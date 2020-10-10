import React from 'react';
import PropTypes from 'prop-types';
import { createTaskAction } from '../../shared/api/handlers';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './useStyles';

const AddTask = ({ match, dispatch }) => {
  const [newTaskName, setNewTaskName] = React.useState('');
  const classes = useStyles();
  return (
    <form
      className={classes.inputContainer}
      onSubmit={e => {
        e.preventDefault();
        createTaskAction(dispatch, {
          data: {
            body: newTaskName,
            project_id: parseInt(match.params.id),
            status: 'incoming',
          },
          projectId: match.params.id,
        }).then(() => {
          setNewTaskName('');
        });
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          <TextField
            name="time"
            type="text"
            value={newTaskName}
            onChange={e => {
              setNewTaskName(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" size="small" type="submit">
            add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddTask.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
};

export default AddTask;
