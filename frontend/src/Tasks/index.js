import React, { Component } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { postTodo, deleteTodo, getTodos } from '../shared/api/routes';

class Tasks extends Component {
  state = {
    toDoArr: [],
    isLoading: true,
    newTask: '',
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    getTodos()
      .then((data) => {
        const items = [];
        console.log(data);
        Object.entries(data.data).map(([key, value]) => items.push({ id: key, name: value.name }));
        this.setState({ toDoArr: items, isLoading: false, refreshing: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false, refreshing: false });
      });
  };

  handleDelete = (id) => {
    deleteTodo(id)
      .then(this.fetchData)
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    this.setState({ newTask: e.target.value });
  };

  handleAdd = (e) => {
    const { newTask } = this.state;
    e.preventDefault();
    postTodo({ name: newTask })
      .then(() => {
        this.setState({
          newTask: '',
        });
        this.fetchData();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { toDoArr, newTask } = this.state;
    return (
      <div style={{ maxWidth: 500, margin: 'auto' }}>
        <Grid container justify="space-between" spacing={3}>
          <Grid item style={{ flex: 1 }}>
            <TextField value={newTask} onChange={this.handleChange} fullWidth />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={this.handleAdd} color="secondary">
              Add
            </Button>
          </Grid>
        </Grid>
        <List>
          {toDoArr.length > 0 ? (
            toDoArr.map((todo) => (
              <React.Fragment key={todo.id}>
                <ListItem>
                  <ListItemText>{todo.name}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => this.handleDelete(todo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography>Relax, there is no to do items</Typography>
          )}
        </List>
      </div>
    );
  }
}

export default Tasks;
