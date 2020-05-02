import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

const PostLabel = ({ isActive, label, classes, onClick }) => {
  return (
    <span
      className={classes.dot}
      title={label.name}
      style={{
        backgroundColor: isActive ? label.colorActive : label.color,
        color: isActive ? 'white' : 'black',
      }}
      onClick={e => onClick(e, isActive)}
    >
      {label.name.substr(0, 1)}
    </span>
  );
};

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

PostLabel.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    colorActive: PropTypes.string,
  }),
  classes: PropTypes.object,
  onClick: PropTypes.func,
};

export default withStyles(styles)(PostLabel);
