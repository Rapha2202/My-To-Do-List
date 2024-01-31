const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const userControllers = require("./controllers/userControllers");
const listControllers = require("./controllers/listControllers");
const todoControllers = require("./controllers/todoControllers");
const priorityControllers = require("./controllers/priorityControllers");
const stateControllers = require("./controllers/stateControllers");

const { hashPassword } = require("./services/auth");
const { authCheck } = require("./services/authCheckMiddleware");

// Route to check token
router.get("/checktoken", userControllers.checktoken);

// Route to login
router.post("/login", userControllers.login);

// Route to add a new item
router.post("/users", hashPassword, userControllers.add);

router.use(authCheck);

// Route to get a list of items
router.get("/users", userControllers.browse);

// Route to get a list of items
router.get("/list/:id/users", listControllers.listUsers);

router.get("/iscreator/:id", listControllers.isCreator);

// Route to get a specific item by ID
router.get("/users/:id", userControllers.read);

// Route to edit a specific item by ID
router.post("/editusers", userControllers.edit);

// Route to delete
router.post("/deleteusers", userControllers.userDelete);

// Route to take data
router.get("/takedata", userControllers.takeData);

router.get("/readlist", listControllers.browse);

router.get("/createlist", listControllers.create);

router.post("/checklistid", listControllers.checkListId);

router.get("/list/:id", listControllers.read);

router.post("/editlist", listControllers.edit);

router.post("/deletelist", listControllers.deleteList);

router.post("/deletetodo", todoControllers.deleteTodo);

router.post("/readtodo", todoControllers.browse);

router.post("/createtodo", todoControllers.create);

router.get("/priority/:id", priorityControllers.browse);

router.get("/state/:id", stateControllers.browse);

router.post("/list/deleteuser", listControllers.deleteUser);

router.post("/list/adduser", listControllers.addUser);

router.post("/modifytodo", todoControllers.edit);

/* ************************************************************************* */

module.exports = router;
