export const callbackWithCorsWrapped = (callback, enableCors) => {
  if (enableCors) {
    cors(request, response, () => {
      callback();
    });
  } else {
    callback();
  }
};
