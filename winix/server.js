const mongodb = require('./database/mongodb')
const express = require('express')
const app = express()

const PORT = 3000

// Appel des routes USERS
require('./routes/users/createUser')(app)
require('./routes/users/findOneUser')(app)
require('./routes/users/findAllUsers')(app)
require('./routes/users/updateUser')(app)
require('./routes/users/deleteUser')(app)

// Appel des routes ANNONCES
require('./routes/annonces/createAnnonce')(app)
require('./routes/annonces/findOneAnnonce')(app)
require('./routes/annonces/findAllAnnonce')(app)
require('./routes/annonces/updateAnnonce')(app)
require('./routes/annonces/deleteAnnonce')(app)

app.listen(PORT, () => { console.log(`Server is running on : http://localhost:${PORT}`) })