const cors = require('cors')({
  origin: true
});

export const isUndefined = val => typeof val === 'undefined';

export const requestBodyTransformer = (body, extractFromBody) => {
  return extractFromBody.reduce(
    (result, key) =>
      Object.assign(result, {
        [key]: body[key]
      }),
    {}
  );
};

export const callbackWithCorsWrapped = (request, response, callback, enableCors) => {
  if (enableCors) {
    cors(request, response, () => {
      callback();
    });
  } else {
    callback();
  }
};
