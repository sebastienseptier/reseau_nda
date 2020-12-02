const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const app = express();

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

// parse requests of content-type - application/json 
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// sync with database
const db = require("./app/models");
const Role = db.roles;
db.sequelize.sync().then(() => {
    console.log('Resync Db');
    initial();
});;

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to reseau-nda application." });
});

//Connect server to Angular project
//app.use('*', express.static(path.join(__dirname, './front/dist')));

const userRouter = require('./app/routes/user.routes');
const postRouter = require('./app/routes/post.routes');
const tagRouter = require('./app/routes/tag.routes');
require('./app/routes/auth.routes')(app);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/tags', tagRouter);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });
    Role.create({
        id: 2,
        name: "moderator"
    });
    Role.create({
        id: 3,
        name: "admin"
    });
}

module.exports = app;