import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';

let config = {
    credential: admin.credential.cert('firebase-adminsdk-rmtfk@userddata.iam.gserviceaccount.com'),
    databaseURL: 'https://userddata.firebaseio.com'
};
admin.initializeApp(config);

// Get a reference to the database service
let database = admin.database();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    let test = database.ref('test');
    let arr: Response[] = new Array<Response>();
    console.log(request);
    arr.push({
        response: 'test'
    });

    response.send(test);
});
