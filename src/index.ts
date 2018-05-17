import * as functions from 'firebase-functions';
import Response from './interfaces/response';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const responder: string = 'this uses an interface!';

export const helloWorld = functions.https.onRequest((request, response) => {
    console.log(request);
    const finalResponse: Response = {
        response: responder
    }

    response.send(finalResponse);
});
