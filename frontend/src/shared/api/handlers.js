import * as api from './routes';
import { SET_ERROR } from '../redux/rootReducer';
import {
  LABELS_LOADED,
  PERIODS_LOADED,
  POSTS_HISTORY_LOADED,
  POSTS_LOADED,
} from '../redux/postReducer';
import { LAST_TIMES_LOADED, REMINDER_LOADED } from '../redux/lastTimeReducer';
import { IN_PROGRESS_LOADED, PROJECT_LOADED, TASKS_LOADED } from '../redux/projectsReducer';
import { TRANS_CATEGORIES_LOADED } from '../redux/transactionsReducer';

const safeAction = (action, callback, dispatch) => {
  return action()
    .then(callback)
    .catch((err) => {
      console.log(err);
      if (err.message === 'Network Error') {
        // TODO: add custom logic for each route
        console.log('request will be synced later');
        return true;
      }
      dispatch({ type: SET_ERROR, payload: err.message });
      throw err;
    });
};

export function getPostsAction(dispatch) {
  return safeAction(
    api.getPosts,
    (json) => {
      dispatch({ type: POSTS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getPostsHistoryAction(dispatch) {
  return safeAction(
    api.getPostsHistory,
    (json) => {
      dispatch({ type: POSTS_HISTORY_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getLabelsAction(dispatch) {
  return safeAction(
    api.getLabels,
    (json) => {
      dispatch({ type: LABELS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getPeriodsAction(dispatch) {
  return safeAction(
    api.getPeriods,
    (json) => {
      dispatch({ type: PERIODS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getInProgressAction(dispatch) {
  return safeAction(
    api.getInProgress,
    (json) => {
      dispatch({ type: IN_PROGRESS_LOADED, payload: json });
    },
    dispatch,
  );
}

export function getReminderAction(dispatch) {
  return safeAction(
    api.getExpiredLts,
    (json) => {
      dispatch({ type: REMINDER_LOADED, payload: json });
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
  return safeAction(
    () => api.deleteLabel(id),
    () => {
      getLabelsAction(dispatch);
    },
    dispatch,
  );
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

const updateProjectTasks = (dispatch, id) => {
  return safeAction(
    () => api.getTasks(id),
    (json) => dispatch({ type: TASKS_LOADED, payload: { ...json, id } }),
    dispatch,
  );
};

export function getProjectAction(dispatch, id) {
  return Promise.all([
    safeAction(
      () => api.getProject(id),
      (json) => dispatch({ type: PROJECT_LOADED, payload: json }),
      dispatch,
    ),
    updateProjectTasks(dispatch, id),
  ]);
}

export function editTaskAction(dispatch, { id, data, projectId }) {
  return safeAction(
    () => api.editTask(id, data),
    () => {
      updateProjectTasks(dispatch, projectId);
      getInProgressAction(dispatch);
    },
    dispatch,
  );
}

export function deleteTaskAction(dispatch, { id, projectId }) {
  return safeAction(
    () => api.deleteTask(id),
    () => {
      updateProjectTasks(dispatch, projectId);
      getInProgressAction(dispatch);
    },
    dispatch,
  );
}

export function createTaskAction(dispatch, { data, projectId }) {
  return safeAction(
    () => api.postTask(data),
    () => updateProjectTasks(dispatch, projectId),
    dispatch,
  );
}

export function getLastTimeAction(dispatch) {
  return safeAction(
    api.getLts,
    (json) => dispatch({ type: LAST_TIMES_LOADED, payload: json }),
    dispatch,
  );
}

export function editLastTimeAction(dispatch, { id, data }) {
  return safeAction(
    () => api.putLT(id, data),
    () => {
      getReminderAction(dispatch);
      getLastTimeAction(dispatch);
    },
    dispatch,
  );
}

export function addLastTimeAction(dispatch, data) {
  return safeAction(
    () => api.postLT(data),
    () => {
      getLastTimeAction(dispatch);
    },
    dispatch,
  );
}

export function getTransCategoriesAction(dispatch) {
  return safeAction(
    api.getTransactionsCategories,
    (json) => dispatch({ type: TRANS_CATEGORIES_LOADED, payload: json }),
    dispatch,
  );
}

export function addTransCategoryAction(dispatch, data) {
  return safeAction(
    () => api.postTransactionsCategories(data),
    () => {
      getTransCategoriesAction(dispatch);
    },
    dispatch,
  );
}
