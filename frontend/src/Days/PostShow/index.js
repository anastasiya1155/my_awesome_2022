import React, { Fragment } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PostLabel from '../PostLabel';
import PostEdit from './PostEdit';
import PostComment from './PostComment';
import PostCommentEdit from './PostCommentEdit';
import useStyles from './useStyles';
import { deletePostAction, togglePostLabelAction } from '../../shared/api/handlers';
import PostPhotos from './PostPhotos';

const PostShow = ({ post, labels, searchTerm, oauthToken }) => {
  const [deleteMode, setDeletedMode] = React.useState(false);
  const [isCommentOpen, setCommentOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const toggleDeleteMode = () => {
    setDeletedMode(!deleteMode);
  };

  const handleDeletePost = () => {
    deletePostAction(dispatch, post.id);
  };

  const handleLabelClick = (isActive, labelId) => {
    togglePostLabelAction(dispatch, { postId: post.id, labelId, isActive });
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {' '}
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.toLowerCase() === highlight.toLowerCase() ? classes.highlight : ''}
          >
            {part}
          </span>
        ))}{' '}
      </span>
    );
  };

  return (
    <div className={classes.container}>
      <Grid container justify="center" alignItems="center" className={classes.topActions}>
        <Grid item>{moment(post.date).format('dddd YYYY-MM-DD')}</Grid>
        <Grid item>
          {labels.map(l => (
            <PostLabel
              key={l.id}
              label={l}
              onClick={(e, active) => handleLabelClick(active, l.id)}
              isActive={!!post.labels.find(pl => pl.ID === l.id)}
            />
          ))}
        </Grid>
        <Grid item className={classes.actionBtns}>
          <Button onClick={() => setIsEdit(true)} className={classes.button}>
            edit
          </Button>
          <Button onClick={() => setCommentOpen(true)} className={classes.button}>
            cmnt
          </Button>
          <Button onClick={toggleDeleteMode} className={classes.button}>
            x
          </Button>
        </Grid>
      </Grid>

      {deleteMode ? (
        <div className={classes.post}>
          <div className={classes.deleteBtns}>
            <Button
              variant="contained"
              onClick={() => setDeletedMode(false)}
              className={classes.deleteBtn}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDeletePost} className={classes.deleteBtn}>
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.post}>
          {isEdit ? (
            <PostEdit body={post.body} post={post} onCancel={() => setIsEdit(false)} />
          ) : (
            <p>
              {post.body.split('\n').map((item, key) => (
                <Fragment key={key}>
                  {searchTerm ? getHighlightedText(item, searchTerm) : item}
                  <br />
                </Fragment>
              ))}
            </p>
          )}
          {post.periods && post.periods.length > 0 ? (
            <div className={classes.periods}>
              {post.periods.map(period => (
                <Chip
                  key={period.ID}
                  label={period.Name}
                  className={classes.period}
                  variant="outlined"
                />
              ))}
            </div>
          ) : null}
          {oauthToken ? (
            <PostPhotos oauthToken={oauthToken} date={post.date} dispatch={dispatch} />
          ) : null}
          {post.comments.map(comment => (
            <PostComment key={comment.ID} comment={comment} />
          ))}
          {isCommentOpen ? (
            <PostCommentEdit postId={post.id} onCancel={() => setCommentOpen(false)} />
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
};

export default PostShow;
