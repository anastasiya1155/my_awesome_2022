import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  Checkbox,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    width: 400,
    '@media screen and (max-width: 500px)': {
      width: '100%',
    },
  },
  done: {
    border: `3px dotted ${theme.palette.secondary.main}`,
  },
  media: {
    height: 170,
  },
  fullImg: {
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
}));

const WishList = ({ wishes, editWish, removeWish, openEditPopup }) => {
  const [showImg, setShowImg] = React.useState(null);
  const [shouldHideDone, setHideDone] = React.useState(true);
  const [wishesToShow, setWishesToShow] = React.useState([]);
  const classes = useStyles();

  React.useEffect(() => {
    if (wishes) {
      if (shouldHideDone) {
        setWishesToShow(wishes.filter(w => !w.isDone));
      } else {
        setWishesToShow(wishes);
      }
    }
  }, [wishes, shouldHideDone]);

  return (
    <div>
      <FormControl>
        <FormControlLabel
          control={
            <Checkbox checked={shouldHideDone} onChange={e => setHideDone(e.target.checked)} />
          }
          label="Hide done"
        />
      </FormControl>
      <Grid container spacing={2}>
        {wishesToShow.map(w => {
          const isMine = true;
          return (
            <Grid key={w.id} item className={classes.root}>
              <Card raised={isMine} className={w.isDone ? classes.done : ''}>
                <CardMedia
                  image={w.picture}
                  title={w.name}
                  className={classes.media}
                  onClick={() => setShowImg(w.picture)}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {w.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {w.priceFrom} - {w.priceTo} грн.
                  </Typography>
                  <Typography variant="caption">
                    {moment(w.createdAt).format('DD-MM-YYYY')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => openEditPopup(w)} disabled={!isMine}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => editWish(w.id, { ...w, isDone: true })}
                    disabled={!isMine || w.isDone}
                  >
                    Done
                  </Button>
                  <Button onClick={() => removeWish(w.id)} disabled={!isMine}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
        <Dialog open={!!showImg} onClose={() => setShowImg(null)}>
          <img src={showImg} className={classes.fullImg} alt="wish" />
        </Dialog>
      </Grid>
    </div>
  );
};

WishList.propTypes = {
  wishes: PropTypes.array,
  editWish: PropTypes.func,
  openEditPopup: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default WishList;
