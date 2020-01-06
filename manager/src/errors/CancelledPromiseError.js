export default class CancelledPromiseError extends Error {
  constructor(data, message = null) {
    super(message);
    this.data = data;
    this.cancelled = true;
  }
}
