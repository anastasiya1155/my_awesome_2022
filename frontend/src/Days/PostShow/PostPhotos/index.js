import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Dialog, Grid, Typography } from '@material-ui/core';
import { getPhotosOnDate } from '../../../shared/utils/photos';
import useStyles from './useStyles';

const PostPhotos = ({ oauthToken, date }) => {
  const [photos, setPhotos] = React.useState([]);
  const [isFetched, setFetched] = React.useState(false);
  const [showImg, setShowImg] = React.useState(null);
  const classes = useStyles();

  const getPhotos = () => {
    getPhotosOnDate(oauthToken, date)
      .then(({ photos, error }) => {
        setFetched(true);
        if (error) {
          console.log(error);
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
            <Grid item>
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
  date: PropTypes.string.isRequired,
  oauthToken: PropTypes.string.isRequired,
};

export default PostPhotos;
