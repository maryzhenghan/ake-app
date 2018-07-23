function getAllLogs(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_ALL_LOGS)}, 100);
}

// function stays same when connecting to real API later
function displayAllLogs(data) {
	for (index in data.allLogs) {
		let simpJson = JSON.stringify(data.allLogs[index], null, "\t");

		$('body').append(
			'<p>' + data.allLogs[index]['entry date'] + ': ' + data.allLogs[index].migraine + ' migraine' + '</p><p class="js-simpJson">' + simpJson + '</p>');
	}
}


// function stays the same even when connecting to real API
function getDisplayLogs() {
	getAllLogs(displayAllLogs);
}

$(getDisplayLogs);
