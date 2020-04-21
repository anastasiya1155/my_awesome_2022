import React, { Component } from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionsList from './TransactionsList';
import TransactionsCreate from './TransactionsCreate';
import TransactionsCategories from './TransactionsCategories';
import TransactionsStatistics from './TransactionsStatistics';

const links = ['/transactions/list', '/transactions/add', '/transactions/categories', '/transactions/statistics'];

class Transactions extends Component {
  render() {
    const { location } = this.props;
    return (
      <div>
        <Tabs value={links.indexOf(location.pathname)} indicatorColor="primary" textColor="primary">
          <Link to="/transactions/list" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tab label="List" />
          </Link>
          <Link to="/transactions/add" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tab label="Add" />
          </Link>
          <Link to="/transactions/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tab label="Categories" />
          </Link>
          <Link to="/transactions/statistics" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tab label="Statistics" />
          </Link>
        </Tabs>
        <br /> <br />
        <Switch>
          <Route path="/transactions/add" component={TransactionsCreate} />
          <Route path="/transactions/list" component={TransactionsList} />
          <Route path="/transactions/categories" component={TransactionsCategories} />
          <Route path="/transactions/statistics" component={TransactionsStatistics} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Transactions);
