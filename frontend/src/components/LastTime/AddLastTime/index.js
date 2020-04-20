import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';
import moment from "moment";

const AddLastTime = ({ handleSubmit }) => {
  const [lt, setLt] = React.useState({ body: '', date: moment() });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(lt);
      }}
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={4} xs={12}>
          <TextField
            name="title"
            fullWidth
            label="Title"
            value={lt.body}
            onChange={e => setLt({...lt, body: e.target.value })}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddLastTime.propTypes = {
  handleSubmit: PropTypes.func,
};

export default AddLastTime;
