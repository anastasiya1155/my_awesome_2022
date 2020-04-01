import React, { Component, Fragment } from 'react';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios/index';
import { connect } from 'react-redux';
import PostLabel from '../PostLabel';
import PostEdit from '../PostEdit';
import PostComment from '../PostComment';
import PostCommentEdit from '../PostCommentEdit';
import { TOGGLE_COMMENT, TOGGLE_EDIT, RELOAD_POST_LIST } from '../../redux/actions';
import { IP, PORT } from '../../redux/const';
import moment from 'moment';

const styles = (theme) => ({
  periods: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  period: {
    color: theme.palette.primary.light,
  },
});

class PostShow extends Component {
  state = {
    deleteMode: false,
  };

  toggleDeleteMode = () => {
    this.setState((prevState) => ({ deleteMode: !prevState.deleteMode }));
  };

  handleDeletePost = () => {
    const { post, reloadPostList } = this.props;
    axios
      .delete(`http://${IP}:${PORT}/posts/${post.id}`)
      .then(() => {
        reloadPostList(true);
      })
      .catch((error) => console.log(error));
  };

  render() {
    const {
      post,
      labels,
      toggleEdit,
      toggleComment,
      isEditOpen,
      isCommentOpen,
      classes,
    } = this.props;
    const { deleteMode } = this.state;
    if (!post.periods) {
      post.periods = [
        { ID: 1, Name: 'work' },
        { ID: 2, Name: 'health' },
      ];
    }
    return (
      <div style={{ marginBottom: 20 }}>
        <span style={{ position: 'relative', right: 15 }}>
          {moment(post.date).format('dddd YYYY-MM-DD')}
        </span>

        {labels.map((l) => (
          <PostLabel key={l.id} label={l} post={post} />
        ))}
        <span className="PostShowEdit" onClick={toggleEdit}>
          edt
        </span>
        <span className="PostShowEdit" onClick={toggleComment}>
          cmnt
        </span>
        <span className="PostShowEdit" onClick={this.toggleDeleteMode}>
          x
        </span>

        {deleteMode ? (
          <div className="PostShowBody">
            <div
              className="MyAwesomeButton"
              style={{
                textAlign: 'center',
                marginTop: 15,
                backgroundColor: '#DED2D2',
                width: '95%',
              }}
              onClick={this.handleDeletePost}
            >
              Delete ?
            </div>
          </div>
        ) : (
          <div className="PostShowBody">
            {isEditOpen ? (
              <PostEdit body={post.body} post={post} />
            ) : (
              <p>
                {post.body.split('\n').map((item, key) => (
                  <Fragment key={key}>
                    {item}
                    <br />
                  </Fragment>
                ))}
              </p>
            )}
            <div className={classes.periods}>
              {post.periods.map((period) => (
                <Chip
                  key={period.ID}
                  label={period.Name}
                  className={this.props.classes.period}
                  variant="outlined"
                />
              ))}
            </div>
            {post.comments.map((comment) => (
              <PostComment key={comment.ID} comment={comment} />
            ))}
            {isCommentOpen ? <PostCommentEdit postId={post.id} /> : ''}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = function (state, ownProps) {
  return {
    isCommentOpen: state.openComments[ownProps.post.id],
    isEditOpen: state.openEdits[ownProps.post.id],
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    toggleComment: () => {
      dispatch({
        type: TOGGLE_COMMENT,
        payload: {
          postId: ownProps.post.id,
        },
      });
    },
    toggleEdit: () => {
      dispatch({
        type: TOGGLE_EDIT,
        payload: {
          postId: ownProps.post.id,
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PostShow));
