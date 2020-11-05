import { USER_SIGN_IN, USER_SIGN_OUT } from '../redux/photosReducer';

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
    const result = await response.json();
    if (result && !result.error) {
      photos = result;
    } else {
      error = result.error;
    }
  } catch (err) {
    error = err;
  }

  return { photos, error };
};

export const photosSignIn = dispatch => {
  const auth2 = window.gapi.auth2?.getAuthInstance();

  if (auth2) {
    return auth2
      .signIn({ scope: 'https://www.googleapis.com/auth/photoslibrary.readonly' })
      .then(googleUser => {
        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().access_token;

        dispatch({
          type: USER_SIGN_IN,
          payload: {
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
            token,
          },
        });
        return token;
      })
      .catch(console.log);
  }
};

export const photosVerifyToken = async (token, dispatch) => {
  if (token) {
    const auth2 = window.gapi.auth2?.getAuthInstance();
    if (auth2) {
      const isValid = auth2.isSignedIn.get();
      if (!isValid) {
        dispatch({ type: USER_SIGN_OUT });
      }
    }
  }
};
