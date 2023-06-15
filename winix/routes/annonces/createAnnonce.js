const { client, annoncesCollection } = require('../../database/mongodb')

module.exports = (app) => {
    app.post('/api/annonces', async (req, res) => {
        try {
            await client.connect()
            const newAnnonce = req.body
            await annoncesCollection.insertOne(newAnnonce, (error, result) => {
                if(error){
                    const message = "Erreur lors de la création de l'annonce"
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
