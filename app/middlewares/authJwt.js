const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    var bearer = token.split(" ");
    token = bearer[1];

    User.findByPk(req.userId).then(user => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err || !user) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            req.userId = decoded.id;
            next();
        });
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user) {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Admin Role!"
                });
                return;
            });
        }
        else {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user) {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Moderator Role!"
                });
            });
        }
        else {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    });
};

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user) {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }

                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Moderator or Admin Role!"
                });
            });
        }
        else {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;