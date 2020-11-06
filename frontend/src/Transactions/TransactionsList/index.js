import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  Grid,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Hidden,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { getTransactionsByMonthAndYear } from '../../shared/api/routes';
import Table from '../../shared/components/Table';
import { useTheme } from '@material-ui/core/styles';

const thisMonth = moment().format('MMMM');
const thisYear = moment().year();
const startDate = moment('2018-06-01');
const yearsSinceStart = thisYear - startDate.year();

const tableColumns = [
  { title: 'Amount', field: 'amount' },
  {
    title: 'Category',
    field: 'category',
  },
  { title: 'Description', field: 'description' },
  { title: 'Date', field: 'date', render: row => moment(row.date).format('YYYY-MM-DD') },
];

const mobileColumns = [
  {
    title: '',
    field: 'amount',
    render: row => (
      <div>
        <div>
          <b>{row.amount}</b>
        </div>
        <div>
          <sub>{row.description}</sub>
        </div>
      </div>
    ),
  },
  {
    title: '',
    field: 'date',
    render: row => (
      <div>
        <div>{row.category}</div>
        <div>
          <sub>{moment(row.date).format('ddd D MMM')}</sub>
        </div>
      </div>
    ),
  },
];

const categoryColumns = [
  { title: 'Sum', field: 'sum' },
  {
    title: 'Percentage',
    field: 'percentage',
    render: row => (
      <div style={{ width: `${row.percentage}%`, backgroundColor: '#af8f85' }}>
        {row.percentage}
      </div>
    ),
  },
  { title: 'Category', field: 'category' },
];

const getYears = () => {
  const years = [];
  for (let i = 0; i <= yearsSinceStart; i++) {
    const year = moment()
      .subtract(i, 'years')
      .format('YYYY');
    years.push(
      <MenuItem value={year} key={year}>
        {year}
      </MenuItem>,
    );
  }
  return years;
};

const countSum = transactions => {
  let total = 0;
  transactions.forEach(tr => (total += tr.amount));
  return total;
};

const TransactionsList = ({ history }) => {
  const [total, setTotal] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);
  const [categoryData, setCategoryData] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState(thisMonth);
  const [selectedYear, setSelectedYear] = React.useState(thisYear);
  const [groupByCategory, setGroupByCategory] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const categories = useSelector(state => state.transactions.categories);

  const normalizeByCategory = React.useCallback(
    (trs, totalSum) => {
      return categories
        .map(category => {
          const filtered = trs.filter(tr => tr.category === category.name);
          const sum = countSum(filtered);
          const percentage = ((sum / totalSum) * 100).toFixed(1);
          return { sum, percentage, category: category.name };
        })
        .sort((a, b) => (a.sum > b.sum ? -1 : 1));
    },
    [categories],
  );

  const fetchData = React.useCallback(
    (m, y) => {
      const month = moment()
        .month(m)
        .format('M');
      getTransactionsByMonthAndYear(y, month)
        .then(response => {
          if (response.data) {
            const newTransactions = Object.keys(response.data)
              .reverse()
              .map(key => ({
                ...response.data[key],
                id: key,
                category: categories.find(c => c.id === response.data[key].category)?.name,
              }));
            const newTotal = countSum(newTransactions);
            const newCategoryData = normalizeByCategory(newTransactions, newTotal);
            setTransactions(newTransactions);
            setTotal(newTotal);
            setCategoryData(newCategoryData);
          }
        })
        .catch(console.log);
    },
    [categories, normalizeByCategory],
  );

  React.useEffect(() => {
    fetchData(thisMonth, thisYear);
  }, [categories, fetchData]);

  const onMonthChange = e => {
    setSelectedMonth(e.target.value);
    fetchData(e.target.value, selectedYear);
  };

  const onYearChange = e => {
    setSelectedYear(e.target.value);
    fetchData(selectedMonth, e.target.value);
  };

  const onGroupByChange = e => {
    const newCategoryData = normalizeByCategory(transactions, total);
    setGroupByCategory(e.target.checked);
    setCategoryData(newCategoryData);
  };

  return (
    <div>
      <Hidden smUp>
        <Button
          fullWidth
          variant="contained"
          style={{ marginBottom: 10 }}
          onClick={() => history.push('/transactions/add')}
        >
          Add
        </Button>
      </Hidden>
      <Grid container justify="space-around">
        <Grid item>
          <Select value={selectedMonth} onChange={onMonthChange}>
            {moment.months().map(m => (
              <MenuItem value={m} key={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedYear} onChange={onYearChange}>
            {getYears()}
          </Select>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox value={groupByCategory} onChange={onGroupByChange} />}
            label="Group By Category"
          />
        </Grid>
      </Grid>
      <p>
        <b>
          {selectedMonth} {selectedYear} ({total})
        </b>
      </p>
      <Table
        data={groupByCategory ? categoryData : transactions}
        columns={groupByCategory ? categoryColumns : isMobile ? mobileColumns : tableColumns}
        size={isMobile ? 'small' : undefined}
      />
    </div>
  );
};

export default TransactionsList;
