const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parse incoming requests
const morgan = require('morgan');  // logging framework for incoming requests
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:27017/auth');

// App setup
app.use(morgan('combined'));  
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on port ${port}`);
