const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

// necessary code to use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

// What should happen when user enters my route homepage
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {
  // body parser allows to look through the body of the post req
  // and fetch the data based on the name of the input
  // 1. Fetch data from an external server (a get request to the OpenWeather server)
  // 2. Get the data in the form of a JSON
  // 3. Parse the data into JS Object
  const query = req.body.cityName;
  const apiKey = '9496d34774d40cf564704db143384a65'
  const unit = 'metric';
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=' + unit + '&appid=' + apiKey;


  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on('data', function(data) {
      // console.log(data);
      // convert data into JS object
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      const temp = weatherData.main.temp;
      // console.log(temp);
      const description = weatherData.weather[0].description;
      // console.log(description);
      const iconID = weatherData.weather[0].icon;
      // Add icon
      const iconURL = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png';

      // Response that is given to the browser
      // Use res.write and at the end res.send because there can be only 1 res.send
      res.write('<p>The weather is currently: ' + description + '.</p>');
      res.write('<h1>The temperature in ' + query + ' is ' + temp + ' degrees Celcius. </h1>');
      // Add icon
      res.write('<img src=' + iconURL + '>');
      // res.write('<h2>Enter Your City:</h2>')
      // res.write('<input type="text" placeholder="City">');
      res.send();
    })
  });

});

app.listen('3000', function() {
  console.log('Server is running on port 3000');
});
