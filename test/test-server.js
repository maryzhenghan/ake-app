'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('GET endpoint', function() {

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