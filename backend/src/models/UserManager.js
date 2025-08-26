const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "user" });
  }

  async read(id) {
    const [rows] = await this.database.query(
      `select id,
                    username,
                    email,
                    creationDate,
                    lastLogin,
                    lastUpdate,
                    emailVerified
             from ${this.table}
             where id = ?`,
      [id]
    );

    return rows[0];
  }

  async create(username, email, hashedPassword, creationDate, lastUpdate) {
    const [result] = await this.database.query(
      `insert into ${this.table} (username, email, password, creationDate, lastUpdate)
             values (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, creationDate, lastUpdate]
    );
    return result.insertId;
  }

  async destroy(id) {
    const [result] = await this.database.query(
      `delete
             from ${this.table}
             where id = ?`,
      [id]
    );
    return result.affectedRows;
  }

  async checkUser(email, username) {
    const [rows] = await this.database.query(
      `select *
             from ${this.table}
             where email = ?
                or username = ?`,
      [email, username]
    );

    return rows;
  }

  async updateLastLogin(email, username, lastLogin) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET lastLogin = ?
             WHERE email = ?
                OR username = ?`,
      [lastLogin, email, username]
    );
    return rows;
  }

  async verifyEmail(email) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET emailVerified = 1
             WHERE email = ?`,
      [email]
    );
    return rows;
  }

  async updatePassword(email, hashedPassword) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET password = ?
             WHERE email = ?`,
      [hashedPassword, email]
    );
    return rows;
  }

  async incrementPasswordTry(email, username) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET passwordTry = passwordTry + 1
             WHERE email = ?
                OR username = ?`,
      [email, username]
    );
    return rows;
  }

  async resetPasswordTry(email, username) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET passwordTry = 0
             WHERE email = ?
                OR username = ?`,
      [email, username]
    );
    return rows;
  }

  async lockAccount(email, username, lockUntil) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET lockUntil = ?
             WHERE email = ?
                OR username = ?`,
      [lockUntil, email, username]
    );
    return rows;
  }

  async unlockAccount(email, username) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET lockUntil = null
             WHERE email = ?
                OR username = ?`,
      [email, username]
    );
    return rows;
  }

  async updateUsername(id, username) {
    const [rows] = await this.database.query(
      `UPDATE ${this.table}
             SET username = ?
             WHERE id = ?`,
      [username, id]
    );
    return rows;
  }
}

module.exports = UserManager;
