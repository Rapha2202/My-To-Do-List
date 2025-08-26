const jwt = require("jsonwebtoken");
const argon2 = require("@node-rs/argon2");
const uniqid = require("uniqid");
const { createTransport } = require("nodemailer");

const tables = require("../tables");

const escapeHtml = require("../services/escapeHtml");

function isEmailValid(value) {
  const emailPattern = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  return emailPattern.test(value);
}

function isPasswordValid(value) {
  const passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,32}$/gm;

  return passwordPattern.test(value);
}

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const register = async (req, res, next) => {
  const { creationDate, lastUpdate } = req.body;

  const username = escapeHtml(req.body.username);
  const email = escapeHtml(req.body.email);
  const password = escapeHtml(req.body.password);
  const passwordConfirm = escapeHtml(req.body.passwordConfirm);

  try {
    const checkEmail = await tables.user.checkUser(email, email);
    const checkUsername = await tables.user.checkUser(username, username);

    const verifyToken = uniqid();

    const hashedPassword = await argon2.hash(password, hashingOptions);

    const checkPassword = await argon2.verify(hashedPassword, passwordConfirm);

    if (!isEmailValid(email)) {
      res
        .status(403)
        .send({ message: "Votre adresse email n'est pas dans le bon format" });
    } else if (!isPasswordValid(password)) {
      res.status(403).send({
        message:
          "Votre mot de passe doit contenir à la fois une majuscule, une minuscule, un caractère spécial, et doit être compris entre 8 et 32 caractères",
      });
    } else if (checkEmail.length === 1) {
      res
        .status(403)
        .send({ message: "Cette adresse email est déjà utilisée" });
    } else if (checkUsername.length === 1) {
      res
        .status(403)
        .send({ message: "Ce nom d'utilisateur est déjà utilisé" });
    } else if (!checkPassword) {
      res
        .status(403)
        .send({ message: "Les mots de passe ne correspondent pas" });
    } else {
      await tables.user.create(
        username,
        email,
        hashedPassword,
        creationDate,
        lastUpdate
      );

      await tables.verification.create(email, verifyToken);

      res.status(201).send({
        message: "Votre compte a était crée et est en attente de vérification",
      });

      const mailOptions = {
        from: `MyToDoList <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Vérification de votre adresse email",
        html: `
            <h1>Bienvenue sur MyToDoList</h1>
            <p>Merci de vous être inscrit sur notre site. Pour vérifier votre adresse email, veuillez cliquer sur le lien ci-dessous.</p>
            <a href="${process.env.FRONTEND_URL}/verify/${verifyToken}">Vérifier mon adresse email</a>
            <p>Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer cet email.</p>
            `,
      };

      transporter.sendMail(mailOptions);

      setTimeout(async () => {
        const checkVerification = await tables.user.checkUser(email);

        if (checkVerification[0].emailVerified === 0) {
          await tables.user.destroy(email);
          await tables.verification.destroy(email);
        } else {
          await tables.verification.destroy(email);
        }
      }, 120000);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { lastLogin } = req.body;
    const email = escapeHtml(req.body.email);
    const username = escapeHtml(req.body.email);
    const password = escapeHtml(req.body.password);
    const checkUser = await tables.user.checkUser(email, username);

    if (checkUser.length === 0) {
      res.status(403).send({
        message:
          "Aucun compte n'a été trouvé avec cet adresse email ou ce nom d'utilisateur",
      });
    } else if (checkUser[0].emailVerified === 0) {
      res.status(403).send({
        message:
          "Votre adresse email n'a pas été vérifiée veuillez vérifier votre boîte mail pour valider votre compte",
      });
    } else {
      const { lockUntil, passwordTry } = checkUser[0];

      if (lockUntil > Date.now() && passwordTry >= 5) {
        const unlockTime = new Date(lockUntil - new Date()).getMinutes();
        res.status(403).send({
          message: `Vous avez dépassé le nombre de tentatives de connexion autorisées veuillez réessayer dans ${unlockTime} minutes`,
        });
      } else {
        const checkPassword = await argon2.verify(
          checkUser[0].password,
          password
        );

        if (lockUntil < Date.now()) {
          await tables.user.resetPasswordTry(email, username);
          await tables.user.unlockAccount(email, username);
        }

        if (!checkPassword) {
          await tables.user.lockAccount(email, username, Date.now() + 1200000);
          await tables.user.incrementPasswordTry(email, username);
          if (passwordTry >= 4) {
            res.status(403).send({
              message:
                "Vous venez de dépasser le nombre de tentatives de connexion autorisées veuillez réessayer dans 20 minutes",
            });
          } else {
            res.status(403).send({ message: "Mot de passe incorrect" });
          }
        } else {
          delete checkUser[0].password;
          await tables.user.resetPasswordTry(email, username);
          await tables.user.unlockAccount(email, username);

          const token = jwt.sign(
            { id: checkUser[0].id },
            process.env.APP_SECRET,
            { expiresIn: "1h" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.status(200).send({
            message: "Authentification réussie, connexion en cours...",
          });

          await tables.user.updateLastLogin(email, username, lastLogin);
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

const checkIdOnChangePage = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      const { token } = req.cookies;

      const { id } = jwt.verify(token, process.env.APP_SECRET);

      const checkUser = await tables.user.read(id);

      if (checkUser !== null && checkUser.emailVerified === 1) {
        res.status(200).send({ login: true });
      } else {
        res.status(200).send({ login: false });
      }
    } else {
      res.status(200).send({ login: false });
    }
  } catch (err) {
    next(err);
  }
};

const getUserInfos = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);

    if (user === null || user === undefined) {
      res.status(403).send({ message: "Aucun utilisateur trouvé" });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const checkToken = await tables.verification.readByToken(token);

    if (checkToken.length === 0) {
      res.status(403).send({
        message:
          "Votre compte a déjà été vérifier ou le lien de vérification a expiré",
      });
    } else {
      await tables.user.verifyEmail(checkToken[0].email);
      await tables.verification.destroy(checkToken[0].email);

      res.status(200).send({ message: "Votre compte a été vérifié" });
    }
  } catch (err) {
    next(err);
  }
};

const checkPasswordToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const checkToken = await tables.verification.readByToken(token);

    if (checkToken.length === 0) {
      res.status(403).send({
        message:
          "La demande de réinitialisation de mot de passe a expiré ou n'existe pas",
      });
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const identifiant = escapeHtml(req.body.email);

    const checkUser = await tables.user.checkUser(identifiant);

    if (checkUser.length === 0 || checkUser[0].emailVerified === 0) {
      res.status(403).send({
        message: "Aucun compte n'a été trouvé avec cet adresse email",
      });
    } else {
      const { email } = checkUser[0];
      const verifyToken = uniqid();

      await tables.verification.create(email, verifyToken);

      const mailOptions = {
        from: `MyToDoList <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous.</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${verifyToken}">Réinitialiser mon mot de passe</a>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
            `,
      };

      transporter.sendMail(mailOptions);

      res.status(200).send({
        message:
          "Un email de réinitialisation de mot de passe vous a été envoyé",
      });

      setTimeout(async () => {
        await tables.verification.destroy(email);
      }, 300000);
    }
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedPassword = escapeHtml(req.body.hashedPassword);
    const passwordConfirm = escapeHtml(req.body.passwordConfirm);

    const checkToken = await tables.verification.readByToken(token);

    const checkUser = await tables.user.checkUser(checkToken[0].email);

    const checkLastPassword = await argon2.verify(
      checkUser[0].password,
      passwordConfirm
    );

    if (checkToken.length === 0) {
      res.status(403).send({
        message:
          "La demande de réinitialisation de mot de passe a expiré ou n'existe pas",
      });
    } else {
      const checkPassword = await argon2.verify(
        hashedPassword,
        passwordConfirm
      );

      if (!checkPassword) {
        res
          .status(403)
          .send({ message: "Les mots de passe ne correspondent pas" });
      } else if (checkLastPassword) {
        res.status(403).send({
          message: "Votre nouveau mot de passe doit être différent de l'ancien",
        });
      } else if (!isPasswordValid(passwordConfirm)) {
        res.status(403).send({
          message:
            "Votre mot de passe doit contenir à la fois une majuscule, une minuscule et un caractère spécial, et doit être compris entre 8 et 32 caractères",
        });
      } else {
        await tables.user.updatePassword(checkToken[0].email, hashedPassword);

        await tables.verification.destroy(checkToken[0].email);

        res
          .status(200)
          .send({ message: "Votre mot de passe a été réinitialisé" });
      }
    }
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Vous avez été déconnecté" });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const identifiant = escapeHtml(req.params.identifiant);

    const user = await tables.user.checkUser(identifiant, identifiant);

    const { id } = user[0];

    const lists = await tables.list.readUserLists(id);

    console.info(lists);

    const deleteTodo = lists.map(async (list) => {
      const isCreator = await tables.list.checkCreator(list.list_id, id);

      await tables.list.deleteUserLists(id);

      if (isCreator.length === 1) {
        await tables.todo.deleteListTodos(list.list_id);
        await tables.list.deleteListUser(list.list_id);
        await tables.list.deleteList(list.list_id);
      }
    });

    await Promise.all(deleteTodo);

    await tables.user.destroy(id);

    res.status(200).send({ message: "Votre compte a été supprimé" });
  } catch (err) {
    next(err);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { username } = req.body;

    const { id } = jwt.verify(token, process.env.APP_SECRET);

    const user = await tables.user.read(id);
    const checkUsername = await tables.user.checkUser(username, username);

    if (username === "") {
      res
        .status(403)
        .send({ message: "Votre nom d'utilisateur ne peut pas être vide" });
    } else if (username.length > 20) {
      res.status(403).send({
        message: "Votre nom d'utilisateur ne peut pas dépasser 20 caractères",
      });
    } else if (username === user.username) {
      res.status(403).send({ message: "Votre nom d'utilisateur est le même" });
    } else if (checkUsername.length === 1) {
      res
        .status(403)
        .send({ message: "Ce nom d'utilisateur est déjà utilisé" });
    } else {
      await tables.user.updateUsername(id, username);
      res
        .status(200)
        .send({ message: "Votre nom d'utilisateur a été modifié" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  checkIdOnChangePage,
  verifyEmail,
  resetPassword,
  checkPasswordToken,
  changePassword,
  logout,
  getUserInfos,
  deleteAccount,
  editUser,
};
