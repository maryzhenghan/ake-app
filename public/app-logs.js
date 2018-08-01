'use strict';

const allFields = ['date', 'dateEnd', 'migraineLengthHr', 'weather', 'water', 'skippedMeals', 'sleepStartHr', 'sleepStartMin', 'sleepEndHr', 'sleepEndMin', 'notes'];

$('.js-logFilterButton').on('click', function(e) {
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

function createEditHandlers(data) {
	data.logs.forEach(logData => {
		// edit log button
		$(`#js-logEditButton-allLogs-${logData.id}`).on('click', function(e) {
			$(`#js-allLogsFormEdit-${logData.id}`).removeClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).addClass('hidden');
		});

		// saving edited log
		$(`#js-logSaveButton-allLogs-${logData.id}`).on('click', function(e) {
			e.preventDefault();
			$(`#js-allLogsFormEdit-${logData.id}`).addClass('hidden');

			let logDataObject = {
				id: $(`#js-allLogsFormEdit-${logData.id} #logId-allLogs`).val(),
				date: $(`#js-allLogsFormEdit-${logData.id} #entry-date-allLogs`).val(),
				migraineLengthHr: $(`#js-allLogsFormEdit-${logData.id} #migraine-length-allLogs`).val(),
				weather: $(`#js-allLogsFormEdit-${logData.id} #weather-allLogs`).val(),
				water: $(`#js-allLogsFormEdit-${logData.id} #water-count-allLogs`).val(),
				skippedMeals: $(`#js-allLogsFormEdit-${logData.id} #skipped-meals-allLogs`).val() || [],
				sleepStartHr: $(`#js-allLogsFormEdit-${logData.id} #sleepstart-hr-allLogs option:selected`).text(),
				sleepStartMin: $(`#js-allLogsFormEdit-${logData.id} #sleepstart-min-allLogs option:selected`).text(),
				sleepEndHr: $(`#js-allLogsFormEdit-${logData.id} #sleepend-hr-allLogs option:selected`).text(),
				sleepEndMin: $(`#js-allLogsFormEdit-${logData.id} #sleepend-min-allLogs option:selected`).text(),
				notes: $(`#js-allLogsFormEdit-${logData.id} #notes-allLogs`).val()
			};

			putLog(logDataObject);
		});

		// cancel on edit form
		$(`#js-logCancelButton-allLogs-${logData.id}`).on('click', function(e) {
			$(`#js-allLogsFormEdit-${logData.id}`).addClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).removeClass('hidden');
			matchEditFields([logData]);
		});

		// delete on edit form
		$(`#js-logDeleteButton-allLogs-${logData.id}`).on('click', function(e) {
			console.log(`yay delete button for log ${logData.id}`);
			$(`#js-allLogsFormEdit-${logData.id}`).addClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).removeClass('hidden');
			$(`#js-allLogsIndividualContainer-${logData.id}`).empty().addClass('hidden');

			deleteLog(logData.id);
		});
	});
}

function matchEditFields(data) {
	data.forEach(data => {
		let id = data.id;
		let date = `${data.dateAdjusted}`;
		let entryDate = convertDate(date);

		$(`#js-allLogsFormEdit-${data.id} #logId-allLogs`).val(id);
		$(`#js-allLogsFormEdit-${data.id} #entry-date-allLogs`).val(entryDate);
		$(`#js-allLogsFormEdit-${data.id} #migraine-length-allLogs`).val(data.migraineLengthHr);
		$(`#js-allLogsFormEdit-${data.id} #weather-allLogs`).val(data.weather);
		$(`#js-allLogsFormEdit-${data.id} #water-count-allLogs`).val(data.water);

		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-1`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-edit-1:selected`).prop('selected', false);
		}
		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-edit-2`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-edit-2:selected`).prop('selected', false);
		}
		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-edit-3`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-edit-3:selected`).prop('selected', false);
		}

		if (data.skippedMeals.includes('1')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-1:selected`).attr('selected', 'selected');
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-1:selected`).prop('selected', true);
		}
		if (data.skippedMeals.includes('2')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-2:selected`).attr('selected', 'selected');
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-2:selected`).prop('selected', true);
		}
		if (data.skippedMeals.includes('3')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-3:selected`).attr('selected', 'selected');
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-3:selected`).prop('selected', true);
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

		$(`#js-allLogsFormEdit-${data.id} #sleepstart-allLogs-hr${convertedStartHr}`).attr('selected', 'selected');
		$(`#js-allLogsFormEdit-${data.id} #sleepstart-allLogs-hr${convertedStartHr}`).prop('selected', true);

		$(`#js-allLogsFormEdit-${data.id} #sleepstart-allLogs-min${convertedStartMin}`).attr('selected', 'selected');
		$(`#js-allLogsFormEdit-${data.id} #sleepstart-allLogs-min${convertedStartMin}`).prop('selected', true);

		$(`#js-allLogsFormEdit-${data.id} #sleepend-allLogs-hr${convertedEndHr}`).attr('selected', 'selected');
		$(`#js-allLogsFormEdit-${data.id} #sleepend-allLogs-hr${convertedEndHr}`).prop('selected', true);

		$(`#js-allLogsFormEdit-${data.id} #sleepend-allLogs-min${convertedEndMin}`).attr('selected', 'selected');
		$(`#js-allLogsFormEdit-${data.id} #sleepend-allLogs-min${convertedEndMin}`).prop('selected', true);

		$(`#js-allLogsFormEdit-${data.id} #notes-allLogs`).val(data.notes);
	});
}

function createLogHtml(data) {
	$('.js-allLogsContainer').empty();

	data.logs.forEach(logData => {
		let logDataId = logData.id;

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
		if (!(logData.skippedMeals.includes('1')) && !(logData.skippedMeals.includes('2')) && !(logData.skippedMeals.includes('3'))) {
			skippedMealsModified = "n/a";
		}

		// if empty Notes
		let notesModified = logData.notes;
		if (logData.notes === "") {
			notesModified = "n/a";
		}

		$('.js-allLogsContainer').append(`
			<div class="allLogsIndividualContainer" id="js-allLogsIndividualContainer-${logDataId}">
				<h5>${logData.dateAdjusted}</h5>

				<p>Migraine today?: ${migraineYesNo}</p>
				<p>Length of migraine (hours): ${logData.migraineLengthHr}</p>
				<p>Weather description: ${logData.weather}</p>
				<p>Water count (oz): ${logData.water}</p>
				<p>Skipped meals: ${skippedMealsModified}</p>
				<p>Asleep: From ${sleepStartSplit}:${sleepStartSplit2} ${sleepStart12HrClock} to ${sleepEndSplit}:${sleepEndSplit2} ${sleepEnd12HrClock}</p>
				<p>Total hours slept: ${logData.sleepTotal}</p>
				<p>Notes: ${notesModified}</p>

				<div class="allLogsFormEdit hidden" id="js-allLogsFormEdit-${logDataId}">
					<form>
						<fieldset>
							<legend>Log Editor</legend>

							<input type="hidden" id="logId-allLogs" name="logId-allLogs" value="${logData.id}">
							<label for="entry-date-allLogs">Entry date:</label><input type="date" id="entry-date-allLogs" min="2018-01-01" required><br>

							<label for="migraine-length-allLogs">Migraine Length (hours):</label><input type="text" id="migraine-length-allLogs"><br>
							<label for="weather-allLogs">Weather description:</label><input type="text" id="weather-allLogs"><br>
							<label for="water-count-allLogs">Water count (oz):</label><input type="text" id="water-count-allLogs"><br>

							<label for="skipped-meals-allLogs">Skipped meals (select all that apply):</label>
							<select id="skipped-meals-allLogs" name="skipped-meals-allLogs" size="3" multiple>
								<option value="1" id="skippedmeals-allLogs-1">Breakfast</object>
								<option value="2" id="skippedmeals-allLogs-2">Lunch</object>
								<option value="3" id="skippedmeals-allLogs-3">Dinner</object>
							</select>
							<br>

							<label for="sleepstart-hr-allLogs">Went to bed last night at:</label>
							<select id="sleepstart-hr-allLogs" name="sleepstart-hr-allLogs"><br>
								<option value="xx" id="sleepstart-allLogs-hrxx"></option>
								<option value="00" id="sleepstart-allLogs-hr00">00</option>
								<option value="01" id="sleepstart-allLogs-hr01">01</option>
								<option value="02" id="sleepstart-allLogs-hr02">02</option>
								<option value="03" id="sleepstart-allLogs-hr03">03</option>
								<option value="04" id="sleepstart-allLogs-hr04">04</option>
								<option value="05" id="sleepstart-allLogs-hr05">05</option>
								<option value="06" id="sleepstart-allLogs-hr06">06</option>
								<option value="07" id="sleepstart-allLogs-hr07">07</option>
								<option value="08" id="sleepstart-allLogs-hr08">08</option>
								<option value="09" id="sleepstart-allLogs-hr09">09</option>
								<option value="10" id="sleepstart-allLogs-hr10">10</option>
								<option value="11" id="sleepstart-allLogs-hr11">11</option>
								<option value="12" id="sleepstart-allLogs-hr12">12</option>
								<option value="13" id="sleepstart-allLogs-hr13">13</option>
								<option value="14" id="sleepstart-allLogs-hr14">14</option>
								<option value="15" id="sleepstart-allLogs-hr15">15</option>
								<option value="16" id="sleepstart-allLogs-hr16">16</option>
								<option value="17" id="sleepstart-allLogs-hr17">17</option>
								<option value="18" id="sleepstart-allLogs-hr18">18</option>
								<option value="19" id="sleepstart-allLogs-hr19">19</option>
								<option value="20" id="sleepstart-allLogs-hr20">20</option>
								<option value="21" id="sleepstart-allLogs-hr21">21</option>
								<option value="22" id="sleepstart-allLogs-hr22">22</option>
								<option value="23" id="sleepstart-allLogs-hr23">23</option>
							</select>

							<label for="sleepstart-min-allLogs">:</label>
							<select id="sleepstart-min-allLogs" name="sleepstart-min-allLogs"><br>
								<option value="xx" id="sleepstart-allLogs-minxx"></option>
								<option value="00" id="sleepstart-allLogs-min00">00</option>
								<option value="15" id="sleepstart-allLogs-min15">15</option>
								<option value="30" id="sleepstart-allLogs-min30">30</option>
								<option value="45" id="sleepstart-allLogs-min45">45</option>
							</select>

							<label for="sleepend-hr-allLogs">Woke up this morning at:</label>
							<select id="sleepend-hr-allLogs" name="sleepsend-hr-allLogs"><br>
								<option value="xx" id="sleepend-allLogs-hrxx"></option>
								<option value="00" id="sleepend-allLogs-hr00">00</option>
								<option value="01" id="sleepend-allLogs-hr01">01</option>
								<option value="02" id="sleepend-allLogs-hr02">02</option>
								<option value="03" id="sleepend-allLogs-hr03">03</option>
								<option value="04" id="sleepend-allLogs-hr04">04</option>
								<option value="05" id="sleepend-allLogs-hr05">05</option>
								<option value="06" id="sleepend-allLogs-hr06">06</option>
								<option value="07" id="sleepend-allLogs-hr07">07</option>
								<option value="08" id="sleepend-allLogs-hr08">08</option>
								<option value="09" id="sleepend-allLogs-hr09">09</option>
								<option value="10" id="sleepend-allLogs-hr10">10</option>
								<option value="11" id="sleepend-allLogs-hr11">11</option>
								<option value="12" id="sleepend-allLogs-hr12">12</option>
								<option value="13" id="sleepend-allLogs-hr13">13</option>
								<option value="14" id="sleepend-allLogs-hr14">14</option>
								<option value="15" id="sleepend-allLogs-hr15">15</option>
								<option value="16" id="sleepend-allLogs-hr16">16</option>
								<option value="17" id="sleepend-allLogs-hr17">17</option>
								<option value="18" id="sleepend-allLogs-hr18">18</option>
								<option value="19" id="sleepend-allLogs-hr19">19</option>
								<option value="20" id="sleepend-allLogs-hr20">20</option>
								<option value="21" id="sleepend-allLogs-hr21">21</option>
								<option value="22" id="sleepend-allLogs-hr22">22</option>
								<option value="23" id="sleepend-allLogs-hr23">23</option>
							</select>

							<label for="sleepend-min-allLogs">:</label>
							<select id="sleepend-min-allLogs" name="sleepend-min-allLogs"><br>
								<option value="00" id="sleepend-allLogs-minxx"></option>
								<option value="00" id="sleepend-allLogs-min00">00</option>
								<option value="15" id="sleepend-allLogs-min15">15</option>
								<option value="30" id="sleepend-allLogs-min30">30</option>
								<option value="45" id="sleepend-allLogs-min45">45</option>
							</select>

							<label for="notes-allLogs">Additional notes:</label><textarea id="notes-allLogs"></textarea><br>

							<input type="submit" name="save-button-allLogs-${logDataId}" value="Save" class="logSaveButton-allLogs" id="js-logSaveButton-allLogs-${logDataId}">
							<button type="button" name="cancel-button-allLogs-${logDataId}" class="logCancelButton-allLogs" id="js-logCancelButton-allLogs-${logDataId}">Cancel</button>
							<button type="button" name="delete-button-allLogs-${logDataId}" class="logDeleteButton-allLogs" id="js-logDeleteButton-allLogs-${logDataId}">Delete log</button>
						</fieldset>
					</form>
				</div>

				<button type="button" name="edit-button-allLogs-${logDataId}" class="logEditButton-allLogs" id="js-logEditButton-allLogs-${logDataId}">Edit log</button>
				<hr>
			</div>`);
	});
}

function putLog(logData) {
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
		return getDisplayLogs();
	});
}

function deleteLog(logId) {
	let settings = {
		url: `/logs/${logId}`,
		method: 'DELETE'
	};

	$.ajax(settings)
	.done();
}

function getAllLogs(callbackFn, callbackFn2, callbackFn3) {
	let settings = {
		url: '/logs',
		method: 'GET'
	};

	$.ajax(settings)
	.done(data => {
		callbackFn(data);
		callbackFn2(data.logs);
		callbackFn3(data);
	});
}

function getDisplayLogs() {
	getAllLogs(createLogHtml, matchEditFields, createEditHandlers);
}

$(getDisplayLogs);
