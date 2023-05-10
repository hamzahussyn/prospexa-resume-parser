const express = require('express');
const handlebars = require('handlebars');
const exhbs = require('express-handlebars');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { connectDB } = require('./providers/database');
const { AuthController } = require('./controllers/auth.controller');
const { MVPController } = require('./controllers/mvp.controller');
const { handleError } = require('./utils/exceptions');
const { checkEquals, splitOnNewLine } = require('./utils/handlebars');
const helmetConfig = require('./helmet.config');

// connectDB();

handlebars.registerHelper('eq', checkEquals);
handlebars.registerHelper('splitOnNewLine', splitOnNewLine);

const app = express();

app.engine('handlebars', exhbs.engine());
app.set('view engine', 'handlebars');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthController);
app.use('/mvp', helmet(helmetConfig), MVPController);
app.use('/resources', express.static(__dirname + '/public'));

app.get('/', function (request, response, next) {
  response.status(200).json({ message: 'creds-backend' });
});

app.use((err, req, res, next) => handleError(err, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`[server]: working on http://localhost:${PORT}`);
});
