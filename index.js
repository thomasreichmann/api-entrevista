require('dotenv').config()

const bodyParser = require("body-parser");

const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT

const mysql = require('mysql');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
});

const messageEvent = 'newMessage'
let localMessage = 'Init message';

pool.query(`SELECT \`message\` FROM \`messages\` WHERE \`id\` = 1;`, (err, row) => {
    if (err) console.error(err)

    localMessage = row[0].message
})

server.listen(port);

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.get('/memory_usage', (req, res) => {
    // Convercao bytes -> MB
    let mem = (process.memoryUsage().rss / 1048576).toFixed(2)

    res.send(mem)
})

app.get('/message', async (req, res) => {
    if (localMessage) {
        // Decide se a mensagem e um numero, se sim delay sera o numero, caso a mensagem seja texto, delay sera 0
        let delay = isNaN(localMessage) ? 0 : parseInt(localMessage)
        console.log(`GET /message sendo enviado com ${delay}ms de delay`)
        // Em teoria com essa implementacao mesmo se delay = 0, setTimeout agregaria um delay de ate 10ms na execucao
        await timeout(delay)

        res.send(localMessage)
    } else {
        res.sendStatus(419)
    }
})

app.post('/message', (req, res) => {
    let newMessage = req.body.newMessage;

    console.log(`Mensagem local: "${localMessage}", Alterada para "${newMessage}" Localmente`)

    localMessage = newMessage

    // Apos atualizar localMessage, mandamos a nova localMessage para todas as sockets
    io.sockets.emit(messageEvent, localMessage)

    res.sendStatus(204)

    // Update a mensagem na database apos mandar a resposta para evitar esperar pela query ser feita
    pool.query(`UPDATE \`messages\` SET \`message\` = '${localMessage}' WHERE \`id\` = 1;`)
})

app.get('/live', (req, res) => {
    // Enviamos a mensagem junto ao nome do socket event que a mensagem sera enviada
    let data = {
        message: localMessage,
        event: messageEvent
    }
    res.send(data)
})

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}