const { client, usersCollection } = require('../../database/mongodb')

app.get('/api/users/:id', async (req, res) => {
    try {
        await client.connect();
        const userId = new ObjectID(req.params.id);
        const user = await usersCollection.findOne({ _id: userId });

        if (user) {
            res.json(user);
        } else {
            const message = "Impossible de retrouver l'utilisateur."
            res.status(404).json({ message });
        }
    } catch (error) {
        const message = 'Erreur lors de la récupération du document.'
        res.status(500).json({ message, data: error.message });
    } finally {
      await client.close();
    }
  });