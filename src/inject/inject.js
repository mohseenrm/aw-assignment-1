console.log('loaded content script!');

/* globals */
var session = {
	events: []
};

var userName = '';

// TODO: handle logout, and update username
chrome.storage.local.get('username', function(user) {
	/* Retreive username */
	console.log('Got user: ', user.username);
	session.username = user.username;
});

document.body.addEventListener('click', function(e){
	console.log('Content Script caught event: ', e);

	if (
		e.srcElement.baseURI.includes(
			'stackoverflow'
		) && e.srcElement.baseURI.includes(
			'java'
		)
	) {
		session.events.push({
			className: e.srcElement.className || '',
			id: e.srcElement.id || '',
			timeStamp: (new Date).getTime(),
			type: e.type,
			url: e.srcElement.baseURI
		});
		console.log('session: ', session);
	}
}, true);

var updateServer = function(){
	// check if data exists
	if (session.events.length !== 0) {
		// send data to /update/history
		$.ajax( {
			type: 'POST',
			url: 'https://aw-1.herokuapp.com/update/history',
			data: JSON.stringify(session),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function( result ){
				console.log( 'update history [client] result: ', result );
			},
			error: function( request, error ){
				console.log( 'login Error: ', error );
			}
		} );
		// resetting session
		session.events = [];
	}
}

setInterval(updateServer, 1500);
