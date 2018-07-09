import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Response from './interfaces/response';
import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { json } from '../node_modules/@types/body-parser';
import *  as got from 'got';
import { from } from 'rxjs';
import * as moment from 'moment';

function formatDateTimeToDate(isoDate: string) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const dt = date.getDate();
    let monthString: string;
    let dtString: string;

    if (dt < 10) {
        dtString = '0' + dt;
    }
    if (month < 10) {
        monthString = '0' + month;
    }

    return year+'-' + monthString + '-' + dtString;
}

let serviceThing: string = __dirname + '/serviceAccountKey.json';
serviceThing = serviceThing.replace('/lib', '');
const config = {
    credential: admin.credential.cert(serviceThing),
    databaseURL: 'https://userddata.firebaseio.com',
    storageBucket: 'gs://userddata.appspot.com'
};
const app = express();

admin.initializeApp(config);
const corsAccess = cors();
const database = admin.database();

const main = (request, response, next) => {
    next();
}

let requiredData: any[] = new Array();

function getDataFromDatabase() {
    return database.ref('test').once('value').then(snapshot => {
        let snapshot1 = snapshot.val();
        const myData = Object.keys(snapshot1).map(key => {
            return snapshot1[key];
        })
        requiredData.push(snapshot1);
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
const weatherRoot = { weather: () => JSON.stringify(requiredData)};

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

app.get('/store', (req, res) => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = admin.storage();
    const jsonStore = storage.bucket('gs://userddata.appspot.com/test.json');
    res.send(jsonStore.getMetadata());
});

app.use('/weathergraph', graphqlHTTP({
    schema: weatherschema,
    rootValue: weatherRoot,
    graphiql: true,
}));
app.get('/weatherdata', (req, res) => {
    database.ref('test').once('value').then(snapshot => {
        let result: any[] = new Array();
        console.log('snapshot');
        console.log(JSON.stringify(snapshot));
        const snapshotData = snapshot.val();
        const keys = Object.keys(snapshot.val());
        keys.forEach(dataStuff => {
            let test = new Object();
            test[dataStuff] = snapshotData[dataStuff];
            result.push(test);
        })
        res.send(result);
    }).catch(error => {
        res.send('an error happened: ' + error);
    });
});
app.get('/dailyaverage', (req, res) => {
    database.ref('test').once('value').then(snapshot => {
        const snapshotData = snapshot.val();
        const keys = Object.keys(snapshot.val());
        let dayAverage = new Object(); 
        keys.forEach(dataStuff => {
            dayAverage[moment(dataStuff).format('dddd YYYY-MM-DD')] = [];
        });

        keys.forEach(dataStuff => {
            dayAverage[moment(dataStuff).format('dddd YYYY-MM-DD')].push(snapshotData[dataStuff]);
        });

        const dayAverageKeys = Object.keys(dayAverage);
        dayAverageKeys.forEach(dataStuff => {
            let values = new Array();
            values = dayAverage[dataStuff];
            const valuesLength = values.length;
            let total: number = 0;
            values.forEach(value => {
                console.log(JSON.stringify(value));
                total += Number(value.temperature);
            });
            const average: number = total / valuesLength;
            dayAverage[dataStuff] = average;
        });

        // Convert to json

        let endArray = new Array();
        let averageKeys = Object.keys(dayAverage);
        averageKeys.forEach(data => {
            let datum = new Object();
            datum[data] = dayAverage[data];
            endArray.push(datum);
        });
        res.send(endArray);
    }).catch(error => {
        res.send('an error happened: ' + error);
    });
});
app.get('/data', (req, res) => {
    const data = from(got('https://us-central1-userddata.cloudfunctions.net/helloWorld/weatherdata'));
    data.subscribe(data1 => {
        res.send(data1);
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
