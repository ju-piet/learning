const { ValidationError, UniqueConstraintError } = require('sequelize')
const {Pokemon} = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.post('/api/pokemons', auth, (req, res) => {
        Pokemon.create({
            name : req.body.name,
            hp: req.body.hp,
            cp: req.body.cp,
            picture: req.body.picture,
            types: req.body.types
        })
        .then(pokemon => {
            const message = `Le pokémon ${pokemon.name} a bien été créé.`
            res.json({ message, data : pokemon })
        })
        .catch(err => {
            if(err instanceof ValidationError){
                return res.status(400).json({ message: err.message, data: err })
            }
            if(err instanceof UniqueConstraintError){
                return res.status(400).json({ message: err.message, data: err })
            }
            const message = `Le pokémon n'a pas pu être créé.`
            res.status(500).json({message, data: err})
        })
    })
}