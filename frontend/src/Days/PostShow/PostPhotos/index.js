import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Dialog, Grid, Typography } from '@material-ui/core';
import { getPhotosOnDate, photosSignIn } from '../../../shared/utils/photos';
import useStyles from './useStyles';

const PostPhotos = ({ oauthToken, date, dispatch }) => {
  const [photos, setPhotos] = React.useState([]);
  const [isFetched, setFetched] = React.useState(false);
  const [showImg, setShowImg] = React.useState(null);
  const classes = useStyles();

  const getPhotos = () => {
    getPhotosOnDate(oauthToken, date)
      .then(async ({ photos, error }) => {
        setFetched(true);
        if (error) {
          if (error.code === 401) {
            const newToken = await photosSignIn(dispatch);
            getPhotosOnDate(newToken, date)
              .then(({ photos }) => {
                if (photos?.mediaItems) {
                  setPhotos(photos.mediaItems);
                }
              })
              .catch(console.log);
          }
        }
        if (photos?.mediaItems) {
          setPhotos(photos.mediaItems);
        }
      })
      .catch(console.log);
  };

  return (
    <Grid container className={classes.container}>
      {isFetched ? null : <Button onClick={getPhotos}>GET PHOTOS</Button>}
      {isFetched && !photos.length ? <Typography>No photos found...</Typography> : null}
      {isFetched && photos.length ? (
        <Grid container spacing={1}>
          {photos.map(p => (
            <Grid item key={p.id}>
              <div
                className={classes.img}
                style={{ backgroundImage: `url(${p.baseUrl})` }}
                onClick={() => setShowImg(p.baseUrl)}
              />
            </Grid>
          ))}
        </Grid>
      ) : null}
      <Dialog open={!!showImg} onClose={() => setShowImg(null)}>
        <img src={showImg} className={classes.fullImg} alt={date} />
      </Dialog>
    </Grid>
  );
};

PostPhotos.propTypes = {
  dispatch: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  oauthToken: PropTypes.string.isRequired,
};

export default PostPhotos;
