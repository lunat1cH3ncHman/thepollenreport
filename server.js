// server.js
// Load all modules


// TODO: AllowedOrigin line in S3 bucket


const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const port = process.env.PORT || 3000;

const app = express();

// Define where to look for static files to serve
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index'); // Serve the frontend
});

app.get('/scrape', function(req, res){

  const url = 'http://www.bbc.co.uk/weather/2654675';

  const json = {count: 0};

  // Use request module to open site
  request (url, function(error, response, html){

    if(!error){
      // Use cheerio to interact with site like jQuery
      const $ = cheerio.load(html);

      json.count = $('.pollen-index .value').text();

      if(!json.count){
        json.count = 'Low';
      }
      json.date = new Date();

      console.log(json);

      res.send('Updated pollen count.');
    } else {
      res.send(error);
    }
  });
});

app.listen(port);

console.log('Listening on port ' + port);

exports = module.exports = app;
