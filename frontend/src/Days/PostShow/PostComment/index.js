import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  comment: {
    color: theme.palette.primary.light,
    paddingLeft: 10,
  },
  date: {
    color: theme.palette.secondary.light,
  },
});

class PostComment extends Component {
  render() {
    return (
      <div className={this.props.classes.comment}>
        <span className={this.props.classes.date}>{this.props.comment.Date.substr(0, 10)}</span>
        <span> {this.props.comment.Body}</span>
      </div>
    );
  }
}

export default withStyles(styles)(PostComment);
