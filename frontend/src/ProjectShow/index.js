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
import { editTask, getProject, getTasks, postTask } from '../shared/utils/routes';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: 'relative',
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    '@media screen and (min-width: 600px) and (max-width: 700px)': {
      padding: theme.spacing(1),
      wordBreak: 'break-all',
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
        response.data.forEach(p => {
          tasks[p.status].push({
            id: p.id,
            body: p.body,
            status: p.status,
            created_at: p.created_at,
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

  render() {
    const { classes, match } = this.props;
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
            <Grid item sm={3} xs={12} container direction="column" spacing={1}>
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
        {/*</Grid>*/}
        <Menu
          anchorEl={this.state.menuAnchorElement}
          open={Boolean(this.state.menuAnchorElement)}
          onClose={this.handleMenuClose.bind(this)}
        >
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
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(Project);
