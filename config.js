'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'https://stormy-temple-33929.herokuapp.com/';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-migraine-app';
exports.PORT = process.env.PORT || 8080;