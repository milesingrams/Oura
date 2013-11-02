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
  , passport = require('passport')
  , logger = require('mean-logger')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

// Bootstrap db connection
var db = mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()

// express settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)

//Initializing logger 
logger.init(app, passport, mongoose)

// expose app
exports = module.exports = app



// TWITTER HANDLING ----------------------------------------------------------------

var Tweet = mongoose.model('Tweet')

var t = new twitter({
    consumer_key: 'VXr1bfvFepu6YPj08j6Lw',           // <--- FILL ME IN
    consumer_secret: 'MfU5U2Q5LQOUQzzZ4TOzShFbOdfWtKYMURvreWf2A',        // <--- FILL ME IN
    access_token_key: '628638328-u074eU2d5gVD8F4mv35fajrNHw5uL3zBrYoXQpMz',       // <--- FILL ME IN
    access_token_secret: 'MFtPyj17lPVBKD2zn5M3rXHkKzpdPTM0GiL0UtBqUYOVV'     // <--- FILL ME IN
})

// //Tell the twitter API to filter on positive tweets
t.stream('statuses/filter', { track: ':)' }, function(stream) {

  //We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {
    //Make sure it was a geotagged tweet
    if (tweet.geo !== null) {
      var tempTweet = new Tweet({_id: tweet.id, text: tweet.text, date: new Date(tweet.created_at) ,geo: tweet.geo.coordinates})
      tempTweet.save(function (err) {
        if (err) return handleError(err);
      })
    }
  })
})

/*
new cronJob('* * * * *', function(){
}, null, true)
*/