const socket = io()
socket.on("connect", () => {
    console.log("connected to server")
})
socket.on("newMessage", msg => {
    const liTag = $(`<li>${msg.from} : ${msg.text}</li>`)
    $("#messages").append(liTag)
})
socket.on("locationFromServer", msg => {
    const liTag = $(`<li>${msg.from} : <a target="blank" href="${msg.url}">User Location</a></li>`)
    $("#messages").append(liTag)
})

// socket.emit("createMessage", {
//     from: "client@gmail.com",
//     to: "Hello admin co khoe khong",
//     // createdAt: Date.now()
// })
socket.on("disconnect", () => {
    console.log("disconnected to server")
})
$("#message-form").on("submit", event => {
    event.preventDefault()
    socket.emit("createMessage", {
        from: "User",
        text: $("[name=message]").val()
    })
    console.log($("[name=message]").val())
})
$("#send-location").on("click", () => {
    if(!navigator.geolocation) return alert("your browser does not support geolocation")
    navigator.geolocation.getCurrentPosition(position=>{
        console.log(position)
        socket.emit("locationFromClient",{
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    })
})