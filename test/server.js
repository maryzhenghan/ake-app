'use strict';

const { app, runServer, closeServer } = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const db = require('../db/mongoose');
const { TEST_DATABASE_URL } = require('../config');

const { Log } = require('../models.js');
const seedLogs = require('../db/seed/logs');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Migraine app API resource', function() {
	/* don't need this for now

	// Note that with your current tests you don't need
	// your before and after functions, since chai.request(app)
	// calls app.listen() for you, however I think once you
	// are testing database interactions you need to call those
	// to connect to the test database etc.
	
	*/

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function () {
		return Promise.all([Log.insertMany(seedLogs)]);
	});

	afterEach(function () {
		return db.dropDatabase();
	});

	after(function() {
		return closeServer();
	});
	

	describe('GET endpoint for home page', function() {
		it('should return a 200 status code and HTML', function() {
			let res;

			return chai.request(app)
				.get('/home')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.not.be.null;
					expect(res).to.be.html;
					//console.log(res);
				});
		});
	});

	describe('GET endpoint for history page', function() {
		it('should return a 200 status code and HTML', function() {
			let res;

			return chai.request(app)
				.get('/history')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.not.be.null;
					expect(res).to.be.html;
				});
		});
	});

	describe ('GET endpoint for /logs', function() {
		it('should return the first 5 logs in JSON', function() {
			let res;

			return chai.request(app)
				.get('/logs')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body.logs).to.have.length(5);
				});
		});

		it('should return logs with the right fields', function() {
			let resLog;

			return chai.request(app)
				.get('/logs')
				.then(function(_res) {
					resLog = _res.body.logs[0];
					expect(resLog).to.have.property('date');
					expect(resLog).to.have.property('migraine');
				});
		});
	});
});