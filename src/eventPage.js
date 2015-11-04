
/** HELPER METHODS **/

//returns a random integer between @min and @max
function randomIntFromInterval(min,max)
{
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

	chrome.alarms.create('mindfulMoments', alarmInfo);
};


/** RUN THE CODE **/

//create the initial alarm (and print its details to the console)
createAlarm(true);
checkAlarms(true);

function alarmHandler(alarm) {
	if(alarm.name == "mindfulMoments") {
		
		//now that the only alarm has run, there is no longer an alarm active,
		//so we create a new alarm in its place
		createAlarm(false);
		checkAlarms(false);
	}
};

chrome.alarms.onAlarm.addListener(alarmHandler);