var defaultOptions = {
	"notifyOption": true, 
	"soundOption": false,
	"notifyStartTimeRange": 15,
	"notifyEndTimeRange": 20, 
	"mindfulMessages": [
       "Zen1",
       "Zen2",
       "Zen3",
       "Zen4",
       "Zen5",
       "Zen6",
       "Zen7",
       "Zen8",
       "Zen9",
       "Zen10"
	],
};

document.addEventListener("DOMContentLoaded", function() {

	//initialize the options page (with default values if necessary)
	initializeForm();

	//hook up the buttons
    document.getElementById("add").addEventListener("click", addMessage);
    document.getElementById("remove").addEventListener("click", removeMessage);
    document.getElementById("save").addEventListener("click", saveOptions);
    document.getElementById("reset").addEventListener("click", resetOptionsToDefault);
});

// Ensured that the options page is loaded with the last saved values (or defaults)
function initializeForm(){

	chrome.storage.sync.get(defaultOptions, function(items) {
		updateFormOptions(items);
	});
}

// Update all options html elements
function updateFormOptions(items) {

	// Overwrite notification type option settings
	document.getElementsByName("notify")[0].checked = items.notifyOption;
	document.getElementsByName("notify")[1].checked = !items.notifyOption;

	// Overwrite sound enabled option setting
	document.getElementById("sound").checked = items.soundOption;

	// Overwrite alarm time option settings
	document.getElementById("notifyStartTimeRange").value = items.notifyStartTimeRange;
	document.getElementById("notifyEndTimeRange").value = items.notifyEndTimeRange;

	var listboxMsgs = document.getElementById("listboxMsgs");

	// Clear the list box
	var i = listboxMsgs.length;
	while (i--) {
		listboxMsgs.remove(i);
	}

	// Add the options from 'items' back into the list box
	for (var i = 0; i < items.mindfulMessages.length; i++) {
		listboxMsgs.add(new Option(items.mindfulMessages[i], items.mindfulMessages[i]));
    }
}

// Add messages to the list box. This list is what will be displayed
// at random times as mindful moments
function addMessage() {
	var textboxMsg = document.getElementById("textboxMsg");
	
	// If the value entered is not empty then add it to
	// the list of mindful moment messages
	if (textboxMsg.value){
		var listboxMsgs = document.getElementById("listboxMsgs");
		listboxMsgs.add(new Option(textboxMsg.value, textboxMsg.value));

		//clear the textbox after the entry is added
		textboxMsg.value = "";
	}
}

// Remove messages from the list box. This list is what will be displayed
// at random times as mindful moments
function removeMessage(){
	var listboxMsgs = document.getElementById("listboxMsgs");
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
	
	if(listboxMsgs.options.length) {
		//select the first item in the list for ease of multiple removals
		listboxMsgs.options[0].selected = true;
		listboxMsgs.focus();
		//TODO - there's some visual bug with using down arrow key 
		//after reselection, can't figure out why
	}
}

// Saves all of the options set
function saveOptions(){
	var chromeNotificationEnabled = document.getElementsByName("notify")[0].checked;
	var isSoundEnabled = document.getElementById("sound").checked;
	var optionsMsgs = document.getElementById("listboxMsgs").options;
	var notifyStartTimeRange = document.getElementById("notifyStartTimeRange").value;
	var notifyEndTimeRange = document.getElementById("notifyEndTimeRange").value;

	// Add all options into an array so they can be used by chrome storage
	var saMsgs = [];
	for (var i = 0; i < optionsMsgs.length; i++) {
		saMsgs.push(optionsMsgs[i].value);
	};

	if (validateOptions(notifyStartTimeRange, notifyEndTimeRange, saMsgs)) {

		var storageItems = {
			"notifyOption": chromeNotificationEnabled, 
			"soundOption": isSoundEnabled, 
			"notifyStartTimeRange": notifyStartTimeRange,
			"notifyEndTimeRange": notifyEndTimeRange,
			"mindfulMessages": saMsgs
		};

		chrome.storage.sync.set(storageItems, function() {

	        // Debug output to console
	        debugOptions(storageItems);

	        // Stop old alarm and create a new one based on saved settings
        	chrome.runtime.getBackgroundPage(function(eventPage){
        		eventPage.resetAlarmWithSavedSettings();
        	});

	        // Update status to let user know options were saved.
		    writeStatusMessage("Options saved", false);
	    });

		//debug the options set
		debugOptions();
	}
}

// Resets all of the options to the defaults (doesn't save them automatically though)
function resetOptionsToDefault(){

	updateFormOptions(defaultOptions);
}

// Writes a status message to the screen. Informational or error, which get styled with CSS file
function writeStatusMessage(message, isError) {
	var status = document.getElementById("status");
	var statusError = document.getElementById("statusError");
	var timeout = 1000;

	if (isError) {
	    status.textContent = "";
	    statusError.textContent = message;
	} else {
	    statusError.textContent = "";
		status.textContent = message;

	    // Eventually blank the informational status message
	    setTimeout(function() {
	      status.textContent = "";
	    }, timeout);
	}
}

function validateOptions(notifyStartTimeRange, notifyEndTimeRange, saMsgs) {
	
	var status = true;

	notifyStartTimeRangeAsNumber = Number(notifyStartTimeRange);
	notifyEndTimeRangeAsNumber = Number(notifyEndTimeRange);

	// Ensure that the alarm times have been entered as numbers
	if (isNaN(notifyStartTimeRangeAsNumber) || isNaN(notifyEndTimeRangeAsNumber)) {
		writeStatusMessage("Please enter an alarm time as number of minutes", true);
		status = false;
	} else {
		if (notifyStartTimeRangeAsNumber<1 || notifyEndTimeRangeAsNumber<1) {
			// Ensure that the alarm times are greater than 0
			writeStatusMessage("Please choose an alarm time of 1 minute or more", true);
			status = false;
		} else if (notifyStartTimeRangeAsNumber>notifyEndTimeRangeAsNumber) {
			// Ensure that the start range is less or equal to the end range
			writeStatusMessage('Please ensure "from" alarm time is less than "to" time', true);
			status = false;
		}
	}

	// Ensure that the array is defined and has at least 1
	// message to print in the notification
	if (typeof saMsgs === 'undefined' || saMsgs.length === 0) {
		writeStatusMessage('Please include at least 1 message', true);
		status = false;
	}

	return status;
}

/** HELPER METHODS **/

function debugOptions(storageItems) {

	//if no storageItems are specified, then we retrieve the values available from chrome storage
	if(!storageItems) {

		chrome.storage.sync.get(Object.keys(defaultOptions), function (items) {
			//Debug output to console  
			console.log(JSON.stringify(items));
		});

	} else {
		//Debug output to console    
		console.log(JSON.stringify(storageItems));
	}
}