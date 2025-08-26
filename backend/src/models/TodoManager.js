const AbstractManager = require("./AbstractManager");

class TodoManager extends AbstractManager {
  constructor() {
    super({ table: "todo" });
  }

  async deleteListTodos(listId) {
    const [result] = await this.database.query(
      `DELETE
       FROM ${this.table}
       WHERE list_id = ?`,
      [listId]
    );
    return result;
  }

  async priorityTodoList(name) {
    const [result] = await this.database.query(
      `SELECT *
       FROM priority WHERE priority = ?`,
      [name]
    );
    return result;
  }

  async stateTodoList(name) {
    const [result] = await this.database.query(
      `SELECT *
       FROM state WHERE state = ?`,
      [name]
    );
    return result;
  }

  async createTodo(listId, priorityId, stateId) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (name, description, list_id, priority_id, state_id)
       VALUES (DEFAULT, DEFAULT, ?, ?, ?)`,
      [listId, priorityId, stateId]
    );
    return result;
  }

  async readListTodos(listId) {
    const [result] = await this.database.query(
      `SELECT *
       FROM ${this.table}
       WHERE list_id = ?`,
      [listId]
    );
    return result;
  }

  async readPriority() {
    const [result] = await this.database.query(
      `SELECT *
       FROM priority`
    );
    return result;
  }

  async readState() {
    const [result] = await this.database.query(
      `SELECT *
       FROM state`
    );
    return result;
  }

  async readTodo(todoId) {
    const [result] = await this.database.query(
      `SELECT *
       FROM ${this.table}
       WHERE id = ?`,
      [todoId]
    );
    return result;
  }

  async deleteTodo(todoId) {
    const [result] = await this.database.query(
      `DELETE
       FROM ${this.table}
       WHERE id = ?`,
      [todoId]
    );
    return result;
  }

  async editTodo(todoId, todoName, todoDescription, priorityId, stateId) {
    const [result] = await this.database.query(
      `UPDATE ${this.table}
         SET name        = ?,
             description = ?,
             priority_id = ?,
             state_id    = ?
         WHERE id = ?`,
      [todoName, todoDescription, priorityId, stateId, todoId]
    );
    return result;
  }
}

module.exports = TodoManager;
