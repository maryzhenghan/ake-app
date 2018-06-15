'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const db = require('../db/mongoose');
const {TEST_DATABASE_URL} = require('../config');

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


	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	*/

	before(function () {
		return db.connect(TEST_DATABASE_URL)
			.then(() => db.dropDatabase());
	});

	beforeEach(function () {
		return Promise.all([Log.insertMany(seedLogs)]);
	});

	afterEach(function () {
		return db.dropDatabase();
	});

	after(function () {
		return db.disconnect();
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
					expect(res.body.logs).to.have.length.of.at.least(1);
					return Log.count();
				})
				.then(function(count) {
					expect(res.body.logs).to.have.length.of(5);
				});
		});

		/*it('should return logs with the right fields', function() {
			let resLog;

			return chai.requet(app)
				.get('/logs')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.logs).to.have.length.of.at.least(1);
					return Log.count();
				})
				.then(function(count) {
					expect(res.body.logs).to.have.length.of(5);
				});
		});*/
	});
});