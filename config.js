'use strict';

exports.DATABASE_URL =
  process.env.DATABASE_URL || 'https://ake-app.herokuapp.com/';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-migraine-app';
exports.PORT = process.env.PORT || 8080;
