import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: 'relative',
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
    '@media screen and (min-width: 600px) and (max-width: 700px)': {
      padding: theme.spacing(1),
    },
  },
  inputContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  moreIcon: {
    padding: theme.spacing(0.5),
    position: 'absolute',
    bottom: 8,
    right: 0,
    '@media screen and (min-width: 600px) and (max-width: 700px)': {
      bottom: 2,
    },
  },
  taskText: {
    marginRight: 20,
  },
}));

export default styles;
