const AbstractManager = require("./AbstractManager");

class PriorityManager extends AbstractManager {
  constructor() {
    super({ table: "priority" });
  }

  // The C of CRUD - Create operation
  async readPriority(id) {
    const [todo] = await this.database.query(
      `SELECT *
       FROM priority
       WHERE id = ?`,
      [id]
    );
    return todo;
  }
}

module.exports = PriorityManager;
