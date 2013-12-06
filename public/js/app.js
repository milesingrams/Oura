window.app = angular.module('ouraApp', ['ngCookies', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute', 'oura.controllers', 'oura.directives', 'oura.services', 'oura.filters']);

// bundling dependencies
window.angular.module('oura.controllers', ['oura.controllers.main', 'oura.controllers.interface']);
window.angular.module('oura.services', ['oura.services.mapOverlay', 'oura.services.socket']);
window.angular.module('oura.filters', ['oura.filters.parseUrl', 'oura.filters.parseUsername', 'oura.filters.parseHashtag']);
window.angular.module('oura.directives', ['oura.directives.ouraMap', 'oura.directives.mapbox', 'oura.directives.sidebarTweet', 'oura.directives.mapboxTweet']);