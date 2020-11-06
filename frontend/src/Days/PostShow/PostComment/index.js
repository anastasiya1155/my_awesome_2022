import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  comment: {
    color: theme.palette.primary.light,
    paddingLeft: 10,
  },
  date: {
    color: theme.palette.secondary.light,
  },
}));

const PostComment = ({ comment }) => {
  const classes = useStyles();
  return (
    <div className={classes.comment}>
      <span className={classes.date}>{comment.Date.substr(0, 10)}</span>
      <span> {comment.Body}</span>
    </div>
  );
};

export default PostComment;
