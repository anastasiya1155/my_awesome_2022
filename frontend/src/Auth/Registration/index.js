import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useStyles from '../useStyles';
import { sendRegistration } from '../../shared/api/routes';
import { Button, Grid, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibleIcon from '@material-ui/icons/VisibilityOutlined';
import NotVisibleIcon from '@material-ui/icons/VisibilityOffOutlined';
import { setItemToStorage, TOKEN_KEY } from '../../shared/utils/storage';
import ErrorSnackbar from '../../shared/components/ErrorSnackbar';

const RegistrationPage = ({ history }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [error, setError] = React.useState('');
  const classes = useStyles();
  const handleSubmit = () => {
    if (password === confirmPassword) {
      sendRegistration({ email, password })
        .then((resp) => {
          setItemToStorage(TOKEN_KEY, resp.data.Token);
          history.push('/days');
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError("Passwords don't match!");
    }
  };

  const handleClose = () => {
    setError('');
  };

  return (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      <ErrorSnackbar handleClose={handleClose} error={error} />
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid item container direction="column" spacing={2} className={classes.form}>
          <Grid item>
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              type={visible ? 'text' : 'password'}
              fullWidth
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={classes.icon}>
                    {visible ? (
                      <NotVisibleIcon onClick={() => setVisible(false)} />
                    ) : (
                      <VisibleIcon onClick={() => setVisible(true)} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Confirm Password"
              type={visible2 ? 'text' : 'password'}
              fullWidth
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={classes.icon}>
                    {visible2 ? (
                      <NotVisibleIcon onClick={() => setVisible2(false)} />
                    ) : (
                      <VisibleIcon onClick={() => setVisible2(true)} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item container justify="space-between" alignItems="center">
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Link to="/signin">Login</Link>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

RegistrationPage.propTypes = {
  history: PropTypes.object,
};

export default RegistrationPage;
