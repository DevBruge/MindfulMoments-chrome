
/** CONSTANTS **/
const ALARM_NAME = "mindfulMoments";


/** HELPER METHODS **/

//returns a random integer between @min and @max
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

//prints to the console every alarm that is currently set (name and delay in seconds)
function checkAlarms(isInitial) {
	
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
};

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
};

function NotifyWithConsole() {
	console.log("Hey man, take a break and be mindful!!");
}

function NotifyWithAlert() {
	alert("Hey man, take a break and be mindful!!");
}

function NotifyWithNotificationAPI() {
	var opt = {
		type: "basic",
		title: "Mindful Moments",
		message: "Hey man, take a break and be mindful!!",
		iconUrl: "images/icon.png"
	};

	chrome.notifications.create("takeBreak", opt, function () {});
}

function NotifyWithSound() {
	var audio = new Audio('sounds/Taito_Carousel.wav');
	audio.play();
}

function NotifyUserOfMindfulBreak() {

	//get notification Type from the user's set OPTIONS or use DEFAULT
	var notificationType = "sound";

	switch (notificationType) {
		case "alert":
			NotifyWithAlert();
			break;
		case "notificationAPI":
			NotifyWithNotificationAPI();
			break;
		case "sound":
			NotifyWithSound();
			break;
		default:
			NotifyWithConsole();
			break;
	}
}


/** RUN THE CODE **/

//create the initial alarm (and print its details to the console)
createAlarm(true);
checkAlarms(true);

function alarmHandler(alarm) {
	if(alarm.name == ALARM_NAME) {
		
		NotifyUserOfMindfulBreak();

		//now that the only alarm has run, there is no longer an alarm active,
		//so we create a new alarm in its place
		createAlarm(false);
		checkAlarms(false);
	}
};

chrome.alarms.onAlarm.addListener(alarmHandler);