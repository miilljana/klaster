console.log('Client-side code running');
require('jsdom-global')()
const button = document.getElementById('saveForm') 
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/read', {method: 'POST',
  body:JSON.stringify({title:document.getElementById('Field5')})})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

