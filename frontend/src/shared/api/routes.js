import axios from 'axios';
import { IP, PORT } from '../config/const';
import { getItemFromStorage, TOKEN_KEY } from '../utils/storage';

const FIREBASE = 'https://tranf-ae713.firebaseio.com/';
const LOCAL = `http://${IP}:${PORT}`;

const apiGetRequest = (url, config) => axios.get(url, config);
const apiPostRequest = (url, data, config) => axios.post(url, data, config);
const apiPutRequest = (url, data, config) => axios.put(url, data, config);
const apiDeleteRequest = (url, config) => axios.delete(url, config);

const authConfig = {
  headers: { authorization: getItemFromStorage(TOKEN_KEY) },
};

const redirectUnauth = err => {
  if (err.message === 'Request failed with status code 401') {
    window.location.replace('/login');
  } else {
    throw err;
  }
};

const apiLocalGetRequest = url =>
  apiGetRequest(`${LOCAL}/api/${url}`, authConfig).catch(redirectUnauth);
const apiLocalPostRequest = (url, data) =>
  apiPostRequest(`${LOCAL}/api/${url}`, data, authConfig).catch(redirectUnauth);
const apiLocalPutRequest = (url, data) =>
  apiPutRequest(`${LOCAL}/api/${url}`, data, authConfig).catch(redirectUnauth);
const apiLocalDeleteRequest = url =>
  apiDeleteRequest(`${LOCAL}/api/${url}`, authConfig).catch(redirectUnauth);

// FIREBASE TRANSACTION
export const getTransactionsByMonthAndYear = (year, month) =>
  apiGetRequest(`${FIREBASE}transaction/${year}/${month}.json`);
export const postTransactionsToMonthAndYear = (year, month, data) =>
  apiPostRequest(`${FIREBASE}transaction/${year}/${month}.json`, data);

export const getTransactionsCategories = () => apiGetRequest(`${FIREBASE}cat.json`);
export const postTransactionsCategories = data => apiPostRequest(`${FIREBASE}cat.json`, data);
export const getTransactionsStatistics = () =>
  apiGetRequest(`${FIREBASE}transactions-statistics.json`);

export const getTodos = () => apiGetRequest(`${FIREBASE}todo.json`);
export const getTodo = id => apiGetRequest(`${FIREBASE}todo/${id}.json`);
export const postTodo = data => apiPostRequest(`${FIREBASE}todo.json`, data);
export const putTodo = (id, data) => apiPutRequest(`${FIREBASE}todo/${id}.json`, data);
export const deleteTodo = id => apiDeleteRequest(`${FIREBASE}todo/${id}.json`);

export const getWishes = () => apiGetRequest(`${FIREBASE}wish.json`);
export const postWish = data => apiPostRequest(`${FIREBASE}wish.json`, data);
export const putWish = (id, data) => apiPutRequest(`${FIREBASE}wish/${id}.json`, data);
export const deleteWish = id => apiDeleteRequest(`${FIREBASE}wish/${id}.json`);

export const getPosts = () => apiLocalGetRequest(`posts?sort=-date`);
export const getPostsHistory = () => apiLocalGetRequest(`posts-history`);
export const deletePost = id => apiLocalDeleteRequest(`posts/${id}`);
export const editPost = (id, data) => apiLocalPutRequest(`posts/${id}`, data);
export const postComment = data => apiLocalPostRequest(`comments`, data);
export const postPost = data => apiLocalPostRequest(`posts`, data);

export const getYears = () => apiLocalGetRequest(`posts-months/`);
export const getMonth = month => apiLocalGetRequest(`posts-by-month/?ym=${month}`);
export const searchPosts = q => apiLocalGetRequest(`posts-search/?q=${q}`);

export const getLabels = () => apiLocalGetRequest('labels');
export const postLabel = data => apiLocalPostRequest('labels', data);
export const putLabel = (id, data) => apiLocalPutRequest(`labels/${id}`, data);
export const deleteLabel = id => apiLocalDeleteRequest(`labels/${id}`);

export const deleteLabelFromPost = (postId, labelId) =>
  apiLocalGetRequest(`posts-delete-label/?post_id=${postId}&label_id=${labelId}`);
export const addLabelToPost = (postId, labelId) =>
  apiLocalGetRequest(`posts-add-label/?post_id=${postId}&label_id=${labelId}`);

export const getPins = () => apiLocalGetRequest(`pins`);

export const getProjects = () => apiLocalGetRequest('projects');
export const getProject = id => apiLocalGetRequest(`projects/${id}`);
export const postProject = data => apiLocalPostRequest('projects', data);
export const putProject = (id, data) => apiLocalPutRequest(`projects/${id}`, data);
export const getTasks = id => apiLocalGetRequest(`projects/${id}/tasks`);

export const getInProgress = () => apiLocalGetRequest(`tasks-in-progress`);
export const editTask = (id, data) => apiLocalPutRequest(`tasks/${id}`, data);
export const postTask = data => apiLocalPostRequest(`tasks`, data);
export const deleteTask = id => apiLocalDeleteRequest(`tasks/${id}`);

export const getLts = () => apiLocalGetRequest(`lts`);
export const getExpiredLts = () => apiLocalGetRequest(`lts-expired`);
export const postLT = data => apiLocalPostRequest(`lt`, data);
export const putLT = (id, data) => apiLocalPutRequest(`lt/${id}`, data);

export const sendLogin = data => apiPostRequest(`${LOCAL}/login`, data);
export const sendRegistration = data => apiPostRequest(`${LOCAL}/register`, data);

export const getPeriods = () => apiLocalGetRequest(`periods`);
export const postPeriod = data => apiLocalPostRequest(`periods`, data);
export const deletePeriod = id => apiLocalDeleteRequest(`periods/${id}`);
export const putPeriod = (id, data) => apiLocalPutRequest(`periods/${id}`, data);