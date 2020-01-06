import uuid from 'uuid';
import axios from 'axios';
import * as QuizService from './quizService';
import { API_URL } from '../env';
import { sampleQuiz } from '../utils/testHelpers';

const quizId = uuid();

const exampleQuiz = sampleQuiz();

jest.mock('axios', () => ({
  get: jest.fn(async (url) => {
    // eslint-disable-next-line no-shadow,global-require
    const { sampleQuiz } = require('../utils/testHelpers');
    const urlSlices = url.split('/');
    if (urlSlices[urlSlices.length - 1] === 'quizzes') {
      return Promise.resolve([]);
    }
    return Promise.resolve(sampleQuiz());
  }),
  put: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

describe('quiz service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have getQuiz, getQuizzes, createQuiz, updateQuiz and deleteQuiz', () => {
    expect(QuizService.getQuiz).toBeInstanceOf(Function);
    expect(QuizService.getQuizzes).toBeInstanceOf(Function);
    expect(QuizService.createQuiz).toBeInstanceOf(Function);
    expect(QuizService.updateQuiz).toBeInstanceOf(Function);
    expect(QuizService.deleteQuiz).toBeInstanceOf(Function);
  });

  it('getQuiz, getQuizzes, createQuiz, updateQuiz and deleteQuiz should return promises', () => {
    expect(QuizService.getQuiz()).toBeInstanceOf(Promise);
    expect(QuizService.getQuiz()).toBeInstanceOf(Promise);
    expect(QuizService.getQuiz()).toBeInstanceOf(Promise);
    expect(QuizService.getQuiz()).toBeInstanceOf(Promise);
    expect(QuizService.getQuiz()).toBeInstanceOf(Promise);
  });

  it('getQuizzes should call the API to GET /quizzes', () => {
    QuizService.getQuizzes();
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/quizzes`);
  });

  it('getQuiz should call the API to GET /quizzes/{id}', () => {
    QuizService.getQuiz(quizId);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/quizzes/${quizId}`);
  });

  it('createQuiz should call the API to POST /quizzes with the quiz as data', () => {
    QuizService.createQuiz(exampleQuiz);
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/quizzes`, exampleQuiz);
  });

  it('updateQuiz should call the API to PUT /quizzes/{id} with the quiz as data', () => {
    QuizService.updateQuiz(quizId, exampleQuiz);
    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/quizzes/${quizId}`, exampleQuiz);
  });
});
