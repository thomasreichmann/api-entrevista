const socket = io.connect('http://localhost:80');

$.get("live", (requestData) => {
    $('#getlive').text(requestData.message)

    socket.on(requestData.event, (socketData) => {
        $('#live').text(socketData)
    })  
})

$(document).ready(function () {
    $('#btGetMessage').click(() => {
        console.log(`a`)
        $.get("message", (data) => {
            $('#get').text(data)
        })
    })

    $('#btPostMessage').click(() => {
        $.post("message", {newMessage: $("#postMessageInput").val()})
    })
})