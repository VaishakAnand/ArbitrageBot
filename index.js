require('dotenv').config();

const express = require('express');
const telebot = require('./bot.js');
const app = express();

app.listen(process.env.PORT || 2000);

telebot.launch();

app.get('/', (req, res) => {
    res.status(200).send('Hey');
});

app.all('*', (req, res) => {
    res.status(400).send('Not a functional endpoint');
});

exports.app = app;
