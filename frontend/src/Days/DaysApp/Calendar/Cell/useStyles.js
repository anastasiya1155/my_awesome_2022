import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    width: 75,
    height: 75,
    display: 'flex',
    position: 'relative',
    margin: '0 -10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    position: 'absolute',
    top: -3,
    right: -3,
  },
}));

export default useStyles;
