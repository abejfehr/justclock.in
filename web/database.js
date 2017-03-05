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
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11823000,
        first_name: 'Alec',
        last_name: 'Baldwin',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11823339,
        first_name: 'Timothy',
        last_name: 'Schroeder',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11823993,
        first_name: 'Miriam',
        last_name: 'Knott',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11821111,
        first_name: 'Alicia',
        last_name: 'Keys',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11821232,
        first_name: 'Victor',
        last_name: 'Johnson',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11829381,
        first_name: 'Emily',
        last_name: 'Groulx',
        wage: 23.50,
        shifts: [
          {
            in: 1488665550,
            out: 1488672954,
          },
        ],
      },
      {
        id: 11723455,
        first_name: 'Tina',
        last_name: 'Fey',
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
        console.log('THE DATA: ', data);
        _db.employees.push(Object.assign({
          shifts: [],
        }, data));
      }
    },
  };

};

module.exports = createDatabase();
