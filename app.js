const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { connectDB } = require('./providers/database');
const { AuthController } = require('./controllers/auth.controller');
const { handleError } = require('./utils/exceptions');

connectDB();

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthController);

app.get('/', function (request, response, next) {
  response.status(200).json({ message: 'creds-backend' });
});

app.use((err, req, res, next) => handleError(err, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`[server]: working on http://localhost:${PORT}`);
});
