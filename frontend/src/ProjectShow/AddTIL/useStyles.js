import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  modalPaper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default styles;
