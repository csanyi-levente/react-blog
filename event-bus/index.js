const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.post('/events', (req, res) => {
    const event = req.body;

    app.post('http://localhost:4000/events', event);
    app.post('http://localhost:4001/events', event);
    app.post('http://localhost:4002/events', event);

    res.send({status: 'OK'});
});

app.listen(4005, () => {
    console.log("Listens on 4005!");
});
