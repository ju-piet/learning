const User = require('../../database/models/user')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/users', auth, (req, res) => {
        User.find().then(users => {
            const message = 'La liste des utilisateurs a été récupérée'
            res.json({ message, data: users })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
    })
}