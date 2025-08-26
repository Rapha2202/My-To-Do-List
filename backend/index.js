require("dotenv").config();

const app = require("./src/app");

const port = process.env.APP_PORT;

app
  .listen(port, () => {
    console.info(`Le serveur est lancé sur la port: ${port}`);
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });
