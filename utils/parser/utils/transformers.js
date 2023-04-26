const { months } = require('../../constants');

module.exports = {
  removeNonAlphaNumeric,
  experienceInYears,
};

function removeNonAlphaNumeric(resumeObj) {
  const regex = new RegExp(/^[^a-zA-Z0-9\ \-\.\n]+/);

  for (field in resumeObj.parts) {
    if (field === 'github') continue;
    // console.log(resumeObj.parts[field]);
    resumeObj.parts[field].replace(regex, '');
  }

  return resumeObj;
}

function hasStringMonth(date) {
  months.forEach((month) => {
    if (date.includes(month.toLowerCase())) {
      return true;
    }
  });
  return false;
}

function stringToDate(date) {
  if (date.match(/present|ongoing/)) {
    return new Date();
  }

  if (!isNaN(Date.parse(date))) return new Date(date);

  // console.log(date, date.match(/^\d{4}$/));
  if (date.match(/^\d{4}$/)) {
    // console.log(date);
    return new Date(`01 01 ${date}`);
  }

  if (hasStringMonth(date)) {
    return new Date(`1 ${date}`);
  }

  if (date.includes('-') || date.includes('/')) {
    if (date.split(/-|\//).length === 3) {
      if (isNaN(Date.parse(date))) {
        //try changing to the format mm/dd/yyyy
        let [day, month, year] = date.split(/-|\//);
        if (!isNaN(Date.parse(`${month}/${day}/${year}`))) {
          return new Date(`${month}/${day}/${year}`);
        }
      }
    }
  }

  if (date.includes('-')) return new Date(`01-${date}`);
  if (date.includes('/')) return new Date(`01/${date}`);
  return new Date(`01 ${date}`);
}

function experienceInYears(resumeObj) {
  const regex = new RegExp(
    /(((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'?\s*(\d{4}|\d{2}))\s*(-|–)\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'?\s*(\d{4}|\d{2})|Present|Ongoing))|((\d{2}\/)?(\d{2}\/)?(\d{4}|\d{2})\s?(-|–)\s?(Present|Ongoing|(\d{2}\/)?(\d{2}\/)?(\d{4}|\d{2})))/gi
  );
  const regex2 = new RegExp(
    /\d+(?:\.\d+)?\+*\s*(?:year|yr|years|yrs)'*(?:\sof)?\s*experience/gi
  );
  const experience = resumeObj?.parts?.experience?.toLowerCase();

  if (!experience?.length) {
    return 0;
  }

  const matches = [
    ...new Set(experience?.match(regex)),
    // ...new Set(experience.match(regex1)),
  ];
  let dateRanges = matches.map((match) => {
    return match.split(/-|–/).map((date) => date.trim());
  });
  console.log({ matches, dateRanges });
  dateRanges = dateRanges.map((date) => {
    if (date?.length) {
      return [stringToDate(date[0]), stringToDate(date[1])];
    }
    return date;
  });
  let experienceRanges = dateRanges.map((date) => {
    // console.log({
    //   diff: date[1] - date[0],
    //   date1: date[1],
    //   date0: date[0],
    // });
    return (date[1] - date[0]) / 3.154e10;
  });

  const total = experienceRanges.reduce((total, years) => total + years, 0);
  // console.log(experienceRanges, Math.round(total));
  resumeObj.parts.approxExperienceInYears = total.toFixed(1);
  resumeObj.parts.mentionedExperienceInYears = resumeObj?.rawText
    ?.match(regex2)?.[0]
    .split(/year|yr|years|yrs/)?.[0]
    ?.trim();
  return resumeObj;
}
