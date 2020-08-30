const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        console.log("Moderated status is: " + status);
        axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                content: data.content,
                status,
                postId: data.postId
            }
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log("Listens on 4003!");
})
