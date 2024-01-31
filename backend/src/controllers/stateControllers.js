const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const readState = await tables.state.readState(id);
    res.status(200).send(readState);
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
};
