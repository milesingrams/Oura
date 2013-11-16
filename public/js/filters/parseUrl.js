window.angular.module('ngOura.filters.parseUrl', [])
  .filter('parseUrl', [
    function() {
	    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
	    return function(text) {        
	        angular.forEach(text.match(urlPattern), function(url) {
	            text = text.replace(url, "<a target='_blank' href="+ url + ">" + url +"</a>");
	        });
	        return text;        
	    };
	}]);