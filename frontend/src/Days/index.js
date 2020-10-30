import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import Tabs from '../shared/components/Tabs';
import PostList from './PostList';
import PostCreate from './PostList/PostCreate';
import { getLabelsAction, getPostsAction, getPostsHistoryAction } from '../shared/api/handlers';
const DaysApp = lazy(() => import(/* webpackChunkName: "days-app" */ './DaysApp'));
const DaysSettings = lazy(/* webpackChunkName: "days-settings" */ () => import('./Settings'));
const Search = lazy(/* webpackChunkName: "days-search" */ () => import('./Search'));

const links = ['/days', '/days/history', '/days/app', '/days/settings', '/days/search'];

const getCurrentTab = path => (links.indexOf(path) >= 0 ? links.indexOf(path) : 0);

const Days = ({ location, history }) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(getCurrentTab(location.pathname));
  const labels = useSelector(state => state.post.labels);
  const oauthToken = useSelector(state => state.photos.token);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getLabelsAction(dispatch);
    getPostsHistoryAction(dispatch);
    getPostsAction(dispatch);
  }, [dispatch]);

  return (
    <div>
      <Tabs
        value={activeTabIndex}
        onChange={(e, newVal) => setActiveTabIndex(newVal)}
        tabs={[
          {
            label: 'Last 25 posts',
            mobile: {
              label: 'Last posts',
            },
            onClick: () => history.push('/days'),
          },
          {
            label: 'This day in history',
            mobile: {
              label: 'This day',
            },
            onClick: () => history.push('/days/history'),
          },
          {
            label: 'All posts',
            mobile: {
              label: 'All',
            },
            onClick: () => history.push('/days/app'),
          },
          {
            label: 'Settings',
            // icon: <SettingsIcon />,
            mobile: {
              icon: <SettingsIcon />,
            },
            onClick: () => history.push('/days/settings'),
          },
          {
            icon: <SearchIcon />,
            mobile: {
              icon: <SearchIcon />,
            },
            onClick: () => history.push('/days/search'),
          },
        ]}
      />
      <br /> <br />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/days/app">
            <DaysApp labels={labels} oauthToken={oauthToken} />
          </Route>
          <Route path="/days/settings">
            <DaysSettings />
          </Route>
          <Route path="/days/search">
            <Search labels={labels} />
          </Route>
          <Route path="/days/history">
            <PostList labels={labels} oauthToken={oauthToken} tab="history" />
          </Route>
          <Route path="/days">
            <PostCreate />
            <PostList labels={labels} oauthToken={oauthToken} tab="last" />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default Days;
