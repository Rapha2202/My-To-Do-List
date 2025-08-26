const AbstractManager = require("./AbstractManager");

class VerificationManager extends AbstractManager {
  constructor() {
    super({ table: "verification" });
  }

  async create(email, verifyToken) {
    const [result] = await this.database.query(
      `insert into ${this.table} (email, verifyToken)
             values (?, ?)`,
      [email, verifyToken]
    );
    return result.insertId;
  }

  async readByToken(token) {
    const [rows] = await this.database.query(
      `select *
             from ${this.table}
             where verifyToken = ?`,
      [token]
    );

    return rows;
  }

  async destroy(email) {
    const [result] = await this.database.query(
      `delete
             from ${this.table}
             where email = ?`,
      [email]
    );
    return result.affectedRows;
  }
}

module.exports = VerificationManager;
