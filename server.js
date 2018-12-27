// server.js
// Load all modules

// TODO: adjsut  AllowedOrigin in S3 bucket


const express = require('express');
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');
const postgres = require('pg');
const bodyParser = require('body-parser');
const cron = require('node-cron');

// Referesh every day at 05:00

cron.schedule('00 05 * * 0-6', function(){
  console.log('running cron update job');

    const url = 'http://www.bbc.co.uk/weather/2643743';

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

        console.log('Updated pollen count.');
      } else {
        //TODO: email or other alert
        console.log(error);
      }
    });
}).start();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

// Define where to look for static files to serve
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index'); // Serve the frontend
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    //TODO: Authentication here
    console.log('Request received API v1');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/comments')
  .post(function(req, res){
    console.log('Post comments');
    //TODO: Abstract all the common settings to config file
    const s3 = new AWS.S3();

    console.log(req.body);

    const comments_params = {
      Bucket: 'thepollenreport',
      Key: 'comments.json',
      Body: JSON.stringify(req.body, null, 4),
      ACL: 'public-read'
    };

    s3.putObject(comments_params, function(err, data){
      if (err) {
        console.log(err);
        res.json({message: err});
      } else {
        console.log('Successful uploaded data to' + comments_params.Bucket + '/' + comments_params.Key);
        res.json({message: 'Updated comments.'});
      }
    });
  })
  .get(function(req, res){
    res.json({message: 'Return comments here'});
  });

app.use('/api/v1/', router);

app.listen(port);

console.log('Listening on port ' + port);

exports = module.exports = app;
