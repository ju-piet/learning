const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('./services/database/mongoose')
const express = require('express')
const app = express()

const PORT = 3000

app
    .use(bodyParser.json())
    .use(morgan('dev'))

require('./app/routes/login')(app)

// Appel des routes Users, Annonces et Login
const usersRoutes = require('./app/routes/usersRoutes')
const annoncesRoutes = require('./app/routes/annoncesRoutes')

app.use('/api/users', usersRoutes)
app.use('/api/annonces', annoncesRoutes)


app.use(({res}) => {
    const message = "Impossible de fournir la ressource demandée. Veuillez utiliser une autre URL"
    res.status(404).json({message})
})

const server = app.listen(PORT, () => { console.log(`Server is running on : http://localhost:${PORT}`) })

module.exports = server










  






