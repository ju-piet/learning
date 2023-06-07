const {Pokemon} = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            if(pokemon === null){
                const message = `Le pokémon n'a pas pu être récupéré.`
                res.status(404).json({ message, data: err })
            }
            const pokemonDeleted = pokemon
            return Pokemon.destroy({ where : { id: pokemon.id } })
            .then(_ => {
                const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
                res.json({ message, data : pokemonDeleted })
            })
        })
        .catch(err => {
            const message = `Le pokémon n'a pas pu être supprimé.`
            res.status(500).json({ message, data: err })
        })
    })
}