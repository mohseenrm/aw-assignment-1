var nav = new NavigationCollector();
var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];
eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(data) {
    if (typeof data)
      console.log(chrome.i18n.getMessage('inHandler'), e, data);
    else
      console.error(chrome.i18n.getMessage('inHandlerError'), e);
  });
});
// Reset the navigation state on startup. We only want to collect data within a
// session.
chrome.runtime.onStartup.addListener(function() {
  nav.resetDataStorage();
});

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

chrome.tabs.query(
  {
    active: true, 
    currentWindow: true
  }, 
  function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id, 
      {
        greeting: "hello"
      }, function(response) {
        if (response) {
          console.log("Already there");
        }
        else {
          console.log("Not there, inject contentscript");
        }
    });
});