const db = require("../models");
const Tag = db.tags;

// Create and Save a new Tag
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tag
    const tag = {
        name: req.body.name,
        description: req.body.description
    };

    // Save Tag in the database
    Tag.create(tag)
        .then(data => {
            res.status(201);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tag."
            });
        });
};

// Retrieve all Tags from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Tag.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tags."
            });
        });
};

// Update a Tag by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tag.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tag was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tag with id=${id}. Maybe Tag was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tag with id=" + id
            });
        });
};

// Delete a Tag with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tag.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tag was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tag with id=${id}. Maybe Tag was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tag with id=" + id
            });
        });
};

// Delete all Tags from the database.
exports.deleteAll = (req, res) => {
    Tag.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Tags were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tags."
            });
        });
};