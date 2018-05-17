import * as functions from 'firebase-functions';
import Response from './interfaces/response';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const responder: string = 'this uses an interface!';

export const helloWorld = functions.https.onRequest((request, response) => {
    let arr: Response[] = new Array<Response>();
    console.log(request);
    arr.push({
        response: 'test'
    })
    const finalResponse: Response = {
        response: responder
    }

    response.send(arr);
});
