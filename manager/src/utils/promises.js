import CancelledPromiseError from '../errors/CancelledPromiseError';

// eslint-disable-next-line import/prefer-default-export
export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled_ ? reject(new CancelledPromiseError(val)) : resolve(val)),
      (error) => (hasCanceled_ ? reject(new CancelledPromiseError(error)) : reject(error)),
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
