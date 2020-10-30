export const USER_SIGN_IN = '@photos/USER_SIGN_IN';

const initialState = {
  isLoggedIn: !!localStorage.getItem('oauth_token'),
  name: localStorage.getItem('name'),
  imageUrl: localStorage.getItem('imageUrl'),
  token: localStorage.getItem('oauth_token'),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGN_IN:
      const user = action.payload;
      localStorage.setItem('name', user.name);
      localStorage.setItem('imageUrl', user.imageUrl);
      localStorage.setItem('oauth_token', user.token);
      return {
        ...state,
        isLoggedIn: true,
        name: user.name,
        imageUrl: user.imageUrl,
        token: user.token,
      };
    default:
      return state;
  }
};

export default reducer;
