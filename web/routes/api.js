var express = require('express');
var router = express.Router();
var xl = require('excel4node');

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

  router.post('/employees/manage/:id?', function(req, res, next) {
    // Get the data that was given
    var id = req.params.id || req.body.id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var wage = req.body.wage;

    // Find the employee with the given ID and update his info
    db.updateEmployee({
      id: id,
      first_name: first_name,
      last_name: last_name,
      wage: wage,
    });

    // Show the user the thingy
    res.redirect('/app/employees/manage');
  });

  router.get('/employees/excel', function (req, res, next) {
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Hours');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    // Go through all of the employees and put their shit in here
    var employees = db.getEmployees();
    for (let i = 0; i < employees.length; ++i) {
      ws.cell(i+1,1).string(employees[i].first_name).style(style);
      ws.cell(i+1,2).string(employees[i].last_name).style(style);
      ws.cell(i+1,3).number(employees[i].wage).style(style);
    }

    wb.write('Report.xlsx', res);
  });


  return router;
}

module.exports = routerMaker;
