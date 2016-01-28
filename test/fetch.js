/**
 * @file fetch + form data test
 * @author leon(ludafa@outlook.com)
 */

const fetch = require('node-fetch');
const FormData = require('form-data');

const form = new FormData();

form.append('a', '1');
form.append('test', require('fs').createReadStream(require('path').join(__dirname, 'findConfig.js')));

fetch('http://localhost:8080/bundles', {
    method: 'POST',
    headers: {
    },
    body: form
}).then(function (response) {

    if (response.ok) {
        return response.json();
    }

    throw new Error(response.status);

}).catch(function (error) {

    console.error(error.stack);

});
