const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
let PokemonModel = require('./../models/pokemon')
let UserModel = require('./../models/user')
let pokemons = require('./mock-pokemon')

const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2'
    },
    logging: false
})

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({force : true}).then(() => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name : pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemonCreated => console.log(pokemonCreated.toJSON()))
        })

        bcrypt.hash('pikachu', 10)
        .then(hash => {
            User.create({ username: 'pikachu', password: hash })
            .then(userCreated => console.log(userCreated.toJSON()))
        })

        console.log('Pokedex and user database has been initialized')
    })
}

module.exports = { initDb, Pokemon, User }
