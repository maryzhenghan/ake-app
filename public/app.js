// EDIT/ADD LOG //

// clicking on edit log button on homepage
$('.js-todayLogEdit').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogForm').removeClass('hidden');
	$('.js-todayLogDisplay').addClass('hidden');
	$('.js-todayLogEdit').addClass('hidden');
});

// saving edited log w mock data
$('.js-logSaveButton').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogForm').addClass("hidden");

	MOCK_LOGS.recentLogs.push({"id": "555", "date": "5/22/2018", "migraine": "yes", "weather": "88F, sunny, humidiy: 90%", "water count (oz)": 78, "skipped meals": "none", "hours of sleep": "23:00 to 07:00", "total hours slept": 8, "notes": "n/a"});

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

	return todayDate;
}

// functions for checking if there's an existing log for today.
// if so, display w edit button. if not, display create log button
function getTodayLog(callbackFn) {

	let todayDate = getTodayDate();
	let settings = {
		url: `/logs?date=${todayDate}`,
		method: 'GET'
	};

	$.ajax(settings)
	.done(function(data) {
		if (data.logs.length > 0) {
			$('.js-todayLogDisplayYes').removeClass('hidden');
			$('.js-todayLogEdit').removeClass('hidden');

			return callbackFn(data);
		}

		else {
			let noSettings = {
				url: '/logs',
				method: 'GET'
			}

			$.ajax(noSettings).done(function(data) {
				$('.js-todayLogDisplayNo').removeClass('hidden');
				$('.js-todayLogDisplayPast').append(combineLogs(data.logs));
				$('.js-todayLogCreate').removeClass('hidden');

				return callbackFn(data);
			});
		}
	/*if (data. === null) {
		$('.js-todayLogCreate').addClass('hidden');
		$('.js-todayLogEdit').removeClass('hidden');
		$('.js-todayLog').append(`correct date's data`);
	}
	else {
		$('.js-todayLogCreate').removeClass('hidden');
		$('.js-todayLogEdit').addClass('hidden');
	}

	setTimeout(function() { callbackFn(currentLog)}, 50);
	*/
});
}

function createLogHtml() {
	// creating ONE log the way it should be


}

function combineLogs(logData) {
	// map each log via createLogHtml and .join after
	// return string of HTML


}



function displayTodayLog(data) {
	JSON.stringify(data);
	$('.js-todayLogDisplayYes').append(`<p><h5>${data.logs[0].dateAdjusted}</h5>
			<p>${data.logs[0].migraine} migraine.</p>
			<p>Water count: ${data.logs[0].water} oz</p>
			<p>Skipped meals: ${data.logs[0].skippedMeals}</p>
			<p>Went to bed at ${data.logs[0].sleepStart}</p>
			<p>Woke up at ${data.logs[0].sleepEnd}</p>/
			<p>Total hours slept: ${data.logs[0].sleepTotal}</p>`);

	//	if ($('.js-todayDate').find())

	$('#entry-date').val("2018-05-24");
	$('#migraine-yes').prop('checked', false);
	$('#migraine-no').prop('checked', true);
	$('#migraine-length').val(8);
	$('#weather').val("77F, cloudy, humidity: 83%");
	$('#water-count').val(88);
//	$('#skipped-meals').
}


// function stays the same even when connecting to real API
function getDisplayLogs() {
	getTodayLog(displayTodayLog);
}

$(getDisplayLogs);
