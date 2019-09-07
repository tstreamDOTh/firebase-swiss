const functions = require('firebase-functions');

export default class FireFunctions {
  constructor(database) {
    this.database = database;
  }

  getFunction(type, options) {
    const { ref, requestBodyTransformer, id = 'id' } = options;
    const cors = require('cors')({
      origin: true
    });
    switch (type) {
      case 'CREATE':
        return functions.https.onRequest((request, response) => {
          cors(request, response, () => {
            if (request.method !== 'POST') {
              response.status(400).send('Please send a POST request');
              return;
            }
            return this.database
              .ref(ref)
              .push(requestBodyTransformer(request.body))
              .then(snapshot => {
                response.status(200).send(request.body);
              });
          });
        });
      case 'GET':
        return functions.https.onRequest((request, response) => {
          let subref = '';
          if (request.query[id]) {
            subref = `/${request.query[id]}`;
          }
          cors(request, response, () => {
            return this.database
              .ref(`${ref}/${subref}`)
              .once('value')
              .then(snapshot => {
                response.send(snapshot.val());
              });
          });
        });
      case 'PATCH':
        return functions.https.onRequest((request, response) => {
          let subref = '';
          if (request.query[id]) {
            subref = `/${request.query[id]}`;
          }
          cors(request, response, () => {
            if (request.method !== 'PATCH') {
              response.status(400).send('Please send a PATCH request');
              return;
            }
            console.log(request.body.name);
            console.log(JSON.stringify(request.body));
            return this.database
              .ref(`${ref}/${subref}`)
              .set(requestBodyTransformer(request.body))
              .then(snapshot => {
                response.status(200).send(request.body);
              });
          });
        });
      default:
        break;
    }
  }
}
