const { client, usersCollection } = require('../../database/mongodb')

app.post('/api/users', async (req, res) => {
    try {
        await client.connect();
        const newUser = req.body;
        const result = await collection.insertOne(usersCollection);
        res.json(result.ops[0]);
    } catch (error) {
        console.error('Erreur lors de la création du document :', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du document.' });
    } finally {
        await client.close();
    }
});