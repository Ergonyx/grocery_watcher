// Require node modules
// Make variables inside .env element available to project
require("dotenv").config();
// Grab the MySQL stuff so I can do database things.
const sql = require("mysql");
// Pull in express and CORS for API calls.
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbService = require('./dbService')

// These seem to just appear. Honestly not sure wtf is going on here.
const { response } = require("express");

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`App listening on port 5000`)
})

// All the Database things.

// CREATE
app.post('/v1/add', (req, res) => {
    const db = dbService.getDbServiceInstance();
    const result = db.addNew(req.body)
    result
    .then(data => {
        res.send(data)
    })
    .catch(err => console.log(err))
})
// READ

// UPDATE

// DELETE

