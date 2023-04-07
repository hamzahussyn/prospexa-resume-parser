module.exports = {
  removeNonAlphaNumeric,
  experienceInYears
};

function removeNonAlphaNumeric(resumeObj) {
  const regex = new RegExp(/^[^a-zA-Z0-9\ \-\.\n]+/);

  for (field in resumeObj.parts) {
    if (field === 'github') continue;
    console.log(resumeObj.parts[field]);
    resumeObj.parts[field].replace(regex, '');
  }

  return resumeObj;
}

function experienceInYears(resumeObj) {
  const regex = new RegExp(/[(0-9)][(0-9)][(0-9)][(0-9)]/g);
  const experience = resumeObj.parts.experience.toLowerCase();

  if(!experience.length) {
    return 0;
  }

  let upperBound = null;
  let lowerBound = null;
  let yearsArr = null;
  let isPursuing = experience.match(/present/g);

  if(isPursuing.length) {
    let date = new Date();
    upperBound = date.getFullYear();
  }

  const matches = experience.match(regex); 
  yearsArr = matches.map(_ => +_);
  console.log('matches', JSON.stringify(yearsArr));
}