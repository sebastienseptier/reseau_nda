const db = require("../models");
const Post = db.posts;
const Tag = db.tags;
const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, posts, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


// Create and Save a new Post
exports.create = (req, res) => {
    const tagIds = req.body.tagIds ? JSON.parse(req.body.tagIds) : undefined;
    // Validate request
    if (!req.body.title || !req.body.description || !req.body.userId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Post
    const post = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
        userId: req.body.userId
    };

    // Save Post in the database
    Post.create(post)
        .then(data => {
            Post.findByPk(data.id)
                .then((newPost) => {
                    // Linking post to its tags
                    if (tagIds) {
                        tagIds.forEach(tagId => {
                            Tag.findByPk(tagId)
                                .then((tag) => {
                                    if (tag) {
                                        newPost.addTag(tag);
                                    }
                                })
                                .catch((err) => {
                                });
                        });
                    }
                    res.status(201);
                    res.send(newPost);
                })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Post."
            });
        });
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    
    
    Post.findAndCountAll({
        where: condition, limit, offset,
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name", "description"],
                through: {
                    attributes: ["tagid", "postid"],
                }
            }
        ]
    })
        .then(data => {
            console.log(data);
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving posts."
            });
        });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Post.findByPk(id, {
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name", "description"],
                through: {
                    attributes: ["tagid", "postid"],
                }
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Post with id=" + id
            });
        });
};

// Update a Post by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Post.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
};

// Delete a Post with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Post.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Post was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Post with id=" + id
            });
        });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
    Post.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Posts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all posts."
            });
        });
};

// Find all published Posts
exports.findAllPublished = (req, res) => {
    Post.findAll({
        where: { published: true },
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name", "description"],
                through: {
                    attributes: ["tagid", "postid"],
                }
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving posts."
            });
        });
};

// Find all Posts by tag ID
exports.findAllTagged = (req, res) => {
    // Validate request
    const tagIds = req.body.tagIds ? JSON.parse(req.body.tagIds) : undefined;

    if (!tagIds) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Post.findAll({
        where: { published: true },
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name", "description"],
                through: {
                    attributes: ["tagid", "postid"],
                },
                where: {
                    id: {
                        [Op.in]: tagIds
                    }
                }
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving posts."
            });
        });
};

// Associate a Post with a Tag
exports.addTag = (req, res) => {
    // Validate request
    const postId = req.body.postId ? req.body.postId : undefined;
    const tagId = req.body.tagId ? req.body.tagId : undefined;

    if (!postId || !tagId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Post.findByPk(postId)
        .then((post) => {
            if (!post) {
                res.status(500).send({
                    message: "Post not found."
                });
                return;
            }
            Tag.findByPk(tagId)
                .then((tag) => {
                    if (!tag) {
                        res.status(500).send({
                            message: "Tag not found."
                        });
                        return;
                    }

                    post.addTag(tag);
                    res.status(201);
                    res.send({ message: `Added tag ID ${tagId} to post ID ${postId}` });
                    return;
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Error while adding tag to post"
                    });
                    return;
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Error while adding tag to post"
            });
            return;
        });
};

// Delete a tag/post association with the specified ids in the request
exports.deleteTag = (req, res) => {
    // Validate request
    const postId = req.params.postId ? req.params.postId : undefined;
    const tagId = req.params.tagId ? req.params.tagId : undefined;

    if (!postId || !tagId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Post.findByPk(postId)
        .then((post) => {
            if (!post) {
                res.status(500).send({
                    message: "Post not found."
                });
                return;
            }
            Tag.findByPk(tagId)
                .then((tag) => {
                    if (!tag) {
                        res.status(500).send({
                            message: "Tag not found."
                        });
                        return;
                    }

                    post.removeTag(tag);
                    res.status(200);
                    res.send({ message: `Removed tag ID ${tagId} from post ID ${postId}` });
                    return;
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Error while removing tag to post"
                    });
                    return;
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Error while removing tag to post"
            });
            return;
        });
};