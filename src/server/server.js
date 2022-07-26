
const dotenv = require('dotenv');
dotenv.config();
// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
// Start up an instance of app
const app = express();
const fetch = require('node-fetch')
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());
// Initialize the main project folder
app.use(express.static("dist"));
app.get('/', (req, res) => {
  res.sendFile("dist/index.html")
})

// test route
app.get('/test', async (req, res) => {
  res.json({ msg: 'Done!' })
})
// Post Route

app.post('/makeCalls', async (req, res) => {
  let userInput = req.body
  let projectData = ''
  let geonameData = ''
  let weatherData = ''
  let pixabayData = ''
  
  // call geonames
  const geousername = process.env.geonames_USERNAME;
  const geonameBaseURL = `http://api.geonames.org/search?q=${userInput.city}&maxRows=1&type=json&username=${geousername}`

  await (fetch(encodeURI(geonameBaseURL)) 
    .then(res => res.json())
    .then(data => geonameData = { 
      lng: data.geonames[0].lng,
      lat: data.geonames[0].lat,
      countryName: data.geonames[0].countryName,
      city: data.geonames[0].toponymName
     })
    .catch(err => {
      console.log(err)
      return err.message
    }))

  // WEATHERBIT API
  const key = process.env.weather_KEY
  const weatherbitBaseURL = 'http://api.weatherbit.io/v2.0/current?'
  const url = `${weatherbitBaseURL}lat=${geonameData.lat}&lon=${geonameData.lng}&key=${key}&units=I`
  // Call API
  await (fetch(url) //*
    .then(res => res.json())
    .then(res => weatherData = { 
      temp: res.data[0].temp, //*
      weather: res.data[0].weather.description,
       icon: res.data[0].weather.icon 
      })
    .catch(err => {
      console.log(err)
      return err.message
    }))
  // PIXABAY API
  const pixabayKey = process.env.pixabay_KEY
  const pixabayURL = `https://pixabay.com/api/?key=${pixabayKey}&q=${geonameData.city}&category=places&image_type=photo&orientation=horizontal&safesearch=true`
  // Call API

  await (fetch(pixabayURL) //*
    .then(res =>
      res.json()
    )
    .then(data => {
      pixabayData = { 
        img: data.hits[0].webformatURL //*
      }
    })
    .catch(err => {
      console.log(err)
      return err.message
    })
  )

  projectData = { 
    temp: weatherData.temp,
    weather: weatherData.weather,
    icon: weatherData.icon,
    cityName: geonameData.city,
    countryName: geonameData.countryName,
    date: userInput.date,
    img: pixabayData.img }
  res.send(projectData)
})

app.listen(5000, () => {
  console.log(`Server Running on localhost:5000...`);
});

module.exports = app;