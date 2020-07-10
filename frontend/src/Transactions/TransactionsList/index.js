import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getTransactionsByMonthAndYear } from '../../shared/api/routes';
import Table from '../../shared/components/Table';

const thisMonth = moment().format('MMMM');
const thisYear = moment().year();
const startDate = moment('01-06-2018');
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
    years.push(<MenuItem value={year}>{year}</MenuItem>);
  }
  return years;
};

const countSum = transactions => {
  let total = 0;
  transactions.forEach(tr => (total += tr.amount));
  return total;
};

class TransactionsList extends Component {
  state = {
    total: 0,
    transactions: [],
    categoryData: [],
    selectedMonth: thisMonth,
    selectedYear: thisYear,
    groupByCategory: false,
  };

  componentDidMount() {
    this.fetchData(thisMonth, thisYear);
  }

  fetchData = (selectedMonth, selectedYear) => {
    const { categories } = this.props;
    console.log(categories);
    const month = moment()
      .month(selectedMonth)
      .format('M');
    getTransactionsByMonthAndYear(selectedYear, month)
      .then(response => {
        if (response.data) {
          const transactions = Object.keys(response.data)
            .reverse()
            .map(key => ({
              ...response.data[key],
              id: key,
              category: categories.find(c => c.id === response.data[key].category)?.name,
            }));
          const total = countSum(transactions);
          const categoryData = this.normalizeByCategory(transactions, total);
          this.setState({ transactions, total, categoryData });
        }
      })
      .catch(error => console.log(error));
  };

  onMonthChange = e => {
    const { selectedYear } = this.state;
    const selectedMonth = e.target.value;
    this.setState({ selectedMonth });
    this.fetchData(selectedMonth, selectedYear);
  };

  onYearChange = e => {
    const { selectedMonth } = this.state;
    const selectedYear = e.target.value;
    this.setState({ selectedYear });
    this.fetchData(selectedMonth, selectedYear);
  };

  normalizeByCategory = (transactions, total) => {
    const { categories } = this.props;
    return categories
      .map(category => {
        const filtered = transactions.filter(tr => tr.category === category.name);
        const sum = countSum(filtered);
        const percentage = ((sum / total) * 100).toFixed(1);
        return { sum, percentage, category: category.name };
      })
      .sort((a, b) => (a.sum > b.sum ? -1 : 1));
  };

  onGroupByChange = e => {
    const { transactions, total } = this.state;
    const categoryData = this.normalizeByCategory(transactions, total);
    this.setState({ groupByCategory: e.target.checked, categoryData });
  };

  render() {
    const {
      selectedYear,
      selectedMonth,
      transactions,
      total,
      groupByCategory,
      categoryData,
    } = this.state;
    return (
      <div>
        <Grid container justify="space-around">
          <Grid item>
            <Select value={selectedMonth} onChange={this.onMonthChange}>
              {moment.months().map(m => (
                <MenuItem value={m}>{m}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select value={selectedYear} onChange={this.onYearChange}>
              {getYears()}
            </Select>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Checkbox value={groupByCategory} onChange={this.onGroupByChange} />}
              label="Group By Category"
            />
          </Grid>
        </Grid>
        <p>
          <b>
            {selectedMonth} {selectedYear} ({total})
          </b>
        </p>
        <Paper>
          <Table
            data={groupByCategory ? categoryData : transactions}
            columns={groupByCategory ? categoryColumns : tableColumns}
          />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.transactions.categories,
});

export default connect(mapStateToProps)(TransactionsList);
