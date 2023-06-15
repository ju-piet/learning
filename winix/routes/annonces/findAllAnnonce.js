const { client, annoncesCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.get('/api/annonces', async (req, res) => {
        try {
            await client.connect();
            const annonces = await collection.find().toArray();
            const message = 'Les annonces ont bien été récupérées'
            res.json({message, data: annonces});
        } catch (error) {
            const message = 'Erreur lors de la récupération des annonces'
            res.status(500).json({message, data: error.message});
        } finally {
            await client.close();
        }
    })
}