export const getMessageFromExceptionResponse = (
  response: object | string,
  defaultMessage = 'Internal server error'
) => {
  if (!response) return defaultMessage;
  if (typeof response === 'string') return response;
  const message = response['message'];
  if (!message) return defaultMessage;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.join(', ');

  return defaultMessage;
};
