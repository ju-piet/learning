const { client, annoncesCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.put('/api/annonces/:id', async (req, res) => {
        try {
            await client.connect((error));
            const annonceId = new ObjectID(req.params.id);
            const updatedAnnonce = req.body;
            await annoncesCollection.updateOne({ _id: annonceId }, { $set: updatedAnnonce }, (result, error) => {
                if(error){
                    const message = "Erreur lors de la mise à jour de l'annonce."
                    res.status(500).json({ message, data: error });
                }
                if (result.modifiedCount === 1) {
                    const message = `Annonce : ${updatedAnnonce.title} mis à jour avec succès.`
                    res.json({ message, data: updatedAnnonce });
                } else {
                    const message = 'Annonce non trouvée.'
                    res.status(404).json({ message });
                }
            });
        } catch (error) {
            const message = "Erreur lors de la mise à jour de l'annonce"
            res.status(500).json({ message, data: error });
        } finally {
            await client.close();
        }
    });
}
