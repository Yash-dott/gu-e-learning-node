const express = require("express");
const bodyParser = require('body-parser')
const FileUpload = require('express-fileupload')
const os = require("os");
const app = express();
const cors = require('cors')
app.use(cors({
    origin: [
        "https://gu-ems-react.onrender.com"
    ]
}))
app.use(FileUpload({
    tempFileDir: 'assets'
}));

app.use(express.json());
app.use(express.static("assets"));
// app.use(bodyParser.urlencoded({ extended: true }));


module.exports = {app};