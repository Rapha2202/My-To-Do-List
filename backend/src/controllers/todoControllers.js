const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const { listId } = req.body;
    const readTodo = await tables.todo.readTodo(listId);
    res.status(200).send(readTodo);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { listId } = req.body;
    const todo = await tables.todo.createTodo(listId);
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

const checkListId = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId } = req.body;

    const user = await tables.user.checkToken(token);
    const result = await tables.list.checkListId(listId);

    if (result.length === 0) {
      res.status(200).send({ message: "List not found" });
    } else if (user.length === 0) {
      res.status(200).send({ message: "User not found" });
    } else if (result[0].user_id === user[0].id) {
      res.status(200).send({ message: "User Correct" });
    } else {
      res.status(200).send({ message: "User Incorrect" });
    }
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [list] = await tables.list.readList(id);
    res.status(200).send(list);
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId, todoId, details } = req.body;
    const { Titre, Description, priority, state } = details;

    const user = await tables.user.checkToken(token);
    const result = await tables.list.checkListId(listId);
    const todo = await tables.todo.readOne(todoId);

    let response = false;

    console.info(todo, details);

    if (result.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenu veuillez réessayer plus tard",
      });
    } else if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenu veuillez réessayer plus tard",
      });
    } else if (
      Titre === todo[0].todoName &&
      Description === todo[0].todoDescription &&
      priority === todo[0].priority_id &&
      state === todo[0].state_id
    ) {
      res.status(200).send({
        message: "Aucune modification n'a été apporté",
      });
    } else {
      result.map(async (element) => {
        if (element.user_id === user[0].id) {
          response = true;
        }
      });

      if (response) {
        await tables.todo.editTodo(todoId, Titre, Description, priority, state);
        res.status(200).send({ message: "Todo modifiée" });
      } else {
        res.status(200).send({
          message: "Une erreur est survenu veuillez réessayer plus tard",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId, todoId } = req.body;
    const user = await tables.user.checkToken(token);
    const result = await tables.list.checkListId(listId);

    let response = false;

    if (result.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenu veuillez réessayer plus tard",
      });
    } else if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenu veuillez réessayer plus tard",
      });
    } else {
      result.map(async (element) => {
        if (element.user_id === user[0].id) {
          response = true;
        }
      });

      if (response) {
        await tables.todo.deleteTodo(todoId);
        res.status(200).send({ message: "Todo supprimée" });
      } else {
        res.status(200).send({
          message: "Une erreur est survenu veuillez réessayer plus tard",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  create,
  checkListId,
  read,
  edit,
  deleteTodo,
};
