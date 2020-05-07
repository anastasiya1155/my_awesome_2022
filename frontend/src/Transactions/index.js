import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Tabs from '../shared/components/Tabs';
const TransactionsList = lazy(() =>
  import(/* webpackChunkName: "transactions-list" */ './TransactionsList'),
);
const TransactionsCreate = lazy(() =>
  import(/* webpackChunkName: "transactions-add" */ './TransactionsCreate'),
);
const TransactionsCategories = lazy(() =>
  import(/* webpackChunkName: "transactions-cats" */ './TransactionsCategories'),
);
const TransactionsStatistics = lazy(() =>
  import(/* webpackChunkName: "transactions-stats" */ './TransactionsStatistics'),
);

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
          {
            label: 'List',
            mobile: { label: 'List' },
            onClick: () => history.push('/transactions/list'),
          },
          {
            label: 'Add',
            mobile: { label: 'Add' },
            onClick: () => history.push('/transactions/add'),
          },
          {
            label: 'Categories',
            mobile: { label: 'Cats' },
            onClick: () => history.push('/transactions/categories'),
          },
          {
            label: 'Statistics',
            mobile: { label: 'Stats' },
            onClick: () => history.push('/transactions/statistics'),
          },
        ]}
      />
      <br /> <br />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/transactions/add" component={TransactionsCreate} />
          <Route path="/transactions/list" component={TransactionsList} />
          <Route path="/transactions/categories" component={TransactionsCategories} />
          <Route path="/transactions/statistics" component={TransactionsStatistics} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default Transactions;
