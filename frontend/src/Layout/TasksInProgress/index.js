import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

const TasksInProgress = ({ inProgress }) => {
  return inProgress.length > 0 ? (
    <Grid container>
      {inProgress.map(task => (
        <Grid item key={task.id}>
          <b> --- {task.body} --- </b>
        </Grid>
      ))}
    </Grid>
  ) : null;
};

TasksInProgress.propTypes = {
  inProgress: PropTypes.array,
};

export default TasksInProgress;
