window.app = angular.module('ngOuraApp', ['ngCookies', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute', 'ngOura.controllers', 'ngOura.directives', 'ngOura.services', 'ngOura.filters']);

// bundling dependencies
window.angular.module('ngOura.controllers', ['ngOura.controllers.main', 'ngOura.controllers.interface']);
window.angular.module('ngOura.services', ['ngOura.services.socket']);
window.angular.module('ngOura.filters', ['ngOura.filters.parseUrl']);
window.angular.module('ngOura.directives', ['ngOura.directives.ouraMap', 'ngOura.directives.tweet']);