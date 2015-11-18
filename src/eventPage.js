
/** CONSTANTS **/
const ALARM_NAME = "mindfulMoments";


/** RUN THE CODE **/

//create the initial alarm (and print its details to the console)
createAlarm(true);
debugAlarms(true);

chrome.alarms.onAlarm.addListener(alarmHandler);


/** HELPER METHODS **/

//creates an alarm using a random delay (optionally allowing the caller to distinguish
//between the initially set alarm and subsequent ones)
function createAlarm(isInitial) {
	
	//if initial alarm then returns 0.1 or 0.2 which are equivalent to 6 or 12 seconds
	//else, returns 0.15 or 0.25 which are equivalent to 9 or 15 seconds
	var delay = isInitial ? (randomIntFromInterval(1,2)/10) : (randomIntFromInterval(2,3)/10 - 0.05);

	var alarmInfo = {
		"delayInMinutes": delay
	};

	chrome.alarms.create(ALARM_NAME, alarmInfo);
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
			debugAlarms(false);
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

function selectMessage(mindfulMessages) {
	//randomly select a message from the list
	var randomMessageIndex = randomIntFromInterval(0,mindfulMessages.length - 1);
	return mindfulMessages[randomMessageIndex];
}

function playSound() {
	var audio = new Audio('sounds/Taito_Carousel.wav');
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
		imageUrl: "images/zen2.jpg"
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
				var scheduled = (Date.now() - alarms[i].scheduledTime)/1000;
				scheduled = Math.abs(Math.floor(scheduled));

				console.log(prefix + "name:" + theName + ", scheduled: " + scheduled);
			}

		} else {
			console.log(prefix + 'no alarms currently defined');
		}
	});
}