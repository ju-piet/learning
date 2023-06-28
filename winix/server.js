require('dotenv').config()
const mongoose = require('mongoose')
const app = require("./app")
const PORT = 3000

mongoose
    .connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    })
    .then(() => {
        console.log('Connecté à la base MongoDb')
        app.listen(PORT, () => { console.log(`Le serveur tourne sur : http://localhost:${PORT}`) })
    })
    .catch(err => console.error('Erreur de connexion à MongoDB:', err))