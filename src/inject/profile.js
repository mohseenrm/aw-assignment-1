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

chrome.storage.local.get('username', function(user) {
	console.log('Got user: ', user);
});