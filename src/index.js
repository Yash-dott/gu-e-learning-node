const requireDir = require('require-dir');
const { app } = require('./app')
const { error } = require('./helpers/response')
require('../src/models')
const {Server} = require("socket.io");
const {socketInit} = require("./socket");
require('dotenv').config();

requireDir("./controllers", { recurse: true });
requireDir('./routes');

app.use(function (err, req, res, next) {
    res.json(error(err.message));
});
const server = app.listen(9000,async () => {
    console.log(`app is listening on port: 9000 `)
})

const io = new Server(server, {
    cors: {
        origins: ['*'],
    }
});


socketInit(io);


module.exports = { app, server }