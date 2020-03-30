import * as actionTypes from './actions';

const initialState = {
  openComments: {},
  openEdits: {},
  reloadPostList: false,
  reloadTransCategoriesList: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_COMMENT:
      return {
        ...state,
        openComments: {
          ...state.openComments,
          [action.payload.postId]: !state.openComments[action.payload.postId],
        },
      };
    case actionTypes.TOGGLE_EDIT:
      return {
        ...state,
        openEdits: {
          ...state.openEdits,
          [action.payload.postId]: !state.openEdits[action.payload.postId],
        },
      };

    case actionTypes.RELOAD_TRANS_CATEGORIES_LIST:
      return {
        ...state,
        reloadTransCategoriesList: action.payload.reload,
      };

    case actionTypes.RELOAD_POST_LIST:
      return {
        ...state,
        reloadPostList: action.payload.reload,
      };
    default:
      return state;
  }
};

export default reducer;
