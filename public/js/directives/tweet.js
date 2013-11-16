window.angular.module('ngOura.directives.tweet', [])
  .directive('tweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet'
    		},
    		templateUrl: '/templates/tweet.html',
            link: function (scope) {
                scope.oura = Math.floor(1 + Math.random() * 15);
            }
    	}
    }]);