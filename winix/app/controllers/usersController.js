const User = require('../models/usersModel')
const bcrypt = require('bcrypt')
const fs = require('fs')

const profilePhoto = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\julien.jpg')
const base64Image = profilePhoto.toString('base64')

const createUser = async (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                pseudo: req.body.pseudo,
                photo: base64Image
            })
            newUser.save().then(user => {
                const message = `L'utilisateur ${user.pseudo} a été créé`
                return res.json({ message, data: user })
            })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        })
}

const getAllUser = async (req, res) => {
    User.find().then(users => {
        const message = 'La liste des utilisateurs a été récupérée'
        res.json({ message, data: users })
    })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

const getUserById = async (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            const message = `L'utilisateur ${user.pseudo} a été retrouvé`
            res.json({ message, data: user })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

const updateUser = async (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const updatedUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                pseudo: req.body.pseudo,
                photo: base64Image
            })
            User.findByIdAndUpdate(req.params.userId,
                {
                    $set: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        pseudo: req.body.pseudo,
                        photo: base64Image
                    }
                }).then(updatedUser => {
                    if (!updatedUser) {
                        return res.status(404).json({ message: 'Utilisateur non trouvé' })
                    }
                    const message = `L'utilisateur a été modifié`
                    res.json({ message, data: updatedUser })
                })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        })
}

const deleteUser = async (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            const message = 'Utilisateur supprimé avec succès'
            res.json({ message, data: deletedUser })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}

