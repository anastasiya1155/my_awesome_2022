import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PostCreate from '../Post/PostCreate';
import PostList from '../PostList';

import { RELOAD_POST_LIST } from '../../redux/actions';
import { IP, PORT } from '../../redux/const';
import Tabs from '@material-ui/core/Tabs';
import { Link } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

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
  };

  componentDidMount() {
    this.fetchLabels();
    this.fetchPosts();
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.fetchPosts();
      this.props.reloadPostList(false);
    }
  }

  fetchLabels = () => {
    axios
      .get(`http://${IP}:${PORT}/labels`)
      .then((response) => {
        const labels = response.data.map((c) => ({
          id: c.ID,
          name: c.Name,
          color: c.Color,
          colorActive: c.ColorActive,
        }));

        this.setState({ labels });
      })
      .catch((error) => console.log(error));
  };

  fetchPosts = () => {
    console.log('fetchPosts');

    axios
      .get(`http://${IP}:${PORT}/posts${this.state.activeTab.link}`)
      .then((response) => {
        const posts = response.data.map((c) => ({
          id: c.ID,
          labels: c.Labels,
          comments: c.Comments,
          periods: c.Periods,
          body: c.Body,
          date: c.Date.slice(0, 10),
        }));

        this.setState({ posts });
      })
      .catch((error) => console.log(error));
  };

  toggleTab = (tab) => {
    console.log('toggleTab');
    this.setState({
      activeTab: {
        link: tab.link,
        name: tab.name,
      },
    });
    this.fetchPosts();
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: '30px' }}>
          <Tabs
            value={this.state.activeTabIndex}
            onChange={(e, newVal) => this.setState({ activeTabIndex: newVal})}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label="This day in history"
              onClick={() => this.toggleTab({ link: '-history', name: 'history', i: 0 })}
            />
            <Tab
              label="Last 25 posts"
              onClick={() => this.toggleTab({ link: '?sort=-date', name: 'mada', i: 1 })}
            />
          </Tabs>
        </div>
        <PostCreate />
        <PostList labels={this.state.labels} posts={this.state.posts} />
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    reloadPosts: state.reloadPostList,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    reloadPostList: (reload) => {
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
