const Annonce = require('../../database/models/annonce')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/annonces', auth, (req, res) => {
        Annonce.find()
        .then(annonces => {
            const message = 'La liste des annonces a été récupérée'
            res.json({ message, data: annonces })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
    })
}