const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`App em porta ${port}`))

app.get('/memory_usage', (req, res) => {
    // Convercao bytes - MB
    let mem = (process.memoryUsage().rss / 1048576).toFixed(2)

    res.send(mem)
})

app.get()