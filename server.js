'use strict';

// Load Enviornment Variables from the .env file
require('dotenv').config()

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors')

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

let locations = {};

// Route Deffinitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

// app.get('/location', (request, response) => {
//   const geoData = require('./data/geo.json');
//   const city = request.query.data;
//   if (geoData.results[0].address_components[0].long_name === city){
//     const locationData = new Location(city,geoData);
//     response.send(locationData);
//   } else{
//     response.send('Josh is amazeballs. ERROR 500!!!!!!!')
//   }
  
// });

// app.get('/weather', (req,res) =>{
//   const darkSky = require('./data/darksky.json');
//   const	city = req.query.data;
//   let arrayOfDays = [];
//   for (let i = 0 ; i < 8 ; i++){
//     const summary = darkSky.daily.data[i].summary;
//     const time = darkSky.daily.data[i].time;
//     const weatherData = new Weather(city,summary,time);
//     arrayOfDays.push(weatherData);
//   }
//   res.send(arrayOfDays);
// })

function locationHandler(request, response) {
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?`;

  if ( locations[url] ) {
    response.send( locations[url] );
  }
  else {
    superagent.get(url)
      .then(data => {
        const geoData = data.body;
        const location = new Location(request.query.data, geoData);
        location[url] = location;
        response.send(location);
      })
      .catch( () => {
        errorHandler('So sorry, something went wrong.', request, response);
      })
  }
}

function Location(city, geoData){
  this.request_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longtitude = geoData.results[0].geometry.location.lng;
}

// http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
// That encoded query string is: data[latitude]=47.6062095&data[longitude]=122.3320708
function weatherHandler(request, response) {
  
  const url = `https://api.darksky.net/forecast/`

  superagent.get(url)
    .then( data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      })
      response.status(200).json(weatherSummaries);
    })
    .catch( () => {
      errorHandler('Somnething went wrong', request, response);
    })
}

function Weather(summary,time){
  this.summary = day.summary;
  this.time = new Date(day.time*1000).toGMTString();
}

function notFound

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}.`)
});
