'use strict';

exports.DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://testuser1:testpw1@ds215380.mlab.com:15380/migraine-app';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-migraine-app';
exports.PORT = process.env.PORT || 8080;
