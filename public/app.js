// ADD/EDIT LOG //
// new log button on homepage
$('.js-todayLogCreate').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormCreate').removeClass('hidden');
	$('.js-todayLogFormEdit').addClass('hidden');
	$('.js-todayLogCreate').addClass('hidden');
})

// clicking on edit log button on homepage
$('.js-todayLogEdit').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormEdit').removeClass('hidden');
	$('.js-todayLogFormCreate').addClass('hidden');
	$('.js-todayLogDisplay').addClass('hidden');
	$('.js-todayLogEdit').addClass('hidden');
});

// saving new log
$('.js-logSaveButton').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormCreate').addClass('hidden');
	$('.js-todayLogDisplay').removeClass('hidden');
	$('.js-todayLogEdit').removeClass('hidden');

	let logDataObject = {
		date: $('#entry-date').val(),
		migraineLengthHr: $('#migraine-length').val(),
		weather: $('#weather').val(),
		water: $('#water-count').val(),
		skippedMeals: $('#skipped-meals').val() || [],
		sleepStartHr: $('#sleepstart-hr option:selected').text(),
		sleepStartMin: $('#sleepstart-min option:selected').text(),
		sleepEndHr: $('#sleepend-hr option:selected').text(),
		sleepEndMin: $('#sleepend-min option:selected').text(),
		notes: $('#notes').val()
	};

	postNewLog(logDataObject);

	// // take out .empty when using real data, as needed //
	$('.js-todayLogDisplay').empty().append(`<p><h5>fake log</h5>
			<p>Yes migraine.</p>
			<p>Weather in Durham: 88F, sunny, humidiy: 90%</p>
			<p>Water count (oz): 78</p>
			<p>No skipped meals.</p>
			<p>Hours of sleep: 23:00 to 07:00</p>
			<p>Total hours slept: 8</p>`);

	clearForm();
	getDisplayLogs();
});

// saving edited log
$('.js-logSaveButton-edit').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormEdit').addClass('hidden');
	// $('.js-todayLogCreate').addClass('hidden');
	$('.js-todayLogDisplay').removeClass('hidden');
	$('.js-todayLogEdit').removeClass('hidden');

	let logDataObject = {
		id: $('#logId').val(),
		date: $('#entry-date-edit').val(),
		migraineLengthHr: $('#migraine-length-edit').val(),
		weather: $('#weather-edit').val(),
		water: $('#water-count-edit').val(),
		skippedMeals: $('#skipped-meals-edit').val() || [],
		sleepStartHr: $('#sleepstart-hr-edit option:selected').text(),
		sleepStartMin: $('#sleepstart-min-edit option:selected').text(),
		sleepEndHr: $('#sleepend-hr-edit option:selected').text(),
		sleepEndMin: $('#sleepend-min-edit option:selected').text(),
		notes: $('#notes-edit').val()
	};

	putNewLog(logDataObject);

	// take out .empty when using real data, as needed //
	$('.js-todayLogDisplay').empty().append(`<p><h5>fake log</h5>
			<p>Yes migraine.</p>
			<p>Weather in Durham: 88F, sunny, humidiy: 90%</p>
			<p>Water count (oz): 78</p>
			<p>No skipped meals.</p>
			<p>Hours of sleep: 23:00 to 07:00</p>
			<p>Total hours slept: 8</p>`);

	getDisplayLogs();
});

function clearForm() {
	$(':input','.js-todayLogFormCreate')
  .not(':button, :submit, :reset')
  .val('')
  .removeAttr('checked')
  .removeAttr('selected');
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

	return todayDate;
}


function getRequestFormatDate(todayDate) {
	let splitTodayDate = todayDate.split('/');

	let mm = splitTodayDate[0];
	let dd = splitTodayDate[1];
	let yyyy = splitTodayDate[2];

	let requestFormatDate = `${yyyy}-${mm}-${dd}`;
	return requestFormatDate;
}

// functions for checking if there's an existing log for today.
// if so, display w edit button. if not, display create log button
function getTodayLog(callbackFn, callbackFn2) {
	let todayDate = getTodayDate();
	let requestFormatDate = getRequestFormatDate(todayDate);

	let settings = {
		url: `/logs?date=${requestFormatDate}`,
		method: 'GET'
	};

	$.ajax(settings)
	.done(function(data) {
		if (data.logs.length > 0) {
			$('.js-todayLogDisplayYes').removeClass('hidden');
			$('.js-todayLogEdit').removeClass('hidden');
			$('.js-todayLogCreate').removeClass('hidden');

			callbackFn(data);
			callbackFn2(data);
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
				// should create a auto-fill date with today's date in the form if no form exists

				callbackFn(data);
			});
		}
	// setTimeout(function() { callbackFn(currentLog)}, 50);
});
}

function postNewLog(logData) {
	let settings = {
		url: '/logs',
		method: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(logData),
	};

	$.ajax(settings)
	.done();
}

function putNewLog(logData) {
	let id = logData.id;
	let settings = {
		url: `/logs/${id}`,
		method: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(logData),
	};

	$.ajax(settings)
	.done();
}

function createLogHtml() {
	// creating ONE log the way it should be


}

function combineLogs(logData) {
	// map each log via createLogHtml and .join after
	// return string of HTML


}



function displayTodayLog(data) {
	let log = data.logs[0];
	let stringifiedMeals = JSON.stringify(data.logs[0].skippedMeals[0]);
	// need to slice the quotes off the meal.
	// and map to each meal
	$('.js-todayLogDisplayYes').append(`<p><h5>${log.dateAdjusted}</h5>
			<p>Migraine: ${log.migraine}</p>
			<p>Migraine length: ${log.migraineLengthHr}</p>
			<p>Water count: ${log.water} oz</p>
			<p>Skipped meals: ${stringifiedMeals}</p>
			<p>Went to bed at ${log.sleepStart}</p>
			<p>Woke up at ${log.sleepEnd}</p>
			<p>Total hours slept: ${log.sleepTotal}</p>`);
}

function convertDate(date) {
	let splitDate = date.split("/");
	let combineDate = `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;

	return combineDate;
}

function convertTime(splitTime) {
	if (splitTime < 10) {
		return `0${splitTime}`;
	}

	else {
		return splitTime;
	}
}

function matchEditFields(data) {

	let id = data.logs[0].id;
	let log = data.logs[0];
	let date = `${data.logs[0].dateAdjusted}`;
	let entryDate = convertDate(date);

	$('#logId').val(id);
	$('#entry-date-edit').val(entryDate);
	$('#migraine-length-edit').val(log.migraineLengthHr);
	$('#weather-edit').val(log.weather);
	$('#water-count-edit').val(log.water);

	if (log.skippedMeals.includes('1')) {
		$('#skippedmeals-edit-1').attr('selected', 'selected');
	}
	if (log.skippedMeals.includes('2')) {
		$('#skippedmeals-edit-2').attr('selected', 'selected');
	}
	if (log.skippedMeals.includes('3')) {
		$('#skippedmeals-edit-3').attr('selected', 'selected');
	}

	let splitStartTime = log.sleepStart.split(":");
	let splitEndTime = log.sleepEnd.split(":");
	let startHr = splitStartTime[0];
	let startMin = splitStartTime[1];
	let endHr = splitEndTime[0];
	let endMin = splitEndTime[1];

	let convertedStartHr = convertTime(startHr);
	let convertedStartMin = convertTime(startMin);
	let convertedEndHr = convertTime(endHr);
	let convertedEndMin = convertTime(endMin);

	$(`#sleepstart-edit-hr${convertedStartHr}`).attr('selected', 'selected');
	$(`#sleepstart-edit-min${convertedStartMin}`).attr('selected', 'selected');
	$(`#sleepend-edit-hr${convertedEndHr}`).attr('selected', 'selected');
	$(`#sleepend-edit-min${convertedEndMin}`).attr('selected', 'selected');

	$('#notes-edit').val(log.notes);
}

// function stays the same even when connecting to real API
function getDisplayLogs() {
	// need to make sure date autofills today's date...
	getTodayLog(displayTodayLog, matchEditFields);
}

$(getDisplayLogs);
