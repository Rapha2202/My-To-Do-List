const UserManager = require("./models/UserManager");
const VerificationManager = require("./models/VerificationManager");
const ListManager = require("./models/ListManager");
const TodoManager = require("./models/TodoManager");

const managers = [UserManager, VerificationManager, ListManager, TodoManager];

const tables = {};

managers.forEach((ManagerClass) => {
  const manager = new ManagerClass();

  tables[manager.table] = manager;
});

module.exports = new Proxy(tables, {
  get(obj, prop) {
    if (prop in obj) return obj[prop];

    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in ${__filename}?`
    );
  },
});
