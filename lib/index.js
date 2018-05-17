"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const responder = 'this uses an interface!';
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log(request);
    const finalResponse = {
        response: responder
    };
    response.send(finalResponse);
});
//# sourceMappingURL=index.js.map