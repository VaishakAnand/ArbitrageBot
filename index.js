require('dotenv').config();

const express = require('express');
const app = express();

require('./controllers/traderjoe');

app.listen(process.env.PORT || 2000);

app.get('/', (req, res) => {
    res.status(200).send('Hey');
});

app.all('*', (req, res) => {
    res.status(400).send('Not a functional endpoint');
});

exports.app = app;
