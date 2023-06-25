const User = require('../models/usersModel')
const bcrypt = require('bcrypt')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const privateKey = require('../../services/auth/private_key')

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
    User.find().then(users => {
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
            res.json({ message, data: user })
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }
            const message = "L'utilisateur n'a pas été retrouvé"
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

            if(!req.body.password){
                User.findByIdAndUpdate(req.params.userId,
                    {
                        $set: {
                            email: newEmail,
                            password: newPassword,
                            pseudo: newPseudo,
                            photo: base64Image
                        }                      
                    }, { runValidators: true })
                    .then(updatedUser => {
                        if (!updatedUser) {
                            return res.status(404).json({ message: 'Utilisateur non trouvé' })
                        }
                        User.findById(req.params.userId)
                            .then(user => {
                                if (!user) {
                                    return res.status(404).json({ message: 'Utilisateur non trouvé' })
                                }
                                const message = `L'utilisateur a été modifié`
                                return res.json({ message, data: user })
                            })
                    })
                    .catch(err => {
                        if(err.name == "ValidationError"){
                            return res.status(400).json({ message: err.message, data: err })
                        }
                        return res.status(500).json({ message: err.message, data: err })
                    })
            }else{
                bcrypt.hash(newPassword, 10)
                .then(hash => {
                    User.findByIdAndUpdate(req.params.userId,
                        {
                            $set: {
                                email: newEmail,
                                password: hash,
                                pseudo: newPseudo,
                                photo: base64Image
                            }
                        }).then(updatedUser => {
                            if (!updatedUser) {
                                return res.status(404).json({ message: 'Utilisateur non trouvé' })
                            }
                            User.findById(req.params.userId)
                                .then(user => {
                                    if (!user) {
                                        return res.status(404).json({ message: 'Utilisateur non trouvé' })
                                    }
                                    const message = `L'utilisateur a été modifié`
                                    return res.json({ message, data: user })
                                })
                        })
                        .catch(err => {
                            return res.status(500).json({ error: err.message })
                        })
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

const deleteAllUser = async (req, res) => {
    User.deleteMany({})
        .then(() => {
            const message = 'Supression de tous les utilisateurs faite !'
            return res.json({ message })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
    deleteAllUser
}

