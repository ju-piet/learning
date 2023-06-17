const User = require('../models/usersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../../services/auth/private_key')

module.exports = (app) => {
    app.post('/api/login', (req, res) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé' })
                }

                bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: `Le mot de passe de l'utilisateur est incorrect.` })
                    }

                    const token = jwt.sign(
                        { userId: user.id },
                        privateKey,
                        { expiresIn: '24h' })

                    const message = `L'utilisateur a été connecté avec succès.`
                    return res.json({ message, data: user, token })
                })
            })
            .catch(error => {
                const message = `L'utilisateur n'a pas pu se connecter`
                return res.status(500).json({ message, data: error })
            })
    })
}