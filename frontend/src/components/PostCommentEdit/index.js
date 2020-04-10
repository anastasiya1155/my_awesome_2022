import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RELOAD_POST_LIST, TOGGLE_COMMENT } from '../../redux/actions';
import {postComment} from '../../utils/routes';

class PostCommentEdit extends Component {
  state = {
    commentBody: '',
  };

  handleText = (e) => {
    this.setState({ commentBody: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    postComment({
      body: this.state.commentBody,
      PostId: this.props.postId,
    })
      .then(() => {
        this.props.closeComment();
        this.props.reloadPostList(true);
      })
      .catch((error) => console.log(error));
  };

  render() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }

    today = `${yyyy}-${mm}-${dd}`;
    return (
      <div style={{ backgroundColor: 'rgb(230, 230, 230)', paddingLeft: 10 }}>
        <span style={{ color: 'rgb(62, 62, 62)' }}>{today}</span>
        <input
          onChange={this.handleText}
          style={{
            backgroundColor: 'transparent',
            marginLeft: 5,
            border: 'none',
            outline: 'none',
            fontSize: '1em',
          }}
        />
        <button onClick={this.handleSubmit}>Send</button>
      </div>
    );
  }
}

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    closeComment: () => {
      dispatch({
        type: TOGGLE_COMMENT,
        payload: {
          postId: ownProps.postId,
        },
      });
    },
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

export default connect(null, mapDispatchToProps)(PostCommentEdit);
