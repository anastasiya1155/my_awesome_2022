import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';
import moment from 'moment';

const AddLastTime = ({ handleSubmit, initialValues, handleCancel }) => {
  const [lt, setLt] = React.useState(
    initialValues || { body: '', date: moment(), remind_after_days: '' },
  );

  React.useEffect(() => {
    setLt(initialValues || { body: '', date: moment(), remind_after_days: '' });
  }, [initialValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ ...lt, remind_after_days: parseInt(lt.remind_after_days, 10) });
      }}
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={4} xs={12}>
          <TextField
            name="title"
            fullWidth
            label="Title"
            value={lt.body}
            onChange={(e) => setLt({ ...lt, body: e.target.value })}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <TextField
            name="reminder"
            fullWidth
            type="number"
            label="Remind after (days)"
            value={lt.remind_after_days}
            onChange={(e) => setLt({ ...lt, remind_after_days: e.target.value })}
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

AddLastTime.propTypes = {
  handleSubmit: PropTypes.func,
};

export default AddLastTime;
