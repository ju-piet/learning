const { client, usersCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.post('/api/users', async (req, res) => {
        try {
            await client.connect()
            const newUser = req.body
            await usersCollection.insertOne(newUser, (error, result) => {
                if (error) {
                    const message = "Erreur lors de la création de l'utilisateur"
                    res.status(500).send({ message, data: error })
                }
                res.json(result.ops[0])
            })
        } catch (error) {
            const message = "Erreur lors de la création de l'annonce"
            res.status(500).json({ message, data: error})
        } finally {
            await client.close()
        }
    })
}