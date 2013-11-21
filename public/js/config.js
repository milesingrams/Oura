//Setting up route
window.app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/tweets', { templateUrl: 'views/tweets.html' })
	.when('/venues', { templateUrl: 'views/venues.html' })
	.otherwise({redirectTo: '/tweets'});
}]);

//Removing tomcat unspported headers
window.app.config(['$httpProvider', function($httpProvider, Configuration) {
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
}]);