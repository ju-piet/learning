const { client, usersCollection } = require('../../database/mongodb')

app.get('/api/users', async (req, res) => {
    try {
        await client.connect();
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        const message = 'Erreur lors de la récupération des documents'
        res.status(500).json({message, data: error.message});
    } finally {
        await client.close();
    }
});