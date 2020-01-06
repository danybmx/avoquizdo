import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import i18n from './i18n';
import {click, wait, waitAndClick} from './utils/testHelpers';

jest.mock('./service/quizService');

const languages = ['es', 'en', 'gl'];

describe('quiz application', () => {
  it('renders the application', async () => {
    await act(async () => {
      const { getByText } = render(<App />, { wrapper: MemoryRouter });
      expect(getByText(/Quiz Manager/i)).toBeInTheDocument();
    });
  });

  it('should open/close the language menu on click the button', async () => {
    await act(async () => {
      const { getByTestId } = render(<App />, { wrapper: MemoryRouter });
      await click(getByTestId('language-menu-button'));
      expect(getByTestId('language-menu')).toBeVisible();
      await click(getByTestId('language-menu-button'));
      expect(getByTestId('language-menu')).not.toBeVisible();
      await click(getByTestId('language-menu-button'));
      expect(getByTestId('language-menu')).toBeVisible();
    });
  });

  test.each(languages)('language %s', async (language) => {
    await act(async () => {
      jest.spyOn(i18n, 'changeLanguage');
      const { getByTestId } = render(<App />, { wrapper: MemoryRouter });
      await click(getByTestId('language-menu-button'));
      await waitAndClick(() => getByTestId(`language-${language}`));
      expect(i18n.changeLanguage).toHaveBeenCalledWith(language);
    });
  });

  test.each([
    ['/', 'quizzes-list-component'],
    ['/create', 'quiz-editor-component'],
    ['/edit/zzz', 'quiz-editor-component'],
  ])('route %s should show %s', async (path, testid) => {
    await act(async () => {
      const { getByTestId } = render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
      expect(getByTestId(testid)).toBeInTheDocument();
    });
  });
});
