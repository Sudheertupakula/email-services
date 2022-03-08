const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./config/mongoose")
const email_services = require("./controllers/email_services")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/**
 * Routes
 */
app.post("/", email_services.scheduleEmail)

app.get("/status",email_services.getByStatus)

app.get("/:id", email_services.readEmail)

app.get("/", email_services.emailList)

app.put("/:id", email_services.updateEmail)

app.delete("/:id", email_services.deleteEmail)

/**
 * server config
 */
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
})

module.exports = app;