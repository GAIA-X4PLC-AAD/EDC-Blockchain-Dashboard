const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    res.sendStatus(200);
  });

app.listen(3005, () => console.log('Server listening on port 3005'));// chnage later to docker varible 