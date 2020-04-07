import axios from 'axios';

const FIREBASE = 'https://tranf-ae713.firebaseio.com/';

const apiGetRequest = (url) => axios.get(url);
const apiPostRequest = (url, data) => axios.post(url, data);
const apiPutRequest = (url, data) => axios.put(url, data);
const apiDeleteRequest = (url) => axios.delete(url);


// FIREBASE TRANSACTION
export const getTransactionsByMonthAndYear = (year, month) => apiGetRequest(`${FIREBASE}transaction/${year}/${month}.json`);
export const postTransactionsToMonthAndYear = (year, month, data) => apiPostRequest(`${FIREBASE}transaction/${year}/${month}.json`,data);

export const getTransactionsCategories = () =>  apiGetRequest(`${FIREBASE}cat.json`);
export const postTransactionsCategories = (data) => apiPostRequest(`${FIREBASE}cat.json`, data);

export const getTodos   = () => apiGetRequest(`${FIREBASE}todo.json`);
export const getTodo    = (id) => apiGetRequest(`${FIREBASE}todo/${id}.json`);
export const postTodo   = (data) => apiPostRequest(`${FIREBASE}todo.json`, data);
export const putTodo    = (id, data) => apiPutRequest(`${FIREBASE}todo/${id}.json`, data);
export const deleteTodo = (id) => apiDeleteRequest(`${FIREBASE}todo/${id}.json`);
