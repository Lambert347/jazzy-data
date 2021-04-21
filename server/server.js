const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

const pg = require('pg');
const { Pool } = require('pg');
const pool = new Pool({
    database: 'jazzy.sql',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000
});

pool.on('connect', () => {
    console.log('Postgresqul connected');
});

pool.on('error', error => {
    console.log('Error with posgres pool', pool);
})





app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

app.get('/song', (req, res) => {
    let queryText = 'SELECT * FROM songs;';
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error from database`, error);
            res.sendStatus(500);
        });
})

app.post('/artist', (req, res) => {
    let queryString =`
    INSERT INTO "artists"
        ("name","birthdate")
    VALUES
        ($1, $2);
    `;
    let queryArgs = [
        req.body.name,
        req.body.birthdate,
    ];
    pool.query(queryString, queryArgs)
        .then(function(dbRes) {
            res.sendStatus(201);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        })
   
});

app.get('/artist', (req, res) => {
    let queryText = 'SELECT * FROM artists;';
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error from database`, error);
            res.sendStatus(500);
        });
})

app.post('/song', (req, res) => {
    let queryString =`
    INSERT INTO "songs"
        ("title", "length", "released")
    VALUES
        ($1, $2, $3);
    `;
    let queryArgs = [
        req.body.title,
        req.body.length,
        req.body.released,
    ];
    pool.query(queryString, queryArgs)
        .then(function(dbRes) {
            res.sendStatus(201);
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        })
   
});


