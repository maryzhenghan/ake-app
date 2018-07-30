// ADD/EDIT LOG //
// new log button on homepage
$('.js-todayLogCreate').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormCreate').removeClass('hidden');
	$('.js-todayLogFormEdit').addClass('hidden');
	$('.js-todayLogCreate').addClass('hidden');

	if ($('#logId').val() !== "") {
		$('.js-todayLogEdit').removeClass('hidden');
	}
});

// clicking on edit log button on homepage
$('.js-todayLogEdit').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormEdit').removeClass('hidden');
	$('.js-todayLogFormCreate').addClass('hidden');
	$('.js-todayLogCreate').removeClass('hidden');
	$('.js-todayLogEdit').addClass('hidden');
});

// saving new log
$('.js-logSaveButton').on("click", function(e) {
	e.preventDefault();
	$('.js-todayLogFormCreate').addClass('hidden');
	$('.js-todayLogDisplay').removeClass('hidden');

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
	clearForm();
	getDisplayLogs();
});

function clearForm() {
	$('.js-todayLogFormCreate input, #skipped-meals, #sleepstart-hr, #sleepstart-min, #sleepend-hr, #sleepend-min, #notes')
  .not('.js-logSaveButton')
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
	.done(data => {
		if (data.logs.length > 0) {
			$('.js-todayLogDisplayYes').removeClass('hidden');
			$('.js-todayLogEdit').removeClass('hidden');
			$('.js-todayLogCreate').removeClass('hidden');

			callbackFn(data.logs[0]);
			callbackFn2(data.logs[0]);
		}

		else {
			let noSettings = {
				url: '/logs',
				method: 'GET'
			}

			$.ajax(noSettings).done(data => {
				$('.js-todayLogDisplayNo').removeClass('hidden');
				$('.js-todayLogCreate').removeClass('hidden');
				$('.js-todayLogDisplayNo').removeClass('hidden');
			});
		}
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
	.done(data => {
		$('.js-todayLogEdit').removeClass('hidden');
		matchEditFields(data);
		return createLogHtml(data);
	});
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
	.done(data => {
		return createLogHtml(data);
	});
}

function createLogHtml(logData) {
	// clock related edits
	let sleepStartHrSplit = logData.sleepStart.split(":");
	let sleepEndHrSplit = logData.sleepEnd.split(":");

	let sleepStartSplit = sleepStartHrSplit[0];
	let sleepStartSplit2 = sleepStartHrSplit[1];

	let sleepEndSplit = sleepEndHrSplit[0];
	let sleepEndSplit2 = sleepEndHrSplit[1];

	if (sleepStartSplit < 10) {
		sleepStartSplit = '0' + sleepStartSplit;
	}
	if (sleepStartSplit2 < 10) {
		sleepStartSplit2 = '0' + sleepStartSplit2;
	}
	if (sleepEndSplit < 10) {
		sleepEndSplit = '0' + sleepEndSplit;
	}
	if (sleepEndSplit2 < 10) {
		sleepEndSplit2 = '0' + sleepEndSplit2;
	}

	let sleepStart12HrClock;
	let sleepEnd12HrClock;

	if (sleepStartSplit < 12) {
		sleepStart12HrClock = "AM";
	}
	else {
		sleepStart12HrClock = "PM";
	}

	if (sleepEndSplit < 12) {
		sleepEnd12HrClock = "AM";
	}
	else {
		sleepEnd12HrClock = "PM";
	}

	// true false migraine
	let migraineYesNo;
	if (logData.migraine === true) {
		migraineYesNo = 'Yes';
	}
	else {
		migraineYesNo = 'No';
	}

	// skippedMeals
	let skippedMealsModified = "";
	let skippedB = "breakfast";
	let skippedL = "lunch";
	let skippedD = "dinner";
	if (logData.skippedMeals.includes('1')) {
		skippedMealsModified += "breakfast ";
	}
	if (logData.skippedMeals.includes('2')) {
		skippedMealsModified += "lunch ";
	}
	if (logData.skippedMeals.includes('3')) {
		skippedMealsModified += "dinner ";
	}

	// if empty Notes
	let notesModified = logData.notes;
	if (logData.notes === "") {
		notesModified = "n/a";
	}

	$('.js-todayLogDisplay').empty().append(`
		<p><h5>${logData.dateAdjusted}</h5>
		<p>Migraine today?: ${migraineYesNo}</p>
		<p>Length of migraine (hours): ${logData.migraineLengthHr}</p>
		<p>Weather description: ${logData.weather}</p>
		<p>Water count (oz): ${logData.water}</p>
		<p>Skipped meals: ${skippedMealsModified}</p>
		<p>Asleep: From ${sleepStartSplit}:${sleepStartSplit2} ${sleepStart12HrClock} to ${sleepEndSplit}:${sleepEndSplit2} ${sleepEnd12HrClock}</p>
		<p>Total hours slept: ${logData.sleepTotal}</p>
		<p>Notes: ${notesModified}</p>`);
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
	let id = data.id;
	let date = `${data.dateAdjusted}`;
	let entryDate = convertDate(date);

	$('#logId').val(id);
	$('#entry-date-edit').val(entryDate);
	$('#migraine-length-edit').val(data.migraineLengthHr);
	$('#weather-edit').val(data.weather);
	$('#water-count-edit').val(data.water);

	if (data.skippedMeals.includes('1')) {
		$('#skippedmeals-edit-1').attr('selected', 'selected');
	}
	if (data.skippedMeals.includes('2')) {
		$('#skippedmeals-edit-2').attr('selected', 'selected');
	}
	if (data.skippedMeals.includes('3')) {
		$('#skippedmeals-edit-3').attr('selected', 'selected');
	}

	let splitStartTime = data.sleepStart.split(":");
	let splitEndTime = data.sleepEnd.split(":");
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

	$('#notes-edit').val(data.notes);
}

// function stays the same even when connecting to real API
function getDisplayLogs() {
	// need to make sure date autofills today's date...
	getTodayLog(createLogHtml, matchEditFields);
}

$(getDisplayLogs);
