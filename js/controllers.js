/* Controllers */

(function(){
	
	'use strict';

	var config = {
		api_url : 'https://api.leaguevine.com/v1/',
		acces_token : 'access_token=b4d351bf79',
	    tournament_id : '19389',
	    tournament_name : 'Amsterdam Ultimate'
	}

	var keep = {
		upcoming : false,
		latest : false
	}


	FrisbeeApp.controller('Main', ['$scope', '$location', function ($scope, $location, $routeChangeStart) {

		$scope.menu = 'hide';

		$scope.isActive = function(route) {
			return route === $location.path();
		};

		$scope.header = config.tournament_name;

		$scope.showMenu =  function() {
			if ($scope.menu == 'hide') {
				$scope.menu = 'show';
			} else {
				$scope.menu = 'hide';
			}
		}

	}]);

	FrisbeeApp.controller('HomeCtrl', function ($scope, $http) {

		

		$scope.filter = 'latest';


		if (keep.latest == false) {

			$scope.displayLoadingIndicator = true;


			$http.get('https://api.leaguevine.com/v1/game_scores/?tournament_id='+config.tournament_id+'&limit=20&'+config.acces_token).success(function(data) {
				
				$scope.latest = data.objects;
				console.log($scope.latest);
				$scope.displayLoadingIndicator = false;
				keep.latest = $scope.latest;

			});

		} else {
			$scope.latest = keep.latest;
		}


		if (keep.upcoming == false) {



			$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&order_by=%5Bstart_time%5D&limit=20&'+config.acces_token).success(function(data) {
				
				$scope.upcoming = data.objects;
				console.log($scope.upcoming);
				keep.upcoming = $scope.upcoming;

			});

		} else {
			$scope.upcoming = keep.upcoming;
		}

		

		$scope.viewOptions = function(ev){
			angular.element(ev.currentTarget).parent().toggleClass('active');
		}

	
		$scope.toDate = function(date) {
			var time = new Date(date);
			var day = time.getDay();
			var month = time.getDate();
			var hours = time.getHours();
			var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
			return day + '/' + month + ' om ' + hours + ':' + minutes;
		}




	});

	FrisbeeApp.controller('PoolCtrl', function ($scope, $http, $location) {

		$scope.order = 'wins';
		$scope.reverse = true;

		$http.get(config.api_url+'pools/?tournament_id='+config.tournament_id+'&'+config.acces_token).success(function(data) {
			$scope.pools = data.objects;
		});

		$scope.showTeam = function(id) {
			$location.path('/team/'+id);
		}


	});

	FrisbeeApp.controller('MatchCtrl', function ($scope, $http, $location, $routeParams) {

		$scope.displayWrapper = false;
		$scope.displayLoadingIndicator = true;

		$scope.matchID = $routeParams.matchID;


		$http.get(config.api_url+'games/'+$scope.matchID+'/?'+config.acces_token).success(function(data) {
			$scope.match = data;
			console.log($scope.match);
			$scope.displayLoadingIndicator = false;
			$scope.displayWrapper = true;
		});

	});

	FrisbeeApp.controller('ScoreCtrl', function ($scope, $http, $location, $routeParams) {

		$scope.displayWrapper = false;
		$scope.displayLoadingIndicator = true;

		$scope.matchID = $routeParams.matchID;

		$http.get(config.api_url+'games/'+$scope.matchID+'/?'+config.acces_token).success(function(data) {
			$scope.match = data;
			console.log($scope.match);
			$scope.displayLoadingIndicator = false;
			$scope.displayWrapper = true;
		});

		$scope.submitScore = function() {

			if ($scope.team1score == '' || $scope.team2score == '') {
				alert('Vul alle velden in');
				return false;
			}

			$scope.displayWrapper = false;
			$scope.displayLoadingIndicator = true;

			var postData = {
		      "game_id": $scope.matchID,
    		  "team_1_score": $scope.team1score,
              "team_2_score": $scope.team2score,
              "is_final": $scope.isfinal
		    };
		    $http({
		      method: 'POST',
		      url: 'https://api.leaguevine.com/v1/game_scores/',
		      data: postData,
		      headers: {
		      	'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'bearer 82996312dc'
		      },
		    }).
		    success(function(response) {
		    	console.log('succes');	
		    	window.location.hash = "/match/"+$scope.matchID;
		    }).
		    error(function(response) {
		        console.log('failed');	
		    	console.log(response);
		    });

		};

	});

	FrisbeeApp.controller('TeamCtrl', function ($scope, $http, $routeParams, $location) {


		$scope.teamID = $routeParams.teamID;

		$http.get(config.api_url+'teams/'+$scope.teamID+'/?'+config.acces_token).success(function(data) {
			$scope.team = data;
			console.log($scope.team);
		});

		$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&team_ids=['+$scope.teamID+']&'+config.acces_token).success(function(data) {
			$scope.scores = data.objects;
			console.log($scope.scores);
		});

		$scope.showTeam = function(id) {
			$location.path('/team/'+id);
		}

		$scope.showMatch = function(id) {
			$location.path('/match/'+id);
		}

	});

	FrisbeeApp.filter('reverse', function() {
	  return function (items) {
	    return items.slice().reverse();
	  };
	});







})();
