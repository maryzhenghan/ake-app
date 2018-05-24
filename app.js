
// EDIT/ADD LOG //

// clicking on edit log button
$('.js-todayLogEdit').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogForm').removeClass('hidden');
	$('.js-todayLogDisplay').addClass('hidden');
	$('.js-todayLogEdit').addClass('hidden');

	//	if ($('.js-todayDate').find())
});

// saving edited log w mock data
$('.js-logSaveButton').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogForm').addClass("hidden");

	MOCK_LOGS.recentLogs.push({"id": "555", "entry date": "5/22/2018", "migraine": "yes", "weather": "88F, sunny, humidiy: 90%", "water count (oz)": 78, "skipped meals": "none", "hours of sleep": "23:00 to 07:00", "total hours slept": 8, "notes": "n/a"});

	// take out .empty when using real data, as needed //
	$('.js-todayLogDisplay').empty().append(`<p><h5>05/22/2018</h5>
			<p>Yes migraine.</p>
			<p>Weather in Durham: 88F, sunny, humidiy: 90%</p>
			<p>Water count (oz): 78</p>
			<p>No skipped meals.</p>
			<p>Hours of sleep: 23:00 to 07:00</p>
			<p>Total hours slept: 8</p>`);
	$('.js-todayLogDisplay').removeClass('hidden');
	$('.js-todayLogEdit').removeClass('hidden');
})



// // API SETUP // //

// mock data
let MOCK_LOGS = {
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


// function for setting today's date
function getTodayDate() {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth()+1;
	let yyyy = today.getFullYear();

	if (dd<10) {
		dd = '0'+dd;
	}
	if (mm<10) {
		mm = '0'+mm;
	}

	let todayDate = mm+'/'+dd+'/'+yyyy;
	$('.js-todayDate').text(todayDate);
}


// functions for checking if there's an existing log for today.
// if so, display w edit button. if not, display create log button
function getTodayLog(callbackFn) {
	setTimeout(function() { callbackFn(MOCK_LOGS)}, 50);
}

function displayTodayLog(data) {
	// will later need to sort the objects in the db by date

	/*
	if ( !== todayDate) {
		$('.js-todayLogCreate').addClass('hidden');
		$('.js-todayLogEdit').removeClass('hidden');
		$('.js-todayLog').append(`correct date's data`);
	}
	else {
		$('.js-todayLogCreate').removeClass('hidden');
		$('.js-todayLogEdit').addClass('hidden');
	}
	*/

	$('.js-todayLogDisplay').append(`<p><h5>05/14/2018</h5>
			<p>No migraine.</p>
			<p>Weather in Durham: 77F, cloudy, humidity: 83%</p>
			<p>Water count: 88 oz</p>
			<p>Skipped meals: lunch</p>
			<p>Hours of sleep: 23:00 to 07:00</p>
			<p>Total hours: 8 hours</p>`);
	$('.js-todayLogEdit').removeClass('hidden');
	$('.js-todayLogCreate').addClass('hidden');
}


// function stays the same even when connecting to real API
function getDisplayLogs() {
	getTodayDate(getTodayLog(displayTodayLog));
}

$(getDisplayLogs);