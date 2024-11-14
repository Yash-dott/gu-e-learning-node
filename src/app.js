const express = require("express");
const bodyParser = require('body-parser')
const FileUpload = require('express-fileupload')
const os = require("os");
const app = express();
const cors = require('cors')
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://agra-college-admin.000webhostapp.com",
        "https://gochat.technosters.co.in",
        "http://localhost:3001",
        "https://ag-admin.000webhostapp.com",
        "https://agra-college-panel.onrender.com"
    ]
}))
app.use(FileUpload({
    tempFileDir: 'assets'
}));

app.use(express.json());
app.use(express.static("assets"));
// app.use(bodyParser.urlencoded({ extended: true }));



module.exports = { app };