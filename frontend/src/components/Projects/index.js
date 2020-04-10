import React, { Component } from 'react';
import {
  Collapse,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
} from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import {getProjects, getTasks} from '../../utils/routes';

class Projects extends Component {
  state = {
    projects: [],
    tasks: [],
    pressedList: undefined,
    menuAnchorElement: undefined,
    pressedProject: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    getProjects()
      .then((response) => {
        const projects = response.data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          created_at: p.created_at,
        }));

        this.setState({ projects: projects });
      })
      .catch((error) => console.log(error));
  };

  // handleDelete = (id) => {
  //   axios
  //     .delete(`http://${IP}:${PORT}/projects`)
  //     .then((response) => {
  //       this.fetchData();
  //     })
  //     .catch((error) => console.log(error));
  // };

  handleChange = (e) => {};

  handleCreate = (e) => {};

  handleRename(list) {
    this.handleMenuClose();
    this.props.onRenameList(this.state.pressedList);
  }

  handleMoreClick(list, element) {
    this.setState({ pressedList: list, menuAnchorElement: element });
  }

  handleMenuClose() {
    this.setState({ pressedList: undefined, menuAnchorElement: undefined });
  }

  handleListClick = (projectId) => {
    this.setState({ pressedProject: projectId });
    getTasks(projectId)
      .then((response) => {
        const tasks = response.data.map((p) => ({
          id: p.id,
          body: p.body,
          status: p.status,
          created_at: p.created_at,
        }));

        this.setState({ tasks: tasks });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <h1>Projects</h1>
        <List>
          {this.state.projects.map((list, index) => (
            <React.Fragment key={list.id}>
              <ListItem
                button
                onClick={() => this.handleListClick(list.id)}
                selected={this.state.pressedProject === list.id}
              >
                <ListItemIcon>
                  <Icon>
                    {this.state.pressedProject === list.id ? 'chevron_right' : 'chevron_left'}
                  </Icon>
                </ListItemIcon>

                <ListItemText inset primary={list.title} />

                <ListItemSecondaryAction>
                  <IconButton onClick={(event) => this.handleMoreClick(list, event.currentTarget)}>
                    <Icon>more_vert</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={this.state.pressedProject === list.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {this.state.tasks.map((task) => (
                    <ListItem button key={task.id}>
                      <ListItemText primary={task.body} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>

        <Menu
          style={{ cursor: 'pointer' }}
          anchorEl={this.state.menuAnchorElement}
          open={Boolean(this.state.menuAnchorElement)}
          onClose={this.handleMenuClose.bind(this)}
        >
          <ListItem
            onClick={() => this.props.history.push(`/projects/${this.state.pressedList.id}`)}
          >
            Open
          </ListItem>
          <ListItem onClick={() => {}}>Rename</ListItem>
          <ListItem onClick={() => {}}>Archive</ListItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(Projects);
