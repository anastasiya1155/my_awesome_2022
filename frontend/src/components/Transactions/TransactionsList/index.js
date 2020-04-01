import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import moment from 'moment';

import Table, { MTableGroupRow } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { CATEGORIES } from '../../../redux/const';

const thisMonth = moment().format('MMMM');
const thisYear = moment().year();
const startDate = moment('01-06-2018');
const yearsSinceStart = thisYear - startDate.year();

const tableColumns = [
  { title: 'Amount', field: 'amount' },
  {
    title: 'Category',
    field: 'category',
    render: (row) => (row.category ? CATEGORIES[row.category].name : row),
  },
  { title: 'Description', field: 'description' },
  { title: 'Date', field: 'date', render: (row) => moment(row.date).format('YYYY-MM-DD') },
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
    years.push(<MenuItem value={year}>{year}</MenuItem>);
  }
  return years;
};

const countSum = (transactions) => {
  let total = 0;
  transactions.forEach((tr) => (total += tr.amount));
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
    const month = moment().month(selectedMonth).format('M');
    axios
      .get(`https://tranf-ae713.firebaseio.com/transaction/${selectedYear}/${month}.json`)
      .then((response) => {
        if (response.data) {
          const transactions = Object.keys(response.data)
            .reverse()
            .map((key) => ({ ...response.data[key], id: key }));
          const total = countSum(transactions);
          const categoryData = this.normalizeByCategory(transactions, total);
          this.setState({ transactions, total, categoryData });
        }
      })
      .catch((error) => console.log(error));
  };

  onMonthChange = (e) => {
    const { selectedYear } = this.state;
    const selectedMonth = e.target.value;
    this.setState({ selectedMonth });
    this.fetchData(selectedMonth, selectedYear);
  };

  onYearChange = (e) => {
    const { selectedMonth } = this.state;
    const selectedYear = e.target.value;
    this.setState({ selectedYear });
    this.fetchData(selectedMonth, selectedYear);
  };

  normalizeByCategory = (transactions, total) =>
    Object.keys(CATEGORIES)
      .map((id) => {
        const filtered = transactions.filter((tr) => tr.category.toString() === id);
        const sum = countSum(filtered);
        const percentage = ((sum / total) * 100).toFixed(1);
        return { sum, percentage, category: CATEGORIES[id].name };
      })
      .sort((a, b) => (a.sum > b.sum ? -1 : 1));

  onGroupByChange = (e) => {
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
              {moment.months().map((m) => (
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
            title=""
            options={{
              grouping: true,
              paging: false,
            }}
            components={{
              GroupRow: (rowProps) => {
                let sum = 0;
                rowProps.groupData.data.forEach(({ amount }) => (sum += amount));
                return (
                  <MTableGroupRow
                    {...rowProps}
                    groupData={{
                      ...rowProps.groupData,
                      value: `${CATEGORIES[rowProps.groupData.value].name}  ${sum}`,
                    }}
                  />
                );
              },
            }}
          />
        </Paper>
      </div>
    );
  }
}

export default withRouter(TransactionsList);
