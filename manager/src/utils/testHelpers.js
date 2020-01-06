/* eslint-disable import/prefer-default-export */
import uuid from 'uuid';
import { fireEvent, waitForElement } from '@testing-library/react';
import {createMemoryHistory} from "history";

export const sampleQuiz = (id = null) => ({
  _id: id || uuid(),
  name: 'An example quiz',
  played_times: 23,
  questions: [
    {
      text: 'Question one',
      answers: [
        { text: 'Answer one', valid: true },
        { text: 'Answer two', valid: false },
        { text: 'Answer three', valid: false },
        { text: 'Answer four', valid: false },
      ],
    },
    {
      text: 'Question two',
      answers: [
        { text: 'Answer one', valid: false },
        { text: 'Answer two', valid: true },
      ],
    },
  ],
});

export const wait = (time = 5) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

export const click = (element, time = 5) => {
  fireEvent.click(element);
  return wait(time);
};

export const waitAndClick = async (callback) => click(await waitForElement(callback));

export const setValue = (element, value) => {
  fireEvent.change(element, { target: { value } });
};

export const setChecked = (element, checked) => {
  const current = element.checked;
  if (current !== checked) {
    fireEvent.click(element);
  }
};

export const spiedHistory = () => {
  const history = createMemoryHistory();
  jest.spyOn(history, 'push');
  return history;
};
