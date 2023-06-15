const { client, usersCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.get('/api/users', async (req, res) => {
        try {
            await client.connect();
            const users = await usersCollection.find().toArray();
            const message = 'Les utilisateurs ont bien été récupérés'
            res.json({ message, data: users });
        } catch (error) {
            const message = 'Erreur lors de la récupération des utilisateurs'
            res.status(500).json({ message, data: error.message });
        } finally {
            await client.close();
        }
    })
}