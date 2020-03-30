import React, { Component } from 'react';

export default class PinShow extends Component {
  render() {
    return (
      <div>
        <p style={{ padding: 10 }}> {this.props.name} </p>
      </div>
    );
  }
}
