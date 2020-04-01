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
    fetch('https://tranf-ae713.firebaseio.com/todo.json')
      .then((res) => res.json())
      .then((data) => {
        const items = [];
        Object.keys(data).map((key) => items.push({ id: key, name: data[key].name }));
        this.setState({ toDoArr: items, isLoading: false, refreshing: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false, refreshing: false });
      });
  };

  handleDelete = (id) => {
    fetch(`https://tranf-ae713.firebaseio.com/todo/${id}.json`, {
      method: 'delete',
    })
      .then(this.fetchData)
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    this.setState({ newTask: e.target.value });
  };

  handleAdd = (e) => {
    const { newTask } = this.state;
    e.preventDefault();
    fetch('https://tranf-ae713.firebaseio.com/todo.json', {
      method: 'post',
      body: JSON.stringify({
        name: newTask,
      }),
    })
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
              <>
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
              </>
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
