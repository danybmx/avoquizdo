import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { deleteQuiz } from '../service/quizService';
import QuizzesList from './QuizzesList';
import { click, spiedHistory, wait } from '../utils/testHelpers';

import '../i18n';
import { GAME_URL } from '../env';

jest.mock('../service/quizService');

describe('pages/QuizzesList', () => {
  it('should show quizzes list returned from quizService', async () => {
    await act(async () => {
      const { getAllByTestId } = render(<QuizzesList />, { wrapper: MemoryRouter });
      await wait();
      const elements = getAllByTestId('quizzes-list-item');
      expect(elements).toHaveLength(3);
    });
  });
  it('should have a button to create a new quiz that change to create route', async () => {
    await act(async () => {
      const history = spiedHistory();
      const { getByTestId } = render(<Router history={history}><QuizzesList /></Router>);
      fireEvent.click(getByTestId('add-button'));
      expect(history.push).toBeCalledWith('/create');
    });
  });
  it('should have a button to play a quiz that redirects to the game website', async () => {
    window.location.assign = jest.fn();
    await act(async () => {
      const { getAllByTestId } = render(<QuizzesList />, { wrapper: MemoryRouter });
      await wait();
      await click(getAllByTestId('play-quiz-button')[0]);
      expect(window.location.assign).toBeCalledWith(`${GAME_URL}/host/quiz-1`);
    });
  });
  it('should have a button to edit a quiz that change to edit route', async () => {
    const history = spiedHistory();
    await act(async () => {
      const { getAllByTestId } = render(<Router history={history}><QuizzesList /></Router>);
      await wait();
      await click(getAllByTestId('edit-quiz-button')[0]);
      expect(history.push).toBeCalledWith('/edit/quiz-1');
    });
  });
  it('should have a button to remove a quiz that invoke the delete REST endpoint', async () => {
    await act(async () => {
      const { getAllByTestId } = render(<QuizzesList />, { wrapper: MemoryRouter });
      await wait();
      await click(getAllByTestId('delete-quiz-button')[0]);
      expect(deleteQuiz).toBeCalledWith('quiz-1');
    });
  });
});
