import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ListItem, Menu } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { editTask, getProject, getTasks, postTask, deleteTask } from '../shared/config/routes';
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: 'relative',
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
    '@media screen and (min-width: 600px) and (max-width: 700px)': {
      padding: theme.spacing(1),
    },
  },
  inputContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  moreIcon: {
    padding: theme.spacing(0.5),
    position: 'absolute',
    bottom: 8,
    right: 0,
    '@media screen and (min-width: 600px) and (max-width: 700px)': {
      bottom: 2,
    },
  },
  taskText: {
    marginRight: 20,
  },
  modalPaper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
});

class Project extends Component {
  state = {
    project: {},
    tasks: {
      incoming: [],
      todo: [],
      in_progress: [],
      done: [],
    },
    menuAnchorElement: undefined,
    pressedTask: null,
    newTaskName: '',
    tilModalOpen: false,
    taskForModal: {
      id: 0,
      body: '',
      outcome: '',
      today_i_learned: false,
    },
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { id } = this.props.match.params;
    getProject(id)
      .then(response => {
        const project = response.data;

        this.setState({ project: project });
      })
      .catch(error => console.log(error));

    getTasks(id)
      .then(response => {
        const tasks = {
          incoming: [],
          todo: [],
          in_progress: [],
          done: [],
        };
        response.data.forEach(task => {
          tasks[task.status].push({
            id: task.id,
            body: task.body,
            status: task.status,
            created_at: task.created_at,
            priority: task.priority,
            outcome: task.outcome,
          });
        });

        this.setState({ tasks: tasks });
      })
      .catch(error => console.log(error));
  };

  handleMenuClose() {
    this.setState({ pressedTask: undefined, menuAnchorElement: undefined });
  }

  handleMoreClick(task, element) {
    this.setState({ pressedTask: task, menuAnchorElement: element });
  }

  handleStatusChange(task, status) {
    this.handleMenuClose();
    editTask(task.id, { status: status }).then(response => {
      this.fetchData();
    });
  }

  handleArchive(task) {
    this.handleMenuClose();
    editTask(task.id, { archived: true }).then(response => {
      this.fetchData();
    });
  }

  handleDelete(task) {
    this.handleMenuClose();
    deleteTask(task.id).then(response => {
      this.fetchData();
    });
  }
  handleChangePriority(task, increment) {
    this.handleMenuClose();
    editTask(task.id, { priority: task.priority + increment }).then(response => {
      this.fetchData();
    });
  }

  handleOpenTILModal = task => {
    this.handleMenuClose();
    this.setState({ tilModalOpen: true, taskForModal: task });
  };

  handleCloseTILModal = () => {
    this.setState({
      tilModalOpen: false,
      taskForModal: { id: 0, body: '', description: '', today_i_learned: false },
    });
  };

  handleChangeTILModalDescription = e => {
    this.setState({ taskForModal: { ...this.state.taskForModal, outcome: e.target.value } });
  };

  submitTIL = () => {
    this.setState({ tilModalOpen: false });

    editTask(this.state.taskForModal.id, {
      outcome: this.state.taskForModal.outcome,
      today_i_learned: true,
    }).then(response => {});
  };

  render() {
    const { classes, match } = this.props;
    const body = (
      <div className={classes.modalPaper}>
        <h2 id="simple-modal-title">{this.state.taskForModal.body}</h2>
        <TextField
          name="description"
          fullWidth
          label="Description"
          value={this.state.taskForModal.outcome}
          onChange={this.handleChangeTILModalDescription}
        />
        <Button onClick={this.submitTIL}>Submit</Button>
      </div>
    );

    return (
      <div className={classes.root}>
        <div>
          <Typography variant="h4"> {this.state.project.title} </Typography>
          <Typography variant="subtitle2"> {this.state.project.description} </Typography>
        </div>
        <Grid container className={classes.inputContainer} spacing={1}>
          <Grid item>
            <TextField
              name="time"
              type="text"
              value={this.state.newTaskName}
              onChange={e => {
                this.setState({ newTaskName: e.target.value });
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={e => {
                postTask({
                  body: this.state.newTaskName,
                  project_id: parseInt(match.params.id),
                  status: 'incoming',
                }).then(() => {
                  this.setState({ newTaskName: '' });
                  this.fetchData();
                });
              }}
            >
              add
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={1}>
          {Object.keys(this.state.tasks).map(key => (
            <Grid item sm={3} xs={12} container direction="column" spacing={1} key={key}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Typography color="primary"> {key} </Typography>
                </Paper>
              </Grid>
              {this.state.tasks[key].map(task => (
                <Grid item key={task.id}>
                  <Paper className={classes.paper}>
                    <Typography className={classes.taskText}>{task.body}</Typography>
                    <IconButton
                      onClick={event => this.handleMoreClick(task, event.currentTarget)}
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
          anchorEl={this.state.menuAnchorElement}
          open={Boolean(this.state.menuAnchorElement)}
          onClose={this.handleMenuClose.bind(this)}
        >
          <ListItem onClick={e => this.handleOpenTILModal(this.state.pressedTask)}>
            Today I learned
          </ListItem>
          <Divider />
          <ListItem onClick={e => this.handleChangePriority(this.state.pressedTask, 1)}>
            Up priority
          </ListItem>
          <ListItem onClick={e => this.handleChangePriority(this.state.pressedTask, -1)}>
            Down priority
          </ListItem>
          <Divider />
          <ListItem onClick={e => this.handleStatusChange(this.state.pressedTask, 'incoming')}>
            Incoming
          </ListItem>
          <ListItem onClick={e => this.handleStatusChange(this.state.pressedTask, 'todo')}>
            Todo
          </ListItem>
          <ListItem onClick={e => this.handleStatusChange(this.state.pressedTask, 'in_progress')}>
            InProgress
          </ListItem>
          <ListItem onClick={e => this.handleStatusChange(this.state.pressedTask, 'done')}>
            Done
          </ListItem>
          <Divider />
          <ListItem onClick={e => this.handleArchive(this.state.pressedTask)}>Archive</ListItem>
          <ListItem onClick={e => this.handleDelete(this.state.pressedTask)}>Delete</ListItem>
        </Menu>
        <Modal
          open={Boolean(this.state.tilModalOpen)}
          onClose={this.handleCloseTILModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(Project);
