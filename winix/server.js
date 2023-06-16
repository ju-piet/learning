const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('./database/mongoose')
const express = require('express')
const app = express()

const PORT = 3000

app
    .use(bodyParser.json())
    .use(morgan('dev'))

// Appel de la route LOGIN
require('./routes/auth/login')(app)


// Appel des routes USERS
require('./routes/users/createUser')(app)
require('./routes/users/findOneUser')(app)
require('./routes/users/findAllUsers')(app)
require('./routes/users/updateUser')(app)
require('./routes/users/deleteUser')(app)

// Appel des routes ANNONCES
require('./routes/annonces/createAnnonce')(app)
require('./routes/annonces/findOneAnnonce')(app)
require('./routes/annonces/findAllAnnonces')(app)
require('./routes/annonces/updateAnnonce')(app)
require('./routes/annonces/deleteAnnonce')(app)

app.use(({res}) => {
    const message = "Impossible de fournir la ressource demandée. Veuillez utiliser une autre URL"
    res.status(404).json({message})
})

app.listen(PORT, () => { console.log(`Server is running on : http://localhost:${PORT}`) })










  






