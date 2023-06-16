const Annonce = require('../../database/models/annonce')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.delete('/api/annonces/:id', auth, (req, res) => {
        Annonce.findByIdAndRemove(req.params.id)
        .then(deletedAnnonce => {
            if (!deletedAnnonce) {
                return res.status(404).json({ message: 'Annonce non trouvé' })
            }
            const message = `L'annonce ${deletedAnnonce.title} a été supprimée avec succès`
            res.json({ message, data: deletedAnnonce })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
    })
}