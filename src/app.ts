
import express from 'express';
import { client } from './middleware/api';

const app = express();

const PORT = process.env.port || 3000;

app
    .get('/', async (req, res) => {
        const response = await client.getUser();
        res.send(response);
    })
    .get('/threads', async (req, res) => {
        const response = await client.getThreads();
        res.send(response);
    })
    .get('/thread', async (req, res) => {
        const threadId = req.query.threadId;
        const response = await client.getThread(threadId);
        res.send(response);
    })
    .get('/userReplies', async (req, res) => {
        const response = await client.getReplies();
        res.send(response);
    })
    .get('/threadLikers', async (req, res) => {
        const threadId = req.query.threadId;
        const response = await client.getThreadLikers(threadId);
        res.send(response);
    });

app.listen(PORT, () => {
    console.log(`Server is up and running at port: ${PORT}`);
});