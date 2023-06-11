const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ju-piet:wTknLZUJ87iGlBOi@cluster0.2och2bx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db('winix')

const createCollections = async function createCollectionWithValidation() {
    try {
        await client.connect();
        await database.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['firstName', 'lastName', 'age', 'pseudo', 'email', 'password'],
                    properties: {
                        firstName: {
                            bsonType: 'string',
                            description: 'Le champ "firstName" doit être une chaîne de caractères.',
                        },
                        lastName: {
                            bsonType: 'string',
                            description: 'Le champ "lastName" doit être une chaîne de caractères.',
                        },
                        age: {
                            bsonType: 'int',
                            description: 'Le champ "age" doit être un entier.',
                        },
                        pseudo: {
                            bsonType: 'string',
                            description: 'Le champ "lastName" doit être une chaîne de caractères.',
                        },
                        email: {
                            bsonType: 'string',
                            description: 'Le champ "email" doit être une chaîne de caractères.',
                        },
                        password: {
                            bsonType: 'string',
                            description: 'Le champ "password" doit être une chaîne de caractères.',
                        },
                        fame: {
                            bsonType: 'int',
                            description: 'Le champ "fame" doit être un entier.',
                        },
                    },
                },
            },
        });
        console.log(`Collection "users" créée avec validation de schéma.`);

        await database.createCollection('annonces', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['title', 'photos', 'description', 'state', 'userId'],
                    properties: {
                        title: {
                            bsonType: 'string',
                            description: 'Le champ "title" doit être une chaîne de caractères.',
                        },
                        photos: {
                            bsonType: '',
                            description: '',
                        },
                        description: {
                            bsonType: 'string',
                            description: 'Le champ "description" doit être une chaîne de caractères.',
                        },
                        state: {
                            bsonType: 'string',
                            description: 'Le champ "state" doit être une chaîne de caractères.',
                        },
                        releaseDate: {
                            bsonType: '',
                            description: '',
                        },
                        userId: {
                            bsonType: 'int',
                            description: 'Le champ "userId" doit être un entier.',
                        },
                    },
                },
            },
        });
        console.log(`Collection "annonces" créée avec validation de schéma.`);
    } catch (error) {
        console.error('Erreur lors de la création de la collection :', error);
    } finally {
        await client.close();
    }
}

const annoncesCollection = database.collection('annonces');
const usersCollection = database.collection('users');

module.exports = { client, database, createCollections, annoncesCollection, usersCollection }