window.angular.module('ngOura.directives.tweet', [])
  .directive('tweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet'
    		},
    		templateUrl: '/templates/tweet.html',
            link: function (scope, element) {
                var ouraLevel = Math.floor(Math.random()*3 + 0.5);
                var boxShadows = [];
                for (var i=1; i<=ouraLevel; i++) {
                    boxShadows.push("0 0 0 " + i*3 + "px rgba(255, 0, 150, 0.15)");
                }
                scope.ouraStyle = {'box-shadow': boxShadows.join(", ")};
               
                var tweet = scope.tweet;
                var allEntities = [];
                angular.forEach(tweet.entities.urls, function (url) {
                    allEntities.push({
                        html: "<a target='_blank' href='"+url.url+"'>"+url.url+"</a>",
                        indices: url.indices
                    });
                });

                angular.forEach(tweet.entities.hashtags, function (hashtag) {
                    allEntities.push({
                        html: "<a target='_blank' href='http://twitter.com/search?q=%23"+hashtag.text+"'>#"+hashtag.text+"</a>",
                        indices: hashtag.indices
                    });
                });

                angular.forEach(tweet.entities.user_mentions, function (user_mention) {
                    allEntities.push({
                        html: "<a target='_blank' href='http://twitter.com/"+user_mention.screen_name+"'>@"+user_mention.screen_name+"</a>",
                        indices: user_mention.indices
                    });
                });
                
                allEntities.sort(function (a,b) {return (a.indices[0] > b.indices[0]) ? 1 : ((b.indices[0] > a.indices[0]) ? -1 : 0);});

                var htmlText = tweet.text;
                for (var i=0; i<allEntities.length; i++) {
                    var entitity = allEntities[i];
                    htmlText = htmlText.substring(0, entitity.indices[0]) + entitity.html + htmlText.substring(entitity.indices[1]);
                    var indexChange = entitity.indices[0]-entitity.indices[1]+entitity.html.length;
                    for (var j=i; j<allEntities.length; j++) {
                        allEntities[j].indices[0] += indexChange;
                        allEntities[j].indices[1] += indexChange;
                    }
                }
                
                scope.htmlText = htmlText;
            }   
    	}
    }]);