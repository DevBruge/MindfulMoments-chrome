
var defaultOptions = {
	'notifyOption': true, 
	'soundOption': false, 
	'mindfulMessages': [
       "Zen1",
       "Zen2",
       "Zen3",
       "Zen4"
	],
};

document.addEventListener("DOMContentLoaded", function() {

	//initialize the options page (with default values if necessary)
	initializeForm();

	//hook up the buttons
    document.getElementById("add").addEventListener("click", addMessage);
    document.getElementById("remove").addEventListener("click", removeMessage);
    document.getElementById("save").addEventListener("click", saveOptions);
});

// Ensured that the options page is loaded with the last saved values (or defaults)
function initializeForm(){

	chrome.storage.sync.get(defaultOptions, function(items) {

		document.getElementsByName('notify')[0].checked = items.notifyOption;
		document.getElementsByName('notify')[1].checked = !items.notifyOption;

		document.getElementById('sound').checked = items.soundOption;

		var listboxMsgs = document.getElementById('listboxMsgs');

		for (var i = 0; i < items.mindfulMessages.length; i++) {
			listboxMsgs.add(new Option(items.mindfulMessages[i], items.mindfulMessages[i]));
        }
	});
}

// Add messages to the list box. This list is what will be displayed
// at random times as mindful moments
function addMessage() {
	var textboxMsg = document.getElementById('textboxMsg');
	
	// If the value entered is not empty then add it to
	// the list of mindful moment messages
	if (textboxMsg.value){
		var listboxMsgs = document.getElementById('listboxMsgs');
		listboxMsgs.add(new Option(textboxMsg.value, textboxMsg.value));	
	}
}

// Remove messages from the list box. This list is what will be displayed
// at random times as mindful moments
function removeMessage(){
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

// Saves all of the options set
function saveOptions(){

	var bChromeNotificationEnabled = document.getElementsByName('notify')[0].checked;
	var isSoundEnabled = document.getElementById('sound').checked;
	var optionsMsgs = document.getElementById('listboxMsgs').options;

	// Add all options into an array so they can be used by chrome storage
	var saMsgs = [];
	for (var i = 0; i < optionsMsgs.length; i++) {
		saMsgs.push(optionsMsgs[i].value);
	};

	var storageItems = {
		'notifyOption': bChromeNotificationEnabled, 
		'soundOption': isSoundEnabled, 
		'mindfulMessages': saMsgs
	};

	chrome.storage.sync.set(storageItems, function() {
        
        // Debug output to console
        debugOptions(storageItems);

        // Update status to let user know options were saved.
	    var status = document.getElementById('status');
	    status.textContent = 'Options saved.';

	    // Eventually blank the status message
	    setTimeout(function() {
	      status.textContent = '';
	    }, 750);
    });

	//debug the options set
	debugOptions();
}


/** HELPER METHODS **/

function debugOptions(storageItems) {

	//if no storageItems are specified, then we retrieve the values available from chrome storage
	if(!storageItems) {

		chrome.storage.sync.get(Object.keys(defaultOptions), function (items) {
			storageItems = items;
		});
	}

	//Debug output to console    
	console.log(JSON.stringify(storageItems));
}