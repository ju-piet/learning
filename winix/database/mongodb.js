const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ju-piet:wTknLZUJ87iGlBOi@cluster0.2och2bx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db('Winix_db')
const annoncesCollection = database.collection('Annonces');
const usersCollection = database.collection('Users');

module.exports = { client, database, annoncesCollection, usersCollection }