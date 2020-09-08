const Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const keys = require('./APIKeys');
const twitterIds = require('./twitterids');

app.use('/source', express.static(__dirname + '/client/source/'));


////////////////////////database////////////////////////////
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mytweets', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecting error'));

db.once('open', function () {
  // we're connected!
  console.log('DB connected on port 27017');
});

// Schemas
const MyTweets = require('./server/models/mytweets');
////////////////////////database////////////////////////////

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

var streamuser = Tweet.stream('statuses/filter', { follow: [twitterIds.me] });
////////////////////Store my tweets in the DB and emit the color to mytweets.html/////////////////////////////
// streamuser.on('tweet', function (tweet) {
//   console.log(tweet.text)
//   var tweetdb = new MyTweets(tweet);
//   tweetdb.save().then(function() {
//     console.log('Object saved with id : ' + tweetdb.id)
//   });
//   io.emit('backgroundcolor',{ 'tweet': tweet.text });
// });
///////////////Retweet my tweets/////////////////////
streamuser.on('tweet', function (tweet) {
  if (!isReply(tweet)) {
    console.log(tweet);
    Tweet.post('statuses/retweet/:id', {id: tweet.id_str}, function (err, data, response) {
      console.log(data)
    });
  }
});

function isReply(tweet) {
  if ( tweet.retweeted_status
      || tweet.in_reply_to_status_id
      || tweet.in_reply_to_status_id_str
      || tweet.in_reply_to_user_id
      || tweet.in_reply_to_user_id_str
      || tweet.in_reply_to_screen_name )
    return true
}

////////////////Api routes/////////////////
app.get('/', function (req, res) {
  res.sendFile( __dirname +  "/client/index.html" );
});

app.get('/tweets', function (req, res) {
  res.sendFile( __dirname +  "/client/tweets.html" );
});

app.get('/mytweets', function (req, res) {
  res.sendFile( __dirname +  "/client/mytweets.html" );
});

app.get('/api/mytweets', function (req, res) {
  MyTweets.find({}).exec(function (err, myTweetsList) {
    if (err) {
      console.log(err)
    }
    res.json(myTweetsList);
  })
});

//////////////Sever start///////////////////
server.listen(3000, function () {
  console.log('server listening on http://localhost:3000!')
});
