/*
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
        }
    });
    res.sendStatus(200);
});

#server.listen(3005, () => console.log('Server listening on port 3005'));
*/