var createDatabase = function () {

  var _db = {
    employees: [
      {
        id: 11823405,
        first_name: 'Jonathan',
        last_name: 'Toews',
        wage: 23.50,
        shifts: [
          {
            in: 1488203810,
            out: 1488234844,
          },
          {
            in: 1488290344,
            out: 1488316024,
          },
          {
            in: 1488463084,
            out: 1488491884,
          }
        ],
      },
      {
        id: 11823000,
        first_name: 'Alec',
        last_name: 'Baldwin',
        wage: 23.50,
        shifts: [
          {
            in: 1488203641,
            out: 1488234064,
          },
          {
            in: 1488288784,
            out: 1488318604,
          },
          {
            in: 1488376804,
            out: 1488404704,
          },
          {
            in: 1488461644,
            out: 1488493324,
          }
        ],
      },
      {
        id: 11823339,
        first_name: 'Timothy',
        last_name: 'Schroeder',
        wage: 23.50,
        shifts: [
          {
            in: 1488201674,
            out: 1488232804,
          },
          {
            in: 1488463264,
            out: 1488491044,
          }
        ],
      },
      {
        id: 11823993,
        first_name: 'Miriam',
        last_name: 'Knott',
        wage: 23.50,
        shifts: [
          {
            in: 1488202034,
            out: 1488232864,
          },
          {
            in: 1488288064,
            out: 1488320464,
          },
          {
            in: 1488376624,
            out: 1488405484,
          },
          {
            in: 1488462844,
            out: 1488492124,
          }
        ],
      },
      {
        id: 11821111,
        first_name: 'Alicia',
        last_name: 'Keys',
        wage: 23.50,
        shifts: [
          {
            in: 1488202444,
            out: 1488231904,
          },
          {
            in: 1488290824,
            out: 1488318724,
          }
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
      var found = false;
      for (let i = 0; i < _db.employees.length; ++i) {
        if (_db.employees[i].id == data.id) {
          found = true;
          _db.employees[i].first_name = data.first_name;
          _db.employees[i].last_name = data.last_name;
          _db.employees[i].wage = data.wage;
        }
      }
      if (!found) {
        _db.employees.push(Object.assign({
          shifts: [],
        }, data));
      }
    },
  };

};

module.exports = createDatabase();
