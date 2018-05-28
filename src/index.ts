import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';
import * as path from 'path';
import * as cors from 'cors';
let serviceThing: string = __dirname + '/serviceAccountKey.json';
serviceThing = serviceThing.replace('/lib', '');
const config = {
    credential: admin.credential.cert(serviceThing),
    databaseURL: 'https://userddata.firebaseio.com'
};
admin.initializeApp(config);

import * as express from 'express';
const app = express();

let corsAccess = cors({origin: true});

// Get a reference to the database service
let database = admin.database();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const main = (request, response, next) => {
    let test = database.ref('test').set({
        username: 'test',
        email: 'email',
        profile_picture : 'imageUrl'
      });
    let arr: Response[] = new Array<Response>();
    console.log(request);
    arr.push({
        response: 'test'
    });

    database.ref('test').once('value').then(function(snapshot) {
        next();
        // response.send(snapshot);
    });
}

app.use(corsAccess);
app.use(main);
app.get('/hello', (req, res) => {
    res.send('this is an express app');
});

export const helloWorld = functions.https.onRequest(app);
