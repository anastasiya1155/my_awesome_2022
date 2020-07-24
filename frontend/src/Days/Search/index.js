import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import PostList from '../PostList';
import { searchPosts } from '../../shared/api/routes';
import { mapPost } from '../../shared/utils/mappers';

const Search = ({ labels }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [posts, setPosts] = React.useState([]);

  const handleSearch = e => {
    e.preventDefault();
    searchPosts(searchQuery)
      .then(response => {
        const newPosts = response.data.map(mapPost);

        setPosts(newPosts);
      })
      .catch(console.log);
  };
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <form onSubmit={handleSearch}>
          <TextField value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <Button type="submit">search</Button>
        </form>
      </Grid>
      <Grid item>
        <PostList labels={labels} searchResultPosts={posts} searchTerm={searchQuery} />
      </Grid>
    </Grid>
  );
};

export default Search;
