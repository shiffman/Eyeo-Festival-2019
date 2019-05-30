// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// Using the Twit node package
// https://github.com/ttezel/twit
const Twit = require('twit');
const express = require('express');

require('dotenv').config();

// Pulling all my twitter account info from another file
const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

// Enable CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Making a Twit object for connection to the API
const T = new Twit(config);

// For reading image files
const fs = require('fs');

// var b64content = fs.readFileSync('output.png', { encoding: 'base64' });
// console.log(b64content);

app.post('/tweet', (request, res) => {
  const data = request.body;
  //console.log(data.image64);
  // Upload the media
  T.post('media/upload', { media_data: data.image64 }, uploaded);

  function uploaded(err, data, response) {
    // Now we can reference the media and post a tweet
    // with the media attached
    console.log(data);
    var mediaIdStr = data.media_id_string;
    var params = { status: '#eyeotest', media_ids: [mediaIdStr] };
    // Post tweet
    T.post('statuses/update', params, tweeted);
  }
  //  Callback for when the tweet is sent
  function tweeted(err, data, response) {
    if (err) {
      console.log(err);
      res.json({ error: err });
    } else {
      console.log('success');
      res.json({ tweet: data.text });
    }
  }
});