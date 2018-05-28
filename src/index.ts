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

let corsAccess = cors();

// Get a reference to the database service
let database = admin.database();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const main = (request, response, next) => {
    let arr: Response[] = new Array<Response>();
    console.log(request);
    arr.push({
        response: 'test'
    });

    next();
}

app.use(corsAccess);
app.use(main);
app.get('/hello', (req, res) => {
    res.send('this is an express app');
});
app.get('/second', (req, res) => {
    database.ref('test').once('value').then(snapshot => 
        res.send(snapshot)
    ).catch(error => {
        res.send('an error happened: ' + error);
    });
});
app.post('/send', (req, res) => {
    database.ref('test').set({
        username: 'test',
        email: 'email',
        random: Math.random(),
        profile_picture : 'imageUrl'
    }).then(out => res.send(out));
});

export const helloWorld = functions.https.onRequest(app);
