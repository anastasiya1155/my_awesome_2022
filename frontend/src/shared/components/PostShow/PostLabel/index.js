import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { addLabel, deleteLabel } from '../../../utils/routes';

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
      deleteLabel(this.state.post, this.state.label)
        .then(response => {
          this.setState({ isActive: false });
        })
        .catch(error => console.log(error));
    } else {
      addLabel(this.state.post, this.state.label)
        .then(response => {
          this.setState({ isActive: true });
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const { label, classes } = this.props;
    return (
      <span
        className={classes.dot}
        title={label.name}
        style={{
          backgroundColor: this.state.isActive ? label.colorActive : label.color,
          color: this.state.isActive ? 'white' : 'black',
        }}
        onClick={this.handleClick}
      >
        {label.name.substr(0, 1)}
      </span>
    );
  }
}

const styles = () => ({
  dot: {
    height: 22,
    width: 22,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 4px -6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'center',
  },
});

export default withStyles(styles)(PostLabel);
