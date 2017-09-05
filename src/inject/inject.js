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

	if (e.srcElement.baseURI.includes('stackoverflow')) {
		session.events.push({
			className: e.srcElement.className || '',
			id: e.srcElement.id || '',
			timeStamp: (new Date).getTime(),
			type: e.type,
		});
		console.log('session: ', session);
	}
}, true);
/* 
var updateServer = function(){
	// check if data exists
	if (session.events.length !== 0) {
		// send data to /update/history

		//resetting session
		session.events = [];
	}
}

setInterval(updateServer, 50000); */