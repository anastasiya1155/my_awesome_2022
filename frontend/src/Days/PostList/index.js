import React from 'react';
import Grid from '@material-ui/core/Grid';
import PostShow from '../PostShow';

const PostList = ({ posts, labels }) => {
  return (
      <Grid container direction="column" spacing={4}>
        {posts.map(p => (
          <Grid item key={p.id}>
            <PostShow post={p} labels={labels} />
          </Grid>
        ))}
      </Grid>
  );
};

export default PostList;
