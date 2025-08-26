const jwt = require("jsonwebtoken");
const tables = require("../tables");

const escapeHtml = require("../services/escapeHtml");

const createList = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.createList();

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else if (list.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      await tables.list.addUserToList(id, list.insertId, "creator");

      res.status(200).send({
        message: "Liste créée avec succès",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getLists = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.readUserLists(id);

    if (user.length === 0) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const lists = [];
      const ListMap = list.map(async (OneList) => {
        const [oneList] = await tables.list.readList(OneList.list_id);

        lists.push({
          id: oneList.id,
          name: oneList.name,
          description: oneList.description,
        });
      });
      Promise.all(ListMap).then(() => {
        res.status(200).send(lists);
      });
    }
  } catch (err) {
    next(err);
  }
};

const getListInfos = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    let accessToList = false;
    let creator = false;

    if (list.length === 0) {
      res.status(403).send({
        message: "Liste non trouvée",
      });
    } else if (user === undefined) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const listUsers = await tables.list.readUsersOnList(listId);

      const userPromises = listUsers.map(async (userList) => {
        const userInfos = await tables.user.read(userList.user_id);
        return {
          id: userInfos.id,
          username: userInfos.username,
          email: userInfos.email,
          role: userList.role,
        };
      });

      const users = await Promise.all(userPromises);

      listUsers.forEach((userList) => {
        if (userList.user_id === id) {
          accessToList = true;
        }
        if (userList.user_id === id && userList.role === "creator") {
          creator = true;
        }
      });

      res.status(200).send({
        accessToList,
        listInfos: list[0],
        listUsers: users,
        isCreator: creator,
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    if (list.length === 0) {
      res.status(403).send({
        message: "Liste non trouvée",
      });
    } else if (user === undefined) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const checkCreator = await tables.list.checkCreator(listId, id);

      if (checkCreator.length === 0) {
        res.status(403).send({
          message: "Vous n'avez pas les droits pour supprimer cette liste",
        });
      } else {
        await tables.todo.deleteListTodos(listId);
        await tables.list.deleteListUser(listId);
        await tables.list.deleteList(listId);

        res.status(200).send({
          message: "Liste supprimée avec succès",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const editList = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const name = escapeHtml(req.body.listName);
    const description = escapeHtml(req.body.listDescription);

    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    if (list.length === 0) {
      res.status(403).send({
        message: "Liste non trouvée",
      });
    } else if (user === undefined) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const checkCreator = await tables.list.checkCreator(listId, id);

      if (checkCreator.length === 0) {
        res.status(403).send({
          message: "Vous n'avez pas les droits pour modifier cette liste",
        });
      } else {
        await tables.list.editList(
          listId,
          escapeHtml(name),
          escapeHtml(description)
        );

        res.status(200).send({
          message: "Liste modifiée avec succès",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { listId, email } = req.params;
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    if (list.length === 0) {
      res.status(403).send({
        message: "Liste non trouvée",
      });
    } else if (user === undefined) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const checkCreator = await tables.list.checkCreator(listId, id);

      if (checkCreator.length === 0) {
        res.status(403).send({
          message: "Vous n'avez pas les droits pour supprimer cet utilisateur",
        });
      } else {
        const deletedUser = await tables.user.checkUser(email, email);

        await tables.list.deleteUser(listId, deletedUser[0].id);

        res.status(200).send({
          message: "Utilisateur supprimé avec succès",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const addUserToList = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { identifiant } = req.body;
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const list = await tables.list.checkListId(listId);

    if (list.length === 0) {
      res.status(403).send({
        message: "Liste non trouvée",
      });
    } else if (user === undefined) {
      res.status(403).send({
        message: "Une erreur est survenue, veuillez réessayer plus tard",
      });
    } else {
      const checkCreator = await tables.list.checkCreator(listId, id);

      if (checkCreator.length === 0) {
        res.status(403).send({
          message: "Vous n'avez pas les droits pour ajouter un utilisateur",
        });
      } else {
        const addedUser = await tables.user.checkUser(identifiant, identifiant);

        const listUsers = await tables.list.readUsersOnList(listId);

        if (addedUser.length === 0) {
          res.status(403).send({
            message: "L'utilisatuer n'a pas de compte sur ce site",
          });
        } else if (
          listUsers.filter((thisUser) => thisUser.user_id === addedUser[0].id)
            .length > 0
        ) {
          res.status(403).send({
            message: "L'utilisateur est déjà sur la liste",
          });
        } else {
          await tables.list.addUserToList(addedUser[0].id, listId);

          res.status(200).send({
            message: "Utilisateur ajouté avec succès",
          });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createList,
  getLists,
  getListInfos,
  deleteList,
  editList,
  deleteUser,
  addUserToList,
};
