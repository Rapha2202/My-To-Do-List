const AbstractManager = require("./AbstractManager");

class ListManager extends AbstractManager {
  constructor() {
    super({ table: "list" });
  }

  async createList() {
    const [result] = await this.database.query(
      `insert into ${this.table} (name, description)
             values (DEFAULT, DEFAULT)`
    );
    return result;
  }

  async deleteList(id) {
    const [result] = await this.database.query(
      `delete
             from ${this.table}
             where id = ?`,
      [id]
    );
    return result;
  }

  async addUserToList(userId, listId, role) {
    const userRole = role === "creator" ? "creator" : "guest";

    const [result] = await this.database.query(
      `insert into user_list (user_id, list_id, role)
             values (?, ?, ?)`,
      [userId, listId, userRole]
    );
    return result;
  }

  async readUserLists(userId) {
    const [lists] = await this.database.query(
      `select list_id
             from user_list
             where user_id = ?`,
      [userId]
    );
    return lists;
  }

  async deleteUserLists(userId) {
    const [lists] = await this.database.query(
      `delete
             from user_list
             where user_id = ?`,
      [userId]
    );
    return lists;
  }

  async readList(listId) {
    const [list] = await this.database.query(
      `select *
             from ${this.table}
             where id = ?`,
      [listId]
    );
    return list;
  }

  async checkListId(listId) {
    const [list] = await this.database.query(
      `select *
             from ${this.table}
             where id = ?`,
      [listId]
    );
    return list;
  }

  async readUsersOnList(id) {
    const [result] = await this.database.query(
      `select *
             from user_list
             where list_id = ?`,
      [id]
    );
    return result;
  }

  async checkCreator(listId, id) {
    const [result] = await this.database.query(
      `select * from user_list where list_id = ? and user_id = ? and role = 'creator'`,
      [listId, id]
    );
    return result;
  }

  async deleteListUser(listId) {
    const [result] = await this.database.query(
      `delete from user_list where list_id = ?`,
      [listId]
    );
    return result;
  }

  async editList(id, name, description) {
    const [result] = await this.database.query(
      `update ${this.table} set name = ?, description = ? where id = ?`,
      [name, description, id]
    );
    return result;
  }

  async deleteUser(listId, userId) {
    const [result] = await this.database.query(
      `delete from user_list where list_id = ? and user_id = ?`,
      [listId, userId]
    );
    return result;
  }
}

module.exports = ListManager;
