import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1),
  },
  img: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: 70,
    height: 70,
    cursor: 'pointer',
  },
  fullImg: {
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
}));

export default styles;
