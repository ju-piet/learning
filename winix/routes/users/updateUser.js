const { client, usersCollection } = require('../../database/mongodb')

app.put('/api/users/:id', async (req, res) => {
    try {
        await client.connect();
        const userId = new ObjectID(req.params.id);
        const updatedUser = req.body;
  
        const result = await usersCollection.updateOne({ _id: userId }, { $set: updatedUser });
        if (result.modifiedCount === 1) {
            const message = 'Document mis à jour avec succès.'
            res.json({ message });
        } else {
            const message = 'Document non trouvé.'
            res.status(404).json({ message });
        }
    } catch (error) {
        const message = 'Erreur lors de la mise à jour du document'
      res.status(500).json({ message, data: error.message });
    } finally {
      await client.close();
    }
  });