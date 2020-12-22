import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
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
import Table from '../../shared/components/Table';
import { useTheme } from '@material-ui/core/styles';
import EditableTable from '../../shared/components/EditableTable';
import { deleteTransaction, editTransaction, getTransactions } from '../../shared/api/handlers';

const thisMonth = moment().format('MMMM');
const thisYear = moment().year();
const startDate = moment('2018-06-01');
const yearsSinceStart = thisYear - startDate.year();

const mobileColumns = [
  {
    title: '',
    field: 'amount',
    render: (row) => (
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
    render: (row) => (
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
    render: (row) => (
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
    const year = moment().subtract(i, 'years').format('YYYY');
    years.push(
      <MenuItem value={year} key={year}>
        {year}
      </MenuItem>,
    );
  }
  return years;
};

const TransactionsList = ({ history }) => {
  const [selectedMonth, setSelectedMonth] = React.useState(thisMonth);
  const [selectedYear, setSelectedYear] = React.useState(thisYear);
  const [groupByCategory, setGroupByCategory] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const trState = useSelector((state) => state.transactions);
  const dispatch = useDispatch();

  const fetchData = (m, y) => {
    const month = moment().month(m).format('M');
    getTransactions(dispatch, { year: y, month });
  };

  React.useEffect(() => {
    fetchData(thisMonth, thisYear);
  }, []);

  const onMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    fetchData(e.target.value, selectedYear);
  };

  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
    fetchData(selectedMonth, e.target.value);
  };

  const onGroupByChange = (e) => {
    setGroupByCategory(e.target.checked);
  };

  const onEditSubmit = (id, values) => {
    const data = {
      amount: Number(values.amount),
      category: values.category,
      description: values.description,
      date: moment.utc(values.date).format(),
    };
    console.log(data);
    return editTransaction(dispatch, { id, data, year: selectedYear, month: selectedMonth });
  };

  const onDeleteSubmit = (id) => {
    console.log(id);
    return deleteTransaction(dispatch, { id, year: selectedYear, month: selectedMonth });
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
            {moment.months().map((m) => (
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
          {selectedMonth} {selectedYear} ({trState.total})
        </b>
      </p>
      {groupByCategory || isMobile ? (
        <Table
          data={groupByCategory ? trState.transactionsByCat : trState.transactions}
          columns={groupByCategory ? categoryColumns : mobileColumns}
          size={isMobile ? 'small' : undefined}
        />
      ) : (
        <EditableTable
          items={trState.transactions}
          onEditSubmit={onEditSubmit}
          onDeleteSubmit={onDeleteSubmit}
          columns={[
            { label: 'Amount', name: 'amount', type: 'string' },
            {
              label: 'Category',
              name: 'category',
              type: 'select',
              options: trState.categories,
            },
            { label: 'Description', name: 'description', type: 'string' },
            {
              label: 'Date',
              name: 'date',
              render: (row) => moment(row.date).format('YYYY-MM-DD'),
              type: 'date',
            },
          ]}
        />
      )}
    </div>
  );
};

export default TransactionsList;
