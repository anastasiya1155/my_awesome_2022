import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, TextField, Button } from '@material-ui/core';
import { sendLogin } from '../../shared/api/routes';
import useStyles from '../useStyles';
import { setItemToStorage, TOKEN_KEY } from '../../shared/utils/storage';
import ErrorSnackbar from '../../shared/components/ErrorSnackbar';

const LoginPage = ({ history }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const classes = useStyles();
  const handleSubmit = () => {
    sendLogin({ email, password })
      .then(resp => {
        setItemToStorage(TOKEN_KEY, resp.data.Token);
        history.push('/days');
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const handleClose = () => {
    setError('');
  };
  return (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      <ErrorSnackbar error={error} handleClose={handleClose} />
      <Grid item container direction="column" spacing={2} className={classes.form}>
        <form onSubmit={e => e.preventDefault()}>
          <Grid item>
            <TextField
              label="Email"
              fullWidthx
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              type="password"
              fullWidth
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item container justify="space-between" alignItems="center">
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Link to="/register">Register</Link>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

LoginPage.propTypes = {
  history: PropTypes.object,
};

export default LoginPage;
