var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;
 
var venueSchema = new Schema({
	_id: {type: String},
	venue: {type: Object},
	coordinates: {type: [Number], index: '2dsphere'},
	oura: {type: Number}
});
 
mongoose.model('Venue', venueSchema);