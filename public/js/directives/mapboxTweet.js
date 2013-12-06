window.angular.module('oura.directives.mapboxTweet', [])
  .directive('mapboxTweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet',
    		},
    		templateUrl: '/templates/mapboxTweet.html',
            link: function (scope, element) {
            }   
    	}
    }]);