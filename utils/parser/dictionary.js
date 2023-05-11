var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

module.exports = {
  titles: {
    objective: ['objective(s)?'],
    summary: ['professional? summary'],
    technology: ['technology'],
    experience: ['work? (?:experience|history)'],
    education: ['education'],
    skills: ['skills( & expertise)?|technical skills'],
    languages: ['languages'],
    courses: ['courses'],
    projects: [
      'personal projects|academic projects|final year project|projects'
    ],
    links: ['links'],
    contacts: ['contact(s)?'],
    positions: ['position(s)?'],
    profiles: [
      'profiles|social connect|social-profiles|social profiles',
    ],
    awards: ['awards'],
    honors: ['honors'],
    additional: ['additional'],
    certification: [
      'certification|certifications|licenses & certifications|license & certification|license|licenses',
    ],
    interests: ['interests|extra curricular|hobbies'],
  },
  profiles: [
    [
      'github.com',
      function (url, Resume, profilesWatcher) {
        console.log({ url });
        let reconstructedURL = null;
        try {
          reconstructedURL = new URL(url);
        } catch (error) {
          console.log('Dismorphed url for Github, correcting it.');
          const sections = url.split('/');
          const githubURL = 'https://github.com';
          const base = sections.length > 0 ? sections[sections.length - 1] : '';
          reconstructedURL = new URL(base, githubURL);
          console.log('Corrected to my best attempt: ', reconstructedURL.href);
        }
        download(reconstructedURL.href, function (data, err) {
          if (data) {
            var $ = cheerio.load(data),
              fullName = $('.vcard-username').text().trim(),
              location = $('.octicon-location').parent().text().trim(),
              followers = $('.octicon-people')
                .siblings('.color-fg-default')
                .text(),
              mail = $('.octicon-mail').parent().text(),
              link = $('.octicon-link').parent().text(),
              clock = $('.octicon-clock').parent().text(),
              company = $('.octicon-organization').parent().text(),
              repositories = $('.octicon-repo')
                .next()
                .text()
                .trim()
                .split('\n')
                .join('\n'), 
            contributions = $('.js-yearly-contributions')
              .children()
              .children()
              .siblings('.f4')
              .text()
              .trim()
              .split('\n')[0];
            Resume.addObject('github', {
              name: fullName,
              location: location,
              email: mail,
              link: link,
              joined: clock,
              company: company,
              followers: followers,
              repositories: repositories.substring(0, repositories.length / 2),
              contributions: contributions,
            });
          } else {
            return console.log(err);
          }
          //profilesInProgress--;
          profilesWatcher.inProgress--;
        });
      },
    ],
    [
      'linkedin.com',
      function (url, Resume, profilesWatcher) {
        let reconstructedURL = null;
        try {
          reconstructedURL = new URL(url);
        } catch (error) {
          console.log('Dismorphed url for Linkedin, correcting it.');
          const sections = url.split('/');
          const linkedinURL = 'https://linkedin.com';
          const base = `/in/${
            sections.length > 0 ? sections[sections.length - 1] : ''
          }`;
          reconstructedURL = new URL(base, linkedinURL);
          console.log('Corrected to my best attempt: ', reconstructedURL.href);
        }
        download(reconstructedURL.href, function (data, err) {
          // console.log({ data });
          if (data) {
            var $ = cheerio.load(data),
              linkedData = {
                positions: {
                  past: [],
                  current: {},
                },
                languages: [],
                skills: [],
                educations: [],
                volunteering: [],
                volunteeringOpportunities: [],
              },
              $pastPositions = $('.past-position'),
              $currentPosition = $('.current-position'),
              $languages = $('#languages-view .section-item > h4 > span'),
              $skills = $(
                '.skills-section .skill-pill .endorse-item-name-text'
              ),
              $educations = $('.education'),
              $volunteeringListing = $('ul.volunteering-listing > li'),
              $volunteeringOpportunities = $(
                'ul.volunteering-opportunities > li'
              );

            linkedData.summary = $('#summary-item .summary').text();
            linkedData.name = $('.full-name').text();
            // current position
            linkedData.positions.current = {
              title: $currentPosition.find('header > h4').text(),
              company: $currentPosition.find('header > h5').text(),
              description: $currentPosition.find('p.description').text(),
              period: $currentPosition.find('.experience-date-locale').text(),
            };
            // past positions
            _.forEach($pastPositions, function (pastPosition) {
              var $pastPosition = $(pastPosition);
              linkedData.positions.past.push({
                title: $pastPosition.find('header > h4').text(),
                company: $pastPosition.find('header > h5').text(),
                description: $pastPosition.find('p.description').text(),
                period: $pastPosition.find('.experience-date-locale').text(),
              });
            });
            _.forEach($languages, function (language) {
              linkedData.languages.push($(language).text());
            });
            _.forEach($skills, function (skill) {
              linkedData.skills.push($(skill).text());
            });
            _.forEach($educations, function (education) {
              var $education = $(education);
              linkedData.educations.push({
                title: $education.find('header > h4').text(),
                major: $education.find('header > h5').text(),
                date: $education.find('.education-date').text(),
              });
            });
            _.forEach($volunteeringListing, function (volunteering) {
              linkedData.volunteering.push($(volunteering).text());
            });
            _.forEach($volunteeringOpportunities, function (volunteering) {
              linkedData.volunteeringOpportunities.push($(volunteering).text());
            });

            Resume.addObject('linkedin', linkedData);
          } else {
            return console.log(err);
          }
          profilesWatcher.inProgress--;
        });
      },
    ],
    'facebook.com',
    'bitbucket.org',
    'stackoverflow.com',
  ],
  inline: {
    address: 'address',
    skype: 'skype',
  },
  regular: {
    name: [/([A-Z][a-z]*)(\s[A-Z][a-z]*)/],
    email: [/([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/],
    phone: [
      /((?:\+?\d{1,3}[\s-])?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4})/,
    ],
  },
};

// helper method
function download(url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback(null, error);
    }
  });
}
