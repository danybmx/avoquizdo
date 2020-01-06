import CancelledPromiseError from './CancelledPromiseError';

describe('errors/CancelledPromiseError', () => {
  it('should contains cancelled: true', () => {
    const error = new CancelledPromiseError();
    expect(error.cancelled).toBeTruthy();
  });

  it('should maintain data from first argument', () => {
    const data = { foo: 'bar' };
    const error = new CancelledPromiseError(data);
    expect(error.data).toEqual(data);
  });

  it('should set the message from second argument', () => {
    const message = 'the message';
    const error = new CancelledPromiseError(null, message);
    expect(error.message).toEqual(message);
  });
});
