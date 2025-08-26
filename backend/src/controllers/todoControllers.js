const jwt = require("jsonwebtoken");
const tables = require("../tables");

const escapeHtml = require("../services/escapeHtml");

const createTodo = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId } = req.params;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (list.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const [priority] = await tables.todo.priorityTodoList("Moyenne");
      const [state] = await tables.todo.stateTodoList("A faire");

      await tables.todo.createTodo(listId, priority.id, state.id);

      res.status(200).send({
        message: "Tâche créée avec succès",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId } = req.params;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const todo = await tables.todo.readListTodos(listId);

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      res.status(200).send(todo);
    }
  } catch (err) {
    next(err);
  }
};

const getPriority = async (req, res, next) => {
  try {
    const priority = await tables.todo.readPriority();

    res.status(200).send(priority);
  } catch (err) {
    next(err);
  }
};

const getState = async (req, res, next) => {
  try {
    const state = await tables.todo.readState();

    res.status(200).send(state);
  } catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { todoId } = req.params;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const todo = await tables.todo.readTodo(todoId);

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (todo.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      await tables.todo.deleteTodo(todoId);

      res.status(200).send({
        message: "Tâche supprimée avec succès",
      });
    }
  } catch (err) {
    next(err);
  }
};

const editTodo = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { todoId } = req.params;
    const { todoName, todoDescription, priorityId, stateId } = req.body.details;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const todo = await tables.todo.readTodo(todoId);

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (todo.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      await tables.todo.editTodo(
        todoId,
        todoName,
        todoDescription,
        priorityId,
        stateId
      );

      res.status(200).send({
        message: "Tâche modifiée avec succès",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getPriority,
  getState,
  deleteTodo,
  editTodo,
};
