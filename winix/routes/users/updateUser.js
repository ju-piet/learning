const { client, usersCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.put('/api/users/:id', async (req, res) => {
        try {
            await client.connect((error));
            const userId = new ObjectID(req.params.id);
            const updatedUser = req.body;
            await usersCollection.updateOne({ _id: userId }, { $set: updatedUser }, (result, error) => {
                if(error){
                    const message = "Erreur lors de la mise à jour de l'utilisateur"
                    res.status(500).json({ message, data: error });
                }
                if (result.modifiedCount === 1) {
                    const message = `Utilisateur : ${updatedUser.pseudo} mis à jour avec succès.`
                    res.json({ message, data: updatedUser });
                } else {
                    const message = 'Document non trouvé.'
                    res.status(404).json({ message });
                }
            });
        } catch (error) {
            const message = "Erreur lors de la mise à jour de l'utilisateur"
            res.status(500).json({ message, data: error });
        } finally {
            await client.close();
        }
    });
}
