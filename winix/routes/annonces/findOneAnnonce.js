const { client, annoncesCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.get('/api/annonces/:id', async (req, res) => {
        try {
            await client.connect()
            const annonceId = new ObjectID(req.params.id)
            const annonce = await annoncesCollection.findOne({ _id: annonceId })
    
            if (annonce) {
                const message = `L'annonce : ${annonce.title} a été retrouvée`
                res.json({ message, data: annonce })
            } else {
                const message = "Impossible de retrouver l'utilisateur"
                res.status(404).json({ message })
            }
        } catch (error) {
            const message = "Impossible de retrouver l'utilisateur."
            res.status(500).json({ message, data: error.message })
        } finally {
          await client.close()
        }
    })
}