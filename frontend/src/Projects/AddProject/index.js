import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';

const AddProject = ({ handleSubmit }) => {
  const [values, setValues] = React.useState({ title: '', description: '' });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(values);
      }}
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={4} xs={12}>
          <TextField
            name="title"
            fullWidth
            label="Title"
            value={values.title}
            onChange={e => setValues({ ...values, title: e.target.value })}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            name="description"
            fullWidth
            label="Description"
            value={values.description}
            onChange={e => setValues({ ...values, description: e.target.value })}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Button type="submit">Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddProject.propTypes = {
  handleSubmit: PropTypes.func,
};

export default AddProject;
