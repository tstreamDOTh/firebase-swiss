require('@babel/polyfill');
require('firebase-functions-test')();
const firebase = require('@firebase/testing');
import { FireFunctions } from '../src/firefunctions/index';

const databaseName = 'test-db';

const getAuthedApp = auth => firebase.initializeTestApp({ databaseName, auth }).database();

const getAdminApp = () => firebase.initializeAdminApp({ databaseName }).database();

const getStubResponse = () => {
  const res = {};
  res.status = code => {
    return {
      code,
      send: data => {
        res.response = data;
        return data;
      }
    };
  };
  res.json = () => res;
  res.send = data => {
    res.response = data;
    return data;
  };
  return res;
};

describe('Test Create API', () => {
  beforeEach(async () => {
    await getAdminApp()
      .ref()
      .set(null);
  });

  afterEach(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  it('should create an entry in the database', async () => {
    // Arrange
    const db = getAdminApp();
    const firefunctions = new FireFunctions(db);
    const addApplicant = firefunctions.getFireFunction({
      type: 'CREATE',
      ref: 'applicants',
      extractFromBody: ['name', 'role'],
      enableCors: false
    });
    const getApplicantById = firefunctions.getFireFunction({
      type: 'GET',
      ref: 'applicants',
      enableCors: false
    });

    // Act
    // 1. CREATE
    const req1 = { body: { name: 'foo', role: 'bar' }, method: 'POST' };
    const res1 = getStubResponse();
    addApplicant(req1, res1);

    // 2. GET
    const req2 = { query: { id: res1.__id__ }, method: 'GET' };
    const res2 = getStubResponse();
    getApplicantById(req2, res2);

    // Assert
    // Check from DB
    await db
      .ref('applicants')
      .once('value')
      .then(snapshot => {
        const snap = snapshot.val();
        expect(snap[res1.__id__].name).toEqual('foo');
        expect(snap[res1.__id__].role).toEqual('bar');
      });

    expect(res2.response.name).toEqual('foo');
    expect(res2.response.role).toEqual('bar');
  });
});
