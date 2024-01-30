const AbstractManager = require("./AbstractManager");

class StateManager extends AbstractManager {
  constructor() {
    super({ table: "state" });
  }

  // The C of CRUD - Create operation
  async readState(id) {
    const [todo] = await this.database.query(
      `SELECT *
       FROM state
       WHERE id = ?`,
      [id]
    );
    return todo;
  }
}

module.exports = StateManager;
