import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Checkbox, Button, Grid, FormControlLabel } from '@material-ui/core';

const AddProject = ({ handleSubmit, initialValues, handleCancel }) => {
  const [values, setValues] = React.useState(
    initialValues || { title: '', description: '', archived: false },
  );

  React.useEffect(() => {
    setValues(initialValues || { title: '', description: '', archived: false });
  }, [initialValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }}
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={3} xs={12}>
          <TextField
            name="title"
            fullWidth
            label="Title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            name="description"
            fullWidth
            label="Description"
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.archived}
                onChange={(e) => setValues({ ...values, archived: !values.archived })}
              />
            }
            label="Archived"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button type="submit">Submit</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddProject.propTypes = {
  handleSubmit: PropTypes.func,
};

export default AddProject;
