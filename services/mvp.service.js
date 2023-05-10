const fs = require('fs');
const http = require('http');
var resumeParser = require('../utils/parser');
var { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

module.exports = {
  get,
  post,
};

function _getGPTCompletion(prompt) {
  if (!prompt || !prompt.length) return;
  console.log('prompt recieved', prompt);

  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openAI = new OpenAIApi(configuration);
  return openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `summarize the profile in 120 words by reading this text ahead without making assumptions, also rate the profile as beginner, intermediate, or advanced, keep it consice? \n${prompt}`,
      },
    ],
  });
}

function _getCredsMetrics(rawResume) {
  return new Promise(function (resolve, reject) {
    const resume = rawResume
      .replace(/[^a-z0-9\s]/gi, ' ')
      .replace(/\t\n/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
    const requestData = { data: resume };
    console.log(requestData);
    const options = {
      hostname: process.env.CREDS_ML_HOST,
      port: process.env.CREDS_ML_PORT,
      path: '/equivalence-text-lower-bound',
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'Content-Type': 'application/json',
      },
    };

    const request = http.request(options, function (response) {
      let responseData = '';
      response.on('data', (chunk) => {
        responseData += chunk;
      });
      response.on('end', () => {
        console.log(responseData);
        resolve(JSON.parse(responseData));
      });
    });

    request.on('error', (error) => reject(error));
    request.write(JSON.stringify(requestData));
    request.end();
  });
}

function get(req, res, next) {
  res.render('form', {
    layout: false,
    title: 'Prospexa Resume Parser',
  });
}

function post(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      message: 'File is required.',
    });
  }
  // console.log(req.body);
  // console.log(req.file);

  resumeParser.parseResumeFile(req.file.path, './parsed').then((resume) => {
    fs.readFile(`parsed/${req.file.filename}.json`, async function (err, data) {
      if (err) throw err;
      var json = JSON.parse(data);

      const [CREDS_METRICS, GPTProfile] = await Promise.all([
        _getCredsMetrics(resume.resume.rawText),
        _getGPTCompletion(resume.resume.rawText),
      ]);

      const profile = {
        ...JSON.parse(data),
        profileSummary: GPTProfile.data.choices[0].message.content,
        expertise: CREDS_METRICS.prediction,
        expertiseLevel: CREDS_METRICS.complexity,
        skills: CREDS_METRICS.skills,
      };

      res.render('result', {
        layout: false,
        result: profile,
      });
    });

    fs.unlink(req.file.path, () => {
      console.log(`[server]: unlinked`, req.file.path);
    });
  });
}
