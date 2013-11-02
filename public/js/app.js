window.app = angular.module('ngOuraApp', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngRoute', 'ngOura.controllers', 'ngOura.directives', 'ngOura.services']);

// bundling dependencies
window.angular.module('ngOura.controllers', ['ngOura.controllers.map', 'ngOura.controllers.interface', 'ngOura.controllers.index']);
window.angular.module('ngOura.services', ['ngOura.services.global']);