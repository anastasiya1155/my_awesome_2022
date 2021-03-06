import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    height: '100vh',
    '& a': {
      color: 'grey',
      textDecoration: 'none',
    },
  },
  icon: {
    cursor: 'pointer',
  },
  form: {
    width: 300,
  },
}));

export default useStyles;
