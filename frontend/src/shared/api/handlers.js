import * as api from './routes';
import { SET_ERROR } from '../redux/rootReducer';
import {
  LABELS_LOADED,
  PERIODS_LOADED,
  POSTS_HISTORY_LOADED,
  POSTS_LOADED,
} from '../redux/postReducer';

const handleError = () => {};

const safeAction = (action, callback, dispatch) => {
  return action()
    .then(callback)
    .catch(err => {
      console.log(err);
      dispatch({ type: SET_ERROR, payload: err.message });
      throw err;
    });
};

export function getPostsAction(dispatch) {
  return safeAction(
    api.getPosts,
    json => {
      dispatch({ type: POSTS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getPostsHistoryAction(dispatch) {
  return safeAction(
    api.getPostsHistory,
    json => {
      dispatch({ type: POSTS_HISTORY_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getLabelsAction(dispatch) {
  return safeAction(
    api.getLabels,
    json => {
      dispatch({ type: LABELS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getPeriodsAction(dispatch) {
  return safeAction(
    api.getPeriods,
    json => {
      dispatch({ type: PERIODS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function deletePostAction(dispatch, id) {
  return safeAction(
    () => api.deletePost(id),
    () => {
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function createPostAction(dispatch, data) {
  return safeAction(
    () => api.postPost(data),
    () => {
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function togglePostLabelAction(dispatch, { postId, labelId, isActive }) {
  const apiHandler = isActive ? api.deleteLabelFromPost : api.addLabelToPost;
  return safeAction(
    () => apiHandler(postId, labelId),
    () => {
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function editPostAction(dispatch, { postId, value }) {
  return safeAction(
    () => api.editPost(postId, value),
    () => {
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function addCommentAction(dispatch, data) {
  return safeAction(
    () => api.postComment(data),
    () => {
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function editLabelAction(dispatch, { labelId, data }) {
  return safeAction(
    () => api.putLabel(labelId, data),
    () => {
      getLabelsAction(dispatch);
    },
    dispatch,
  );
}

export function addLabelAction(dispatch, data) {
  return safeAction(
    () => api.postLabel(data),
    () => {
      getLabelsAction(dispatch);
    },
    dispatch,
  );
}

export function deleteLabelAction(dispatch, id) {
  return api
    .deleteLabel(id)
    .then(() => {
      getLabelsAction(dispatch);
    })
    .catch(handleError);
}

export function createPeriodAction(dispatch, data) {
  return safeAction(
    () => api.postPeriod(data),
    () => {
      getPeriodsAction(dispatch);
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function deletePeriodAction(dispatch, id) {
  return safeAction(
    () => api.deletePeriod(id),
    () => {
      getPeriodsAction(dispatch);
      getPostsAction(dispatch);
    },
    dispatch,
  );
}

export function editPeriodAction(dispatch, { id, data }) {
  return safeAction(
    () => api.putPeriod(id, data),
    () => {
      getPeriodsAction(dispatch);
      getPostsAction(dispatch);
    },
    dispatch,
  );
}
