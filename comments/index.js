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

    comments.push({ id: id, content, status: 'pending'});

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
                id: id,
                content,
                postId: req.params.id,
                status: 'pending'
            }
         }
     );

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log("Received event: " + req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { id, postId, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find( c => {
            return c.id === id;
        });

        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, postId, content, status
            }
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log("Listens on 4001!");
})
