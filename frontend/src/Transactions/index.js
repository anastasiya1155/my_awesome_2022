import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Tabs from '../shared/components/Tabs';
import { getTransCategoriesAction } from '../shared/api/handlers';
import { useDispatch } from 'react-redux';
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

function Transactions({ history, location }) {
  const [activeTab, setActiveTab] = React.useState(location.pathname);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getTransCategoriesAction(dispatch);
  }, [dispatch]);

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        history={history}
        tabs={[
          {
            label: 'List',
            mobile: { label: 'List' },
            path: '/transactions/list',
          },
          {
            label: 'Add',
            mobile: { label: 'Add' },
            path: '/transactions/add',
            hideOnMobile: true,
          },
          {
            label: 'Categories',
            mobile: { label: 'Cats' },
            path: '/transactions/categories',
          },
          {
            label: 'Statistics',
            mobile: { label: 'Stats' },
            path: '/transactions/statistics',
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
