'use strict';

const allFields = ['date', 'dateEnd', 'migraineYesNo', 'migraineLengthHr', 'weather', 'water', 'skippedMeals', 'sleepTotalRange', 'sleepStartHr', 'sleepStartMin', 'sleepEndHr', 'sleepEndMin', 'notes'];

// MAIN CLICK HANDLERS

// filter button
$('.js-logFilterButton').on('click', function(e) {
	$('.js-allLogsContainer').empty();

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

	filterLogs(filterParams, createLogHtml, createEditHandlers);
});

// reset button
$('.js-logResetButton').on('click', function(e) {
	clearForm();
});

// MISC FUNCTIONS

function clearForm() {
	$('.js-allLogsForm input, #migraine-yesno-filter, #skipped-meals-filter, #sleeprange-filter, #sleepstart-hr-filter, #sleepstart-min-filter, #sleepend-hr-filter, #sleepend-min-filter, #notes-filter')
  .not('.js-logFilterButton, .js-logResetButton')
  .val('')
  .removeAttr('checked')
  .removeAttr('selected')
	.prop('checked', false);
}

function empty(value) {
	if(typeof(value) === 'number' || (typeof(value) === 'boolean')) {
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

// DATA MANIPULATION FUNCTIONS

function createEditHandlers(data) {
	data.logs.forEach(logData => {
		// edit log button
		$(`#js-logEditButton-allLogs-${logData.id}`).on('click', function(e) {
			$(`#js-allLogsFormEdit-${logData.id}`).removeClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).addClass('hidden');
		});

		// save edited log button
		$(`#js-logSaveButton-allLogs-${logData.id}`).on('click', function(e) {
			e.preventDefault();
			$(`#js-allLogsFormEdit-${logData.id}`).addClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).removeClass('hidden');

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

		// cancel edit button
		$(`#js-logCancelButton-allLogs-${logData.id}`).on('click', function(e) {
			$(`#js-allLogsFormEdit-${logData.id}`).addClass('hidden');
			$(`#js-logEditButton-allLogs-${logData.id}`).removeClass('hidden');
			matchEditFields([logData]);
		});

		// delete button
		$(`#js-logDeleteButton-allLogs-${logData.id}`).on('click', function(e) {
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

		// skipped meals
		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-1`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-1:selected`).prop('selected', false);
		}
		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-2`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-2:selected`).prop('selected', false);
		}
		if ($(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-3`).prop('selected')) {
			$(`#js-allLogsFormEdit-${data.id} #skippedmeals-allLogs-3:selected`).prop('selected', false);
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

		// sleep times
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

		// notes
		$(`#js-allLogsFormEdit-${data.id} #notes-allLogs`).val(data.notes);
	});
}

function createLogHtml(data) {
	$('.js-allLogsContainer').empty();

	data.logs.forEach(logData => {
		let logDataId = logData.id;

		// sleep times display
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

		// migraine: true false
		let migraineYesNo;
		if (logData.migraine === true) {
			migraineYesNo = 'Yes';
		}
		else {
			migraineYesNo = 'No';
		}

		// weather description
		let weatherDescription;
		if (logData.weather === "") {
			weatherDescription = "n/a";
		}
		else {
			weatherDescription = logData.weather;
		}

		// water count
		let waterCount;
		if (empty(logData.water)) {
			waterCount = 'n/a';
		}
		else {
			waterCount = logData.water;
		}

		// skipped meals
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

		// notes
		let notesModified = logData.notes;
		if (logData.notes === "") {
			notesModified = "n/a";
		}

		// append HTML
		$('.js-allLogsContainer').append(`
			<hr>
			<div class="log-box" id="js-allLogsIndividualContainer-${logDataId}">
				<div class="log-contents">
					<div class="log-date"><h5>${logData.dateAdjusted}</h5></div>

					<h6 class="top-field">Migraine?</h6>
					<span class="log-migraineYesNo log-fieldBorder border-purple">${migraineYesNo}</span>

					<h6>Length of migraine <p class="italics">(hours)</p></h6>
					<span class="log-migraineLengthHr log-fieldBorder border-purple">${logData.migraineLengthHr}</span>

					<h6>Weather description</h6>
					<span class="log-weatherDescription log-fieldBorder border-lightblue">${weatherDescription}</span>

					<h6>Water count <p class="italics">(oz)</p></h6>
					<span class="log-waterCount log-fieldBorder border-blue">${waterCount}</span>

					<h6>Skipped meals</h6>
					<span class="log-skippedMeals log-fieldBorder border-purple">${skippedMealsModified}</span>

					<h6>Sleep</h6>
					<span class="log-sleep grey log-fieldBorder border-lightblue">From <p class="log-sleep-hours lightblue">${sleepStartSplit}:${sleepStartSplit2}${sleepStart12HrClock}</p> to <p class="log-sleep-hours lightblue">${sleepEndSplit}:${sleepEndSplit2}${sleepEnd12HrClock}</p></span>

					<h6>Total hours slept</h6>
					<span class="log-sleepTotal log-fieldBorder border-lightblue">${logData.sleepTotal}</span>

					<h6>Additional notes</h6>
					<span class="log-notesModified log-fieldBorder border-blue">${notesModified}</span>


					<div class="allLogsFormEdit hidden" id="js-allLogsFormEdit-${logDataId}">
						<form class="log-filterEdit-form">
							<fieldset class="fieldset border-purple">
								<legend class="grey legend legend-border border-purple">Edit Log</legend>

								<div class="form-elements">
									<input type="hidden" id="logId-allLogs" name="logId-allLogs" value="${logData.id}">
									<label for="entry-date-allLogs" class="top-field">Date</label><input type="date" id="entry-date-allLogs" class="field-border border-blue" min="2018-01-01" required><br>

									<label for="migraine-length-allLogs">Migraine Length <p class="italics">(hrs)</p></label><input type="text" id="migraine-length-allLogs" class="field-border border-purple"><br>
									<label for="weather-allLogs">Weather description</label><input type="text" id="weather-allLogs" class="field-border border-lightblue"><br>
									<label for="water-count-allLogs">Water count <p class="italics">(oz)</p></label><input type="text" id="water-count-allLogs" class="field-border border-blue"><br>

									<label for="skipped-meals-allLogs">Skipped meals <span class="italics-secondline">(select all that apply)</span></label>
									<select id="skipped-meals-allLogs" class="skipped-meals field-border-reverse border-purple" name="skipped-meals-allLogs" size="3" multiple>
										<option value="1" id="skippedmeals-allLogs-1" class="skipped-meals-opt">Breakfast</object>
										<option value="2" id="skippedmeals-allLogs-2" class="skipped-meals-opt">Lunch</object>
										<option value="3" id="skippedmeals-allLogs-3" class="skipped-meals-opt">Dinner</object>
									</select>
									<br>

									<label for="sleepstart-hr-allLogs">Slept last night @ <span class="italics-secondline">(24 hr clock)</span></label>
									<div class="sleep-div">
										<select id="sleepstart-hr-allLogs" class="sleep-select grey field-border-reverse border-lightblue" name="sleepstart-hr-allLogs"><br>
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
										<label for="sleepstart-min-allLogs" class="colon">:</label>
										<select id="sleepstart-min-allLogs" class="sleep-select grey field-border-reverse border-lightblue" name="sleepstart-min-allLogs"><br>
											<option value="xx" id="sleepstart-allLogs-minxx"></option>
											<option value="00" id="sleepstart-allLogs-min00">00</option>
											<option value="15" id="sleepstart-allLogs-min15">15</option>
											<option value="30" id="sleepstart-allLogs-min30">30</option>
											<option value="45" id="sleepstart-allLogs-min45">45</option>
										</select>
									</div>
									<br>

									<label for="sleepend-hr-allLogs">Woke up this morning @ <span class="italics-secondline">(24 hr clock)</span></label>
									<div class="sleep-div">
										<select id="sleepend-hr-allLogs" class="sleep-select grey field-border-reverse border-blue" name="sleepsend-hr-allLogs"><br>
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
										<label for="sleepend-min-allLogs" class="colon">:</label>
										<select id="sleepend-min-allLogs" class="sleep-select grey field-border-reverse border-blue" name="sleepend-min-allLogs"><br>
											<option value="00" id="sleepend-allLogs-minxx"></option>
											<option value="00" id="sleepend-allLogs-min00">00</option>
											<option value="15" id="sleepend-allLogs-min15">15</option>
											<option value="30" id="sleepend-allLogs-min30">30</option>
											<option value="45" id="sleepend-allLogs-min45">45</option>
										</select>
									</div>
									<br>

									<label for="notes-allLogs">Additional notes</label><textarea id="notes-allLogs" class="notes grey field-border-reverse border-lightblue"></textarea><br>

									<div class="form-buttons-div">
										<input type="submit" name="save-button-allLogs-${logDataId}" value="Save" class="grey form-button button-border border-green" id="js-logSaveButton-allLogs-${logDataId}">
										<button type="button" name="cancel-button-allLogs-${logDataId}" class="grey form-button button-border border-grey" id="js-logCancelButton-allLogs-${logDataId}">Cancel</button>
										<button type="button" name="delete-button-allLogs-${logDataId}" class="grey form-button button-border border-red" id="js-logDeleteButton-allLogs-${logDataId}">Delete</button>
									</div>
								</div>
							</fieldset>
						</form>
					</div>

					<br>
					<button type="button" name="edit-button-allLogs-${logDataId}" class="grey form-button button-border border-purple" id="js-logEditButton-allLogs-${logDataId}">Edit</button>
				</div>
			</div>`);
	});
}

// REQUEST FUNCTIONS

function filterLogs(filterParams, createLogHtml, createEditHandlers) {
	let settings = {
		url: `/logs?${filterParams}`,
		method: 'GET',
	}

	$.ajax(settings)
	.done(data => {
		createLogHtml(data);
		createEditHandlers(data);
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

function getAllLogs(createLogHtml, matchEditFields, createEditHandlers) {
	let settings = {
		url: '/logs',
		method: 'GET'
	};

	$.ajax(settings)
	.done(data => {
		createLogHtml(data);
		matchEditFields(data.logs);
		createEditHandlers(data);
	});
}

function getDisplayLogs() {
	getAllLogs(createLogHtml, matchEditFields, createEditHandlers);
}

$(getDisplayLogs);
