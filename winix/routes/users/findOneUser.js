const { client, usersCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.get('/api/users/:id', async (req, res) => {
        try {
            await client.connect()
            const userId = new ObjectID(req.params.id)
            const user = await usersCollection.findOne({ _id: userId })
    
            if (user) {
                const message = `L'utilisateur : ${user.pseudo} a été retrouvé`
                res.json({ message, data: user })
            } else {
                const message = "Impossible de retrouver l'utilisateur."
                res.status(404).json({ message })
            }
        } catch (error) {
            const message = "Impossible de retrouver l'utilisateur."
            res.status(500).json({ message, data: error.message })
        } finally {
          await client.close()
        }
    })
}
