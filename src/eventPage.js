
/** CONSTANTS **/
const ALARM_NAME = "mindfulMoments";

const defaultOptions = {
	"notifyOption": true, 
	"soundOption": false,
	"notifyStartTimeRange": 15,
	"notifyEndTimeRange": 20, 
	"mindfulMessages": [
       "Be grateful... and take a slow deep breath",
       "Be kind... and take a slow deep breath",
       "Take 5 slow deep breaths",
       "Be mindful of the present... and take a slow deep breath",
       "Let go of all distractions... and take a slow deep breath"
	],
};

/** RUN THE CODE **/

chrome.runtime.onInstalled.addListener(loadOptionsOnInstall);
chrome.alarms.onAlarm.addListener(alarmHandler);

//create the initial alarm (and print its details to the console)
createAlarm(true);


/** HELPER METHODS **/

//load the options page on first installed
function loadOptionsOnInstall(details){

	if(details.reason == "install"){
		chrome.runtime.openOptionsPage();
	}
}

//creates an alarm using the delay parameters configured in the options page
function createAlarm(isInitial) {
	
	chrome.storage.sync.get(defaultOptions, function (delayOptions) {

		var minMinutes = parseInt(delayOptions.notifyStartTimeRange);
		var maxMinutes = parseInt(delayOptions.notifyEndTimeRange);

		var delay; 

		if(minMinutes == maxMinutes) {
			delay = minMinutes;
		} else {
			delay = randomIntFromInterval(minMinutes, maxMinutes);
		}

		var alarmInfo = {
			"delayInMinutes": delay
		};

		chrome.alarms.create(ALARM_NAME, alarmInfo);
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
		
		chrome.storage.sync.get(defaultOptions, function (options) {
			
			if(Object.keys(options).length === 0) {
				throw "Default OPTIONS cannot be retrieved";
			}

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