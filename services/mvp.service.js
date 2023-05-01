const fs = require('fs');
var resumeParser = require('../utils/parser');
var { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

module.exports = {
  get,
  post,
};

function isGithub(key) {
  return key === 'github';
}

function _getGPTCompletion(prompt) {
  if (!prompt || !prompt.length) return;

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

      const GPTProfile = await _getGPTCompletion(resume.resume.rawText);

      const profile = {
        ...JSON.parse(data),
        profileSummary: GPTProfile.data.choices[0].message.content,
      };

      res.render('result', {
        layout: false,
        result: profile,
        isGithub,
      });
    });

    fs.unlink(req.file.path, () => {
      console.log(`[server]: unlinked`, req.file.path);
    });
  });
}
