import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, TextField } from '@material-ui/core';
import PostList from '../PostList';
import { Route } from 'react-router-dom';
import {searchPosts} from '../../shared/utils/routes';

const Search = ({ labels }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [posts, setPosts] = React.useState([]);

  const handleSearch = e => {
    e.preventDefault();
    searchPosts(searchQuery)
      .then(response => {
        const newPosts = response.data.map(c => ({
          id: c.ID,
          labels: c.Labels,
          comments: c.Comments,
          periods: c.Periods,
          body: c.Body,
          date: c.Date.slice(0, 10),
        }));

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
        <PostList labels={labels} posts={posts} />
      </Grid>
    </Grid>
  );
};

Search.propTypes = {};

export default Search;
