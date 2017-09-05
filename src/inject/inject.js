console.log('loaded content script!');

var session = {
	events: []
};

document.body.addEventListener('click', function(e){
	console.log('Content Script caught event: ', e);
	console.log('element: ', e.srcElement.className);

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