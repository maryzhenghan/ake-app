'use strict';

// CLICK HANDLERS

// create new log button
$('.js-todayLogCreate').on('click', function(e) {
  $('.js-todayLogFormCreate').removeClass('hidden');
  $('.js-todayLogFormEdit').addClass('hidden');

  if ($('#logId').val() !== '') {
    $('.js-todayLogEdit').removeClass('hidden');
  }
});

// edit log button
$('.js-todayLogEdit').on('click', function(e) {
  $('.js-todayLogFormEdit').removeClass('hidden');
  $('.js-todayLogFormCreate').addClass('hidden');
  $('.js-todayLogCreate').removeClass('hidden');
});

// save new log button
$('.js-logSaveButton').on('click', function(e) {
  e.preventDefault();

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
});

// save edited log button
$('.js-logSaveButton-edit').on('click', function(e) {
  e.preventDefault();

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

  putLog(logDataObject);
});

// cancel create button
$('.js-logCancelButton').on('click', function(e) {
  $('.js-todayLogFormCreate').addClass('hidden');
  $('.js-todayLogCreate').removeClass('hidden');
  $('.error-message').empty();
  clearForm();
});

// cancel edit button
$('.js-logCancelButton-edit').on('click', function(e) {
  $('.js-todayLogFormEdit').addClass('hidden');
  $('.js-todayLogEdit').removeClass('hidden');
  $('.error-message').empty();
  getDisplayLogs();
});

// delete log button
$('.js-logDeleteButton-edit').on('click', function(e) {
  let deleteLogId = $('#logId').val();
  deleteTodayLog(deleteLogId);
});

// MISC FUNCTIONS

function clearForm() {
  $(
    '.js-todayLogFormCreate input, #skipped-meals, #sleepstart-hr, #sleepstart-min, #sleepend-hr, #sleepend-min, #notes'
  )
    .not('.js-logSaveButton, .js-logCancelButton')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');

  let todayDate = getTodayDate();
  let requestFormatDate = getRequestFormatDate(todayDate);

  $('#entry-date').val(requestFormatDate);
}

function getTodayDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  let todayDate = mm + '/' + dd + '/' + yyyy;
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

function empty(value) {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return false;
  }
  if (typeof value === 'undefined' || value === null) {
    return true;
  }
  if (typeof value.length !== 'undefined') {
    if (/^[\s]*$/.test(value.toString())) {
      return true;
    }
    return value.length === 0;
  }

  let count = 0;
  for (let i in value) {
    if (value.hasOwnProperty(i)) {
      count++;
    }
  }
  return count === 0;
}

function convertDate(date) {
  let splitDate = date.split('/');
  let combineDate = `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;
  return combineDate;
}

function convertTime(splitTime) {
  if (splitTime < 10) {
    return `0${splitTime}`;
  } else {
    return splitTime;
  }
}

// DATA MANIPULATION FUNCTIONS

function matchEditFields(data) {
  let id = data.id;
  let date = `${data.dateAdjusted}`;
  let entryDate = convertDate(date);

  $('#logId').val(id);
  $('#entry-date-edit').val(entryDate);
  $('#migraine-length-edit').val(data.migraineLengthHr);
  $('#weather-edit').val(data.weather);
  $('#water-count-edit').val(data.water);

  if ($('#skippedmeals-edit-1:selected').prop('selected')) {
    $('#skippedmeals-edit-1:selected').prop('selected', false);
  }
  if ($('#skippedmeals-edit-2:selected').prop('selected')) {
    $('#skippedmeals-edit-2:selected').prop('selected', false);
  }
  if ($('#skippedmeals-edit-3:selected').prop('selected')) {
    $('#skippedmeals-edit-3:selected').prop('selected', false);
  }

  if (data.skippedMeals.includes('1')) {
    $('#skippedmeals-edit-1').attr('selected', 'selected');
    $('#skippedmeals-edit-1').prop('selected', true);
  }
  if (data.skippedMeals.includes('2')) {
    $('#skippedmeals-edit-2').attr('selected', 'selected');
    $('#skippedmeals-edit-2').prop('selected', true);
  }
  if (data.skippedMeals.includes('3')) {
    $('#skippedmeals-edit-3').attr('selected', 'selected');
    $('#skippedmeals-edit-3').prop('selected', true);
  }

  let splitStartTime = data.sleepStart.split(':');
  let splitEndTime = data.sleepEnd.split(':');
  let startHr = splitStartTime[0];
  let startMin = splitStartTime[1];
  let endHr = splitEndTime[0];
  let endMin = splitEndTime[1];

  let convertedStartHr = convertTime(startHr);
  let convertedStartMin = convertTime(startMin);
  let convertedEndHr = convertTime(endHr);
  let convertedEndMin = convertTime(endMin);

  $(`#sleepstart-edit-hr${convertedStartHr}`).attr('selected', 'selected');
  $(`#sleepstart-edit-hr${convertedStartHr}`).prop('selected', true);

  $(`#sleepstart-edit-min${convertedStartMin}`).attr('selected', 'selected');
  $(`#sleepstart-edit-min${convertedStartMin}`).prop('selected', true);

  $(`#sleepend-edit-hr${convertedEndHr}`).attr('selected', 'selected');
  $(`#sleepend-edit-hr${convertedEndHr}`).prop('selected', true);

  $(`#sleepend-edit-min${convertedEndMin}`).attr('selected', 'selected');
  $(`#sleepend-edit-min${convertedEndMin}`).prop('selected', true);

  $('#notes-edit').val(data.notes);
}

function createLogHtml(logData) {
  // sleep times display
  let sleepStartHrSplit = logData.sleepStart.split(':');
  let sleepEndHrSplit = logData.sleepEnd.split(':');

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
    sleepStart12HrClock = 'AM';
  } else {
    sleepStart12HrClock = 'PM';
  }

  if (sleepEndSplit < 12) {
    sleepEnd12HrClock = 'AM';
  } else {
    sleepEnd12HrClock = 'PM';
  }

  // migraine: true false
  let migraineYesNo;
  if (logData.migraine === true) {
    migraineYesNo = 'Yes';
  } else {
    migraineYesNo = 'No';
  }

  // weather description
  let weatherDescription;
  if (logData.weather === '') {
    weatherDescription = 'n/a';
  } else {
    weatherDescription = logData.weather;
  }

  // water count
  let waterCount;
  if (empty(logData.water)) {
    waterCount = 'n/a';
  } else {
    waterCount = logData.water;
  }

  // skipped meals
  let skippedMealsModified = '';
  let skippedB = 'breakfast';
  let skippedL = 'lunch';
  let skippedD = 'dinner';
  if (logData.skippedMeals.includes('1')) {
    skippedMealsModified += 'breakfast ';
  }
  if (logData.skippedMeals.includes('2')) {
    skippedMealsModified += 'lunch ';
  }
  if (logData.skippedMeals.includes('3')) {
    skippedMealsModified += 'dinner ';
  }
  if (
    !logData.skippedMeals.includes('1') &&
    !logData.skippedMeals.includes('2') &&
    !logData.skippedMeals.includes('3')
  ) {
    skippedMealsModified = 'n/a';
  }

  // notes
  let notesModified = logData.notes;
  if (logData.notes === '') {
    notesModified = 'n/a';
  }

  // append HTML
  $('.js-todayLogDisplayYes').empty().append(`
		<div class="log-box ">
			<div class="log-contents">
				<div class="log-date"><h5>${logData.dateAdjusted}</h5></div>

				<h6 class="top-field">Migraine?</h6>
				<span class="log-migraineYesNo log-fieldBorder border-purple">${migraineYesNo}</span>

				<h6>Length of migraine <p class="italics">(hours)</p></h6>
				<span class="log-migraineLengthHr log-fieldBorder border-purple">${
          logData.migraineLengthHr
        }</span>

				<h6>Weather description</h6>
				<span class="log-weatherDescription log-fieldBorder border-lightblue">${weatherDescription}</span>

				<h6>Water count <p class="italics">(oz)</p></h6>
				<span class="log-waterCount log-fieldBorder border-blue">${waterCount}</span>

				<h6>Skipped meals</h6>
				<span class="log-skippedMeals log-fieldBorder border-purple">${skippedMealsModified}</span>

				<h6>Sleep</h6>
				<span class="log-sleep grey log-fieldBorder border-lightblue">From <p class="log-sleep-hours lightblue">${sleepStartSplit}:${sleepStartSplit2}${sleepStart12HrClock}</p> to <p class="log-sleep-hours lightblue">${sleepEndSplit}:${sleepEndSplit2}${sleepEnd12HrClock}</p></span>

				<h6>Total hours slept</h6>
				<span class="log-sleepTotal log-fieldBorder border-lightblue">${
          logData.sleepTotal
        }</span>

				<h6>Additional notes</h6>
				<span class="log-notesModified log-fieldBorder border-blue">${notesModified}</span>
			</div>
		</div>`);
}

// REQUEST FUNCTIONS

function deleteTodayLog(id) {
  let settings = {
    url: `/logs/${id}`,
    method: 'DELETE'
  };

  $.ajax(settings)
    .fail((xhr, status, error) => {
      $('.error-message')
        .empty()
        .append(`Error: ${error}`);
    })
    .done(data => {
      $('.js-todayLogFormEdit').addClass('hidden');
      $('.js-todayLogEdit').addClass('hidden');
      $('.js-todayLogDisplayNo').removeClass('hidden');
      $('.js-todayLogDisplayYes')
        .empty()
        .addClass('hidden');
      clearForm(data);
    });
}

function putLog(logData) {
  let id = logData.id;
  let settings = {
    url: `/logs/${id}`,
    method: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(logData)
  };

  $.ajax(settings)
    .fail((xhr, status, error) => {
      $('.error-message')
        .empty()
        .append(`Error: ${error}`);
    })
    .done(data => {
      $('.js-todayLogFormEdit').addClass('hidden');
      $('.js-todayLogDisplay').removeClass('hidden');
      $('.js-todayLogEdit').removeClass('hidden');
      clearForm(data);
      return getDisplayLogs();
    });
}

function postNewLog(logData) {
  let settings = {
    url: '/logs',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(logData)
  };

  $.ajax(settings)
    .fail((xhr, status, error) => {
      $('.error-message')
        .empty()
        .append(`Error: ${error}`);
    })
    .done(data => {
      $('.js-todayLogFormCreate').addClass('hidden');
      $('.js-todayLogDisplayYes').removeClass('hidden');
      $('.js-todayLogDisplayNo').addClass('hidden');

      $('.js-todayLogEdit').removeClass('hidden');
      $('.js-todayLogCreate').removeClass('hidden');
      clearForm();
      matchEditFields(data);
      return createLogHtml(data);
    });
}

function getTodayLog(createLogHtml, matchEditFields) {
  let todayDate = getTodayDate();
  let requestFormatDate = getRequestFormatDate(todayDate);

  let settings = {
    url: `/logs?date=${requestFormatDate}`,
    method: 'GET'
  };

  $('#entry-date').val(requestFormatDate);

  $.ajax(settings).done(data => {
    if (data.logs.length > 0) {
      $('.js-todayLogDisplayYes').removeClass('hidden');
      $('.js-todayLogDisplayNo').addClass('hidden');
      $('.js-todayLogEdit').removeClass('hidden');
      $('.js-todayLogCreate').removeClass('hidden');

      createLogHtml(data.logs[0]);
      matchEditFields(data.logs[0]);
    } else {
      let noSettings = {
        url: '/logs',
        method: 'GET'
      };

      $.ajax(noSettings).done(data => {
        $('.js-todayLogDisplayNo').removeClass('hidden');
        $('.js-todayLogCreate').removeClass('hidden');
      });
    }
  });
}

function getDisplayLogs() {
  getTodayLog(createLogHtml, matchEditFields);
}

$(getDisplayLogs);
