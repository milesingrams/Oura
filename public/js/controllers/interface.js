window.angular.module('ngOura.controllers.interface', [])
  .controller('InterfaceController', ['$scope', 'Global',
    function($scope, Global) {
    	$scope.shelfOpen = true;
    	$scope.global = Global;
    }]);