import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { RELOAD_POST_LIST, TOGGLE_COMMENT } from '../../../shared/redux/actions';
import { postComment } from '../../../shared/utils/routes';

class PostCommentEdit extends Component {
  state = {
    commentBody: '',
  };

  handleText = e => {
    this.setState({ commentBody: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    postComment({
      body: this.state.commentBody,
      PostId: this.props.postId,
    })
      .then(() => {
        this.props.closeComment();
        this.props.reloadPostList(true);
      })
      .catch(error => console.log(error));
  };

  render() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }

    today = `${yyyy}-${mm}-${dd}`;
    return (
      <Paper style={{ width: '100%', padding: '0 10px 5px 10px' }}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item style={{ minWidth: 91 }}>
            <Typography>{today}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              value={this.state.commentBody}
              onChange={this.handleText}
              name="comment"
              label="Comment"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button onClick={this.handleSubmit} fullWidth>
              Send
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    closeComment: () => {
      dispatch({
        type: TOGGLE_COMMENT,
        payload: {
          postId: ownProps.postId,
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

export default connect(null, mapDispatchToProps)(PostCommentEdit);
