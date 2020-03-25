const socket = io()
const user = $.deparam(window.location.search)
socket.on("connect", () => {
    console.log("connected to server")
    socket.emit("joinRoom", {
        user
    })
})
socket.on("newMessage", msg => {
    // const liTag = $(`<li>${msg.from} : ${msg.text}</li>`)
    // $("#messages").append(liTag)
    const template = $("#message-template").html()
    const html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: moment(msg.createdAt).format("LT")
    })
    $("#messages").append(html)
})
socket.on("locationFromServer", msg => {
    // const liTag = $(`<li>${msg.from} : <a target="blank" href="${msg.url}">User Location</a></li>`)
    const template = $("#location-template").html()
    const html = Mustache.render(template, {
        from: msg.from,
        url: msg.url,
        createdAt: moment(msg.createdAt).format("LT")
    })
    $("#messages").append(html)
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
        from: user.name,
        text: $("[name=message]").val()
    })
    $("[name=message]").val('')
})
$("#send-location").on("click", () => {
    if (!navigator.geolocation) return alert("your browser does not support geolocation")
    navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        socket.emit("locationFromClient", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    })
})
socket.on("usersInRoom", msg => {
    const users = msg.usersInRoom
    const olTag = $("<ol></ol>")
    users.forEach(user => {
        const liTag = $("<li></li>")
        liTag.text(user.name)
        olTag.append(liTag)
    })
    $("#users").html(olTag)
})