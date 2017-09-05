console.log('loaded profile js: ', chrome);

var $activity = $('#activity');
var $username = $('#username');

var session = {};

chrome.storage.local.get('username', function(user) {
	/* Retreive username */
	console.log('Got user: ', user);
	$username.html(user.username);
	session.username = user.username;
	/* Retrieve history */
});

console.log('runs till here');

var convertToReadableTime = function(epoc){
	if (epoc){
		var time = new Date(epoc);
		return time;
	}
	return '27 August, 2017';
}

var render = function(){
	renderLastLogin();
}

var renderLastLogin = function(){
	if (session.activity && session.activity.length !== 0){
		$activity.html('Last Login at : ' + convertToReadableTime(
			session.activity[
				session.activity.length - 1
			].timeStamp
		));
	}
}

var retrieveHistory = function(){
	$.ajax( {
		type: 'POST',
		url: 'https://aw-1.herokuapp.com/get/history',
		data: JSON.stringify({ username: session.username }),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function( result ){
			console.log( 'get history [client] result: ', result );
			session.activity = result.events[0].activity;
			session.events = result.events[0].events;
			render();
		},
		error: function( request, error ){
			console.log( 'get history Error: ', error );
		}
	} );
}

setTimeout(retrieveHistory, 100);
