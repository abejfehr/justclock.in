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
     console.log("This worked!");
  });

  router.post('/employees/manage/:id', function(req, res, next) {
    // Get the data that was given
    var id = req.params.id;
    var name = req.body.name;
    var wage = req.body.wage;

    // Find the employee with the given ID and update his info
    db.updateEmployee({
      id: id,
      name: name,
      wage: wage,
    });

    // Show the user the thingy
    res.redirect('/app/employees/manage/' + id);
  });


  return router;
}

module.exports = routerMaker;
