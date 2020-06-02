import { makeStyles } from '@material-ui/core';

const styles = makeStyles(theme => ({
  container: {
    position: 'relative',
    border: '1px solid black',
  },
  topActions: {
    position: 'absolute',
    top: -13,
    left: 0,
    width: '100%',
    '& > div:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
    '@media screen and (max-width: 555px)': {
      position: 'relative',
      top: 0,
      padding: theme.spacing(1),
      '& > div:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
  },
  actionBtns: {
    '& > button:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  periods: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  period: {
    color: theme.palette.primary.light,
  },
  button: {
    textTransform: 'lowercase',
    padding: 0,
    minWidth: 32,
  },
  post: {
    margin: 'auto',
    minHeight: 70,
    width: '100%',
    textAlign: 'left',
    lineHeight: '150%',
    position: 'relative',
    '& > p,textarea': {
      padding: 10,
    },
    '& > textarea': {
      minHeight: 70,
      width: '100%',
      border: 'none',
      textAlign: 'left',
      lineHeight: '150%',
    },
  },
  deleteBtns: {
    width: '95%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'space-around',
  },
  deleteBtn: {
    width: '40%',
  },
  highlight: {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default styles;
