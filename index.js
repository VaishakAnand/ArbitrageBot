require('dotenv').config();
const express = require('express');

const app = express();

app.listen(process.env.PORT || 2000);

app.all('*', (req, res) => {
    res.status(400).send('Not a functional endpoint');
});
