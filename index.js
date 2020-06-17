const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000

let localMessage = ''

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`App em porta ${port}`))

app.get('/memory_usage', (req, res) => {
    // Convercao bytes - MB
    let mem = (process.memoryUsage().rss / 1048576).toFixed(2)

    res.send(mem)
})

app.get('/message', (req, res) => {
    if(localMessage) {
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