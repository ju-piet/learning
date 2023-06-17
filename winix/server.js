const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('./services/database/mongoose')
const auth = require('./services/auth/auth')
const express = require('express')
const app = express()

const PORT = 3000

app
    .use(bodyParser.json())
    .use(morgan('dev'))

// Appel des routes Users, Annonces et Login
const usersRoutes = require('./app/routes/usersRoutes')
const annoncesRoutes = require('./app/routes/annoncesRoutes')
require('./app/routes/login')(app)

app.use('/api/users', auth, usersRoutes)
app.use('/api/annonces', auth, annoncesRoutes)


app.use(({res}) => {
    const message = "Impossible de fournir la ressource demandée. Veuillez utiliser une autre URL"
    res.status(404).json({message})
})

app.listen(PORT, () => { console.log(`Server is running on : http://localhost:${PORT}`) })










  






