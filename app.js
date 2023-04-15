const express = require('express');
const exhbs = require('express-handlebars');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const handlebars = require('handlebars');

const { connectDB } = require('./providers/database');
const { AuthController } = require('./controllers/auth.controller');
const { handleError } = require('./utils/exceptions');
const { MVPController } = require('./controllers/mvp.controller');

// connectDB();

handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

const app = express();

app.engine('handlebars', exhbs.engine());
app.set('view engine', 'handlebars');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthController);
app.use('/mvp', MVPController);

app.get('/', function (request, response, next) {
  response.status(200).json({ message: 'creds-backend' });
});

app.use((err, req, res, next) => handleError(err, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`[server]: working on http://localhost:${PORT}`);
});
