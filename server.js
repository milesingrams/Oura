/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , twitter = require('ntwitter')
  , foursquare = require('foursquarevenues')
  , cronJob = require('cron').CronJob
  , sentiment = require('./scripts/sentiment.js')

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')

// Bootstrap db connection
var db = mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

var app = express()

// express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
var io = require('socket.io').listen(app.listen(port), { log: false });
io.sockets.on('connection', require('./config/socket'));
console.log('Express app started on port '+port)

// expose app
exports = module.exports = app

// TWITTER HANDLING ----------------------------------------------------------------

var Tweet = mongoose.model('Tweet')
var Venue = mongoose.model("Venue")

// Authorize API access
var twit = new twitter({
    consumer_key: 'VXr1bfvFepu6YPj08j6Lw',
    consumer_secret: 'MfU5U2Q5LQOUQzzZ4TOzShFbOdfWtKYMURvreWf2A',
    access_token_key: '628638328-u074eU2d5gVD8F4mv35fajrNHw5uL3zBrYoXQpMz',
    access_token_secret: 'MFtPyj17lPVBKD2zn5M3rXHkKzpdPTM0GiL0UtBqUYOVV'
})

var foursq = new foursquare('10HCLJ0AMUAMCQBMOFVHQ3H0VGESNVPUGFCWIN25YMTGD1ZR', 'BQUG531JQFN44JW1DGTVJYLLYSX4TKACMZWKRQIT1ZFJZURY')


// Tell the twitter API to filter on positive tweets

twit.stream('statuses/filter', { locations: '-180,-90,180,90' }, function(stream) {
  // We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {
    // Make sure it was a geotagged tweet
    if (tweet.coordinates != null) {
      // Make sure it's in english for sentiment analysis
      if (tweet.lang === 'en') {
        sentiment(tweet.text, function(sentimentErr, sentimentResult) {
          if (!sentimentErr) {
            // If the tweet is sufficiently positive, save it to the database
            if (sentimentResult > 1) {
              var lng = tweet.coordinates.coordinates[0]
              var lat = tweet.coordinates.coordinates[1]

              var dbTweet = new Tweet({
                _id: tweet.id, 
                text: tweet.text,
                user: {
                  _id: tweet.user.id,
                  name: tweet.user.name,
                  screen_name: tweet.user.screen_name,
                  profile_image_url: tweet.user.profile_image_url
                },
                coordinates: [lng, lat],
                saved_at: new Date()
              });
              dbTweet.save(function (dbErr){})

              //addOuraToLocation(1, lng, lat);
            }
          }
        })
      }
    }
  })
})

var addOuraToLocation = function (oura, lng, lat) {
  // setup foursquare query params
  var params = {
    "ll": lat+","+lng,
    "radius": "100",
    "intent": "browse"
  }
  // grab nearby venue data from foursquare
  foursq.getVenues(params, function(foursqErr, foursqResult) {

    if (!foursqErr) {
      var venues = foursqResult.response.venues

      if (venues) {
        // for each venue, save it if it doesnt exist, update it's information if it does exist
        venues.forEach(function (venue) {

          var upsertData = {
            venue: venue,
            coordinates: [venue.location.lng, venue.location.lat],
            $inc: {oura: oura}
          }

          Venue.update({_id: venue.id}, upsertData, {upsert: true}, function (dbErr, dbVenue) {})
        })
      }
    }
  })
}

/*
new cronJob('* * * * *', function(){
}, null, true)
*/