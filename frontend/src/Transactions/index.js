import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import TransactionsList from './TransactionsList';
import TransactionsCreate from './TransactionsCreate';
import TransactionsCategories from './TransactionsCategories';
import TransactionsStatistics from './TransactionsStatistics';
import Tabs from '../shared/components/Tabs';

const links = [
  '/transactions/list',
  '/transactions/add',
  '/transactions/categories',
  '/transactions/statistics',
];

function Transactions({ history, location }) {
  const [activeTab, setActiveTab] = React.useState(links.indexOf(location.pathname));
  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        tabs={[
          { label: 'List', onClick: () => history.push('/transactions/list') },
          { label: 'Add', onClick: () => history.push('/transactions/add') },
          { label: 'Categories', onClick: () => history.push('/transactions/categories') },
          { label: 'Statistics', onClick: () => history.push('/transactions/statistics') },
        ]}
      />
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

export default withRouter(Transactions);
