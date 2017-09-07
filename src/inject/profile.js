console.log('loaded profile js: ', chrome);

var $activity = $('#activity');
var $close = $('#close');
var $hook = $('#activity-hook');
var $info = $('#info');
var $logout = $('#logout');
var $modal = $('.modal');
var $username = $('#username');

var session = {
	render: {}
};

var cssClasses = [
  'question-hyperlink',
	'page-numbers',
	'bounties-tab'
];

chrome.storage.local.get('username', function(user) {
	/* Retreive username */
	console.log('Got user: ', user);
	$username.html(user.username);
	session.username = user.username;
	/* Retrieve history */
});

$modal.fadeOut();

$info.click(function(){
	$modal.fadeIn();
});

$close.click(function(){
	$modal.fadeOut();
});

var convertToReadableTime = function(epoc){
	if (epoc){
		var time = new Date(epoc);
		return time;
	}
	// fallback
	return '27 August, 2017';
}

var render = function(){
	renderLastLogin();
	renderLoginActivity();
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

var createActivityElement = function(activity){
	var $element = $(
		'<div>',
		{
			'class': 'main-wrapper--body--activity--item content light'
		}
	);
	var time = convertToReadableTime(activity.timeStamp);
	$element.html(time);
	$hook.append($element);
}

var renderLoginActivity = function(){
	if (session.activity && session.activity.length !== 0){
		// render each activity
		session.activity.map(createActivityElement);
	}
}

var renderFail = function(){
	var $fail = $(
		'<div>',
		{
			'class': 'main-wrapper--body--activity--item content light'
		}
	);
	$fail.html('Error loading history, please refresh');
	$hook.append($fail);
}

var isPage = function(event){
	return event.className.includes('page-numbers');
}

var filterPages = function(){
	if(session.events){
		var pages = session.events.filter(isPage);
		session.render.pages = pages;
	}
}

var isQuestion = function(event){
	return event.className.includes('question-hyperlink');
}

var filterQuestions = function(){
	if(session.events){
		var questions = session.events.filter(isQuestion);
		session.render.questions = questions;
	}
}

var isBounty = function(event){
	return event.className.includes('bounties-tab');
}

var filterBounties = function(){
	if(session.events){
		var bounties = session.events.filter(isBounty);
		session.render.bounties = bounties;
	}
}

var filter = function(){
	filterBounties();
	filterPages();
	filterQuestions();
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
			if (result.getHistory){
				session.activity = result.events[0].activity;
				session.events = result.events[0].events;
				filter();
				render();
				console.log('Session: ', session);
			} else {
				renderFail();
			}
		},
		error: function( request, error ){
			console.log( 'get history Error: ', error );
		}
	} );
}

setTimeout(retrieveHistory, 100);

/* Hooking up logout action */
$logout.click(function(e){
	e.preventDefault();

	chrome.runtime.sendMessage(
		{
			logout: true
		}
	);
});
