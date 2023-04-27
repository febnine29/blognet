const { Socket } = require('socket.io')

const io = require('socket.io')(8800,{
    cors: {
        origin: "*"
    }
})

let activeUsers = []
io.on("connection", (socket) => {
    // add new user 
    socket.on('new-user-add', (newUserId) => {
        // if user is not added previously
        if(!activeUsers.some((user) => user.userId === newUserId)){
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("User Connected", activeUsers);
        io.emit('get-users', activeUsers)
        })
    socket.on("send-message", (data) => {
        const {fromId} = data;
        const user = activeUsers.find((user) => user.userId === fromId)
        console.log("user", user);
        console.log("Data", data);
        if(user){
            console.log('debug');
            io.to(user.socketId).emit("receive-message", data)
        }
    })
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId === socket.id)
        console.log("User Disconnected", activeUsers);
    })
})