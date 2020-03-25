const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const Room = require('./model/Room')
const newRoom = new Room
const { generateMessage, generateLocation } = require('./util/messageTemplate')
io.on("connection", socket => {
    console.log("new user connected")
    socket.on("joinRoom", msg => {
        console.log(msg.user)
        const { name, room } = msg.user
        socket.join(room)
        console.log(socket.id)
        newRoom.createUser(socket.id, name, room)
        io.to(room).emit("usersInRoom", {
            usersInRoom: newRoom.getUserByRoom(room)
        })
        console.log(newRoom.user)
        socket.emit('newMessage',
            generateMessage("Admin", "Welcome to chatapp")
        )
        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${ name } joined the room`))
        socket.on('createMessage', msg => {
            console.log(msg)
            io.to(room).emit("newMessage", msg)
        })
        socket.on("messageFromClient", msg => {
            io.to(room).emit(
                "newMessage",
                generateMessage(
                    msg.from, msg.text
                )
            )
        })
        socket.on('locationFromClient', msg => {
            io.to(room).emit("locationFromServer", generateLocation(msg.from, msg.lat, msg.lng))
        })
        socket.on("disconnect", () => {

            console.log("user disconnected")
            const leftUser = newRoom.removeUser(socket.id)
            io.to(room).emit("usersInRoom", {
                userInroom: newRoom.getUserByRoom(room)
            })
            io.to(room).emit(
                "newMessage", generateMessage("Admin", `${leftUser.name} has left the room`)
            )
        })
    })

})
const port = 5000
const publicPath = path.join(`${__dirname}/../public`)
console.log(publicPath)
app.use(express.static(publicPath))
server.listen(port, () => {
    console.log("app is running on" + port)
})