const { client, annoncesCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.delete('/api/annonces/:id', async (req, res) => {
        try {
            await client.connect()
            const annonceId = req.params.id
            await annoncesCollection.deleteOne({ _id: annonceId }, (error, result) => {
                if (error) {
                    const message = "Erreur lors de la suppression de l'annonce."
                    res.status(500).send({ message, data: error })
                } else if (result.deletedCount === 0) {
                    const message = 'Annonce non trouvée'
                    res.status(404).send({ message })
                } else {
                    const message = `L'annonce : ${result.title} a été supprimée avec succès.`
                    res.status(200).send({ message, data: result })
                }
            })
        } catch (error) {
            const message = "Erreur lors de la création de l'annonce."
            res.status(500).json({ message, data: error })
        } finally {
            await client.close()
        }
    })
}