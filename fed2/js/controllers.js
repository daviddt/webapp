

/* Controllers */

(function(){

	'use strict';

	/* 

	config bestand met alle data die we herbruiken, dit object bevat ook "keep", 
	hierin sla ik json's op die we kunnen hergebruiken 

	*/
	var config = {
		api_url : 'https://api.leaguevine.com/v1/',
		acces_token : 'access_token=b4d351bf79',
	    tournament_id : '19389',
	    tournament_name : 'Amsterdam Ultimate',
	    keep: {
	    	upcoming : false,
			latest : false,
			teamlist : false
	    }
	}

	/* Main controller, deze gebruiken we onder andere voor het menu item active te zetten en de animatie (class toevoegen) */

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

	/* Controller voor de homepage */

	FrisbeeApp.controller('HomeCtrl', function ($scope, $http) {

		

		$scope.filter = 'latest';


		/* Als we deze json al een keer hebben opgehaald staat hij in ons object en hoeven we niet nog een keer de api te callen */
		if (config.keep.latest == false) {

			$scope.displayLoadingIndicator = true;


			$http.get('https://api.leaguevine.com/v1/game_scores/?tournament_id='+config.tournament_id+'&fields=%5Bteam_1%2C%20team_1_score%2C%20team_2%2C%20team_2_score%2C%20game%5D&'+config.acces_token).success(function(data) {
				
				$scope.latest = data.objects;
				
				config.keep.latest = $scope.latest;

			});

		} else {
			$scope.latest = config.keep.latest;
		}

		/* Als we deze json al een keer hebben opgehaald staat hij in ons object en hoeven we niet nog een keer de api te callen */
		if (config.keep.upcoming == false) {


			$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&fields=%5Bteam_1%2C%20team_2%2C%20start_time%2C%20id%5D&order_by=%5Bstart_time%5D&limit=20&'+config.acces_token).success(function(data) {
				
				$scope.upcoming = data.objects;
				config.keep.upcoming = $scope.upcoming;
				$scope.displayLoadingIndicator = false;

			});

		} else {
			$scope.upcoming = config.keep.upcoming;
		}

		
		/* deze functie wordt gebruikt voor het switchen tussen de 2 menu's */
		$scope.viewOptions = function(ev){
			angular.element(ev.currentTarget).parent().toggleClass('active');
		}

		/* date string omrekenen naar bruikbare data.... */	
		$scope.toDate = function(date) {
			var time = new Date(date);
			var day = time.getDay();
			var month = time.getDate();
			var hours = time.getHours();
			var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
			return day + '/' + month + ' om ' + hours + ':' + minutes;
		}




	});

	/* controller voor de pool */

	FrisbeeApp.controller('PoolCtrl', function ($scope, $http, $location, myService) {

		$scope.displayLoadingIndicator = true;

		$scope.order = 'wins';
		$scope.reverse = true;

		$http.get(config.api_url+'pools/?tournament_id='+config.tournament_id+'&fields=%5Bstandings%5D&'+config.acces_token).success(function(data) {
			$scope.pools = data.objects;
			$scope.displayLoadingIndicator = false;

		});

		/* functie attachen uit de service */
		$scope.showTeam = myService.showTeam;


	});


	/* controller voor de match page */

	FrisbeeApp.controller('MatchCtrl', function ($scope, $http, $location, $routeParams) {

		$scope.displayWrapper = false;
		$scope.displayLoadingIndicator = true;

		$scope.matchID = $routeParams.matchID;


		$http.get(config.api_url+'games/'+$scope.matchID+'/?'+config.acces_token).success(function(data) {
			$scope.match = data;
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
			$scope.displayLoadingIndicator = false;
			$scope.displayWrapper = true;
		});

		/* post functie */

		$scope.submitScore = function() {

			/* als 1 van de velden leeg is geven we de gebruiker feedback */
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
		    	if (config.keep.latest !== false) {
		    		config.keep.latest.reverse();
		    		config.keep.latest.push(response);
		    		config.keep.latest.reverse();
		    	}
		    	window.location.hash = "/match/"+$scope.matchID; /* bij succes gaan we meteen naar de match pagina */
		    }).
		    error(function(response) {
				alert("Oeps! er ging iets mis, probeer het nog een keertje..");
		    });

		};

	});

	/* controller voor de teampage */

	FrisbeeApp.controller('TeamCtrl', function ($scope, $http, $routeParams, $location, myService) {

		$scope.displayLoadingIndicator = true;



		$scope.teamID = $routeParams.teamID;

		$http.get(config.api_url+'teams/'+$scope.teamID+'/?'+config.acces_token).success(function(data) {
			$scope.team = data;
		});

		$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&team_ids=['+$scope.teamID+']&'+config.acces_token).success(function(data) {
			$scope.scores = data.objects;
			$scope.displayLoadingIndicator = false;
		});

		/* functies attachen uit de service */
		$scope.showTeam = myService.showTeam;
		$scope.showMatch = myService.showMatch;

	});

	/* controller voor de teams page */

	FrisbeeApp.controller('TeamsCtrl', function ($scope, $http, $location, myService) {

		


		if (config.keep.teamlist == false) {

			$scope.displayLoadingIndicator = true;


			$http.get('https://api.leaguevine.com/v1/tournament_teams/?tournament_ids=%5B'+config.tournament_id+'%5D&limit=200&'+config.acces_token).success(function(data) {
				$scope.teams = data.objects;
				config.keep.teamlist = data.objects;
				$scope.displayLoadingIndicator = false;
			});

		} else {
			$scope.teams = config.keep.teamlist;
		}

		/* services attachen */
		$scope.showTeam = myService.showTeam;
	
		
	});

	FrisbeeApp.controller('RulesCtrl', function ($scope, $http) {

		$scope.displayLoadingIndicator = true;


		$http.get('https://api.leaguevine.com/v1/tournaments/?tournament_ids=%5B'+config.tournament_id+'%5D&fields=%5Binfo%5D&'+config.acces_token).success(function(data) {
			$scope.rules = data.objects[0].info;
			$scope.displayLoadingIndicator = false;
		});

	});


	



})();
