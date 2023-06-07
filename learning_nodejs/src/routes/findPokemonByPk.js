const {Pokemon} = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/pokemons/:id', auth, (req, res) => {
        Pokemon.findByPk(req.params.id)
        .then(pokemon => {
            const message = `Le pokémon ${pokemon.name} a bien été récupéré.`
            res.json({message, data : pokemon})
        })
        .catch(err => {
            const message = `Le pokémon n'a pas pu être récupéré.`
            res.status(500).json({message, data: err})
        })
    })
}