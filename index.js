const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json({ limit: '50mb' }))
app.use('/', express.static(path.join(__dirname, '/public')))

app.get('/health', (req, res) => {
    return res.send({
        'status': 'ok',
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
