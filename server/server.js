const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const { generateMessage, generateLocation } = require('./util/messageTemplate')
io.on("connection", socket => {
    console.log("new user connected")
    socket.emit('newMessage',
        generateMessage("Admin", "Welcome to chatapp")
    )
    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"))
    socket.on('createMessage', msg => {
        console.log(msg)
        io.emit("newMessage", msg)
    })
    socket.on('locationFromClient', msg => {
        io.emit("locationFromServer", generateLocation("User", msg.lat, msg.lng))
    })
    socket.on("disconnect", () => {
        ~
            console.log("user disconnected")
    })
})
const port = 5000
const publicPath = path.join(`${__dirname}/../public`)
console.log(publicPath)
app.use(express.static(publicPath))
server.listen(port, () => {
    console.log("app is running on" + port)
})