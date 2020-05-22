import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import PostShow from '../PostShow';

const PostList = ({ labels, tab }) => {
  const posts = useSelector(state => state.post.posts);
  const postsHistory = useSelector(state => state.post.postsHistory);

  return (
    <Grid container direction="column" spacing={4}>
      {(tab === 'history' ? postsHistory : posts).map(p => (
        <Grid item key={p.id}>
          <PostShow post={{ ...p, labels: p.labels || [] }} labels={labels} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
