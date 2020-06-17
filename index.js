const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000

let localMessage = 'Init message'

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`App em porta ${port}`))

app.get('/memory_usage', (req, res) => {
    // Convercao bytes - MB
    let mem = (process.memoryUsage().rss / 1048576).toFixed(2)

    res.send(mem)
})

app.get('/message', async (req, res) => {
    if (localMessage) {
        // Decide se a mensagem e um numero, se sim delay sera o numero, caso a mensagem seja texto, delay sera 0
        let delay = isNaN(localMessage) ? 0 : parseInt(localMessage)
        console.log(`GET /message sendo enviado com ${delay}ms de delay`)
        // Em teoria essa implementacao mesmo se delay = 0, setTimeout agrega um delay de ate 10ms na execucao
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
    res.sendStatus(204)
})

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}