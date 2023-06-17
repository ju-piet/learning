const mongoose = require('mongoose')

module.exports = mongoose.connect("mongodb+srv://ju-piet:wTknLZUJ87iGlBOi@cluster0.2och2bx.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Winix_db'
})
    .then(() => console.log('Connecté à la base MongoDb'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err))