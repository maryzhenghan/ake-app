const MOCK_ALL_LOGS = {
	"allLogs": [
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
		},
		{
			"id": "666",
			"entry date": "05/15/2018",
			"migraine": "no",
			"migraine length": "n/a",
			"weather": "73F, thunderstorms, humidity: 87%",
			"water count": "90 oz",
			"skipped meals": "no",
			"hours of sleep": "23:30 to 06:45",
			"total hours": "7.25",
			"publishedAt": 201805161532
		},
		{
			"id": "777",
			"entry date": "05/16/2018",
			"migraine": "no",
			"migraine length": "n/a",
			"weather": "75F, thunderstorms, humidity: 86%",
			"water count": "76 oz",
			"skipped meals": "no",
			"hours of sleep": "23:30 to 07:00a",
			"total hours": "7.5",
			"publishedAt": 201805161040
		},
	]
}


function getAllLogs(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_ALL_LOGS)}, 100);
}

// function stays same when connecting to real API later
function displayAllLogs(data) {
	for (index in data.allLogs) {
		let simpJson = JSON.stringify(data.allLogs[index], null, 10);

		$('body').append(
			'<p>' + data.allLogs[index].date + ': ' + data.allLogs[index].migraine + ' migraine' + '</p><p>' + simpJson + '</p>');
	}
}


// function stays the same even when connecting to real API
function getDisplayLogs() {
	getAllLogs(displayAllLogs);
}

$(getDisplayLogs);