const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')
const { throwError } = require('rxjs')

console.clear()

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'admin#20',
  database: 'tracker_db',
})

connection.connect(function (err) {
  if (err) throw err
  runTracker()
})

function runTracker() {
  inquirer
    .prompt({
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Create department',
        'View departments',
        'Create role',
        'View roles',
        'Create employee',
        'View employees',
        'Update employee role',
      ],
      name: 'action',
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Create department':
          newDepartment()
          break

        case 'View departments':
          viewDepartments()
          break

        case 'Create role':
          newRole()
          break

        case 'View roles':
          viewRoles()
          break

        case 'Create employee':
          newEmployee()
          break

        case 'View employees':
          viewEmployees()
          break

        case 'Update employee role':
          updateEmployee()
          break
      }
    })
}

// Department handlers
function viewDepartments() {
  let query = 'SELECT * FROM department'
  connection.query(query, function (err, res) {
    if (err) {
      throw Error(err.message)
    }
    console.clear()
    console.table(res)
    runTracker()
  })
}

function newDepartment() {
  inquirer
    .prompt({
      type: 'input',
      message: 'What is the departments name?',
      name: 'name',
    })
    .then(function (answer) {
      let query = 'INSERT INTO department (name) VALUES (?)'
      connection.query(query, [answer.name], function (err, res) {
        if (err) {
          throw Error(err.message)
        }
        console.clear()
        console.log('Department Created!')
        runTracker()
      })
    })
}

//============================================================
// Role handlers

function newRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the title of the role you want to add?',
        name: 'title',
      },
      {
        type: 'input',
        message: 'What is the salary for this role?',
        name: 'salary',
      },
      {
        type: 'input',
        message: 'What is the department ID for this role?',
        name: 'departmentId',
      },
    ])
    .then((answer) => {
      let query = 'SELECT id FROM department WHERE department.id = ?'
      connection.query(query, [answer.departmentId], (err, res) => {
        if (err) {
          throw Error(err.message)
        }
        if (!res.length) {
          throw Error('Invalid department ID')
        }
        let newQuery =
          'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)'
        connection.query(
          newQuery,
          [answer.title, answer.salary, answer.departmentId],
          (err, res) => {
            if (err) {
              throw Error(err.message)
            }
            console.clear()
            console.log('Role created!')
            runTracker()
          }
        )
      })
    })
}

function viewRoles() {
  let query = 'SELECT * FROM roles'
  connection.query(query, function (err, res) {
    if (err) {
      throw Error(err.message)
    }
    console.clear()
    console.table(res)
    runTracker()
  })
}

//============================================================
// Employee handlers

function newEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName',
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastName',
      },
      {
        type: 'input',
        message: 'What is the role id?',
        name: 'roleId',
      },
      {
        type: 'input',
        message: "What is their manager's ID?",
        name: 'managerId',
      },
    ])
    .then((answer) => {
      let query = 'SELECT id FROM roles WHERE roles.id = ?'
      connection.query(query, [answer.roleId], (err, res) => {
        if (err) {
          throw Error(err.message)
        }
        if (!res.length) {
          throw Error('Invalid role ID')
        }
        let query = 'SELECT id FROM employee WHERE employee.id = ?'
        connection.query(query, [answer.managerId], (err, res) => {
          if (answer.managerId) {
            if (err) {
              throw Error(err.message)
            }
            if (!res.length) {
              throw Error('Invalid manager ID')
            }
          }
          let newQuery =
            'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?);'
          connection.query(
            newQuery,
            [
              answer.firstName,
              answer.lastName,
              answer.roleId,
              answer.managerId || null,
            ],
            (err, res) => {
              if (err) {
                throw Error(err.message)
              }
              console.clear()
              console.log('Employee created!')
              runTracker()
            }
          )
        })
      })
    })
}

function viewEmployees() {
  let query = 'SELECT * FROM employee'
  connection.query(query, function (err, res) {
    if (err) {
      throw Error(err.message)
    }
    console.clear()
    console.table(res)
    runTracker()
  })
}

function updateEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the employee ID?',
        name: 'id',
      },
      {
        type: 'input',
        message: 'What is the updated role ID?',
        name: 'roleId',
      },
    ])
    .then((answers) => {
      connection.query(
        'SELECT id FROM employee WHERE employee.id = ?',
        [answers.id],
        (err, res) => {
          if (err) {
            throw Error(err.message)
          }
          if (!res.length) {
            throw Error('Invalid employee ID')
          }
          connection.query(
            'SELECT id FROM roles WHERE roles.id = ?',
            [answers.roleId],
            (err, res) => {
              if (err) {
                throw Error(err.message)
              }
              if (!res.length) {
                throw Error('Invalid role ID')
              }
              connection.query(
                'UPDATE employee SET roles_id = ? WHERE employee.id = ?',
                [answers.roleId, answers.id],
                (err, res) => {
                  if (err) {
                    throw Error(err.message)
                  }
                  console.clear()
                  console.log('Employee updated!')
                  runTracker()
                }
              )
            }
          )
        }
      )
    })
}
