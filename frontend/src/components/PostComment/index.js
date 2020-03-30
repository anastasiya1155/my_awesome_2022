import React, { Component } from 'react';

export default class PostComment extends Component {
  render() {
    return (
      <div style={{ backgroundColor: 'rgb(230, 230, 230)', paddingLeft: 10 }}>
        <span style={{ color: 'rgb(62, 62, 62)' }}>{this.props.comment.Date.substr(0, 10)}</span>
        <span> {this.props.comment.Body}</span>
      </div>
    );
  }
}
