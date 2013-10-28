var FrisbeeApp = angular.module('frisbee', ['angular-gestures']);

(function(){
	
	'use strict';

	FrisbeeApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
	  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	  $routeProvider.
	      when('/home', {templateUrl: 'partials/home.html',   controller: 'HomeCtrl'}).
	      when('/pools', {templateUrl: 'partials/pools.html',   controller: 'PoolCtrl'}).
	      when('/team/:teamID', {templateUrl: 'partials/team.html',   controller: 'TeamCtrl'}).
	      when('/match/:matchID', {templateUrl: 'partials/match.html',   controller: 'MatchCtrl'}).
	      when('/addscore/:matchID', {templateUrl: 'partials/addscore.html',   controller: 'ScoreCtrl'}).
	      otherwise({redirectTo: '/home'});
	}]);

})();
