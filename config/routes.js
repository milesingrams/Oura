
var async = require('async')

module.exports = function (app) {

  // home route
  app.get('/', function(req, res) {
  	res.render('index')
  })
}
