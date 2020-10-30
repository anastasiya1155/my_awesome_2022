import { USER_SIGN_IN } from '../redux/photosReducer';

export const getPhotosOnDate = async (authToken, date) => {
  let photos = [];
  let error = null;
  try {
    const response = await fetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems:search?access_token=${encodeURIComponent(
        authToken,
      )}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            dateFilter: {
              dates: {
                year: new Date(date).getFullYear(),
                month: new Date(date).getMonth() + 1,
                day: new Date(date).getDate(),
              },
            },
          },
        }),
      },
    );
    photos = await response.json();
  } catch (err) {
    error = err;
  }

  return { photos, error };
};

export const photosSignIn = dispatch => {
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
