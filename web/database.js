var createDatabase = function () {

  var _db = {
    employees: [
      {
        id: 11817541,
        name: 'Jonathan Toews',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
    ],
  };

  // Any public function that interfaces with the DB is here
  return {
    // Retrieve all employees
    getEmployees: function () {
      return _db.employees;
    },
    getEmployee: function (id) {
      // Go through the employees
      for (let i = 0; i < _db.employees.length; ++i) {
        if (_db.employees[i].id == id) {
          return _db.employees[i];
        }
      }
    },
    updateEmployee: function (data) {
      for (let i = 0; i < _db.employees.length; ++i) {
        if (_db.employees[i].id == data.id) {
          _db.employees[i].name = data.name;
          _db.employees[i].wage = data.wage;
        }
      }
    },
  };

};

module.exports = createDatabase();
