document
  .getElementById('resume-input')
  .addEventListener('change', async function (e) {
    let file = e.target.files[0];
    let previewDiv = document.getElementById('preview');
    previewDiv.classList.remove('display-none');
    previewDiv.setAttribute('src', URL.createObjectURL(file));
    document.getElementsByClassName('prompt')[0].children[0].innerHTML =
      file.name;
    document.getElementById('error-text').innerText = '';
  });

document
  .querySelectorAll('[aria-label="trigger-file-upload"]')
  .forEach((element) => {
    element.addEventListener('click', () => {
      document.getElementById('resume-input').click();
    });
  });

document
  .getElementById('resume-parser-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    let file = document.getElementById('resume-input').files;
    if (!file.length) {
      document.getElementById('error-text').innerText =
        'Please select a file first!';
      return;
    }
    document.getElementById('error-text').innerText = '';
    document.getElementById('resume-parser-form').submit();
    document.getElementById('form-submit').setAttribute('disabled', 'disabled');
    document.querySelector('.lds-dual-ring').classList.remove('display-none');
  });
