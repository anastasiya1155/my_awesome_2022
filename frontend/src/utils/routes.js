import axios from 'axios';
import {IP, PORT} from '../redux/const';

const FIREBASE = 'https://tranf-ae713.firebaseio.com/';
const LOCAL = `http://${IP}:${PORT}`;

const apiGetRequest = (url) => axios.get(url);
const apiPostRequest = (url, data) => axios.post(url, data);
const apiPutRequest = (url, data) => axios.put(url, data);
const apiDeleteRequest = (url) => axios.delete(url);


// FIREBASE TRANSACTION
export const getTransactionsByMonthAndYear = (year, month) => apiGetRequest(`${FIREBASE}transaction/${year}/${month}.json`);
export const postTransactionsToMonthAndYear = (year, month, data) => apiPostRequest(`${FIREBASE}transaction/${year}/${month}.json`,data);

export const getTransactionsCategories = () =>  apiGetRequest(`${FIREBASE}cat.json`);
export const postTransactionsCategories = (data) => apiPostRequest(`${FIREBASE}cat.json`, data);

export const getTodos    = () => apiGetRequest(`${FIREBASE}todo.json`);
export const getTodo     = (id) => apiGetRequest(`${FIREBASE}todo/${id}.json`);
export const postTodo    = (data) => apiPostRequest(`${FIREBASE}todo.json`, data);
export const putTodo     = (id, data) => apiPutRequest(`${FIREBASE}todo/${id}.json`, data);
export const deleteTodo  = (id) => apiDeleteRequest(`${FIREBASE}todo/${id}.json`);

export const getWishes   = () => apiGetRequest(`${FIREBASE}wish.json`);
export const postWish    = (data) => apiPostRequest(`${FIREBASE}wish.json`, data);
export const putWish     = (id, data) => apiPutRequest(`${FIREBASE}wish/${id}.json`, data);
export const deleteWish  = (id) => apiDeleteRequest(`${FIREBASE}wish/${id}.json`);

export const getPosts    = (link) => apiGetRequest(`${LOCAL}/posts${link}`);
export const deletePost  = id => apiDeleteRequest(`${LOCAL}/posts/${id}`);
export const editPost    = (id, data) => apiPutRequest(`${LOCAL}/posts/${id}`, data);
export const postComment = (data) => apiPostRequest(`${LOCAL}/comments`, data);
export const postPost    = (data) => apiPostRequest(`${LOCAL}/posts`, data);

export const getYears    = () => apiGetRequest(`${LOCAL}/posts-months/`);
export const getMonth    = (month) => apiGetRequest(`${LOCAL}/posts-by-month/?ym=${month}`);
export const searchPosts = (q) => apiGetRequest(`${LOCAL}/posts-search/?q=${q}`);

export const getLabels   = () => apiGetRequest(`${LOCAL}/labels`);
export const deleteLabel = (postId, labelId) => apiGetRequest(`${LOCAL}/posts-delete-label/?post_id=${postId}&label_id=${labelId}`);
export const addLabel    = (postId, labelId) => apiGetRequest(`${LOCAL}/posts-add-label/?post_id=${postId}&label_id=${labelId}`);

export const getPins     = () => apiGetRequest(`${LOCAL}/pins`);

export const getProjects = () => apiGetRequest(`${LOCAL}/projects`);
export const getProject  = (id) => apiGetRequest(`${LOCAL}/projects/${id}`);
export const postProject = (data) => apiPostRequest(`${LOCAL}/projects`, data);
export const getTasks    = (id) => apiGetRequest(`${LOCAL}/tasks?q[project_id]=${id}`);
// todo: hardcode in_progress
export const getInProgress   = () => apiGetRequest(`${LOCAL}/tasks?q[status]=in_progress`);
export const editTask    = (id, data) => apiPutRequest(`${LOCAL}/tasks/${id}`, data);
export const postTask    = (data) => apiPostRequest(`${LOCAL}/tasks`, data);

