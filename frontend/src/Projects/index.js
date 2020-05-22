import React, { Component } from 'react';
import { IconButton, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { getProjects, postProject, putProject } from '../shared/api/routes';
import AddProject from './AddProject';
import { Hidden } from '@material-ui/core';

class Projects extends Component {
  state = {
    projects: [],
    tasks: [],
    pressedList: undefined,
    menuAnchorElement: undefined,
    pressedProject: null,
    isAdd: false,
    isEdit: false,
    projectToEdit: null,
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

  handleSubmit = values => {
    if (this.state.isAdd) {
      postProject(values)
        .then(() => {
          this.fetchData();
          this.setState({ isAdd: false });
        })
        .catch(console.log);
    } else {
      putProject(this.state.projectToEdit.id, values)
        .then(() => {
          this.fetchData();
          this.setState({ isEdit: false, projectToEdit: null });
        })
        .catch(console.log);
    }
  };

  handleEditClick = (e, project) => {
    e.stopPropagation();
    this.setState({ isEdit: true, isAdd: false, projectToEdit: project });
  };

  handleCancel = () => {
    this.setState({ isEdit: false, isAdd: false, projectToEdit: null });
  };

  render() {
    const { projects, isAdd, isEdit, projectToEdit } = this.state;
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
              <Hidden smDown>
                <ListItemText secondary={list.description} />
              </Hidden>
              <ListItemIcon>
                <IconButton onClick={e => this.handleEditClick(e, list)}>
                  <EditIcon />
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
        <IconButton
          onClick={() => this.setState({ isAdd: true, isEdit: false, projectToEdit: null })}
        >
          <AddIcon />
        </IconButton>
        {isAdd || isEdit ? (
          <AddProject
            handleSubmit={this.handleSubmit}
            initialValues={projectToEdit}
            handleCancel={this.handleCancel}
          />
        ) : null}
      </div>
    );
  }
}

export default Projects;
