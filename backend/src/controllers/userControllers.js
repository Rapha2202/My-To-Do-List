const jwt = require("jsonwebtoken");
const argon2 = require("@node-rs/argon2");
const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const users = await tables.user.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const user = await tables.user.read(req.params.id);

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  const { token } = req.cookies;
  const { username, lastUpdate } = req.body;

  try {
    const user = await tables.user.update(token, username, lastUpdate);

    if (user.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.status(202).send({ message: "user updated" });
    }
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  // Extract the item data from the request body
  const {
    username,
    hashedPassword,
    email,
    creationDate,
    lastUpdate,
    verification,
  } = req.body;

  try {
    // Insert the item into the database
    const user = await tables.user.signIn(email);
    const usernameTest = await tables.user.checkUsername(username);

    if (user.length === 1) {
      res.status(200).send({ message: "Email déjà utilisé" });
    } else if (usernameTest.length === 1) {
      res.status(200).send({ message: "Username déjà utilisé" });
    } else if (verification) {
      const insertId = await tables.user.create(
        username,
        hashedPassword,
        email,
        creationDate,
        lastUpdate
      );

      // Respond with HTTP 201 (Created) and the ID of the newly inserted item
      res.status(201).send({ message: "Compte créé", id: insertId });
    } else {
      res.status(200).send({ message: "Email non validé" });
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await tables.user.signIn(email);
    if (user.length === 1) {
      const verified = await argon2.verify(user[0].password, password);

      if (verified) {
        delete user[0].password;

        const tokenUser = jwt.sign(
          { email: user[0].email, userId: user[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        if (user[0].isAdmin === 1) {
          res.cookie("token", tokenUser, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.status(200).send({
            message: "Authentification réussie",
            token: tokenUser,
            admin: true,
          });
          await tables.user.saveToken(tokenUser, email);
        } else {
          res.cookie("token", tokenUser, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.status(200).send({
            message: "Authentification réussie",
            token: tokenUser,
            admin: false,
          });
          await tables.user.saveToken(tokenUser, email);
        }
      } else {
        res.status(200).send({ message: "Mot de passe incorrect" });
      }
    } else {
      res.status(200).send({
        message:
          "Aucun compte n'a été trouvé avec cet email ou ce nom d'utilisateur",
      });
    }
  } catch (err) {
    next(err);
  }
};

const checktoken = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { userId } = decodedToken;
    const checkUserToken = await tables.user.checkToken(token);
    if (
      checkUserToken.length === 1 &&
      checkUserToken[0].token === token &&
      checkUserToken[0].id === userId &&
      checkUserToken[0].isAdmin === 1
    ) {
      res.status(200).send({
        message: "OK",
        admin: true,
        username: checkUserToken[0].username,
        id: checkUserToken[0].id,
      });
    } else if (
      checkUserToken.length === 1 &&
      checkUserToken[0].token === token &&
      checkUserToken[0].id === userId &&
      checkUserToken[0].isAdmin === 0
    ) {
      res.status(200).send({
        message: "OK",
        admin: false,
        username: checkUserToken[0].username,
        id: checkUserToken[0].id,
      });
    } else res.status(200).send({ message: "ErrorElse" });
  } catch (err) {
    res.status(200).send({ message: "ErrorCatch" });
    next(err);
  }
};
// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

const userDelete = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { email, username, password } = req.body;
    const user = await tables.user.signIn(email, username);

    if (user.length === 1) {
      if (user[0].password === password) {
        if (user[0].token === token) {
          await tables.user.userDelete(user[0].id);
          res.status(200).send({ message: "Compte supprimé" });
        } else {
          res.status(200).send({ message: "Token incorrect" });
        }
      } else {
        res.status(200).send({ message: "Password incorrect" });
      }
    } else {
      res.status(200).send({ message: "Email incorrect" });
    }
  } catch (err) {
    next(err);
  }
};

const takeData = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const userData = await tables.user.takeData(token);
    if (userData.length === 1) {
      res.status(200).send(userData);
    } else {
      res.status(200).send({ message: "No User" });
    }
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  login,
  checktoken,
  userDelete,
  takeData,
};
