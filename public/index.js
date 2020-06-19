// IP e port precisam ser alterados para os da maquina hosteando a api quando em "producao"
// caso contrario, localhost e mais pratico para desenvolvimento
const socket = io.connect('http://localhost:80');

// GET /live recebe o eventname e prepara o socket para receber o evento
$.get("live", (requestData) => {
    $('#getlive').text(requestData.message)

    socket.on(requestData.event, (socketData) => {
        $('#live').text(socketData)
    })  
})

$(document).ready(function () {

    // GET /message e atualiza o <p> do site
    $('#btGetMessage').click(() => {
        $.get("message", (data) => {
            $('#get').text(data)
        })
    })

    // POST /message com o valor do <input>
    $('#btPostMessage').click(() => {
        $.post("message", {newMessage: $("#postMessageInput").val()})
    })
})