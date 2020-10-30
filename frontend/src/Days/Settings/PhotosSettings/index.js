import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { USER_SIGN_IN } from '../../../shared/redux/photosReducer';

const PhotosSettings = () => {
  const googleUser = useSelector(state => state.photos);
  const dispatch = useDispatch();

  const signIn = () => {
    const auth2 = window.gapi.auth2?.getAuthInstance();

    if (auth2) {
      auth2
        .signIn({ scope: 'https://www.googleapis.com/auth/photoslibrary.readonly' })
        .then(googleUser => {
          const profile = googleUser.getBasicProfile();

          dispatch({
            type: USER_SIGN_IN,
            payload: {
              name: profile.getName(),
              imageUrl: profile.getImageUrl(),
              token: googleUser.getAuthResponse().access_token,
            },
          });
        })
        .catch(console.log);
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Google Photos:</Typography>
        {googleUser.isLoggedIn ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Logged in as:</Typography>
            </Grid>
            <Grid item container xs={12} spacing={1} alignItems="center">
              <Grid item>
                <Avatar src={googleUser.imageUrl} alt={googleUser.name} />
              </Grid>
              <Grid item>
                <Typography>{googleUser.name}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={signIn}>Change user</Button>
            </Grid>
          </Grid>
        ) : (
          <Button onClick={signIn}>Connect to Google Photos</Button>
        )}
      </Grid>
    </Grid>
  );
};

export default PhotosSettings;
