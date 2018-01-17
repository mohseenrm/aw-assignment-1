/* Globals */
var session = {};

var insights = {
	bounties: [
		'Bounties are a great opportunity to learn a new language or technology, try completing a few bounties to improve you learning on stackoverflow<a class="insight-button" href="https://stackoverflow.com/help/bounty" target="_blank">Link</a>',
		'Awesome! keep knocking those bounties out',
		'You\'re a bounty hunter!'
	],
	pages: [
		'Visit more page results to find similar problems you\'re facing<a class="insight-button" href="https://meta.stackexchange.com/questions/16542/how-to-search-unanswered-questions" target="_blank">Link</a>',
		'Awesome! keep going',
		'You\'re a pro!'
	],
	questions: [
		'Visiting more relevant questions can help point to better solution<a class="insight-button" href="https://meta.stackoverflow.com/questions/254592/how-do-active-answerers-find-questions-to-answer" target="_blank">Link</a>',
		'Awesome! keep going!',
		'Knowledge seeker! (answer a few questions if you know enough about the problem)'
	],
	tags: [
		'Try using relevant tags to view relevant topics and questions<a class="insight-button" href="https://stackoverflow.com/help/tagging" target="_blank">Link</a>',
		'Awesome! keep going',
		'#TagPro'
	],
	votes: [
		'Up vote accurate solutions, it helps the community in the long run towards better solutions<a class="insight-button" href="https://stackoverflow.com/help/privileges/vote-up" target="_blank">Link</a>',
		'Awesome! keep going',
		'#MakeStackOverflowGreatAgain'
	]
};

var $chart = $('#chart');
var $linkChart = $('#link-chart');
var $profile = $('#profile');
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

chrome.storage.local.get('linkStats', function(stats) {
	session.linkStats = stats.linkStats;
	console.log('Got LStats: ', session);
	renderLinkStats();
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

/* Main Render Function */
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
// test
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
				backgroundColor:'rgba(0,51,102,0.8)',
				borderColor:'rgba(0,51,102,1)',
				data: userDataRender,
				label: session.username
			},
			{
				backgroundColor: 'rgba(239,128,13,0.8)',
				borderColor: 'rgba(239,128,13,1)',
				data: averageGlobalUserStats,
				label: 'Average Data (all users)'
			}
		]
	};

	var options = {
		maintainAspectRatio: true,
		spanGaps: false,
		elements: {
			line: {
				tension: 0.25
			}
		},
		plugins:{
			filler: {
				propagate: true
			}
		},
		legend: {
			labels: {
				fontColor: 'black',
				defaultFontFanily: 'Merriweather',
				defaultFontSize: 100
			}
		},
		tooltips: {
			mode: 'point',
			intersect: true
		},
		hover: {
			mode: 'point',
			intersect: true
		}
	};
	
	var radarChart = new Chart($chart, {
		type: 'radar',
		data: chartData,
		options,
	});
};
// this
var renderRow = function(row){
	var averageStat = session.stats.average[row];
	var userStat = session.stats.user[row];
	var element = table[row];

	if (userStat > averageStat) { 
		element.html(insights[row][2]);
	 }
	else if (userStat < averageStat) {
		session.su
		element.html(insights[row][0]);
	}
	else { element.html(insights[row][1]); }
};

var renderTable = function(){
	var rows = Object.keys(table);
	rows.map(renderRow);
};

var renderLinkStats = function(){
	var labels = Object.keys(session.linkStats);
	var data = Object.values(session.linkStats);
	console.log('labels: ', labels);
	console.log('data: ', data);

	var renderData = {
		labels,
		datasets: [{
			backgroundColor:'rgba(239,128,13,0.8)',
			borderColor:'rgba(239,128,13,1)',
			data,
			label: 'Websites'
		}]
	};
// test 
	var options = {
		elements: {
			rectangle: { borderWidth: 2 }
		},
		responsive: true,
		legend: { position: 'right' },
		title: {
			display: true,
			text: 'Frequency of events per page'
		}
	};

	var linkChart = new Chart(
		$linkChart,
		{
			type: 'horizontalBar',
			data: renderData,
			options
		}
	);
};

/* Hooking up stats action */
$profile.click(function(e){
	e.preventDefault();

	chrome.runtime.sendMessage({ profile: true });
});
