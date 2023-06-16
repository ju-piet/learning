const User = require('../../database/models/user')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.delete('/api/users/:id', auth, (req, res) => {
        User.findByIdAndRemove(req.params.id)
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
    })
}

