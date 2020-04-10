import React, { Component } from 'react';
import {addLabel, deleteLabel} from '../../utils/routes';

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
      this.props.post.labels.map((post_label) => {
        if (post_label.ID === props_label.id) {
          isActive = true;
        }
        return 1;
      });
    }

    this.setState({ isActive });
  }

  handleClick = (e) => {
    if (this.state.isActive) {
      deleteLabel(this.state.post, this.state.label)
        .then((response) => {
          this.setState({ isActive: false });
        })
        .catch((error) => console.log(error));
    } else {
      addLabel(this.state.post, this.state.label)
        .then((response) => {
          this.setState({ isActive: true });
        })
        .catch((error) => console.log(error));
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
