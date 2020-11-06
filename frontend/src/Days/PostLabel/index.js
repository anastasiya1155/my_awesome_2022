import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  dot: {
    height: 22,
    width: 22,
    borderRadius: '50%',
    display: 'inline-block',
    margin: (props) => (props.noMargin ? '0' : '0 4px -6px'),
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'center',
  },
}));

const PostLabel = ({ isActive, label, onClick, noMargin }) => {
  const classes = useStyles({ noMargin });
  return (
    <span
      className={classes.dot}
      title={label.name}
      style={{
        backgroundColor: isActive ? label.colorActive : label.color,
        color: isActive ? 'white' : 'black',
      }}
      onClick={(e) => onClick(e, isActive)}
    >
      {label.name.substr(0, 1)}
    </span>
  );
};

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
  noMargin: PropTypes.bool,
};

export default PostLabel;
