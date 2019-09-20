# firebase-swiss 

 <img src="https://res.cloudinary.com/ddbxzcb7k/image/upload/v1568999179/firebaseswiss-02_hy9whb.png" width="50">
 
[![Build Status](https://circleci.com/gh/LogRocket/redux-logger/tree/master.svg?style=svg)](https://circleci.com/gh/tstreamDOTh/firebase-swiss/tree/master)


## Table of contents

-   [Install](#install)
-   [Usage](#usage)
-   [Recipes (Coming Soon)](#recipes)
-   [Options (Coming Soon) ](#options)

## Install

Using Yarn

`yarn add firebase-swiss`

Using NPM

`npm i firebase-swiss`


## Usage

If you are totally new to Firebase or Firebase Cloud Functions then [get started here](https://firebase.google.com/docs/functions/get-started)

Once you have created your firebase projects and setup cloud functions, you can start creating your CRUD api's like the following -

```javascript
// functions.js
const FireFunctions = require("firebase-swiss");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
	origin: true
});

admin.initializeApp(functions.config().firebase);

const firefunctions = new FireFunctions(admin.database());

// Create
exports.addApplicant = firefunctions.getFunction("CREATE", {
	ref: "applicants",
	requestBodyTransformer: object => ({
		name: object.name,
		experience: object.experience,
		age: object.age,
		role: object.role,
		transcript: object.transcript ? object.transcript : "UNAVAILABLE",
		report: object.report ? object.report : []
	})
});

// Get All
exports.getAllApplicants = firefunctions.getFunction("GET", {
	ref: "applicants"
});

// Get By ID
exports.getApplicant = firefunctions.getFunction("GET", {
	ref: "applicants",
	idKey: "id"
});


// Update By ID
exports.updateApplicant = firefunctions.getFunction("PATCH", {
	ref: "applicants",
	idKey: "id",
	requestBodyTransformer: object => ({
		name: object.name,
		experience: object.experience,
		age: object.age,
		role: object.role,
		transcript: object.transcript,
		report: object.report ? object.report : []
	})
});

```
