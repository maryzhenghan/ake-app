'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Log } = require('./models');

app.use(express.static('public'));
app.use(bodyParser.json());


// REQUESTS

app.get('/home', (req, res) => {
	res.status(200);
	res.sendFile('index.html', {root: './public'});
});

app.get('/all-logs', (req, res) => {
	res.status(200);
	res.sendFile('logs.html', {root: './public'});
});

// for filter, be sure to make an "allowed fields" for the queries to limit access
app.get('/logs', (req, res) => {
	Log
		.find(req.query)
		.then(logs => {
			res.status(200).json({
						logs: logs.map(
							(log) => log.serialize())
					});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		});
});

// request log by ID
app.get('/logs/:id', (req, res) => {
	Log
		.findById(req.params.id)
		.then(log => res.json(log.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		});
});


app.post('/logs', (req, res) => {
	const requiredFields = ['date', 'migraineLengthHr'];

	let message;
	let missingError = false;
	let date = req.body.date;
	let alreadyExistsError;

	requiredFields.forEach(field => {
		if (empty(req.body[field])) {
			message = `Missing \`${field}\` value in request body`;
			console.error(message);
			missingError = true;
			return;
		}
	});

	if (missingError) {
		return res.status(400).send(message);
	}

	Log
		.find({ dateAdjusted: date })
		.then(log => {
			if (log.length !== 0) {
				alreadyExistsError = 'A log with this date already exists';
				console.log(`This is the already existing log: ${log}`);
				return res.status(400).send(alreadyExistsError);
			}

			else {
				Log
					.create({
						date: req.body.date,
						migraineLengthHr: req.body.migraineLengthHr,
						weather: req.body.weather,
						water: req.body.water,
						skippedMeals: req.body.skippedMeals,
						sleepStartHr: req.body.sleepStartHr,
						sleepStartMin: req.body.sleepStartMin,
						sleepEndHr: req.body.sleepEndHr,
						sleepEndMin: req.body.sleepEndMin,
						notes: req.body.notes
					})
					.then(log => res.status(201).json(log.serialize()))
					.catch(err => {
						console.error(err);
						res.status(500).json({ message: 'Internal server error' });
					});
			}
		});
});


app.put('/logs/:id', (req, res) => {
	// check if id in request path and request body match
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({ message: message });
	}

	const toUpdate = {};
	const updateableFields = ['date', 'migraineLengthHr', 'weather', 'water', 'skippedMeals', 'sleepStartHr', 'sleepStartMin', 'sleepEndHr', 'sleepEndMin', 'notes'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Log
		.findByIdAndUpdate(req.params.id, { $set: toUpdate })
		.then(log => res.json(log))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		});
});


app.delete('/logs/:id', (req, res) => {
	Log
		.findByIdAndRemove(req.params.id)
		.then(log => res.status(204).end())
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		});
});


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
	res.status(404).json({ message: 'Not Found' });
});


let server;

function empty(value)
{
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

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, server, runServer, closeServer };
