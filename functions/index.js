/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const pug = require('pug');

exports.home = onRequest({ cors: true }, (request, response) => {
    place = request.query.search;
    api = process.env.API_KEY
    let template = pug.compileFile('views/home.pug');
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${api}&units=imperial`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            let markup = template({
                name: data.name,
                temp: Math.round(data.main.temp),
                feels: Math.round(data.main.feels_like),
                weather: data.weather[0].main,
                humidity: data.main.humidity,
                wind: data.wind.speed
            });
            console.log("done");
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(markup);
        })
        .catch(error => {
            console.error(error);
        });
})

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
