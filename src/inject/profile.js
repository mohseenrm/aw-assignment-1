console.log('loaded profile js: ', chrome);
chrome.runtime.onMessage.addListener(
	function(
		request, 
		sender, 
		sendResponse
	) {
			console.log('Profile Script: ', request);
		}
);

var $username = $('#username');

chrome.storage.local.get('username', function(user) {
	/* Retreive username */
	console.log('Got user: ', user);
	$username.html(user.username);
	/* Retrieve history */
});
