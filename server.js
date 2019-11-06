'use strict';

require('dotenv').config()
const express = require('express');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const city = request.query.data;
  if (geoData.results[0].address_components[0].long_name === city){
    const locationData = new Location(city,geoData);
    response.send(locationData);
  } else{
    response.send('Josh is amazeballs. ERROR 500!!!!!!!')
  }

});

app.get('/weather', (req,res) =>{
  const darkSky = require('./data/darksky.json');
  const	city = req.query.data;
  let arrayOfDays = [];
  for (let i = 0 ; i < 8 ; i++){
    const summary = darkSky.daily.data[i].summary;
    const time = darkSky.daily.data[i].time;
    const weatherData = new Weather(city,summary,time);
    arrayOfDays.push(weatherData);
  }
  res.send(arrayOfDays);
})

function Location(city,geoData){
  this.request_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longtitude = geoData.results[0].geometry.location.lng;
}

function Weather(city,summary,time){
  this.request_query = city;
  this.summary = summary;
  this.time = new Date(time*1000).toGMTString();
}

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}.`)
});
