'use strict';

var FrisbeeApp = angular.module('frisbee', ['angular-gestures']);

(function(){

	FrisbeeApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
	  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	  $routeProvider.
	      when('/home', {templateUrl: 'partials/home.html',   controller: 'HomeCtrl'}).
	      when('/pools', {templateUrl: 'partials/pools.html',   controller: 'PoolCtrl'}).
	      when('/rules', {templateUrl: 'partials/rules.html',   controller: 'RulesCtrl'}).
	      when('/team/:teamID', {templateUrl: 'partials/team.html',   controller: 'TeamCtrl'}).
	      when('/teams', {templateUrl: 'partials/teams.html',   controller: 'TeamsCtrl'}).
	      when('/match/:matchID', {templateUrl: 'partials/match.html',   controller: 'MatchCtrl'}).
	      when('/addscore/:matchID', {templateUrl: 'partials/addscore.html',   controller: 'ScoreCtrl'}).
	      otherwise({redirectTo: '/home'});
	}]);

})();