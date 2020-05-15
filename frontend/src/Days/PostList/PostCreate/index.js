import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { RELOAD_POST_LIST } from '../../../shared/redux/actions';
import { postPost } from '../../../shared/config/routes';

class PostCreate extends Component {
  state = {
    value: '',
    date: moment().format('YYYY-MM-DD'),
  };

  handleText = e => {
    this.setState({ value: e.target.value });
  };

  handleDate = e => {
    this.setState({ date: e.target.value });
  };

  handleSubmit = () => {
    const post = {
      body: this.state.value,
      date: moment.utc(this.state.date),
    };
    postPost(post)
      .then(() => {
        this.setState({ value: '' });
        this.props.reloadPostList(true);
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <form style={{ marginBottom: '30px', textAlign: 'center' }}>
        <TextField
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          value={this.state.value}
          onChange={this.handleText}
        />
        <TextField type="date" value={this.state.date} onChange={this.handleDate} />
        <Button fullWidth variant="contained" color="primary" onClick={this.handleSubmit}>
          Send
        </Button>
      </form>
    );
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    reloadPostList: reload => {
      dispatch({
        type: RELOAD_POST_LIST,
        payload: {
          reload,
        },
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(PostCreate);
