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