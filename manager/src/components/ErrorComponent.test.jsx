import React from 'react';
import { render } from '@testing-library/react';
import ErrorComponent from './ErrorComponent';

describe('components/ErrorComponent', () => {
  it('should show the message', () => {
    const message = 'Error sample message';
    const { getByRole } = render(<ErrorComponent title={message} />);
    expect(getByRole('alert').textContent).toEqual(message);
  });
});
