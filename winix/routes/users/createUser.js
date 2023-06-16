const User = require('../../database/models/user')
const auth = require('../auth/auth')
const bcrypt = require('bcrypt')
const fs = require('fs')
const jwt = require('jsonwebtoken')


//TEST
const imageBuffer = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\julien.jpg')
const base64Image = imageBuffer.toString('base64')
//FIN DU TEST

module.exports = (app) => {
    app.post('/api/users', auth, (req, res) => {
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
                res.json({ message, data: user })
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
        })
    }
)}
