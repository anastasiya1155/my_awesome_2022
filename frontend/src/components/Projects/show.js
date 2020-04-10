import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {editTask, getProject, getTasks, postTask} from '../../utils/routes';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
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
      .then((response) => {
        const project = response.data;

        this.setState({ project: project });
      })
      .catch((error) => console.log(error));

    getTasks(id)
      .then((response) => {
        const tasks = {
          incoming: [],
          todo: [],
          in_progress: [],
          done: [],
        };
        response.data.forEach((p) => {
          tasks[p.status].push({
            id: p.id,
            body: p.body,
            status: p.status,
            created_at: p.created_at,
          });
        });

        this.setState({ tasks: tasks });
      })
      .catch((error) => console.log(error));
  };

  handleMenuClose() {
    this.setState({ pressedTask: undefined, menuAnchorElement: undefined });
  }

  handleMoreClick(task, element) {
    this.setState({ pressedTask: task, menuAnchorElement: element });
  }

  handleStatusChange(task, status) {
    this.handleMenuClose();
    editTask(task.id, { status: status }).then((response) => {
      this.fetchData();
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <Typography variant="h4"> {this.state.project.title} </Typography>
          <Typography variant="subtitle2"> {this.state.project.description} </Typography>
        </div>
        <div className={classes.paper}>
          <TextField
            id="time"
            type="text"
            onChange={(e) => {
              this.setState({ newTaskName: e.target.value });
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              postTask({
                body: this.state.newTaskName,
                project_id: parseInt(this.props.match.params.id),
                status: 'incoming',
              })
                .then((response) => {
                  this.fetchData();
                });
            }}
          >
            add
          </Button>
        </div>

        <Grid item xs={12} container spacing={1}>
          {Object.keys(this.state.tasks).map((key) => (
            <Grid item xs={3} container direction="column" spacing={1}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Typography color="primary"> {key} </Typography>
                </Paper>
              </Grid>
              {this.state.tasks[key].map((task) => (
                <Grid item key={task.id}>
                  <Paper className={classes.paper}>
                    <IconButton
                      onClick={(event) => this.handleMoreClick(task, event.currentTarget)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {task.body}
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
          <ListItem onClick={(e) => this.handleStatusChange(this.state.pressedTask, 'incoming')}>
            Incoming
          </ListItem>
          <ListItem onClick={(e) => this.handleStatusChange(this.state.pressedTask, 'todo')}>
            Todo
          </ListItem>
          <ListItem onClick={(e) => this.handleStatusChange(this.state.pressedTask, 'in_progress')}>
            InProgress
          </ListItem>
          <ListItem onClick={(e) => this.handleStatusChange(this.state.pressedTask, 'done')}>
            Done
          </ListItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Project));
