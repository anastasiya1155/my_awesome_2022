import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
    marginBottom: theme.spacing(2),
  },
  moreIcon: {
    padding: theme.spacing(0.5),
    position: 'absolute',
    bottom: 8,
    right: 0,
  },
  noteText: {
    marginRight: 20,
  },
}));

export default styles;
