window.angular.module('oura.directives.sidebarTweet', [])
  .directive('sidebarTweet', ['mapOverlay',
    function(mapOverlay) {
    	return {
    		restrict: 'E',
            replace: true,
    		scope: {
    			tweet: '=tweet',
                map: '=map'
    		},
    		templateUrl: '/templates/sidebarTweet.html',
            link: function (scope) {

                /*
                scope.ouraLevel = Math.floor(Math.random()*3 + 0.5);
                var boxShadows = [];
                for (var i=1; i<=scope.ouraLevel; i++) {
                    boxShadows.push("0 0 0 " + i*3 + "px rgba(255, 0, 150, 0.15)");
                }
                scope.ouraStyle = {'box-shadow': boxShadows.join(", ")};
                */

                scope.addToMap = function () {
                    var template = "<img class='map-tweet' src='"+scope.tweet.data.user.profile_image_url+"'></img>";
                    scope.mapTweet = mapOverlay.create(scope.tweet.location, scope.map, scope, template);
                }
                scope.removeFromMap = function () {
                    mapOverlay.destroy(scope.mapTweet);
                }

                scope.moveToTweet = function () {
                    scope.map.panTo(scope.tweet.location);
                    scope.map.setZoom(15);
                }

                scope.$on('$destroy', function() {
                    if(scope.mapTweet) {
                        scope.removeFromMap();
                    }
                });
            }   
    	}
    }]);