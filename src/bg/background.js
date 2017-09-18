//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Request: ', request);
    console.log('Sender: ', sender);

    if ( request.auth ){
      chrome.storage.local.set({
        'username': request.username
      });

      chrome.tabs.update({
        url: chrome.extension.getURL('profile.html')
      });
    } else if ( request.logout ){
      chrome.tabs.update({
        url: chrome.extension.getURL("index.html")
      });
    } else if ( request.stats ){
      chrome.tabs.update({
        url: chrome.extension.getURL("stats.html")
      });
    }

  	chrome.pageAction.show(sender.tab.id);
    
    chrome.tabs.sendMessage(
      sender.tab.id,
      {
        greeting: "hello"
      },
      function(response) {
        if (response) { console.log('Already there'); }
        else { console.log('Not there, inject contentscript'); }
      }
    );
    sendResponse();
  });

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.update({
    url: chrome.extension.getURL("index.html")
  });
});
