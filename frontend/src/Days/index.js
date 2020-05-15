import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import { RELOAD_POST_LIST } from '../shared/redux/actions';
import { getLabels, getPosts } from '../shared/config/routes';
import Tabs from '../shared/components/Tabs';
import PostList from './PostList';
import DaysSettings from './Settings';
import Search from './Search';
import PostCreate from './PostList/PostCreate';
const DaysApp = lazy(() => import(/* webpackChunkName: "days-app" */ './DaysApp'));

const links = ['/days', '/days', '/days/app', '/days/settings', '/days/search'];

const getCurrentTab = path => (links.indexOf(path) >= 0 ? links.indexOf(path) : 0);

class Days extends React.Component {
  state = {
    posts: [],
    activeTabIndex: getCurrentTab(this.props.location.pathname),

    activeTab: {
      link: '?sort=-date',
      name: 'mada',
    },
    isLoading: false,
    labels: [],
  };

  componentDidMount() {
    this.fetchLabels();
    this.fetchPosts(this.state.activeTab.link);
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.fetchPosts(this.state.activeTab.link);
      this.props.reloadPostList(false);
    }
  }

  fetchLabels = () => {
    getLabels()
      .then(response => {
        const labels = response.data.map(c => ({
          id: c.ID,
          name: c.Name,
          color: c.Color,
          colorActive: c.ColorActive,
        }));

        this.setState({ labels });
      })
      .catch(error => console.log(error));
  };

  fetchPosts = tablink => {
    getPosts(tablink)
      .then(response => {
        const posts = response.data.map(c => ({
          id: c.ID,
          labels: c.Labels,
          comments: c.Comments,
          periods: c.Periods,
          body: c.Body,
          date: c.Date.slice(0, 10),
        }));

        this.setState({ posts });
      })
      .catch(error => console.log(error));
  };

  toggleTab = tab => {
    this.props.history.push('/days');
    this.setState({
      activeTab: {
        link: tab.link,
        name: tab.name,
      },
    });
    this.fetchPosts(tab.link);
  };

  render() {
    const { activeTabIndex, labels, posts } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Tabs
          value={activeTabIndex}
          onChange={(e, newVal) => this.setState({ activeTabIndex: newVal })}
          tabs={[
            {
              label: 'Last 25 posts',
              mobile: {
                label: 'Last posts',
              },
              onClick: () => this.toggleTab({ link: '?sort=-date', name: 'mada' }),
            },
            {
              label: 'This day in history',
              mobile: {
                label: 'This day',
              },
              onClick: () => this.toggleTab({ link: '-history', name: 'history' }),
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
              <DaysApp />
            </Route>
            <Route path="/days/settings">
              <DaysSettings />
            </Route>
            <Route path="/days/search">
              <Search labels={labels} />
            </Route>
            <Route path="/days">
              <PostCreate />
              <PostList labels={labels} posts={posts} />
            </Route>
          </Switch>
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    reloadPosts: state.reloadPostList,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    reloadPostList: reload => {
      dispatch({
        type: RELOAD_POST_LIST,
        payload: {
          reload,
        },
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Days);
