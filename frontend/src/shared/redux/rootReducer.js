import { combineReducers } from 'redux';
import post from './postReducer';
import projects from './projectsReducer';
import lastTime from './lastTimeReducer';
import transactions from './transactionsReducer';

export const SET_ERROR = '@root/SET_ERROR';

const initialState = {
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  root: reducer,
  post,
  projects,
  lastTime,
  transactions,
});

export default rootReducer;
