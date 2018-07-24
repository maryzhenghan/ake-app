$('.js-logFilterButton').on("click", function(e) {
	e.preventDefault();
	$('.js-allLogsContainer').empty();
});

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
	console.log(data);
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
	getAllLogs(displayAllLogs);
}

$(getDisplayLogs);
