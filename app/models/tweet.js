var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;
 
var tweetSchema = new Schema({
	_id: {type: Number},
	text: {type: String},
	date: {type: Date, expires: 1800},
	geo: {type: Array},
});

tweetSchema.index({  });
 
mongoose.model('Tweet', tweetSchema);