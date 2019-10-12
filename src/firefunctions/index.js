const functions = require('firebase-functions');
import { DEFAULT_OPTIONS, TYPES } from '../constants';
import { callbackWithCorsWrapped, requestBodyTransformer, isUndefined } from '../util';

export class FireFunctions {
  constructor(database) {
    this.database = database;
  }
  getFireFunction(options) {
    const resolvedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { type, ref, extractFromBody, enableCors, idKey } = resolvedOptions;
    switch (type) {
      case TYPES.CREATE:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(
            request,
            response,
            () => {
              if (request.method !== 'POST') {
                response.status(400).send('Please send a POST request');
                return;
              }
              const newObjectRef = this.database.ref(ref).push();
              const id = newObjectRef.key;
              response.__id__ = id;
              newObjectRef.set({ id, ...requestBodyTransformer(request.body, extractFromBody) }).then(snapshot => {
                response.status(200).send(snapshot.val());
              });
              return;
            },
            enableCors
          );
        });
      case TYPES.READ:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(
            request,
            response,
            () => {
              const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
              return this.database
                .ref(`${ref}/${subref}`)
                .once('value')
                .then(snapshot => {
                  response.send(snapshot.val());
                });
            },
            enableCors
          );
        });
      case TYPES.UPDATE:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(
            request,
            response,
            () => {
              const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
              if (request.method !== 'PATCH') {
                response.status(400).send('Please send a PATCH request');
                return;
              }
              return this.database
                .ref(`${ref}/${subref}`)
                .set({ [idKey]: subref, ...requestBodyTransformer(request.body, extractFromBody) })
                .then(snapshot => {
                  response.status(200).send(snapshot.val());
                });
            },
            enableCors
          );
        });
      case TYPES.DELETE:
        return functions.https.onRequest((request, response) => {
          callbackWithCorsWrapped(
            request,
            response,
            () => {
              const subref = isUndefined(request.query[idKey]) ? '' : `/${request.query[idKey]}`;
              if (request.method !== 'DELETE') {
                response.status(400).send('Please send a DELETE request');
                return;
              }
              response.__id__ = request.query[idKey];
              return this.database
                .ref(`${ref}/${subref}`)
                .remove()
                .then(snapshot => {
                  response.status(200).send(snapshot.val());
                });
            },
            enableCors
          );
        });
      default:
        throw 'Invalid Type! allowed Types - CREATE, GET, PATCH, and DELETE';
    }
  }
}
