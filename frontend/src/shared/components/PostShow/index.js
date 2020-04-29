import React, { Component, Fragment } from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PostLabel from './PostLabel';
import PostEdit from './PostEdit';
import PostComment from './PostComment';
import PostCommentEdit from './PostCommentEdit';
import { TOGGLE_COMMENT, TOGGLE_EDIT, RELOAD_POST_LIST } from '../../redux/actions';
import moment from 'moment';
import { deletePost } from '../../utils/routes';

const styles = theme => ({
  container: {
    position: 'relative',
    border: '1px solid black',
  },
  topActions: {
    position: 'absolute',
    top: -13,
    left: 0,
    width: '100%',
    '& > div:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
    '@media screen and (max-width: 555px)': {
      position: 'relative',
      top: 0,
      padding: theme.spacing(1),
      '& > div:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
  },
  actionBtns: {
    '& > button:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
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
  button: {
    textTransform: 'lowercase',
    padding: 0,
    minWidth: 'unset',
  },
  post: {
    margin: 'auto',
    minHeight: 70,
    width: '100%',
    textAlign: 'left',
    lineHeight: '150%',
    position: 'relative',
    '& > p,textarea': {
      padding: 10,
    },
    '& > textarea': {
      minHeight: 70,
      width: '100%',
      border: 'none',
      textAlign: 'left',
      lineHeight: '150%',
    },
  },
  deleteBtn: {
    width: '95%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

class PostShow extends Component {
  state = {
    deleteMode: false,
  };

  toggleDeleteMode = () => {
    this.setState(prevState => ({ deleteMode: !prevState.deleteMode }));
  };

  handleDeletePost = () => {
    const { post, reloadPostList } = this.props;
    deletePost(post.id)
      .then(() => {
        reloadPostList(true);
      })
      .catch(error => console.log(error));
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
      <div className={classes.container}>
        <Grid container justify="center" alignItems="center" className={classes.topActions}>
          <Grid item>{moment(post.date).format('dddd YYYY-MM-DD')}</Grid>
          <Grid item>
            {labels.map(l => (
              <PostLabel key={l.id} label={l} post={post} />
            ))}
          </Grid>
          <Grid item className={classes.actionBtns}>
            <Button onClick={toggleEdit} className={classes.button}>edit</Button>
            <Button onClick={toggleComment} className={classes.button}>cmnt</Button>
            <Button onClick={this.toggleDeleteMode} className={classes.button}>x</Button>
          </Grid>
        </Grid>

        {deleteMode ? (
          <div className={classes.post}>
            <Button variant="contained" onClick={this.handleDeletePost} className={classes.deleteBtn}>
              Delete ?
            </Button>
          </div>
        ) : (
          <div className={classes.post}>
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
              {post.periods.map(period => (
                <Chip
                  key={period.ID}
                  label={period.Name}
                  className={this.props.classes.period}
                  variant="outlined"
                />
              ))}
            </div>
            {post.comments.map(comment => (
              <PostComment key={comment.ID} comment={comment} />
            ))}
            {isCommentOpen ? <PostCommentEdit postId={post.id} /> : ''}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    isCommentOpen: state.openComments[ownProps.post.id],
    isEditOpen: state.openEdits[ownProps.post.id],
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PostShow));
