var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;
 
var tweetSchema = new Schema({
	_id: {type: Number},
	text: {type: String},
	user: {
		_id: {type: Number},
		name: {type: String},
		screen_name: {type: String},
		profile_image_url: {type: String}
	},
	coordinates: {type: [Number], index: '2dsphere'},
	saved_at: {type: Date, expires: 1800}
});
 
mongoose.model('Tweet', tweetSchema);