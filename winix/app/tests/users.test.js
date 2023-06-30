require('dotenv').config()
const mongoose = require("mongoose")
const request = require('supertest')
const app = require("../../app")

const tokenExpired = process.env.TOKEN_EXPIRED
let token, userCreatedId

beforeEach(async () => {
    await mongoose
        .connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME_TESTS
        })
        .then(async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    email: "mathilde.gentil@mail.com",
                    password: "chutcsecret"
                })
            token = res.body.token
        })
})

afterEach(async () => {
    await mongoose.connection.close()
})

describe(`\n--------------------------------------\n[USERS] POUR LES CAS CRUD SANS ERREURS\n--------------------------------------`, () => {
    describe("A la création d'un utilisateur : ", () => {
        it("la réponse doit retourner un code 200 et l'utilisateur créé", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({
                    firstname: "Jean",
                    lastname: "Dupont",
                    email: "jean.dupont@mail.com",
                    password: "dupont_secret",
                    pseudo: "xxDupontxx"
                })
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("L'utilisateur xxDupontxx a été créé")
            expect(res.body.data.firstname).toBe("Jean")
            expect(res.body.data.lastname).toBe("Dupont")
            expect(res.body.data.email).toBe("jean.dupont@mail.com")
            expect(res.body.data.pseudo).toBe("xxDupontxx")
            userCreatedId = res.body.data._id
        })
    })

    describe("A la récupération de tout les utilisateurs : ", () => {
        it("la réponse doit retourner un code 200 et tout les utilisateurs", async () => {
            const res = await request(app)
                .get("/api/users")
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("La liste des utilisateurs a été récupérée")
            expect(res.body.data.length).toBe(3)
        })
    })

    describe("A la récupération d'un utilisateur : ", () => {
        it("la réponse doit retourner un code 200 et l'utilisateur recherché", async () => {
            const res = await request(app)
                .get(`/api/users/${userCreatedId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("L'utilisateur xxDupontxx a été retrouvé")
            expect(res.body.data.firstname).toBe("Jean")
            expect(res.body.data.lastname).toBe("Dupont")
            expect(res.body.data.email).toBe("jean.dupont@mail.com")
            expect(res.body.data.pseudo).toBe("xxDupontxx")
        })
    })

    describe("A la modification d'un utilisateur (l'utilisateur se modifie lui même) : ", () => {
        describe("- si l'utilisateur ne modifie que 2 paramètres sur 3", () => {
            it("la réponse doit retourner un code 200 et l'utilisateur modifié", async () => {
                await request(app)
                    .post('/api/login')
                    .send({
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret"
                    })
                    .then(async (loginRes) => {
                        const res = await request(app)
                            .put(`/api/users/${userCreatedId}`)
                            .send({
                                email: "jean-michel.dupont@mail.com",
                                pseudo: "xxJMDupontxx",
                                userId: loginRes.body.data._id
                            })
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                        expect(res.statusCode).toBe(200)
                        expect(res.body.message).toBe("L'utilisateur a été modifié")
                        expect(res.body.data.email).toBe("jean-michel.dupont@mail.com")
                        expect(res.body.data.pseudo).toBe("xxJMDupontxx")
                    })
            })
        })
        describe("- si l'utilisateur ne modifie que 1 paramètre sur 3", () => {
            it("la réponse doit retourner un code 200 et l'utilisateur modifié", async () => {
                await request(app)
                    .post('/api/login')
                    .send({
                        email: "jean-michel.dupont@mail.com",
                        password: "dupont_secret"
                    })
                    .then(async (loginRes) => {
                        const res = await request(app)
                            .put(`/api/users/${userCreatedId}`)
                            .send({
                                password: "newpassword",
                                userId: userCreatedId
                            })
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                        expect(res.statusCode).toBe(200)
                        expect(res.body.message).toBe("L'utilisateur a été modifié")
                        expect(res.body.data.email).toBe("jean-michel.dupont@mail.com")
                        expect(res.body.data.pseudo).toBe("xxJMDupontxx")
                    })
            })
        })
    })

    describe("A la suppression d'un utilisateur : ", () => {
        it("la réponse doit retourner un code 200 et l'utilisateur supprimé", async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: "jean-michel.dupont@mail.com",
                    password: "newpassword"
                })
                .then(async (loginRes) => {
                    const res = await request(app)
                        .delete(`/api/users/${userCreatedId}`)
                        .send({ userId: userCreatedId })
                        .set('Authorization', `Bearer ${loginRes.body.token}`)
                    expect(res.statusCode).toBe(200)
                    expect(res.body.message).toBe("L'utilisateur xxJMDupontxx a été supprimé avec succès")
                    expect(res.body.data.firstname).toBe("Jean")
                    expect(res.body.data.lastname).toBe("Dupont")
                    expect(res.body.data.email).toBe("jean-michel.dupont@mail.com")
                    expect(res.body.data.pseudo).toBe("xxJMDupontxx")
                })
        })
    })
})

describe(`\n-----------------------------------\n[USERS] POUR LES CAS D'ERREURS CRUD\n-----------------------------------`, () => {
    describe("A la création d'un utilisateur lorsqu'il manque le champ : ", () => {
        describe("- firstname : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        lastname: "Dupont",
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: firstname: Path `firstname` is required.")
            })
        })
        describe("- lastname : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: lastname: Path `lastname` is required.")
            })
        })
        describe("- email : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        lastname: "Dupont",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: email: Path `email` is required.")
            })
        })
        describe("- password : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        lastname: "Dupont",
                        email: "jean.dupont@mail.com",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("L'utilisateur n'a pas pu être créé, mot de passe manquant")
            })
        })
        describe("- pseudo : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        lastname: "Dupont",
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret",
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: pseudo: Path `pseudo` is required.")
            })
        })
    })

    describe("A la création d'un utilisateur lorsqu'un champ est d'un mauvais type : ", () => {
        describe("- firstname : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: 123,
                        lastname: "Dupont",
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: firstname: 123 is not a valid firstname.")
            })
        })
        describe("- lastname : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        lastname: 123,
                        email: "jean.dupont@mail.com",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: lastname: 123 is not a valid lastname.")
            })
        })
        describe("- email : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/users")
                    .send({
                        firstname: "Jean",
                        lastname: "Dupont",
                        email: "jean.dupont",
                        password: "dupont_secret",
                        pseudo: "xxDupontxx"
                    })
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("User validation failed: email: jean.dupont is not a valid email.")
            })
        })
    })

    describe("A la récupération d'un utilisateur : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("la réponse doit retourner une erreur 400 de cast", async () => {
                const res = await request(app)
                    .get(`/api/users/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"User\"')
            })
        })

        describe("- si aucun utilisateur ne correspond à l'ID recherché : ", () => {
            it("la réponse doit retourner une erreur 404 de ressources non trouvées", async () => {
                const res = await request(app)
                    .get(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Utilisateur non trouvé')
            })
        })
    })

    describe("A la modification d'un utilisateur lorsque le champ email est d'un mauvais type : ", () => {
        it("la réponse doit retourner une erreur 400 de validation", async () => {
            await request(app)
                .get(`/api/users`)
                .set('Authorization', `Bearer ${token}`)
                .then(async (resGetAll) => {
                    const res = await request(app)
                        .put(`/api/users/${resGetAll.body.data[0]._id}`)
                        .send({ email: "jean.dupont" })
                        .set('Authorization', `Bearer ${token}`)
                    expect(res.statusCode).toBe(400)
                    expect(res.body.message).toBe("Validation failed: email: jean.dupont is not a valid email.")
                })
        })
    })

    describe("A la supression d'un utilisateur : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("la réponse doit retourner une erreur 400 de cast", async () => {
                const res = await request(app)
                    .delete(`/api/users/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"User\"')
            })
        })

        describe("- si aucun utilisateur ne correspond à l'ID recherché : ", () => {
            it("la réponse doit retourner une erreur 404 de ressources non trouvées", async () => {
                const res = await request(app)
                    .delete(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Utilisateur non trouvé')
            })
        })
    })

    describe("Si le token est manquant pour : ", () => {
        describe("- la récupération de tout les utilisateurs : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                const res = await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer `)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("JsonWebTokenError")
                expect(res.body.data.message).toBe("jwt must be provided")
            })
        })

        describe("- la récupération d'un utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .get(`/api/users/${getRes.body.data[0]._id}`)
                            .set('Authorization', `Bearer `)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("JsonWebTokenError")
                        expect(res.body.data.message).toBe("jwt must be provided")
                    })
            })
        })

        describe("- la modification d'un utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/users/${getRes.body.data[0]._id}`)
                            .send({
                                pseudo: "tildam_la_blg",
                                email: "mathilde.hubert@mail.com",
                                password: "chutcsecretbis",
                            })
                            .set('Authorization', `Bearer `)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("JsonWebTokenError")
                        expect(res.body.data.message).toBe("jwt must be provided")
                    })
            })
        })

        describe("- la suppression d'un utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                const res = await request(app)
                    .delete(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer `)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("JsonWebTokenError")
                expect(res.body.data.message).toBe("jwt must be provided")
            })
        })
    })

    describe("Si le token est expiré pour : ", () => {
        describe("- la récupération de tout les utilisateurs : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                const res = await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${tokenExpired}`)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("TokenExpiredError")
                expect(res.body.data.message).toBe("jwt expired")
            })
        })

        describe("- la récupération d'un unique utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .get(`/api/users/${getRes.body.data[0]._id}`)
                            .set('Authorization', `Bearer ${tokenExpired}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("TokenExpiredError")
                        expect(res.body.data.message).toBe("jwt expired")
                    })
            })
        })

        describe("- la modification d'un utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/users/${getRes.body.data[0]._id}`)
                            .send({
                                pseudo: "tildam_la_blg",
                                email: "mathilde.hubert@mail.com",
                                password: "chutcsecretbis",
                            })
                            .set('Authorization', `Bearer ${tokenExpired}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("TokenExpiredError")
                        expect(res.body.data.message).toBe("jwt expired")
                    })
            })
        })

        describe("- la suppression d'un unique utilisateur : ", () => {
            it("la réponse doit retourner une erreur 401 de JWT", async () => {
                const res = await request(app)
                    .delete(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer ${tokenExpired}`)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("TokenExpiredError")
                expect(res.body.data.message).toBe("jwt expired")
            })
        })
    })

    describe("Modification/suppression de données d'un utilisateur X par un utilisateur Y : ", () => {
        describe("- la modification : ", () => {
            it("la réponse doit retourner une erreur 401 d'ID non valide", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/users/${getRes.body.data[1]._id}`)
                            .send({
                                email: "momo.boom2@mail.com",
                                password: "321explosioooooooooooooooooon",
                                userId: getRes.body.data[1]._id
                            })
                            .set('Authorization', `Bearer ${token}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'identifiant de l'utilisateur est invalide.")
                    })
            })
        })

        describe("- la suppression : ", () => {
            it("la réponse doit retourner une erreur 401 d'ID non valide", async () => {
                await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .delete(`/api/users/${getRes.body.data[1]._id}`)
                            .send({
                                email: "momo.boom2@mail.com",
                                password: "321explosioooooooooooooooooon",
                                userId: getRes.body.data[1]._id
                            })
                            .set('Authorization', `Bearer ${token}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'identifiant de l'utilisateur est invalide.")
                    })
            })
        })
    })
})


