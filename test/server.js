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

// TESTS

describe('Migraine app API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return Promise.all([Log.insertMany(seedLogs)]);
  });

  afterEach(function() {
    return db.dropDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint for home page', function() {
    it('should return a 200 status code and HTML', function() {
      let res;

      return chai
        .request(app)
        .get('/')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.not.be.null;
          expect(res).to.be.html;
        });
    });
  });

  describe('GET endpoint for all-logs page', function() {
    it('should return a 200 status code and HTML', function() {
      let res;

      return chai
        .request(app)
        .get('/logs.html')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.not.be.null;
          expect(res).to.be.html;
        });
    });
  });

  describe('GET endpoint for /logs', function() {
    it('should return logs in JSON', function() {
      let res;

      return chai
        .request(app)
        .get('/logs')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        });
    });

    it('should return logs with the right fields', function() {
      let res;

      return chai
        .request(app)
        .get('/logs')
        .then(function(_res) {
          res = _res.body.logs[0];
          expect(res).to.have.property('dateAdjusted');
          expect(res).to.have.property('migraineLengthHr');
        });
    });
  });

  describe('GET endpoint for /logs/:id', function() {
    it('should return 1 log, serialized, in JSON', function() {
      let res;

      return chai
        .request(app)
        .get('/logs/111111111111111111111102')
        .then(function(_res) {
          res = _res;
          let logId = '111111111111111111111102';
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.id).to.equal(logId);
          expect(res.body).to.have.property('migraine');
          expect(res.body).to.have.property('sleepStart');
          expect(res.body).to.have.property('sleepEnd');
          expect(res.body).to.have.property('sleepTotal');
        });
    });
  });

  describe('POST endpoint for /logs', function() {
    it('should create and return a new item when provided valid data', function() {
      const newLog = {
        date: '06/21/2020',
        migraineLengthHr: 4
      };

      let body;

      return chai
        .request(app)
        .post('/logs')
        .send(newLog)
        .then(function(res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res).to.be.a('object');
          expect(res.body).to.have.property('dateAdjusted');
          expect(res.body).to.have.property('migraineLengthHr');
          return Log.findOne({ _id: body.id });
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
        });
    });

    it('should respond with a 400 error if there is a missing field', function() {
      const newLog = {
        date: '06/22/2020'
      };

      return chai
        .request(app)
        .post('/logs')
        .send(newLog)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.html;
          expect(res.body).to.be.a('object');
        });
    });
  });

  describe('PUT endpoint for /logs/:id', function() {
    it('should return a 400 error if the IDs in the req path and req body DO NOT match', function() {
      const updateLog = {
        id: '111111111111111111111100',
        date: '08/20/2018',
        migraineLengthHr: 4
      };
      const fakeId = 'xxxxx';

      return chai
        .request(app)
        .put(`/logs/${fakeId}`)
        .send(updateLog)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            `Request path id (${fakeId}) and request body id (${
              updateLog.id
            }) must match`
          );
        });
    });

    it('should update the log', function() {
      const updateLog = {
        id: '111111111111111111111100',
        date: '08/20/2018',
        migraineLengthHr: 400
      };
      let data;

      return Log.findById(updateLog.id).then(_data => {
        data = _data;
        return chai
          .request(app)
          .put('/logs/111111111111111111111100')
          .send(updateLog)
          .then(res => {
            expect(res).to.have.status(204);
          });
      });
    });
  });

  describe('DELETE endpoint for /logs/:id', function() {
    it('should delete a log by id and respond with 204 status', function() {
      let data;

      return chai
        .request(app)
        .delete('/logs/111111111111111111111100')
        .then(function(res) {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          return Log.findById('111111111111111111111100');
        })
        .then(log => {
          expect(log).to.be.null;
        });
    });
  });
});
