const { client, usersCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.delete('/api/users/:id', async (req, res) => {
        try {
            await client.connect()
            const userId = req.params.id
            await usersCollection.deleteOne({ _id: userId }, (error, result) => {
                if (error) {
                    const message = "Erreur lors de la suppression de l'utilisateur."
                    res.status(500).send({ message, data: error })
                } else if (result.deletedCount === 0) {
                    const message = 'Utilisateur non trouvé. Réessayez.'
                    res.status(404).send({ message })
                } else {
                    const message = `L'utilisateur : ${result.pseudo}  supprimé avec succès.`
                    res.status(200).send({ message, data: result })
                }
            })
        } catch (error) {
            const message = "Erreur lors de la création de l'utilisateur."
            res.status(500).json({ message, data: error })
        } finally {
            await client.close()
        }
    })
}

