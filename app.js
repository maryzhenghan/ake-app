
// EDIT/ADD LOG //

$('.js-todayLogButton').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogForm').removeClass("hidden");
	$('.js-todayLogButton').addClass("hidden");
});

$('.js-logSaveButton').on("click", function(e) {
	e.preventDefault();

})



// API SETUP //

// mock data
const MOCK_LOGS = {
	"recentLogs": [
		{
			"id": "111",
			"entry date": "05/10/2018",
			"migraine": "yes",
			"migraine length": "3 hours",
			"weather": "88F, sunny, humidity: 90%",
			"water count": "76 oz",
			"skipped meals": "no",
			"hours of sleep": "23:30 to 06:55",
			"total hours": "7.42",
			"notes": "n/a",
			"publishedAt": 201805111737
		},
		{
			"id": "222",
			"entry date": "05/11/2018",
			"migraine": "no",
			"migraine length": "n/a",
			"weather": "73F, overcast, humidity: 86%",
			"water count": "88 oz",
			"skipped meals": "no",
			"hours of sleep": "23:45 to 07:00",
			"total hours": "7.25",
			"notes": "indoors most of the day",
			"publishedAt": 201805121534
		},
		{
			"id": "333",
			"entry date": "05/12/2018",
			"migraine": "no",
			"migraine length": "n/a",
			"weather": "92F, sunny, humidity: 94%",
			"water count": "102 oz",
			"skipped meals": "breakfast - late",
			"hours of sleep": "23:00 to 05:35",
			"total hours": "6.6",
			"notes": "woke up early for sendoff",
			"publishedAt": 201805132203
		},
		{
			"id": "444",
			"entry date": "05/13/2018",
			"migraine": "yes",
			"migraine length": "6 hours",
			"weather": "89F, thunderstorms, humidity: 80%",
			"water count": "90 oz",
			"skipped meals": "no",
			"hours of sleep": "23:35 to 6:55",
			"total hours": "7.33",
			"notes": "migraine probably from waking up early yesterday, or rain/barometric pressure",
			"publishedAt": 201805151310
		},
		{
			"id": "555",
			"entry date": "05/14/2018",
			"migraine": "no",
			"migraine length": "n/a",
			"weather": "77F, cloudy, humidity: 83%",
			"water count": "88 oz",
			"skipped meals": "lunch",
			"hours of sleep": "23:00 to 07:00",
			"total hours": "8",
			"publishedAt": 201805151315
		}
	]
}

function getTodayLog(callbackFn) {
	setTimeout(function() { callbackFn(MOCK_LOGS)}, 50);
}

function displayTodayLog(data) {
	/* let todayLog = data.recentLogs.s... */
	// will later need to find a way to sort the objects in the mock data array by date

	$('.js-todayLog').append(`<p><h5>05/14/2018</h5>
			<p>No migraine.</p>
			<p>Weather in Durham: 77F, cloudy, humidity: 83%</p>
			<p>Water count: 88 oz</p>
			<p>Skipped meals: lunch</p>
			<p>Hours of sleep: 23:00 to 07:00</p>
			<p>Total hours: 8 hours</p>`);
}


function getRecentLogs(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_LOGS)}, 100);
}

// function stays same when connecting to real API later
function displayRecentLogs(data) {
	for (index in data.recentLogs) {
		$('.js-recentLogs').append(
			'<p>' + data.recentLogs[index]['entry date'] + ': ' + data.recentLogs[index].migraine + ' migraine' + '</p>');
	}
}


// function stays the same even when connecting to real API
function getDisplayLogs() {
	getTodayLog(displayTodayLog);
	getRecentLogs(displayRecentLogs);
}

$(getDisplayLogs);