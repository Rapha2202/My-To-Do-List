const express = require("express");

const router = express.Router();

const userControllers = require("./controllers/userControllers");
const listControllers = require("./controllers/listControllers");
const todoControllers = require("./controllers/todoControllers");

const { hashPassword } = require("./services/auth");

const { authCheck } = require("./services/authCheckMiddleware");

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

router.post("/user/register", userControllers.register);

router.post("/user/login", userControllers.login);

router.get("/user/check-id", userControllers.checkIdOnChangePage);

router.get("/user/verify/:token", userControllers.verifyEmail);

router.post("/user/reset-password", userControllers.resetPassword);

router.put("/user/check-password/:token", userControllers.checkPasswordToken);

router.delete("/user/delete/:identifiant", userControllers.deleteAccount);

router.use(authCheck);

router.get("/user/infos", userControllers.getUserInfos);

router.get("/list/:listId/infos", listControllers.getListInfos);

router.get("/list/create-list", listControllers.createList);

router.get("/list/get-lists", listControllers.getLists);

router.put("/user/edit", userControllers.editUser);

router.put(
  "/user/reset-password/:token",
  hashPassword,
  userControllers.changePassword
);

router.get("/user/logout", userControllers.logout);

router.delete("/list/:listId/delete", listControllers.deleteList);

router.put("/list/:listId/edit", listControllers.editList);

router.delete("/list/:listId/delete-user/:email", listControllers.deleteUser);

router.post("/list/:listId/add-user", listControllers.addUserToList);

router.get("/list/:listId/create-todo", todoControllers.createTodo);

router.get("/list/:listId/get-todos", todoControllers.getTodos);

router.get("/todo/priority", todoControllers.getPriority);

router.get("/todo/state", todoControllers.getState);

router.delete("/todo/:todoId/delete", todoControllers.deleteTodo);

router.put("/todo/:todoId/edit", todoControllers.editTodo);

/* ************************************************************************* */

module.exports = router;
