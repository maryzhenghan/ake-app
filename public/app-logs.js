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
		// might need to add the "|| []" part to skippedMeals
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

	filterLogs(filterParams, displayLogs);
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

function displayLogs(data) {
	for (let i in data.logs) {
		let simpJson = JSON.stringify(data.logs[i], null, "\t");

		$('.js-allLogsContainer').append(
			`<p>${data.logs[i].dateAdjusted}:</p>
			<p>${simpJson}</p>
			<hr>
			`);
	}

}

function getDisplayLogs() {
	getAllLogs(displayLogs);
}

$(getDisplayLogs);
