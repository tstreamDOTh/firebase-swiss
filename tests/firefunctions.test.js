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
  //? Run `firebase serve --only database` to start firebase emulator before running the test case
  beforeEach(async () => {
    await getAdminApp()
      .ref()
      .set(null);
  });

  afterEach(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  it('should carry out simple CRUD over defined APIs', async () => {
    // Define CRUD
    const db = getAdminApp();
    const firefunctions = new FireFunctions(db);

    const addApplicant = firefunctions.getFireFunction({
      type: 'CREATE',
      ref: 'applicants',
      extractFromBody: ['name', 'role'],
      enableCors: false
    });

    const getApplicantById = firefunctions.getFireFunction({
      type: 'READ',
      ref: 'applicants',
      enableCors: false
    });

    const updateApplicantById = firefunctions.getFireFunction({
      type: 'UPDATE',
      ref: 'applicants',
      extractFromBody: ['name', 'role'],
      enableCors: false
    });

    const deleteApplicantById = firefunctions.getFireFunction({
      type: 'DELETE',
      ref: 'applicants',
      enableCors: false
    });

    // 1. POST
    // Arrange
    const req1 = { body: { name: 'foo', role: 'bar' }, method: 'POST' };
    const res1 = getStubResponse();

    // Act
    await addApplicant(req1, res1);

    // Assert
    await db
      .ref('applicants')
      .once('value')
      .then(snapshot => {
        const snap = snapshot.val();
        expect(snap[res1.__id__].name).toEqual('foo');
        expect(snap[res1.__id__].role).toEqual('bar');
      });

    // 2. GET
    // Arrange
    const req2 = { query: { id: res1.__id__ }, method: 'GET' };
    const res2 = getStubResponse();

    // Act
    await getApplicantById(req2, res2);

    // Assert
    expect(res2.response.name).toEqual('foo');
    expect(res2.response.role).toEqual('bar');

    // 3. PATCH
    // Arrange
    const req3 = { query: { id: res2.response.id }, body: { name: 'fu', role: 'barred' }, method: 'PATCH' };
    const res3 = getStubResponse();

    // Act
    updateApplicantById(req3, res3);

    // Assert
    await db
      .ref(`applicants/${res2.response.id}`)
      .once('value')
      .then(snapshot => {
        const snap = snapshot.val();
        expect(snap.name).toEqual('fu');
        expect(snap.role).toEqual('barred');
      });

    // 4. DELETE
    // Arrange
    const req4 = { query: { id: res2.response.id }, method: 'DELETE' };
    const res4 = getStubResponse();

    // Act
    await deleteApplicantById(req4, res4);

    // Assert
    expect(res4.__id__).toEqual(res2.response.id);
  });
});
