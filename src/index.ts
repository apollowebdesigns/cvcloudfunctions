import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';
import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

let serviceThing: string = __dirname + '/serviceAccountKey.json';
serviceThing = serviceThing.replace('/lib', '');
const config = {
    credential: admin.credential.cert(serviceThing),
    databaseURL: 'https://userddata.firebaseio.com'
};
const app = express();

admin.initializeApp(config);
const corsAccess = cors();
const database = admin.database();

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
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = admin.storage();

    // Create a storage reference from our storage service
    const storageRef = storage;
    res.send('this is an express app');
});
app.get('/weatherdata', (req, res) => {
    database.ref('test').once('value').then(snapshot => {
        let result: any[] = new Array();
        Object.entries(snapshot).forEach(([key, value]) => {
          const mappy = new Map();
          mappy.set(key, value);
          result.push(mappy);
        });
        res.send(snapshot)
    }).catch(error => {
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
