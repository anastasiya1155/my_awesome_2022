import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ListItem, Menu } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import {
  deleteTaskAction,
  editTaskAction,
  getProjectAction,
} from '../shared/api/handlers';
import useStyles from './useStyles';
import AddTIL from './AddTIL';
import AddTask from './AddTask';

const Project = ({ match }) => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
  const [pressedTask, setPressedTask] = React.useState(null);
  const [taskForModal, setTaskForModal] = React.useState(null);
  const project = useSelector(state => state.projects.projects[match.params.id] || {});
  const tasks = useSelector(state => state.projects.tasksByStatus[match.params.id] || []);
  const dispatch = useDispatch();

  const classes = useStyles();

  React.useEffect(() => {
    getProjectAction(dispatch, match.params.id);
  }, [match.params.id, dispatch]);

  const handleMenuClose = () => {
    setPressedTask(null);
    setMenuAnchorElement(null);
  };

  const handleMoreClick = (task, element) => {
    setPressedTask(task);
    setMenuAnchorElement(element);
  };

  const handleStatusChange = (task, status) => {
    handleMenuClose();
    editTaskAction(dispatch, { id: task.id, data: { status: status }, projectId: match.params.id });
  };

  const handleArchive = task => {
    handleMenuClose();
    editTaskAction(dispatch, { id: task.id, data: { archived: true }, projectId: match.params.id });
  };

  const handleDelete = task => {
    handleMenuClose();
    deleteTaskAction(dispatch, { id: task.id, projectId: match.params.id });
  };

  const handleChangePriority = (task, increment) => {
    handleMenuClose();
    editTaskAction(dispatch, {
      id: task.id,
      data: { priority: task.priority + increment },
      projectId: match.params.id,
    });
  };

  const handleOpenTILModal = task => {
    handleMenuClose();
    setTaskForModal(task);
  };

  const handleCloseTILModal = () => {
    setTaskForModal(null);
  };

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h4"> {project.title} </Typography>
        <Typography variant="subtitle2"> {project.description} </Typography>
      </div>
      <AddTask dispatch={dispatch} match={match} />

      <Grid item xs={12} container spacing={1}>
        {Object.keys(tasks).map(key => (
          <Grid item sm={3} xs={12} container direction="column" spacing={1} key={key}>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography color="primary"> {key} </Typography>
              </Paper>
            </Grid>
            {tasks[key].map(task => (
              <Grid item key={task.id}>
                <Paper className={classes.paper}>
                  <Typography className={classes.taskText}>{task.body}</Typography>
                  <IconButton
                    onClick={event => handleMoreClick(task, event.currentTarget)}
                    className={classes.moreIcon}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      <Menu
        anchorEl={menuAnchorElement}
        open={Boolean(menuAnchorElement)}
        onClose={handleMenuClose.bind(this)}
      >
        <ListItem onClick={() => handleOpenTILModal(pressedTask)}>Today I learned</ListItem>
        <Divider />
        <ListItem onClick={() => handleChangePriority(pressedTask, 1)}>Up priority</ListItem>
        <ListItem onClick={() => handleChangePriority(pressedTask, -1)}>Down priority</ListItem>
        <Divider />
        <ListItem onClick={() => handleStatusChange(pressedTask, 'incoming')}>Incoming</ListItem>
        <ListItem onClick={() => handleStatusChange(pressedTask, 'todo')}>Todo</ListItem>
        <ListItem onClick={() => handleStatusChange(pressedTask, 'in_progress')}>
          InProgress
        </ListItem>
        <ListItem onClick={() => handleStatusChange(pressedTask, 'done')}>Done</ListItem>
        <Divider />
        <ListItem onClick={() => handleArchive(pressedTask)}>Archive</ListItem>
        <ListItem onClick={() => handleDelete(pressedTask)}>Delete</ListItem>
      </Menu>
      <AddTIL
        isOpen={Boolean(taskForModal)}
        handleClose={handleCloseTILModal}
        task={taskForModal}
        projectId={match.params.id}
      />
    </div>
  );
};

export default Project;
