const AbstractManager = require("./AbstractManager");

class ToDoManager extends AbstractManager {
  constructor() {
    super({ table: "todo" });
  }

  // The C of CRUD - Create operation
  async readTodo(listId) {
    const [todo] = await this.database.query(
      `SELECT *
       FROM todo
       WHERE list_id = ?`,
      [listId]
    );
    return todo;
  }

  async readOne(todoId) {
    const [todo] = await this.database.query(
      `SELECT *
       FROM todo
       WHERE id = ?`,
      [todoId]
    );
    return todo;
  }

  async createTodo(listId) {
    const [result] = await this.database.query(
      `INSERT INTO todo (todoName, todoDescription, list_id, priority_id, state_id)
       values (DEFAULT, DEFAULT, ?, ?, ?)`,
      [listId, 3, 1]
    );
    return result;
  }

  async editTodo(todoId, Titre, Description, priority, state) {
    const [result] = await this.database.query(
      `UPDATE todo
       SET todoName        = ?,
           todoDescription = ?,
           priority_id     = ?,
           state_id        = ?
       WHERE id = ?`,
      [Titre, Description, priority, state, todoId]
    );
    return result;
  }

  async deleteTodo(todoId) {
    const [result] = await this.database.query(
      `DELETE
       FROM todo
       WHERE id = ?`,
      [todoId]
    );
    return result;
  }
}

module.exports = ToDoManager;
