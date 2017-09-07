console.log('loaded profile js: ', chrome);

var $activity = $('#activity');
var $close = $('#close');
var $hook = $('#activity-hook');
var $pageHook = $('#page-hook');
var $questionHook = $('#question-hook');
var $tabHook = $('#tab-hook');
var $tagHook = $('#tag-hook');
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
	'bounties-tab',
	'post-tag'
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
/* Render Last Login */
var renderLastLogin = function(){
	if (session.activity && session.activity.length !== 0){
		$activity.html('Last Login at : ' + convertToReadableTime(
			session.activity[
				session.activity.length - 1
			].timeStamp
		));
	}
}
/* Render Activity Data */
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
/* Render Bounties Data */
var createTabElement = function(activity){
	var $element = $(
		'<a>',
		{
			'class': 'main-wrapper--body--activity--item content light alt'
		}
	);
	
	var time = convertToReadableTime(activity.timeStamp);

	$element.attr(
		'href',
		activity.url
	);

	$element.attr(
		'target',
		'_blank'
	);

	$element.html(time);
	$tabHook.append($element);
}
var renderTabActivity = function(){
	if (session.render.bounties && session.render.bounties !== 0){
		// render each activity
		session.render.bounties.map(createTabElement);
	}
}
/* Render Questions Data */
var createQuestionElement = function(question){
	var $element = $(
		'<a>',
		{
			'class': 'main-wrapper--body--activity--item content light alt'
		}
	);

	var time = convertToReadableTime(question.timeStamp);

	$element.attr(
		'href',
		question.url
	);

	$element.attr(
		'target',
		'_blank'
	);

	$element.html(time);
	$questionHook.append($element);
}
var renderQuestionActivity = function(){
	if (session.render.questions && session.render.questions !== 0){
		// render each activity
		session.render.questions.map(createQuestionElement);
	}
}
/* Render Page Data */
var createPageElement = function(page){
	var $element = $(
		'<a>',
		{
			'class': 'main-wrapper--body--activity--item content light alt'
		}
	);

	var time = convertToReadableTime(page.timeStamp);

	$element.attr(
		'href',
		page.url
	);

	$element.attr(
		'target',
		'_blank'
	);
	$element.html(time);
	$pageHook.append($element);
}
var renderPageActivity = function(){
	if (session.render.pages && session.render.pages !== 0){
		// render each activity
		session.render.pages.map(createPageElement);
	}
}
/* Render Tag Data */
var createTagElement = function(tag){
	var $element = $(
		'<a>',
		{
			'class': 'main-wrapper--body--activity--item content light alt'
		}
	);

	var time = convertToReadableTime(tag.timeStamp);

	$element.attr(
		'href',
		tag.url
	);

	$element.attr(
		'target',
		'_blank'
	);

	$element.html(time);
	$tagHook.append($element);
}
var renderTagActivity = function(){
	if (session.render.tags && session.render.tags !== 0){
		// render each activity
		session.render.tags.map(createTagElement);
	}
}
/* Render Failure */
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

/* Main Render */
var render = function(){
	renderLastLogin();
	renderLoginActivity();
	renderTabActivity();
	renderQuestionActivity();
	renderPageActivity();
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

var isTag = function(event){
	return event.className.includes('post-tag');
}

var filterTags = function(){
	if(session.events){
		var tags = session.events.filter(isTag);
		session.render.tags = tags;
	}
}

var filter = function(){
	filterBounties();
	filterPages();
	filterQuestions();
	filterTags();
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
