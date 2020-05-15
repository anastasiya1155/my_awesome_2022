import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { RELOAD_POST_LIST, TOGGLE_EDIT } from '../../../shared/redux/actions';
import { editPost } from '../../../shared/config/routes';

const styles = theme => ({
  textarea: {
    width: '100%',
    padding: theme.spacing(2),
  },
});

class PostEdit extends Component {
  state = {
    updatedPostBody: '',
  };

  componentDidMount() {
    this.setState({ updatedPostBody: this.props.body });
  }

  handleText = e => {
    this.setState({ updatedPostBody: e.target.value });
  };

  handleSubmit = () => {
    editPost(this.props.post.id, {
      body: this.state.updatedPostBody,
    })
      .then(response => {
        this.props.reloadPostList(true);
        this.props.toggleEdit(true);
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <form style={{ marginBottom: '30px' }} className="PostCreate">
        <TextField
          multiline
          className={this.props.classes.textarea}
          value={this.state.updatedPostBody}
          onChange={this.handleText}
        />
        <div
          className="MyAwesomeButton"
          style={{ textAlign: 'center', width: '95%' }}
          onClick={this.handleSubmit}
        >
          Send
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    toggleEdit: () => {
      dispatch({
        type: TOGGLE_EDIT,
        payload: {
          postId: ownProps.post.id,
        },
      });
    },
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(PostEdit));
