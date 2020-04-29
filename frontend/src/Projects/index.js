import React, { Component } from 'react';
import { IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { withRouter } from 'react-router-dom';
import { getProjects, getTasks, postProject } from '../shared/utils/routes';
import AddProject from './AddProject';

class Projects extends Component {
  state = {
    projects: [],
    tasks: [],
    pressedList: undefined,
    menuAnchorElement: undefined,
    pressedProject: null,
    isAdd: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    getProjects()
      .then(response => {
        const projects = response.data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          created_at: p.created_at,
        }));

        this.setState({ projects: projects });
      })
      .catch(error => console.log(error));
  };

  // handleDelete = (id) => {
  //   axios
  //     .delete(`http://${IP}:${PORT}/projects`)
  //     .then((response) => {
  //       this.fetchData();
  //     })
  //     .catch((error) => console.log(error));
  // };

  handleChange = e => {};

  handleCreate = e => {};

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

  handleListClick = projectId => {
    this.setState({ pressedProject: projectId });
    getTasks(projectId)
      .then(response => {
        const tasks = response.data.map(p => ({
          id: p.id,
          body: p.body,
          status: p.status,
          created_at: p.created_at,
        }));

        this.setState({ tasks: tasks });
      })
      .catch(error => console.log(error));
  };

  handleSubmit = values => {
    postProject(values)
      .then(() => {
        this.fetchData();
        this.setState({ isAdd: false });
      })
      .catch(console.log);
  };

  render() {
    const { projects, isAdd } = this.state;
    return (
      <div>
        <h1>Projects</h1>
        <List>
          {projects.map((list, index) => (
            <ListItem
              key={list.id}
              button
              onClick={() => this.props.history.push(`/projects/${list.id}`)}
            >
              <ListItemText primary={list.title} />
            </ListItem>
          ))}
        </List>
        <IconButton onClick={() => this.setState({ isAdd: true })}>
          <AddIcon />
        </IconButton>
        {isAdd ? <AddProject handleSubmit={this.handleSubmit} /> : null}
      </div>
    );
  }
}

export default withRouter(Projects);
