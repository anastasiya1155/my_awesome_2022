import React, { Component } from 'react';
import PostShow from '../PostShow';
//
// import axios from 'axios';
// import {connect} from "react-redux";
// import {RELOAD_POST_LIST} from "../../redux/actions";

class PostList extends Component {
  render() {
    const { posts, labels } = this.props;
    return (
      <div>
        {posts.map(p => (
          <PostShow key={p.id} post={p} labels={labels} />
        ))}
      </div>
    );
  }
}

export default PostList;
