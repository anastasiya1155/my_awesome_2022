import React, { Component } from 'react';
import axios from 'axios';
import { IP, PORT } from '../../redux/const';

class PostLabel extends Component {
  state = {
    isActive: false,
    post: this.props.post.id,
    label: this.props.label.id,
  };

  componentDidMount() {
    let isActive = false;
    const props_label = this.props.label;
    if (this.props.post.labels !== null) {
      this.props.post.labels.map(post_label => {
        if (post_label.ID === props_label.id) {
          isActive = true;
        }
        return 1;
      });
    }

    this.setState({ isActive });
  }

  handleClick = e => {
    if (this.state.isActive) {
      axios
        .get(
          `http://${IP}:${PORT}/posts-delete-label/?post_id=${this.state.post}&label_id=${this.state.label}`,
        )
        .then(response => {
          this.setState({ isActive: false });
        })
        .catch(error => console.log(error));
    } else {
      axios
        .get(
          `http://${IP}:${PORT}/posts-add-label/?post_id=${this.state.post}&label_id=${this.state.label}`,
        )
        .then(response => {
          this.setState({ isActive: true });
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    return (
      <span
        className="dot"
        title={this.props.label.name}
        style={{
          backgroundColor: this.state.isActive
            ? this.props.label.colorActive
            : this.props.label.color,
          color: this.state.isActive ? 'white' : 'black',
        }}
        onClick={this.handleClick}
      >
        {this.props.label.name.substr(0, 1)}
      </span>
    );
  }
}

export default PostLabel;
