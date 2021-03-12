const inquirer = require("inquirer");
const db = require("./app/connection")("employees", "joseantonio");
const cTable = require("console.table");
const { ADDRGETNETWORKPARAMS } = require("dns");
const { allowedNodeEnvironmentFlags } = require("process");

async function questionsPrompt() {
  const questionList = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "Choice",
      choices: [
        "View all Employees",
        "View employees by Department",
        "View employees by Role",
        "Add employee",
        "Update employee role",
        "Add role",
        "Add department",
        "Exit Application",
      ],
    },
  ]);

  switch (questionList.Choice) {
    case "View all Employees":
      viewAllEmployees();
      break;

    case "View employees by Department":
      viewAllEmpDepartments();
      break;

    case "View employees by Role":
      viewAllEmpRoles();
      break;

    case "Add employee":
      addEmployee();
      break;

    case "Update employee role":
      updateEmpRole();
      break;

    case "Add role":
      addRole();
      break;

    case "Add department":
      addDepartment();
      break;

    case "Exit Application":
      process.exit();
      break;

    default:
      process.exit();
      break;
  }
}
questionsPrompt();

async function viewAllEmployees() {
  let allEmp = await db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.nameDepart AS department, roles.salary, CONCAT (manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
  );
  let empTable = await db.query("SELECT first_name FROM employee");

  if (empTable.length === 0) {
    console.log(`
    ---------------------------
    There are no employees yet!
    ---------------------------
    `);
  } else {
    console.table(allEmp);
  }
  questionsPrompt();
}

async function viewAllEmpDepartments() {
  let departmentQuery = await db.query(`SELECT * FROM department`);
  const departmentList = departmentQuery.map(({ id, nameDepart }) => ({
    name: nameDepart,
    value: id,
  }));

  if (departmentQuery.length === 0) {
    console.log(`
    ---------------------------
    There are no employees yet!
    ---------------------------
    `);
  } else {
    const departmentAns = await inquirer.prompt([
      {
        type: "list",
        message: "Choose a department",
        name: "department",
        choices: departmentList,
      },
    ]);

    let empDepartments = await db.query(
      `SELECT employee.first_name, employee.last_name FROM employee AS employee LEFT JOIN roles AS roles ON employee.role_id = roles.id LEFT JOIN department AS department ON roles.department_id = department.id WHERE department.id = '${departmentAns.department}'`
    );
    console.table(empDepartments);
  }
  questionsPrompt();
}

async function viewAllEmpRoles() {
  let rolesQuery = await db.query(`SELECT * FROM roles`);

  const rolesList = rolesQuery.map(({ id, title }) => ({
    name: title,
    value: title,
  }));

  if (rolesQuery.length === 0) {
    console.log(`
    ---------------------------
    There are no roles yet!
    ---------------------------
    `);
  } else {
    const rolesAns = await inquirer.prompt([
      {
        type: "list",
        message: "Choose a role",
        name: "role",
        choices: rolesList,
      },
    ]);

    let allRoles = await db.query(
      `SELECT employee.first_name, employee.last_name FROM employee LEFT JOIN roles ON employee.role_id = roles.id WHERE roles.title = '${rolesAns.role}'`
    );
    console.table(allRoles);
  }
  questionsPrompt();
}

