'use strict';

const allFields = ['date', 'dateEnd', 'migraineLengthHr', 'weather', 'water', 'skippedMeals', 'sleepStartHr', 'sleepStartMin', 'sleepEndHr', 'sleepEndMin', 'notes'];

$('.js-logFilterButton').on("click", function(e) {
	e.preventDefault();
	$('.js-allLogsContainer').empty();

	// need to create filter options for total hours of sleepEnd
	// need to create filter options for migraine yes/no

	// if those fields are not empty, then need to add a new filter to "filters" object
	// assign variables that get filled into filters...

	let filters = {
		date: $('#entry-date-start-filter').val(),
		dateEnd: $('#entry-date-end-filter').val(),
		migraineLengthHr: $('#migraine-length-filter').val(),
		weather: $('#weather-filter').val(),
		water: $('#water-count-filter').val(),
		skippedMeals: $('#skipped-meals-filter').val(),
		sleepStartHr: $('#sleepstart-hr-filter option:selected').text(),
		sleepStartMin: $('#sleepstart-min-filter option:selected').text(),
		sleepEndHr: $('#sleepend-hr-filter option:selected').text(),
		sleepEndMin: $('#sleepend-min-filter option:selected').text(),
		notes: $('#notes-filter').val()
	}

	let filterParams = "";

	allFields.forEach(field => {
		// CHECK IF RANGE IS EVEN POSSIBLE IN MONGO
		if (!empty(filters[field])) {
			if (field === "date") {
				filterParams += `date=${filters[field]}&`;
			}

			else if (field === "dateEnd") {
				filterParams += `dateEnd=${filters[field]}&`;
			}

			else {
				filterParams += `${field}=${filters[field]}&`;
			}
		}
		return filterParams;
	});

	filterLogs(filterParams, createLogHtml);
});


function empty(value) {
	if(typeof(value) === 'number' || typeof(value) === 'boolean') {
		return false;
	}

	if(typeof(value) === 'undefined' || value === null) {
		return true;
	}

	if(typeof(value.length) !== 'undefined') {
		if(/^[\s]*$/.test(value.toString())) {
			return true;
		}
		return value.length === 0;
	}

	let count = 0;
	for(let i in value) {
		if(value.hasOwnProperty(i)) {
			count ++;
		}
	}
	return count === 0;
}


function filterLogs(params, callbackFn) {
	let settings = {
		url: `/logs?${params}`,
		method: 'GET',
	}

	$.ajax(settings)
	.done(data => {
		callbackFn(data);
	});
}

function getAllLogs(callbackFn) {
	let settings = {
		url: '/logs',
		method: 'GET'
	};

	$.ajax(settings)
	.done(data => {
		callbackFn(data);
	});
}

function createLogHtml(data) {
	data.logs.forEach(logData => {
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

		$('.js-allLogsContainer').append(`
			<p><h5>${logData.dateAdjusted}</h5>
			<p>Migraine today?: ${migraineYesNo}</p>
			<p>Length of migraine (hours): ${logData.migraineLengthHr}</p>
			<p>Weather description: ${logData.weather}</p>
			<p>Water count (oz): ${logData.water}</p>
			<p>Skipped meals: ${skippedMealsModified}</p>
			<p>Asleep: From ${sleepStartSplit}:${sleepStartSplit2} ${sleepStart12HrClock} to ${sleepEndSplit}:${sleepEndSplit2} ${sleepEnd12HrClock}</p>
			<p>Total hours slept: ${logData.sleepTotal}</p>
			<p>Notes: ${notesModified}</p>
			<input type="submit" name="allLogs-edit-button" value="Edit log" class="js-logEditButton">
			<input type="submit" name="allLogs-delete-button" value="Delete log" class="js-logDeleteButton">
			<hr>`);
	});
}

function getDisplayLogs() {
	getAllLogs(createLogHtml);
}

$(getDisplayLogs);
