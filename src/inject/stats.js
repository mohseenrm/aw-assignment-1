var session = {};

chrome.storage.local.get('username', function(user) {
	/* Retreive username */
	console.log('Got user: ', user);
	session.username = user.username;
	retrieveStats();
});

var retrieveStats = function(){
	$.ajax( {
		type: 'POST',
		url: 'https://aw-1.herokuapp.com/get/stats',
		data: JSON.stringify({ username: session.username }),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function( result ){
			console.log( 'get stats [client] result: ', result );
			if (result.getStats){
				// session.activity = result.events[0].activity;
				// session.events = result.events[0].events;
				// filter();
				// render();
				session.stats = result.stats;
				render();
				console.log('Session: ', session);
			} else {
				renderFail();
			}
		},
		error: function( request, error ){
			console.log( 'get stats Error: ', error );
		}
	} );
}
var render = function(){
	var $chart = $("#chart");

	var userDataRender =  getUserStats();
	var averageGlobalUserStats = getAverageGlobalStats();
	// var averageGlobalUserStats = [2, 2, 2, 2, 2];

	console.log('User data: ', userDataRender);
	console.log('avg data: ', averageGlobalUserStats);
	
	var chartData = {
		labels: [
			'Bounties', 
			'Pages', 
			'Questions', 
			'Tags',
			'Up Votes'
		],
		datasets: [
			{
				backgroundColor: 'rgba(200,0,0,0.2)',
				data: userDataRender,
				label: session.username
			},
			{
				backgroundColor: 'rgba(0,0,200,0.2)',
				data: averageGlobalUserStats,
				label: 'Average Data (all users)'
			}
		]
	};
	
	var radarChart = new Chart($chart, {
		type: 'radar',
		data: chartData
	});
};

var getAverageGlobalStats = function(){
	if(session.stats.global){
		return [
			session.stats.global.bounties / session.stats.global.totalUsers || 0,
			session.stats.global.pages / session.stats.global.totalUsers || 0,
			session.stats.global.questions / session.stats.global.totalUsers || 0,
			session.stats.global.tags / session.stats.global.totalUsers || 0,
			session.stats.global.votes / session.stats.global.totalUsers || 0,
		];
	}
	return [0, 0, 0, 0, 0];
};

var getUserStats = function(){
	if(session.stats.user){
		return [
			session.stats.user.bounties || 0,
			session.stats.user.pages || 0,
			session.stats.user.questions || 0,
			session.stats.user.tags || 0,
			session.stats.user.votes || 0,
		];
	}
	return [0, 0, 0, 0, 0];
}
