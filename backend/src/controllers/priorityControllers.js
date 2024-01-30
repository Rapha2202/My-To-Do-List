const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const readPriority = await tables.priority.readPriority(id);
    res.status(200).send(readPriority);
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
};
