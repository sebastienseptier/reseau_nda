const users = require("../controllers/user.controller.js");
const { authJwt } = require("../middlewares");

var router = require("express").Router();

// Create a new user
router.post("/", users.create);

// Retrieve all users
router.get("/", users.findAll);

// Retrieve a single user with id
router.get("/:id", [authJwt.verifyToken, authJwt.isModerator], users.findOne);

// Update a user with id
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.update);

// Delete a user with id
router.delete("/:id", users.delete);

// Delete all users
router.delete("/", users.deleteAll);

module.exports = router
