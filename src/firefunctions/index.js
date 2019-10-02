const functions = require('firebase-functions');
import { DEFAULT_OPTIONS, TYPES } from '../constants';
import { callbackWithCorsWrapped } from '../util';
import { isUndefined } from '@kubric/litedash';

export class FireFunctions {
  constructor(database) {
    this.database = database;
  }
  getFireFunction(type, ref, requestBodyTransformer, options) {
    const resolvedOptions = { ...DEFAULT_OPTIONS, options };
    const { enableCors, idKey } = resolvedOptions;
    switch (type) {
      case TYPES.CREATE:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(() => {
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
          }, enableCors);
        });
      case TYPES.GET:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(() => {
            const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
            return this.database
              .ref(`${ref}/${subref}`)
              .once('value')
              .then(snapshot => {
                response.send(snapshot.val());
              });
          });
        });
      case TYPES.PATCH:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(() => {
            const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
            if (request.method !== 'PATCH') {
              response.status(400).send('Please send a PATCH request');
              return;
            }
            return this.database
              .ref(`${ref}/${subref}`)
              .set(requestBodyTransformer(request.body))
              .then(snapshot => {
                response.status(200).send(request.body);
              });
          });
        });
      case TYPES.DELETE:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(() => {
            const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
            if (request.method !== 'DELETE') {
              response.status(400).send('Please send a DELETE request');
              return;
            }
            return this.database
              .ref(`${ref}/${subref}`)
              .remove()
              .then(snapshot => {
                response.status(200).send(request.body);
              });
          });
        });
      default:
        throw 'Invalid Type! allowed Types - CREATE, GET, PATCH, and DELETE';
    }
  }
}
