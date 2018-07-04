import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';
import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { json } from '../node_modules/@types/body-parser';

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

let requiredData: any[] = new Array();

function getDataFromDatabase() {
    return database.ref('test').once('value').then(snapshot => {
        const myData = Object.keys(snapshot).map(key => {
            return snapshot[key];
        })
        requiredData.push(snapshot);
    }).catch(error => {
        console.log('error happened');
        console.log(error);
    });
}

// Init the data
getDataFromDatabase();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const weatherschema = buildSchema(`
  type Query {
    weather: String
  }
`);

const root = { hello: () => 'Hello world!' };
const weatherRoot = { weather: () => JSON.stringify(requiredData) };

app.use(corsAccess);
app.use(main);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.get('/hello', (req, res) => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = admin.storage();

    // Create a storage reference from our storage service
    const storageRef = storage;
    res.send('this is an express app');
});
app.use('/weathergraph', graphqlHTTP({
    schema: weatherschema,
    rootValue: weatherRoot,
    graphiql: true,
}));;
app.get('/weatherdata', (req, res) => {
    database.ref('test').once('value').then(snapshot => {
        let result: any[] = new Array();
        let keys = Object.keys(snapshot);
        const myData = Object.keys(snapshot).map(key => {
            return snapshot[key];
        })
        res.send(JSON.stringify(snapshot));
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
