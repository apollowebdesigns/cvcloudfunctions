"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const responder = 'Hello from firebase again!';
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log(request);
    const finalResponse = {
        response: responder
    };
    response.send(finalResponse.response);
});
//# sourceMappingURL=index.js.map