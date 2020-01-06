import { makeCancelable } from './promises';
import { wait } from './testHelpers';

const getCancellablePromise = (resolved, success = true) => {
  const promise = () => new Promise((resolve, reject) => {
    if (success) {
      setTimeout(resolve, 5);
    } else {
      setTimeout(() => { reject(new Error('rejected')); }, 5);
    }
  });
  const cancellablePromise = makeCancelable(promise());
  cancellablePromise.promise.then(() => {
    resolved();
  }).catch((e) => {
    expect(e).not.toBeNull();
  });
  return cancellablePromise;
};

describe('utils/promises', () => {
  it('cancellablePromise should proxy the promise reject and resolve if not cancelled', async () => {
    const resolved = jest.fn();
    getCancellablePromise(resolved);
    await wait(10);
    expect(resolved).toHaveBeenCalled();
    getCancellablePromise(resolved, false);
    await wait(10);
    expect(resolved).toHaveBeenCalled();
  });

  it('cancellablePromise should prevent the promise to be resolved or rejected if cancelled', async () => {
    const resolved = jest.fn();
    const cancellablePromise = getCancellablePromise(resolved);
    cancellablePromise.cancel();
    await wait(10);
    expect(resolved).not.toHaveBeenCalled();
    const cancellablePromiseRejected = getCancellablePromise(resolved, false);
    cancellablePromiseRejected.cancel();
    await wait(10);
    expect(resolved).not.toHaveBeenCalled();
  });
});
