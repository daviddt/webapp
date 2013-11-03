(function(){

	FrisbeeApp.factory('myService', function ($location) {
        return {
            showTeam: function(id) {
				$location.path('/team/'+id);
			},

			showMatch: function(id) {
				$location.path('/match/'+id);
			}
        }
    });

    FrisbeeApp.filter('reverse', function() {
	    return function (items) {
	    	return items.slice().reverse();
	  	};
	});


})();