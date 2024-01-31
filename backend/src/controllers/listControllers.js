const jwt = require("jsonwebtoken");

const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation

const browse = async (req, res, next) => {
  try {
    const list = [];
    const { token } = req.cookies;
    const user = await tables.user.checkToken(token);
    const userList = await tables.list.readUser(user[0].id);
    const UserListMap = userList.map(async (OneList) => {
      const test = await tables.list.readList(OneList.list_id);
      list.push(test);
    });

    Promise.all(UserListMap).then(() => {
      res.json(list);
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user = await tables.user.checkToken(token);
    const list = await tables.list.createList();
    if (user.length === 0) {
      res.status(200).send({ message: "User not found" });
    } else if (list.length === 0) {
      res.status(200).send({ message: "Une erreur est survenue" });
    } else {
      await tables.list.createLiaison(user[0].id, list.insertId);
      res.json(list.insertId);
    }
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

    const resultat = [];

    if (result.length === 0) {
      res.status(200).send({ message: "List not found" });
    } else if (user.length === 0) {
      res.status(200).send({ message: "User not found" });
    } else {
      for (let i = 0; i < user.length; i += 1) {
        for (let j = 0; j < result.length; j += 1) {
          if (result[j].user_id === user[i].id) {
            resultat.push(true);
          } else {
            resultat.push(false);
          }
        }
      }

      if (resultat.includes(true)) {
        res.status(200).send({ message: "User Correct" });
      } else {
        res.status(200).send({ message: "User Incorrect" });
      }
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
    const { listId, listName, listDescription } = req.body;
    const user = await tables.user.checkToken(token);
    const result = await tables.list.checkListId(listId);
    const [list] = await tables.list.readList(listId);

    if (result.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (
      list.listName === listName &&
      list.listDescription === listDescription
    ) {
      res.status(200).send({
        message: "Aucune modification n'a été effectué",
      });
    } else if (result[0].user_id === user[0].id) {
      await tables.list.editList(listId, listName, listDescription);
      res.status(200).send({ message: "Modification réussie" });
    } else {
      res.status(200).send({
        message: "Vous n'avez pas la permission pour modifier cette liste",
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId } = req.body;
    const user = await tables.user.checkToken(token);
    const result = await tables.list.checkListId(listId);

    if (result.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (result[0].user_id === user[0].id) {
      await tables.list.deleteList(listId);
      res.status(200).send({ message: "Liste supprimée" });
    } else {
      res.status(200).send({
        message: "Vous n'avez pas la permission pour supprimer cette liste",
      });
    }
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await tables.list.readUsersOnList(id);
    const user = [];
    const UserMap = list.map(async (OneUser) => {
      const test = await tables.user.read(OneUser.user_id);
      user.push({
        id: test.id,
        username: test.username,
        email: test.email,
        role: OneUser.role,
        creationDate: test.creationDate,
        lastUpdate: test.lastUpdate,
      });
    });
    Promise.all(UserMap).then(() => {
      res.status(200).send(user);
    });
  } catch (err) {
    next(err);
  }
};

const isCreator = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const { token } = req.cookies;

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const list = await tables.list.checkCreator(listId, userId);

    res.status(200).send({ role: list[0].role });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId, username } = req.body;

    const user = await tables.user.checkToken(token);

    if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const userToDelete = await tables.user.checkUsername(username);
      if (userToDelete.length === 0) {
        res
          .status(200)
          .send({ message: "L'utilisateur n'est pas dans la liste" });
      } else {
        await tables.list.deleteUser(userToDelete[0].id, listId);
        res.status(200).send({ message: "User deleted" });
      }
    }
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { listId, email } = req.body;

    const user = await tables.user.checkToken(token);

    if (user.length === 0) {
      res.status(200).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (user[0].email === email) {
      res.status(200).send({
        message: "Vous ne pouvez pas vous ajouter vous même",
      });
    } else {
      const userToAdd = await tables.user.checkEmail(email);

      if (userToAdd.length === 0) {
        res.status(200).send({
          message:
            "L'utilisateur que vous souhaitez ajouter n'a pas de compte sur le site",
        });
      } else {
        const userAlreadyInList = await tables.list.checkCreator(
          listId,
          userToAdd[0].id
        );
        if (userAlreadyInList.length === 0) {
          await tables.list.addUser(userToAdd[0].id, listId);
          res.status(200).send({ message: "User added" });
        } else {
          res.status(200).send({
            message:
              "L'utilisateur que vous souhaitez ajouter est déjà dans la liste",
          });
        }
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
  deleteList,
  listUsers,
  isCreator,
  deleteUser,
  addUser,
};
