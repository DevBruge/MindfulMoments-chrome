
/** CONSTANTS **/
const ALARM_NAME = "mindfulMoments";


/** RUN THE CODE **/

chrome.runtime.onInstalled.addListener(loadOptionsOnInstall);
chrome.alarms.onAlarm.addListener(alarmHandler);

//create the initial alarm (and print its details to the console)
createAlarm(true);


/** HELPER METHODS **/

//load the options page on first installed
function loadOptionsOnInstall(details){

	console.log("OnInstalledReason: " + details.reason);

	if(details.reason == "install"){
		chrome.runtime.openOptionsPage();
	}
}

//creates an alarm using the delay parameters configured in the options page
function createAlarm(isInitial) {
	
	chrome.storage.sync.get(["notifyStartTimeRange", "notifyEndTimeRange"], function (delayOptions) {

		var minMinutes = parseInt(delayOptions.notifyStartTimeRange);
		var maxMinutes = parseInt(delayOptions.notifyEndTimeRange);

		console.log("minMinutes: " + minMinutes + ", maxMinutes: " + maxMinutes);

		var delay; 

		if(minMinutes == maxMinutes) {
			delay = minMinutes;
		} else {
			delay = randomIntFromInterval(minMinutes, maxMinutes);
		}

		var alarmInfo = {
			"delayInMinutes": delay
		};

		console.log(JSON.stringify(alarmInfo));

		chrome.alarms.create(ALARM_NAME, alarmInfo);
		debugAlarms(isInitial);		
	});
}

function stopAlarm() {
	// Clear all the alarms (even though there is only 1 at a time)
	chrome.alarms.clearAll(function(wasCleared) {
		return wasCleared;
	});
}

function alarmHandler(alarm) {
	
	if(alarm.name == ALARM_NAME) {
		
		//TODO don't retrieve options for each alarm
		//perhaps it's better to check a flag in background.html 
		//that is turn on if options were changed, and once we update this file's representation of the options
		//we turn off that flag
		chrome.storage.sync.get(["notifyOption", "soundOption", "mindfulMessages"], function (options) {
			
			if(Object.keys(options).length === 0) {
				throw "TODO - default OPTIONS not yet set";
			}

			//Debug output to console  
			console.log(JSON.stringify(options));

			notifyUserOfMindfulBreak(options);

			//now that the only alarm has run, there is no longer an alarm active,
			//so we create a new alarm in its place
			createAlarm(false);
		});
	}
}

function notifyUserOfMindfulBreak(options) {

	if(options.soundOption)
		playSound();

	var message = selectMessage(options.mindfulMessages);

	if(options.notifyOption) {
		notifyWithChromeNotifications(message);
	} else {
		notifyWithAlert(message);
	}
}

function resetAlarmWithSavedSettings() {
	// stop existing alarm and start a new one
	stopAlarm();
	createAlarm(false);
}

function selectMessage(mindfulMessages) {
	//randomly select a message from the list
	var randomMessageIndex = randomIntFromInterval(0,mindfulMessages.length - 1);
	return mindfulMessages[randomMessageIndex];
}

function playSound() {
	var audio = new Audio('sounds/zen1.mp3');
	audio.play();
}

function notifyWithAlert(message) {
	alert(message);
}

function notifyWithChromeNotifications(message) {
	//chrome.notifications.clear("takeBreak", function () {});

	var opt = {
		type: "image",
		title: "Mindful Moments",
		message: message,
		iconUrl: "images/icon.png",
		imageUrl: "images/notificationImages/zen1.jpg"
	};

	chrome.notifications.create("takeBreak", opt, function () {});
}


//returns a random integer between @min and @max
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

//prints to the console every alarm that is currently set (name and delay in seconds)
function debugAlarms(isInitial) {
	
	chrome.alarms.getAll(function(alarms) {

		var prefix = isInitial ? "**INITIAL- " : "";

		if(alarms && alarms.length > 0) {

			for(var i=0; i<alarms.length; i++) {

				var theName = alarms[i].name;
				var delayInMilliseconds = alarms[i].scheduledTime - new Date();
				var delayInSeconds = Math.ceil(delayInMilliseconds / 1000);
				var delayInMins = delayInSeconds / 60;

				console.log(prefix + "Alarm name - " + theName + ", scheduled (in mins) - " + delayInMins);
			}

		} else {
			console.log(prefix + 'No alarms currently defined');
		}
	});
}