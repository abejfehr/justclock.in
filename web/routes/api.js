var express = require('express');
var router = express.Router();

var routerMaker = function (db) {
  router.get('/', function(req, res, next) {
    res.send('This is an API.');
  });

  router.post('/import', function (req, res, next) {
    // Take in data in JSON
    /**
     * An array of these types of things
     * {
     *   "employee_id": 234234,
     *   "timestamp": 12312334234,
     * }
     */
     // Sort the data into punches per employee
     // Try to sort the punches into shifts (the shifts could be open-ended)
     // Add that data into the database
  });

  return router;
}

module.exports = routerMaker;
