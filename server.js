const Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const keys = require('./APIKeys');

app.use('/source', express.static(__dirname + '/client/source/'));

var Tweet = new Twit({
  consumer_key:         keys.consumer_key,
  consumer_secret:      keys.consumer_secret,
  access_token:         keys.access_token,
  access_token_secret:  keys.access_token_secret,
});

var stream = Tweet.stream('statuses/filter', { track: ['#javascript', '#iot']});

stream.on('tweet', function (tweet) {
  io.emit('tweet',{ 'tweet': tweet });
});

// CREATE ROUTES API
app.get('/', function (req, res) {
  res.sendFile( __dirname +  "/client/index.html" );
});

app.get('/tweets', function (req, res) {
  res.sendFile( __dirname +  "/client/tweets.html" );
});

app.get('/mytweets', function (req, res) {
  res.sendFile( __dirname +  "/client/mytweets.html" );
});

// START server
server.listen(3000, function () {
  console.log('server listening on http://localhost:3000!')
});

