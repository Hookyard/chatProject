const express = require('express')

const db = require('./db/db')
const routes = require('./routes/routes')
require('./middlewares/auth')
const app = express()

db()

app.use(express.json())
app.use(require("body-parser")());
app.use(require("cookie-parser")());
app.use(require("express-session")({
    secret: "AZERTYUIKLJHGFDSQ",
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
    resave: false,
}))


app.use(routes)
app.listen(8080, () => console.log("je tourne sur le port 8080"))