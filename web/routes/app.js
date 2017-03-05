var express = require('express');
var router = express.Router();
var Report = require('fluentreports').Report;

var routerMaker = function (db) {

  router.get('/', function(req, res, next) {
    res.render('app/index', { title: 'Dashboard' });
  });

  router.get('/login', function(req, res, next) {
    res.render('app/login', { title: 'Login' });
  });

  router.get('/employees/manage/:id', function(req, res, next) {
    res.render('app/employees/manage', { title: 'Employees - Manage', employee: db.getEmployee(req.params.id) });
  });

  router.get('/reports/employees', function(req, res, next) {
    // Our Simple Data in Array format:
    var data = [];
    // Go through the database and get the actual data
    var employees = db.getEmployees();
    for (let i = 0; i < employees.length; ++i) {
      var employee = employees[i];
      // Each employee will have his name and a summary of the hours worked
      var hours = 0;
      for (let j = 0; j < employee.shifts.length; ++j) {
        var shift = employee.shifts[j];
        if (shift.out && shift.in) {
          // Convert the time from milliseconds to hours
          hours += Math.round((shift.out - shift.in) / 60 / 60 * 10) / 10;
        }
      }

      data.push([employee.name, hours]);
    }

    var send = function (err, report) {
      res.type('pdf');
      res.send(report);
    }

    // Create a Report
    var rpt = new Report('buffer')
          .data(data)
          .pageHeader( ['Employee Hours Summary'] ) // Add a simple (optional) page Header...
          .detail( [[0, 200],[1, 50]])     // Layout the report in a grid of 200px & 50px
          .render(send);						 // Render the report

    // res.render('app/reports/employees', { title: 'Reports - Employees', employees: db.getEmployees() });
  });

  return router;
};

module.exports = routerMaker;
