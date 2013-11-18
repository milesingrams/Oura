window.angular.module('ngOura.filters.parseHashtag', [])
  .filter('parseHashtag', [
    function() {
	    var hashtagPattern = /[#]+[A-Za-z0-9-_]+/g;
	    return function(text) {        
	        angular.forEach(text.match(hashtagPattern), function(hashtag) {
	        	var clippedHashtag = hashtag.replace('#', '');
	            text = text.replace(hashtag, "<a target='_blank' href='http://twitter.com/search?q=%23"+ clippedHashtag + "'>#" + clippedHashtag +"</a>");
	        });
	        return text;        
	    };
	}]);