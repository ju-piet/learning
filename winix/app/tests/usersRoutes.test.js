const mongoose = require("mongoose")
const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require("../../app")
const users = require('./usersData')

let token, userCreatedId
const tokenExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDhjYWNmMTVhYjZhOGNmOTNlZTNjOWQiLCJpYXQiOjE2ODY5NDMzODEsImV4cCI6MTY4NzAyOTc4MX0.w2clBemwpscH-9Q4WLXwEI1aKlw6FgHvbUEfBaomfDg"

beforeEach(async () => {
    await mongoose
        .connect("mongodb+srv://ju-piet:wTknLZUJ87iGlBOi@cluster0.2och2bx.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Winix_db_tests'
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
});

describe(`\n------------------------------\nPOUR LES CAS CRUD SANS ERREURS\n------------------------------`, () => {
    describe("A la création d'un utilisateur avec tout les champs remplis correctement : ", () => {
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

    describe("A la récupération d'un unique utilisateur : ", () => {
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

    describe("A la modification d'un unique utilisateur (l'utilisateur se modifie lui même) : ", () => {
        describe("- l'utilisateur ne modifie que 2 paramètres sur 3", () => {
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
        describe("- l'utilisateur ne modifie que 1 paramètre sur 3", () => {
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

    describe("A la suppression d'un unique utilisateur : ", () => {
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

describe(`\n---------------------------\nPOUR LES CAS D'ERREURS CRUD\n---------------------------`, () => {
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

    describe("A la récupération d'un unique utilisateur lorsqu'il y a des erreurs sur l'ID : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur de cast est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/users/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"User\"')
            })
        })

        describe("- si aucun utilisateur ne correspond à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Utilisateur non trouvé')
            })
        })
    })

    describe("A la récupération d'un unique utilisateur lorsqu'il y a des erreurs sur l'ID : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur de cast est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/users/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"User\"')
            })
        })

        describe("- si aucun utilisateur ne correspond à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/users/${userCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Utilisateur non trouvé')
            })
        })
    })

    describe("A la modification d'un utilisateur lorsque le champ email est d'un mauvais type : ", () => {
        it("une erreur est renvoyé", async () => {
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

    describe("A la supression d'un unique utilisateur lorsqu'il y a des erreurs sur l'ID' : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur 400 de cast est renvoyé", async () => {
                const res = await request(app)
                    .delete(`/api/users/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"User\"')
            })
        })

        describe("- si aucun utilisateur ne correspond à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
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
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .get("/api/users")
                    .set('Authorization', `Bearer `)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("JsonWebTokenError")
                expect(res.body.data.message).toBe("jwt must be provided")
            })
        })

        describe("- la récupération d'un unique utilisateur : ", () => {
            it("la réponse doit retourner une erreur", async () => {
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

        describe("- la modification d'un unique utilisateur : ", () => {
            it("la réponse doit retourner une erreur", async () => {
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

        describe("- la suppression d'un unique utilisateur : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .delete("/api/users")
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
            it("la réponse doit retourner une erreur", async () => {
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
            it("la réponse doit retourner une erreur", async () => {
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
            it("la réponse doit retourner une erreur", async () => {
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
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .delete("/api/users")
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
            it("la réponse doit retourner une erreur", async () => {
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
            it("la réponse doit retourner une erreur", async () => {
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


