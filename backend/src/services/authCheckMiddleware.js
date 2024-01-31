const jwt = require("jsonwebtoken");
const tables = require("../tables");

const authCheck = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      res.status(204).send({ message: "Not Connected" });
    } else {
      const { token } = req.cookies;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const { email, userId } = decodedToken;
      const checkUserToken = await tables.user.checkToken(token);

      if (
        checkUserToken.length === 1 &&
        checkUserToken[0].token === token &&
        checkUserToken[0].email === email &&
        checkUserToken[0].id === userId
      ) {
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
