const mongoose = require('mongoose')
const app = require("./app");
const PORT = 3000

mongoose
    .connect("mongodb+srv://ju-piet:wTknLZUJ87iGlBOi@cluster0.2och2bx.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Winix_db'
    })
    .then(() => {
        console.log('Connecté à la base MongoDb')
        app.listen(PORT, () => { console.log(`Le serveur tourne sur : http://localhost:${PORT}`) })
    })
    .catch(err => console.error('Erreur de connexion à MongoDB:', err))