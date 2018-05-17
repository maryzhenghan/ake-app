'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Migraine app API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
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
				});
		});
	});

	describe('GET endpoint for settings page', function() {

		it('should return a 200 status code and HTML', function() {
			let res;

			return chai.request(app)
				.get('/settings')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.not.be.null;
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
				});
		});
	});
});