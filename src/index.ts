import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';
import * as path from 'path';

let serviceThing: string = __dirname + '/serviceAccountKey.json';
serviceThing = serviceThing.replace('/lib', '');

let config = {
    credential: admin.credential.cert(serviceThing),
    databaseURL: 'https://userddata.firebaseio.com'
};
admin.initializeApp(config);

console.log('what is the dir name?');
console.log(__dirname + 'src/keys/serviceAccountKey.json');

// Get a reference to the database service
let database = admin.database();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
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
        response.send(snapshot);
    });
});
