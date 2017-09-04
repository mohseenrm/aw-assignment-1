console.log('loaded content script!');
chrome.runtime.onMessage.addListener(
	function(
		request, 
		sender, 
		sendResponse
	) {
			console.log('Content Script: ', request);
			if (request.greeting == "hello") {
				sendResponse({message: "hi"});
			}
		}
);

document.body.addEventListener('click', function(e){
	console.log('Content Script caught event: ', e);
}, true);