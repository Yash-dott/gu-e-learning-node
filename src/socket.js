
const socketInit = (io) => {

    io.on('connection', (socket) => {
        console.log("User connected");

        socket.on('disconnect', function (socket) {
            console.log("user disconnected")
        })
        socket.on('join', function (data) {

            socket.join(data.room)

            console.log(data.user + 'joined the room:' + data.room)

            socket.broadcast.to(data.room).emit('onlineUser', {user: data.user, message: "has joined the chat"});

        });

        socket.on('leave', function (data) {

            console.log(data.user + "has left the room " + data.room)
            socket.broadcast.to(data.room).emit('left room', {user: data.user, message: "has left the chat"});
            socket.leave(data.room)

        })
        socket.on('message', function (data) {
            console.log(data)
            io.in(data.room).emit('newMessage', {
                user: data.user,
                message: data.message,
                senderMobile: data.senderMobile,
                userId: data.userId,
                avatar: data.avatar
            })
        })
    });
}

module.exports = {socketInit};