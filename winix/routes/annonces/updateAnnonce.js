const Annonce = require('../../database/models/annonce')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.put('/api/annonces/:id', auth, (req, res) => {
        Annonce.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.description,
            state: req.body.state,
            updateAt: Date.now
        }).then(updatedAnnonce=> {
            if (!updatedAnnonce) {
                return res.status(404).json({ message: 'Annonce non trouvée' })
            }
            const message = `L'annonce a été modifié`
            res.json({ message, data: updatedAnnonce})
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
    })
}
