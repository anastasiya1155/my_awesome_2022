import React, { Component } from 'react';
import axios from 'axios/index';
import { connect } from 'react-redux';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { IP, PORT } from '../../redux/const';
import { RELOAD_POST_LIST } from '../../redux/actions';

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
    axios
      .post(`http://${IP}:${PORT}/posts`, post)
      .then(() => {
        this.setState({ value: '' });
        this.props.reloadPostList(true);
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <form style={{ marginBottom: '30px' }} className="PostCreate">
        <textarea
          style={{
            fontSize: '1em',
            padding: 0,
            resize: 'none',
            height: 100,
            width: '100%',
            border: '1px solid black',
          }}
          value={this.state.value}
          onChange={this.handleText}
        />
        {this.props.customDate ? (
          <TextField type="date" value={this.state.date} onChange={this.handleDate} />
        ) : (
          ''
        )}
        <div className="MyAwesomeButton" onClick={this.handleSubmit}>
          Send
        </div>
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
export default connect(
  null,
  mapDispatchToProps,
)(PostCreate);
