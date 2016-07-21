// server.js
// Load all modules


// TODO: AllowedOrigin line in S3 bucket


const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');

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

      // s3 credentials set as evironment vars

      const s3 = new AWS.S3();
      const bucketName = 'thepollenreport';
      const keyName = 'pollen.json';

      const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: JSON.stringify(json, null, 4),
        ACL: 'public-read'
      };

      s3.putObject(params, function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log('Successful uploaded data to' + bucketName + '/' + keyName);
        }
      });

      res.send('Updated pollen count.');
    } else {
      res.send(error);
    }
  });
});

app.listen(port);

console.log('Listening on port ' + port);

exports = module.exports = app;
