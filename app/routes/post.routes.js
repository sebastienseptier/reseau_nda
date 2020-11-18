const posts = require("../controllers/post.controller.js");

var router = require("express").Router();

// Create a new Post
router.post("/", posts.create);

// Retrieve all Posts
router.get("/", posts.findAll);

// Retrieve all published Posts
router.get("/published", posts.findAllPublished);

// Retrieve all Posts from tag ID
router.get("/tags", posts.findAllTagged);

// Retrieve a single Post with id
router.get("/:id", posts.findOne);

// Update a Post with id
router.put("/:id", posts.update);

// Delete a Post with id
router.delete("/:id", posts.delete);

// Delete all Posts
router.delete("/", posts.deleteAll);

// Add a new tag to a Post
router.post("/tags", posts.addTag);

// Delete a tag/post association
router.delete("/:postId/tags/:tagId", posts.deleteTag);

module.exports = router