const Annonce = require('../../database/models/annonce')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/annonces/:id', auth, (req, res) => {
        Annonce.findById(req.params.id).then(annonce => {
            if (!annonce) {
                return res.status(404).json({ message: 'Annonce non trouvé' })
            }
            const message = `L'annonce ${annonce.title} a été retrouvé`
            res.json({ message, data: annonce })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
    })
}