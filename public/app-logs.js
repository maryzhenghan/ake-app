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

function displayAllLogs(data) {

	for (let i in data.logs) {
		let simpJson = JSON.stringify(data.logs[i], null, "\t");

		$('.js-allLogs').append(
			`<p>${data.logs[i].dateAdjusted}:</p>
			<p>${simpJson}</p>
			<hr>
			`);
	}


}

function getDisplayLogs() {
	getAllLogs(displayAllLogs);
}

$(getDisplayLogs);
