window.angular.module('oura.filters.parseUsername', [])
  .filter('parseUsername', [
    function() {
	    var usernamePattern = /[@]+[A-Za-z0-9-_]+/g;
	    return function(text) {        
	        angular.forEach(text.match(usernamePattern), function(username) {
	        	var clippedUsername = username.replace('@', '');
	            text = text.replace(username, "<a target='_blank' href='http://twitter.com/"+ clippedUsername + "'>@" + clippedUsername +"</a>");
	        });
	        return text;        
	    };
	}]);