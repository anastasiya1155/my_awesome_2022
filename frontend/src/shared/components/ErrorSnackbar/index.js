import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const ErrorSnackbar = ({ error, handleClose }) => {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={!!error}
      autoHideDuration={5000}
      onClose={handleClose}
      ContentProps={{ className: classes.error }}
      message={error}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

ErrorSnackbar.propTypes = {
  error: PropTypes.string,
  handleClose: PropTypes.func,
};

export default ErrorSnackbar;
