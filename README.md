# firebase-swiss


 <img src="https://res.cloudinary.com/ddbxzcb7k/image/upload/v1568999179/firebaseswiss-02_hy9whb.png" width="50">
 
[![Build Status](https://circleci.com/gh/LogRocket/redux-logger/tree/master.svg?style=svg)](https://circleci.com/gh/tstreamDOTh/firebase-swiss/tree/master)  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![node](https://img.shields.io/badge/node-10.16.x-brightgreen.svg)](https://github.com/tstreamDOTh/firebase-swiss) [![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors)


## Table of contents

- [Install](#install)
- [Usage](#usage)
- [Recipes (Coming Soon)](#recipes)
- [Options (Coming Soon) ](#options)

## Install

Using Yarn

`yarn add firebase-swiss`

Using NPM

`npm i firebase-swiss`

## Usage

If you are totally new to Firebase or Firebase Cloud Functions then [get started here](https://firebase.google.com/docs/functions/get-started)

Once you have created your firebase projects and setup cloud functions, you can start creating your CRUD api's like the following by using simple configuration -

```javascript
// functions.js
const FireFunctions = require('firebase-swiss');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true
});

admin.initializeApp(functions.config().firebase);

const firefunctions = new FireFunctions(admin.database());

exports.addApplicant = firefunctions.getFireFunction({
  type: 'CREATE',
  ref: 'applicants',
  extractFromBody: ['name', 'role'],
  enableCors: true
});

exports.getApplicantById = firefunctions.getFireFunction({
  type: 'READ',
  ref: 'applicants',
  enableCors: true
});

exports.updateApplicantById = firefunctions.getFireFunction({
  type: 'UPDATE',
  ref: 'applicants',
  extractFromBody: ['name', 'role'],
  enableCors: true
});

exports.deleteApplicantById = firefunctions.getFireFunction({
  type: 'DELETE',
  ref: 'applicants',
  enableCors: true
});

```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/thiyagarajt/"><img src="https://avatars0.githubusercontent.com/u/11137394?v=4" width="100px;" alt="T Thiyagaraj"/><br /><sub><b>T Thiyagaraj</b></sub></a><br /><a href="https://github.com/tstreamDOTh/firebase-swiss/commits?author=tstreamDOTh" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
