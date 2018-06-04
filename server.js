'use strict';

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Migraine } = require('./models');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/home', (req, res) => {
	res.status(200).json({ message: 'You have arrived on the Migraine App home page' });
});

app.get('/history', (req, res) => {
	res.status(200).json({ message: 'You have arrived on the Migraine App history page' });
});

app.get('/docs/:id', (req, res) => {
});


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
	res.status(404).json({ message: 'Not Found' });
});

let server;

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

module.exports = { app, runServer, closeServer };