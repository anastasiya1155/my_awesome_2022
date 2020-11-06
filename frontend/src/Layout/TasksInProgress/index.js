import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import useStyles from './useStyles';

const TasksInProgress = () => {
  const inProgress = useSelector((state) => state.projects.inProgress);
  const history = useHistory();
  const classes = useStyles();

  return inProgress.length > 0 ? (
    <Grid container>
      {inProgress.map((task) => (
        <Grid item key={task.id}>
          <b
            onClick={() => history.push(`/projects/${task.project_id}`)}
            className={classes.taskName}
          >
            --- {task.body} ---
          </b>
        </Grid>
      ))}
    </Grid>
  ) : null;
};

TasksInProgress.propTypes = {
  inProgress: PropTypes.array,
};

export default TasksInProgress;
