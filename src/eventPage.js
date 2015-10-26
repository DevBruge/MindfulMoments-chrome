
// // alert('start');
// var millisecondsToWait = 2000;
// var counter = 5;
// for(var i = 0; i < counter; i++) {

// 	setTimeout(function() {
// 	    alert('hello world ' + i);
// 	}, millisecondsToWait);
// }

// alert('finish');

function getRandomNumberOfMinutes(){
	// return Math.floor((Math.random() * 10) + 1);
	//var time = Math.random();
	var time = 0.1;
	alert(time);
	return time;
};

function getRandomNumberOfMinutes2(){
	// return Math.floor((Math.random() * 10) + 1);
	//var time = Math.random();
	var time = 0.2;
	alert(time);
	return time;
};

var alarmInfo = {
	// "when": Date.now() + 10000,
	"delayInMinutes": getRandomNumberOfMinutes()
	// "periodInMinutes": 0.1
};

chrome.alarms.create('mindfulMoments', alarmInfo);

function alarmHandler(alarm) {
	if(alarm.name == "mindfulMoments") {
		alert("take a breather, brugge!");
		//var userResponse = alert("take a breather, brugge!");
		// alert('user response is ' + userResponse);

		chrome.alarms.clear("mindfulMoments", function(wasCleared) {
			if(wasCleared){
				var alarmInfo2 = {
					// "when": Date.now() + 10000,
					"delayInMinutes": getRandomNumberOfMinutes2()
					// "periodInMinutes": 0.1
				};

				chrome.alarms.create('mindfulMoments', alarmInfo2);
			}
			else
			{
				alert('not cleared???');
			}
		});
	}
};

chrome.alarms.onAlarm.addListener(alarmHandler);