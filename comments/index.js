const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const {randomBytes} = require('crypto');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: id, content});

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
         data: {
                id: id,
                content,
                postId: req.params.id
            }
         }
     );

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log("Received event: " + req.body.type);

    res.send({});
});

app.listen(4001, () => {
    console.log("Listens on 4001!");
})
