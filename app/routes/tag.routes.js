const tags = require("../controllers/tag.controller.js");

var router = require("express").Router();

// Create a new Tag
router.post("/", tags.create);

// Retrieve all Tags
router.get("/", tags.findAll);

// Update a Tag with id
router.put("/:id", tags.update);

// Delete a Tag with id
router.delete("/:id", tags.delete);

// Delete all Tags
router.delete("/", tags.deleteAll);

module.exports = router