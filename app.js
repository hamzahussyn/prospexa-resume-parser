const express = require('express');
const handlebars = require('express-handlebars');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const multer = require('multer');

const { connectDB } = require('./providers/database');
const { AuthController } = require('./controllers/auth.controller');
const { handleError } = require('./utils/exceptions');
const upload = multer({ dest: 'resume/' });

// connectDB();

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', AuthController);

app.get('/', function (request, response, next) {
  response.status(200).json({ message: 'creds-backend' });
});

app.get('/form', function (request, response, next) {
  response.render('form', { layout: false, title: 'Prospexa Resume Parser' });
});

app.post('/form', upload.single('file'), function (request, response) {
  console.log(request.file);
});

app.use((err, req, res, next) => handleError(err, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`[server]: working on http://localhost:${PORT}`);
});
