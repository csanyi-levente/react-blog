const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
});

const handleEvent = (type, data) => {
    if ('PostCreated' === type) {
        const { id, title} = data;
        posts[id] = {id, title, comments: [] };
    }

    if ('CommentCreated' === type) {
        const { id, content, postId, status} = data;
        const post = posts[postId];

        post.comments.push({ id, content, status});
    }

    if ('CommentUpdated' === type) {
        const { id, content, status, postId} = data;
        const post = posts[postId];
        const comment = post.comments.find(c => {
            return c.id === id;
        });

        comment.status = status;
        comment.content = content;
    }

}

app.listen(4002, async () => {
    console.log("Listens on 4002!");
    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
        console.log('Event: ' + event.type);

        handleEvent(event.type, event.data);
    }

})
