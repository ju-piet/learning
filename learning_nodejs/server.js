const express = require('express')  //récupération de la dépendance
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')

const app = express()   //instance de de l'app express
const port = 3000

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

sequelize.initDb();

require('./src/routes/login')(app)
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)

app.use(({res}) => {
    const message = "Impossible de fournir la ressource demandée. Veuillez utiliser une autre URL"
    res.status(404).json({message})
})

app.listen(port, () => console.log(`Application listening on : http://localhost:${port}`))