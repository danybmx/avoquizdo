/* eslint-disable no-await-in-loop,no-restricted-syntax */
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, getByTestId as ggetByTestId, waitForElement } from '@testing-library/dom';
import QuizEditor from './QuizEditor';
import '../i18n';
import {
  click, sampleQuiz, setValue, wait, waitAndClick, setChecked,
} from '../utils/testHelpers';
import { createQuiz, getQuiz, updateQuiz } from '../service/quizService';

jest.mock('../service/quizService');

async function addAnswer(getByTestId, questionIndex, answer, answerIndex) {
  await click(getByTestId(`add-question-${questionIndex}-answer-button`));
  const answerBox = getByTestId(`quiz-question-${questionIndex}-answer-${answerIndex}`);
  setValue(answerBox.querySelector('input[name=text]'), answer.text);
  setChecked(answerBox.querySelector('input[name=valid]'), answer.valid);
}

async function addQuestion(getByTestId, question, questionIndex) {
  await click(getByTestId('quiz-add-question-button'));
  const questionBox = getByTestId(`quiz-question-${questionIndex}-box`);
  setValue(questionBox.querySelector('input[name=text]'), question.text);
  for (let answerIndex = 0; answerIndex < question.answers.length; answerIndex += 1) {
    await addAnswer(getByTestId, questionIndex, question.answers[answerIndex], answerIndex);
  }
}

async function addQuestions(getByTestId, questions) {
  for (let questionIndex = 0; questionIndex < questions.length; questionIndex += 1) {
    const sampleQuestion = questions[questionIndex];
    await addQuestion(getByTestId, sampleQuestion, questionIndex);
  }
}

describe('pages/QuizEditor', () => {
  it('should show the form and the name field', async () => {
    await act(async () => {
      const { getByTestId } = render(<QuizEditor />, { wrapper: MemoryRouter });
      expect(getByTestId('quiz-name-field')).toBeInTheDocument();
    });
  });
  it('there should be a button for add a new question and should add the question and its fields', async () => {
    await act(async () => {
      const { getByTestId } = render(<QuizEditor />, { wrapper: MemoryRouter });
      await click(getByTestId('quiz-add-question-button'));
      expect(getByTestId('quiz-question-0-box'));
    });
  });
  it('there should be a button for add a new answers on the questions and should add a new answer', async () => {
    await act(async () => {
      const { getByTestId } = render(<QuizEditor />, { wrapper: MemoryRouter });
      await click(getByTestId('quiz-add-question-button'));
      await waitAndClick(() => getByTestId('add-question-0-answer-button'));
      expect(await waitForElement(() => getByTestId('quiz-question-0-answer-0'))).toBeInTheDocument();
    });
  });
  it('buttons for add a new answer should add the answer fields', async () => {
    await act(async () => {
      const { container } = render(<QuizEditor />, { wrapper: MemoryRouter });
      for (const questionIndex of [0, 1]) {
        await click(ggetByTestId(container, 'quiz-add-question-button'));
        for (const answerIndex of [0, 1, 2]) {
          await click(ggetByTestId(container, `add-question-${questionIndex}-answer-button`));
          const answerBox = ggetByTestId(container, `quiz-question-${questionIndex}-answers-box`);
          expect(answerBox).toBeInTheDocument();
          expect(ggetByTestId(answerBox, `answer-${answerIndex}-text-field`)).toBeInTheDocument();
          expect(ggetByTestId(answerBox, `answer-${answerIndex}-valid-field`)).toBeInTheDocument();
        }
      }
    });
  });
  it('fill the form and submit it should generate a call to the REST endpoint', async () => {
    const sample = sampleQuiz();
    await act(async () => {
      const { getByTestId } = render(<QuizEditor />, { wrapper: MemoryRouter });
      setValue(getByTestId('quiz-name-field').querySelector('input'), sample.name);
      await wait();
      await addQuestions(getByTestId, sample.questions);
      await wait(50);
      fireEvent.submit(getByTestId('quiz-editor-component'));
      expect(createQuiz).toBeCalledWith({
        name: sample.name,
        questions: sample.questions,
      });
    });
  });
  it('should load the specified quiz when editing and submit the updated quiz', async () => {
    const sample = await getQuiz('xxx');
    const modifiedSample = { ...sample, name: 'Modified question' };
    modifiedSample.questions.push({ ...sample.questions[0] });
    const addedQuestionIndex = modifiedSample.questions.length - 1;

    await act(async () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/edit/xxx']}>
          <Route path="/edit/:quizId">
            <QuizEditor />
          </Route>
        </MemoryRouter>,
      );
      await wait();
      expect(getByTestId('quiz-name-field').querySelector('input')).toHaveValue(sample.name);
      setValue(getByTestId('quiz-name-field').querySelector('input'), modifiedSample.name);
      await addQuestion(
        getByTestId, modifiedSample.questions[addedQuestionIndex], addedQuestionIndex,
      );
      fireEvent.submit(getByTestId('quiz-editor-component'));
      expect(updateQuiz).toBeCalledWith(modifiedSample._id, modifiedSample);
    });
  });
});
