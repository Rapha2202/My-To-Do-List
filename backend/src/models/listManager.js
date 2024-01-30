const AbstractManager = require("./AbstractManager");

class ListManager extends AbstractManager {
  constructor() {
    super({ table: "list" });
  }

  // The C of CRUD - Create operation
  async readUser(id) {
    const [list] = await this.database.query(
      `SELECT list_id
       FROM user_list
       WHERE user_id = ?`,
      [id]
    );
    return list;
  }

  async readList(listId) {
    const [list] = await this.database.query(
      `SELECT *
       FROM list
       WHERE id = ?`,
      [listId]
    );
    return list;
  }

  async createList() {
    const [result] = await this.database.query(
      `INSERT INTO list (listName, listDescription)
       values (DEFAULT, DEFAULT)`
    );
    return result;
  }

  async createLiaison(userId, listId) {
    const [result] = await this.database.query(
      `INSERT INTO user_list (user_id, list_id, role)
       values (?, ?, ?)`,
      [userId, listId, "creator"]
    );
    return result;
  }

  async readUsersOnList(id) {
    const [result] = await this.database.query(
      `SELECT *
       FROM user_list
       where list_id = ?`,
      [id]
    );
    return result;
  }

  async checkCreator(listId, id) {
    const [result] = await this.database.query(
      `SELECT *
       FROM user_list
       where list_id = ?
         AND user_id = ?`,
      [listId, id]
    );
    return result;
  }

  async checkListId(listId) {
    const [result] = await this.database.query(
      `SELECT user_id
       FROM user_list
       WHERE list_id = ?`,
      [listId]
    );
    return result;
  }

  async editList(id, listName, listDescription) {
    const [result] = await this.database.query(
      `UPDATE list
       SET listName        = ?,
           listDescription = ?
       WHERE id = ?`,
      [listName, listDescription, id]
    );
    return result;
  }

  async deleteList(id) {
    await this.database.query(
      `DELETE
       FROM user_list
       WHERE list_id = ?`,
      [id]
    );

    await this.database.query(
      `DELETE
       FROM todo
       WHERE list_id = ?`,
      [id]
    );

    const [result] = await this.database.query(
      `DELETE
       FROM list
       WHERE id = ?`,
      [id]
    );
    return result;
  }

  async deleteUser(userId, listId) {
    const [result] = await this.database.query(
      `DELETE
       FROM user_list
       WHERE user_id = ?
         AND list_id = ?`,
      [userId, listId]
    );
    return result;
  }

  async addUser(userId, listId) {
    const [result] = await this.database.query(
      `INSERT INTO user_list (user_id, list_id, role)
       values (?, ?, DEFAULT)`,
      [userId, listId]
    );
    return result;
  }
}

module.exports = ListManager;
