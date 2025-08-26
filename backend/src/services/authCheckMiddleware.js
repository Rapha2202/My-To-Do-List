const jwt = require("jsonwebtoken");
const tables = require("../tables");

const authCheck = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      res.status(204).send({ message: "Utilisateur non connecté" });
    } else {
      const { token } = req.cookies;

      const decodedToken = jwt.verify(token, process.env.APP_SECRET);

      const { id } = decodedToken;

      const checkUserToken = await tables.user.read(id);

      if (checkUserToken.id === id) {
        next();
      } else {
        res
          .status(401)
          .send({ message: "Vous n'avez pas accès a cette page!" });
      }
    }
  } catch (err) {
    res.status(401).send({ message: "Vous n'avez pas accès a cette page!" });
    next(err);
  }
};

module.exports = { authCheck };
