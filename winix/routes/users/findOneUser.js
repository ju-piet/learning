const User = require('../../database/models/user')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/users/:id', auth, (req, res) => {
        User.findById(req.params.id)
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
    })
}
