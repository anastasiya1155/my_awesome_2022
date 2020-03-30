import React from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { connect } from 'react-redux';
import PostCreate from '../Post/PostCreate';
import PostList from '../PostList';
// import Grid from '@material-ui/core/Grid'

import { RELOAD_POST_LIST } from '../../redux/actions';
import { IP, PORT } from '../../redux/const';

class Days extends React.Component {
  state = {
    customDate: false,
    posts: [],

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

  fetchPosts = () => {
    console.log('fetchPosts');

    axios
      .get(`http://${IP}:${PORT}/posts${this.state.activeTab.link}`)
      .then(response => {
        const posts = response.data.map(c => ({
          id: c.ID,
          labels: c.Labels,
          comments: c.Comments,
          periods: c.Periods,
          body: c.Body,
          date: c.Date.slice(0, 10),
        }));

        const postsForCalendar = response.data.map(c => ({
          title: c.ID,
          start: c.Date.slice(0, 10),
          color: 'grey',
        }));

        this.setState({ posts, postsForCalendar });
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
    this.fetchPosts();
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: '30px' }}>
          <div
            onClick={() => this.toggleTab({ link: '-history', name: 'history' })}
            className="BlogPosts"
          >
            This day in history
          </div>
          <div
            onClick={() => this.toggleTab({ link: '?sort=-date', name: 'mada' })}
            className="BlogPosts"
          >
            Last 25 posts
          </div>
          <div
            onClick={() => this.setState({ customDate: !this.state.customDate })}
            className="BlogPosts"
          >
            Create Post
          </div>
          <div style={{ clear: 'both' }} />
        </div>
        <PostCreate customDate={this.state.customDate} />
        <PostList labels={this.state.labels} posts={this.state.posts} />
        <FullCalendar
          events={this.state.postsForCalendar}
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
        />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Days);
