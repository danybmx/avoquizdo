import { sampleQuiz } from '../../utils/testHelpers';

export const getQuiz = jest.fn((id) => Promise.resolve(sampleQuiz(id)));
export const getQuizzes = jest.fn(() => Promise.resolve([
  sampleQuiz('quiz-1'),
  sampleQuiz('quiz-2'),
  sampleQuiz('quiz-3'),
]));
export const createQuiz = jest.fn((id, quiz) => Promise.resolve(quiz));
export const updateQuiz = jest.fn((id, quiz) => Promise.resolve(quiz));
export const deleteQuiz = jest.fn(() => Promise.resolve(null));
