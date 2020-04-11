import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import WishForm from '../WishForm';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(4),
  },
}));

const WishEdit = ({ isOpen, wish, onSubmit, handleClose }) => {
  const [values, setValues] = React.useState(wish || {});
  React.useEffect(() => {
    setValues(wish || {});
  }, [wish]);
  const classes = useStyles();
  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: classes.dialog }}>
      <WishForm
        values={values}
        handleChange={handleChange}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(values)
            .then(() => {
              handleClose();
            })
            .catch(console.log);
        }}
      />
    </Dialog>
  );
};

WishEdit.propTypes = {
  isOpen: PropTypes.bool,
  wish: PropTypes.object,
  onSubmit: PropTypes.func,
  handleClose: PropTypes.func,
};

export default WishEdit;
