export const serializeMessage = (action, data) => JSON.stringify({ action, data });
export const deseralizeMessage = (message) => {
  const { action, data } = JSON.parse(message);
  return { action, data };
};
