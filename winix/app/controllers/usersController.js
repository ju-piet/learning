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
            newUser.save()
                .then(user => {
                    const message = `L'utilisateur ${user.pseudo} a été créé`
                    return res.json({ message, data: user })
                })
                .catch(err => {
                    if (err.name == 'ValidationError') {
                        return res.status(400).json({ message: err.message, data: err })
                    }
                    if (err.name == 'UniqueConstraintError') {
                        return res.status(400).json({ message: err.message, data: err })
                    }
                    return res.status(500).json({ error: err })
                })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu être créé, mot de passe manquant`
            return res.status(400).json({ message, data: error })
        })
}

const getAllUser = async (req, res) => {
    User.find()
        .then(users => {
            const message = 'La liste des utilisateurs a été récupérée'
            return res.json({ message, data: users })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

const getUserById = async (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            const message = `L'utilisateur ${user.pseudo} a été retrouvé`
            return res.json({ message, data: user })
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }
            const message = "L'utilisateur n'a pas pu être retrouvé"
            return res.status(400).json({ message, data: err })
        })
}

const updateUserById = async (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }

            const newEmail = req.body.email !== undefined ? req.body.email : user.email
            const newPassword = req.body.password !== undefined ? req.body.password : user.password
            const newPseudo = req.body.pseudo !== undefined ? req.body.pseudo : user.pseudo

            if (!req.body.password) {
                findUserByIdAndUpdate(
                    req.params.userId,
                    newEmail,
                    newPassword,
                    newPseudo,
                    base64Image,
                    res)
            } else {
                bcrypt.hash(newPassword, 10)
                    .then(hash => {
                        findUserByIdAndUpdate(
                            req.params.userId,
                            newEmail,
                            hash,
                            newPseudo,
                            base64Image,
                            res)
                    })
            }
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }
            const message = "L'utilisateur n'a pas été retrouvé"
            return res.status(500).json({ message, data: err })
        })
}

const deleteUserById = async (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            const message = `L'utilisateur ${deletedUser.pseudo} a été supprimé avec succès`
            return res.json({ message, data: deletedUser })
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }

            return res.status(500).json({ error: err.message })
        })
}

const findUserByIdAndUpdate = (userId, email, password, pseudo, photo, res) => {
    User.findByIdAndUpdate(userId,
        {
            $set: {
                email: email,
                password: password,
                pseudo: pseudo,
                photo: photo,
                updateAt: Date.now
            }
        }, { runValidators: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            User.findById(userId)
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ message: 'Utilisateur non trouvé' })
                    }
                    const message = `L'utilisateur a été modifié`
                    return res.json({ message, data: user })
                })
        })
        .catch(err => {
            if (err.name == "ValidationError") {
                return res.status(400).json({ message: err.message, data: err })
            }
            return res.status(500).json({ message: err.message, data: err })
        })
}

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById
}

