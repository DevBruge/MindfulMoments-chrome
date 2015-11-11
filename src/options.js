/***********************
 * TO DO
 * - load default options into storage at first
 *
 */

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("add").addEventListener("click", addMsg);
});
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("rem").addEventListener("click", remMsg);
});
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("save").addEventListener("click", saveOptions);
});

// Add messages to the list box. This list is what will be displayed
// at random times as mindful moments
function addMsg() {
	var textboxMsg = document.getElementById('textboxMsg');
	var listboxMsgs = document.getElementById('listboxMsgs');
	
	// If the value entered is not empty then add it to
	// the list of mindful moment messages
	if (textboxMsg.value){
		listboxMsgs.add(new Option(textboxMsg.value, textboxMsg.value));	
	}
}

// Remove messages from the list box. This list is what will be displayed
// at random times as mindful moments
function remMsg(){
	var listboxMsgs = document.getElementById('listboxMsgs');
	var options = listboxMsgs.options;
	var i = options.length;

	// iterate all items in the list
	while (i--) {
	    var current = options[i];
	    // Remove the selected items in the list
	    if (current.selected) {
	        listboxMsgs.remove(i);
	    }
	}
}

function saveOptions(){
	var bChromeNotificationEnabled = document.getElementsByName('notify')[0].checked;
	var bSoundEnabled = document.getElementById('sound').checked;
	var optionsMsgs = document.getElementById('listboxMsgs').options;

	// Add all options into an array since they can be used by chrome storage
	var saMsgs = [];
	for (var i = 0; i < optionsMsgs.length; i++) {
		saMsgs.push(optionsMsgs[i].value);
	};

	chrome.storage.sync.set({'notifyOption': bChromeNotificationEnabled}, function() {
        console.log("SET: The notification option value stored is: " + bChromeNotificationEnabled);
    });
    chrome.storage.sync.set({'soundOption': bSoundEnabled}, function() {
        console.log("SET: The sound option value stored is: " + bSoundEnabled);
    });
    chrome.storage.sync.set({'mindfulMessages': saMsgs}, function() {
        console.log("SET: The current mindful message count is: " + saMsgs.length);
    });

	//Test for get    
    chrome.storage.sync.get(['notifyOption','soundOption','mindfulMessages'], function (items) {
    	console.log("GET: The notification option value retreived is: " + items.notifyOption);
        console.log("GET: The sound option value retreived is: " + items.soundOption);
        console.log("GET: The mindful message count retreived is: " + items.mindfulMessages.length);
        for (var i = 0; i < items.mindfulMessages.length; i++) {
        	console.log("GET: Mindful message #" + (i+1) + ": " + items.mindfulMessages[i]);
        };
    });
}