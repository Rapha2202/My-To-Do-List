const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "user" });
  }

  // The C of CRUD - Create operation

  async create(username, password, email, creationDate, lastUpdate) {
    const [result] = await this.database.query(
      `insert into ${this.table} (username, password, email, creationDate, lastUpdate)
       values (?, ?, ?, ?, ?)`,
      [username, password, email, creationDate, lastUpdate]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select id, username, email, creationDate, lastUpdate
       from ${this.table}
       where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select *
                                              from ${this.table}`);

    // Return the array of items
    return rows;
  }

  // The U of CRUD - Update operation

  async update(token, username, lastUpdate) {
    const [result] = await this.database.query(
      `UPDATE user
       SET username=?,
           lastUpdate=?
       WHERE token = ?`,
      [username, lastUpdate, token]
    );
    console.info(result);
    return result;
  }

  async signIn(email) {
    const [user] = await this.database.query(
      `SELECT *
       FROM user
       WHERE email = ?
          OR username = ?`,
      [email, email]
    );
    return user;
  }

  async checkUsername(username) {
    const [user] = await this.database.query(
      `SELECT *
       FROM user
       WHERE username = ?`,
      [username]
    );
    return user;
  }

  async checkEmail(email) {
    const [user] = await this.database.query(
      `SELECT *
       FROM user
       WHERE email = ?`,
      [email]
    );
    return user;
  }

  async saveToken(token, email) {
    const [result] = await this.database.query(
      `UPDATE user
       SET token=?
       WHERE email = ?
          OR username = ?`,
      [token, email, email]
    );
    return result;
  }

  async checkToken(token) {
    const [user] = await this.database.query(
      `SELECT *
       FROM user
       WHERE token = ?`,
      [token]
    );
    return user;
  }

  async takeData(token) {
    const [user] = await this.database.query(
      `SELECT username, email, DATE_FORMAT(lastUpdate, "%Y-%m-%d") as lastUpdate
       FROM user
       WHERE token = ?`,
      [token]
    );
    return user;
  }

  // The D of CRUD - Delete operation

  async userDelete(id) {
    const [result] = await this.database.query(
      `DELETE
       FROM user
       WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = UserManager;
