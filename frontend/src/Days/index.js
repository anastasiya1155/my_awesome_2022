import React from 'react';
import { connect } from 'react-redux';
import { Button, TextField, Grid } from '@material-ui/core';
import { RELOAD_POST_LIST } from '../shared/redux/actions';
import { getLabels, getPosts, searchPosts } from '../shared/utils/routes';
import Tabs from '../shared/components/Tabs';
import PostCreate from './PostCreate';
import PostList from './PostList';

class Days extends React.Component {
  state = {
    posts: [],
    activeTabIndex: 0,

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
              value={this.state.activeTabIndex}
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
              ]}
            />
          </Grid>
          <Grid item>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.search();
              }}
            >
              <TextField value={this.state.searchQuery} onChange={this.handleSearchInputChange} />
              <Button type="submit">search</Button>
            </form>
          </Grid>
        </Grid>
        <PostCreate />
        <PostList labels={this.state.labels} posts={this.state.posts} />
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
