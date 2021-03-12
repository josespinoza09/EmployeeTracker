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

