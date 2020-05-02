import axios from 'axios';
import { IP, PORT } from '../config/const';

const FIREBASE = 'https://tranf-ae713.firebaseio.com/';
const LOCAL = `http://${IP}:${PORT}`;

const apiGetRequest = (url, config) => axios.get(url, config);
const apiPostRequest = (url, data, config) => axios.post(url, data, config);
const apiPutRequest = (url, data, config) => axios.put(url, data, config);
const apiDeleteRequest = (url, config) => axios.delete(url, config);

const apiLocalGetRequest = url => apiGetRequest(`${LOCAL}/${url}`);
const apiLocalPostRequest = (url, data) => apiPostRequest(`${LOCAL}/${url}`, data);
const apiLocalPutRequest = (url, data) => apiPutRequest(`${LOCAL}/${url}`, data);
const apiLocalDeleteRequest = url => apiDeleteRequest(`${LOCAL}/${url}`);

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

export const getPosts = link => apiLocalGetRequest(`posts${link}`);
export const deletePost = id => apiLocalDeleteRequest(`posts/${id}`);
export const editPost = (id, data) => apiLocalPutRequest(`posts/${id}`, data);
export const postComment = data => apiLocalPostRequest(`comments`, data);
export const postPost = data => apiLocalPostRequest(`posts`, data);

export const getYears = () => apiLocalGetRequest(`posts-months/`);
export const getMonth = month => apiLocalGetRequest(`posts-by-month/?ym=${month}`);
export const searchPosts = q => apiLocalGetRequest(`posts-search/?q=${q}`);

export const getLabels = () => apiLocalGetRequest('labels');
export const postLabel = data => apiLocalPostRequest('labels', data);
export const deleteLabel = id => apiLocalDeleteRequest(`labels/${id}`);

export const deleteLabelFromPost = (postId, labelId) =>
  apiLocalGetRequest(`posts-delete-label/?post_id=${postId}&label_id=${labelId}`);
export const addLabelToPost = (postId, labelId) =>
  apiLocalGetRequest(`posts-add-label/?post_id=${postId}&label_id=${labelId}`);

export const getPins = () => apiLocalGetRequest(`pins`);

export const getProjects = () => apiLocalGetRequest(`projects`);
export const getProject = id => apiLocalGetRequest(`projects/${id}`);
export const postProject = data => apiLocalPostRequest(`projects`, data);
export const getTasks = id => apiLocalGetRequest(`tasks?q[project_id]=${id}`);
// todo: hardcode in_progress
export const getInProgress = () => apiLocalGetRequest(`tasks?q[status]=in_progress`);
export const editTask = (id, data) => apiLocalPutRequest(`tasks/${id}`, data);
export const postTask = data => apiLocalPostRequest(`tasks`, data);

export const deleteLt = id => apiLocalDeleteRequest(`${id}`);
export const getLts = () => apiLocalGetRequest(`lts?sort=-date`);
export const postLT = data => apiLocalPostRequest(`lt`, data);
export const putLT = (id, data) => apiLocalPutRequest(`lt/${id}`, data);

export const sendLogin = data =>
  apiLocalPostRequest(`login`, data).then(resp =>
    localStorage.setItem('token', resp.headers.authorization),
  );
export const sendRegistration = data => apiLocalPostRequest(`register`, data);

export const getPeriods = () =>
  Promise.resolve({ data: [{ ID: 1, Name: 'Kyiv', Start: '2019-10-01', End: null }] });
export const postPeriod = data => Promise.resolve(data);
export const deletePeriod = id => Promise.resolve(id);
export const putPeriod = (id, data) => Promise.resolve({ id, data });
