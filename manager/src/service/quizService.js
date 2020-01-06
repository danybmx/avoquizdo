import axios from 'axios';
import { API_URL } from '../env';

export function getQuiz(id) {
  return new Promise((resolve, reject) => axios.get(`${API_URL}/quizzes/${id}`)
    .then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err.message, err.response && err.response.data);
    }));
}

export function getQuizzes() {
  return new Promise((resolve, reject) => axios.get(`${API_URL}/quizzes`)
    .then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err.message, err.response && err.response.data);
    }));
}

export function createQuiz(quiz) {
  return new Promise((resolve, reject) => axios.post(`${API_URL}/quizzes`, quiz)
    .then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err.message, err.response && err.response.data);
    }));
}

export function updateQuiz(id, quiz) {
  return new Promise((resolve, reject) => axios.put(`${API_URL}/quizzes/${id}`, quiz)
    .then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err.message, err.response && err.response.data);
    }));
}

export function deleteQuiz(id) {
  return new Promise((resolve, reject) => axios.delete(`${API_URL}/quizzes/${id}`)
    .then(() => {
      resolve();
    }).catch((err) => {
      reject(err.message, err.response && err.response.data);
    }));
}
