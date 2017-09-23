/* Globals */
var session = {};

var insights = {
	bounties: [
		'Bounties are a great opportunity to learn a new language or technology, try completing a few bounties to improve you learning on stackoverflow',
		'Awesome! keep knocking those bounties out',
		'You\'re a bounty hunter!'
	],
	pages: [
		'Visit more page results to find similar problems you\'re facing',
		'Awesome! keep going',
		'You\'re a pro!'
	],
	questions: [
		'Visiting more relevant questions can help point to better solution',
		'Awesome! keep going!',
		'Knowledge seeker! (answer a few questions if you know enough about the problem)'
	],
	tags: [
		'Try using relevant tags to view relevant topics and questions',
		'Awesome! keep going',
		'#TagPro'
	],
	votes: [
		'Up vote accurate solutions, it helps the community in the long run towards better solutions',
		'Awesome! keep going',
		'#MakeStackOverflowGreatAgain'
	]
};

var $chart = $('#chart');
var $username = $('#user-title');
/* Row elements */
var table = {
	bounties: $('#row-bounties'),
	pages: $('#row-pages'),
	questions: $('#row-questions'),
	tags: $('#row-tags'),
	votes: $('#row-votes')
}
/* Retreive username */
chrome.storage.local.get('username', function(user) {	
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
	renderUsername();
	renderChart();
	renderTable();
};

var getAverageGlobalStats = function(){
	if(session.stats.global){
		session.stats.average = {
			bounties: session.stats.global.bounties / session.stats.global.totalUsers || 0,
			pages: session.stats.global.pages / session.stats.global.totalUsers || 0,
			questions: session.stats.global.questions / session.stats.global.totalUsers || 0,
			tags: session.stats.global.tags / session.stats.global.totalUsers || 0,
			votes: session.stats.global.votes / session.stats.global.totalUsers || 0
		};
		return [
			session.stats.average.bounties,
			session.stats.average.pages,
			session.stats.average.questions,
			session.stats.average.tags,
			session.stats.average.votes,
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
};

var renderUsername = function(){
	$username.html(`${session.username} statistics`);
};

var renderChart = function(){
	var userDataRender =  getUserStats();
	var averageGlobalUserStats = getAverageGlobalStats();

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
				backgroundColor: [
					'rgba(151,249,190,0.5)'
				],
				borderColor: [
					'rgba(255,255,255,0.5)'
				],
				hoverBackgroundColor: 'rgba(151,249,190,1)',
				data: userDataRender,
				label: session.username
			},
			{
				backgroundColor: [
					'rgba(252,147,65,0.5)'
				],
				
				borderColor: [
					'rgba(255,255,255,0.5)'
				],
				hoverBackgroundColor: 'rgba(151,249,190,1)',
				data: averageGlobalUserStats,
				label: 'Average Data (all users)'
			}
		]
	};

	var options = {
		legend: {
			labels: {
				fontColor: 'black',
				defaultFontFanily: 'Merriweather',
				defaultFontSize: 100
			}
		}
	};
	
	var radarChart = new Chart($chart, {
		type: 'radar',
		data: chartData,
		options,
	});
};

var renderRow = function(row){
	var averageStat = session.stats.average[row];
	var userStat = session.stats.user[row];
	var element = table[row];

	if (userStat > averageStat) { element.html(insights[row][2]); }
	else if (userStat < averageStat) { element.html(insights[row][0]); }
	else { element.html(insights[row][1]); }
};

var renderTable = function(){
	var rows = Object.keys(table);
	rows.map(renderRow);
}
