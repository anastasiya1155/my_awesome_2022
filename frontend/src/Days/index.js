import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, TextField, Grid } from '@material-ui/core';
import { RELOAD_POST_LIST } from '../shared/redux/actions';
import { getLabels, getPosts, searchPosts } from '../shared/utils/routes';
import Tabs from '../shared/components/Tabs';
import PostList from './PostList';
const DaysApp = lazy(() => import(/* webpackChunkName: "days-app" */ './DaysApp'));

const links = ['/days', '/days', '/days/app'];

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
    searchQuery: '',
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
    console.log('fetchPosts');

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
    console.log('toggleTab');
    this.props.history.push('/days');
    this.setState({
      activeTab: {
        link: tab.link,
        name: tab.name,
      },
    });
    this.fetchPosts(tab.link);
  };

  handleSearchInputChange = e => {
    this.setState({ searchQuery: e.target.value });
  };

  search = e => {
    searchPosts(this.state.searchQuery)
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

  render() {
    const { activeTabIndex, searchQuery, labels, posts } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Grid
          container
          justify="space-between"
          alignItems="flex-end"
          style={{ marginBottom: '30px' }}
          spacing={3}
        >
          <Grid item>
            <Tabs
              value={activeTabIndex}
              onChange={(e, newVal) => this.setState({ activeTabIndex: newVal })}
              tabs={[
                {
                  label: 'Last 25 posts',
                  onClick: () => this.toggleTab({ link: '?sort=-date', name: 'mada' }),
                },
                {
                  label: 'This day in history',
                  onClick: () => this.toggleTab({ link: '-history', name: 'history' }),
                },
                {
                  label: 'All posts',
                  onClick: () => history.push('/days/app'),
                },
              ]}
            />
          </Grid>
          {activeTabIndex === 0 || activeTabIndex === 1 ? (
            <Grid item>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  this.search();
                }}
              >
                <TextField value={searchQuery} onChange={this.handleSearchInputChange} />
                <Button type="submit">search</Button>
              </form>
            </Grid>
          ) : null}
        </Grid>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/days/app">
              <DaysApp />
            </Route>
            <Route path="/days">
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
