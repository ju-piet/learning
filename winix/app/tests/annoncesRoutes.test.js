const mongoose = require("mongoose")
const request = require('supertest')
const app = require("../../app")
const annonces = require('./annoncesData')

let token, userId
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
            userId = res.body.data._id
        })
})

afterEach(async () => {
    await mongoose.connection.close()
});

describe(`\n------------------------------\nPOUR LES CAS CRUD SANS ERREURS\n------------------------------`, () => {
    describe("A la création d'une annonce : ", () => {
        it("la réponse doit retourner un code 200 et l'annonce créée", async () => {
            const res = await request(app)
                .post("/api/annonces")
                .send({
                    title: "Casque sony",
                    photos: [
                        "photo1",
                        "photo2",
                        "photo3"
                    ],
                    description: "Je propose mon casque sony, acheté il y a 1 an",
                    state: "Bon"
                })
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("L'annonce Casque sony a été créé")
            expect(res.body.data.title).toBe("Casque sony")
            expect(res.body.data.photos.length).toBe(2)
            expect(res.body.data.description).toBe("Je propose mon casque sony, acheté il y a 1 an")
            expect(res.body.data.state).toBe("Bon")
            expect(res.body.data.userId).toBe(userId)
            annonceCreatedId = res.body.data._id
        })
    })

    describe("A la récupération de toutes les annonces : ", () => {
        it("la réponse doit retourner un code 200 et toutes les annonces", async () => {
            const res = await request(app)
                .get("/api/annonces")
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("La liste des annonces a été récupérée")
            expect(res.body.data.length).toBe(3)
        })
    })

    describe("A la récupération d'une unique annonce : ", () => {
        it("la réponse doit retourner un code 200 et l'annonce recherchée", async () => {
            const res = await request(app)
                .get(`/api/annonces/${annonceCreatedId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("L'annonce Casque sony a été retrouvé")
            expect(res.body.data.title).toBe("Casque sony")
            expect(res.body.data.photos.length).toBe(2)
            expect(res.body.data.description).toBe("Je propose mon casque sony, acheté il y a 1 an")
            expect(res.body.data.state).toBe("Bon")
            expect(res.body.data.userId).toBe(userId)
        })
    })

    describe("A la modification d'une annonce (par l'utilisateur qui l'a créé) : ", () => {
        describe("- l'utilisateur ne modifie que 3 paramètres sur 4", () => {
            it("la réponse doit retourner un code 200 et l'annonce modifiée", async () => {
                const res = await request(app)
                    .put(`/api/annonces/${annonceCreatedId}`)
                    .send({
                        title: "Casque sony XM3",
                        photos: [
                            "newPhoto1",
                            "newPhoto2",
                            "newPhoto3"
                        ],
                        description: "Je propose mon casque sony XM3, acheté il y a 1 an",
                        userId: userId
                    })
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(200)
                expect(res.body.message).toBe("L'annonce Casque sony XM3 a été modifié")
                expect(res.body.data.title).toBe("Casque sony XM3")
                expect(res.body.data.photos.length).toBe(3)
                expect(res.body.data.description).toBe("Je propose mon casque sony XM3, acheté il y a 1 an")
                expect(res.body.data.state).toBe("Bon")
                expect(res.body.data.userId).toBe(userId)
            })
        })
        describe("- l'utilisateur ne modifie que 1 paramètre sur 3", () => {
            it("la réponse doit retourner un code 200 et l'annonce modifiée", async () => {
                const res = await request(app)
                    .put(`/api/annonces/${annonceCreatedId}`)
                    .send({
                        state: "Usé",
                        userId: userId
                    })
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(200)
                expect(res.body.message).toBe("L'annonce Casque sony XM3 a été modifié")
                expect(res.body.data.title).toBe("Casque sony XM3")
                expect(res.body.data.photos.length).toBe(3)
                expect(res.body.data.description).toBe("Je propose mon casque sony XM3, acheté il y a 1 an")
                expect(res.body.data.state).toBe("Usé")
                expect(res.body.data.userId).toBe(userId)
            })
        })
    })

    describe("A la suppression d'une annonce : ", () => {
        it("la réponse doit retourner un code 200 et l'annonce supprimée", async () => {
            const res = await request(app)
                .delete(`/api/annonces/${annonceCreatedId}`)
                .send({ userId: userId })
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("L'annonce Casque sony XM3 a été supprimée avec succès")
            expect(res.body.data.title).toBe("Casque sony XM3")
            expect(res.body.data.photos.length).toBe(3)
            expect(res.body.data.description).toBe("Je propose mon casque sony XM3, acheté il y a 1 an")
            expect(res.body.data.state).toBe("Usé")
            expect(res.body.data.userId).toBe(userId)
        })
    })
})

describe(`\n---------------------------\nPOUR LES CAS D'ERREURS CRUD\n---------------------------`, () => {
    describe("A la création d'une annonce lorsqu'il manque le champ : ", () => {
        describe("- title : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/annonces")
                    .send({
                        photos: [
                            "photo1",
                            "photo2",
                            "photo3"
                        ],
                        description: "Je propose mon casque sony, acheté il y a 1 an",
                        state: "Bon"
                    })
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("Annonce validation failed: title: Path `title` is required.")
            })
        })
        describe("- state : ", () => {
            it("la réponse doit retourner une erreur 400 de validation", async () => {
                const res = await request(app)
                    .post("/api/annonces")
                    .send({
                        title: "Casque sony",
                        photos: [
                            "photo1",
                            "photo2",
                            "photo3"
                        ],
                        description: "Je propose mon casque sony, acheté il y a 1 an",
                    })
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe("Annonce validation failed: state: Path `state` is required.")
            })
        })
    })

    describe("A la création d'une annonce lorsque le champ 'state' est d'un mauvais type : ", () => {
        it("la réponse doit retourner une erreur 400 de validation", async () => {
            const res = await request(app)
                .post("/api/annonces")
                .send({
                    title: "Casque sony",
                    photos: [
                        "photo1",
                        "photo2",
                        "photo3"
                    ],
                    description: "Je propose mon casque sony, acheté il y a 1 an",
                    state: 123
                })
                .set('Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe("Annonce validation failed: state: 123 is not a valid state.")
        })
    })

    describe("A la récupération d'une annonce lorsqu'il y a des erreurs sur l'ID : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur de cast est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/annonces/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"Annonce\"')
            })
        })

        describe("- si aucune annonces ne correspondent à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/annonces/${annonceCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Annonce non trouvé')
            })
        })
    })

    describe("A la récupération d'une annonce lorsqu'il y a des erreurs sur l'ID : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur de cast est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/annonces/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"Annonce\"')
            })
        })

        describe("- si aucunes annonces ne correspondent à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
                const res = await request(app)
                    .get(`/api/annonces/${annonceCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Annonce non trouvé')
            })
        })
    })

    describe("A la supression d'une annonce lorsqu'il y a des erreurs sur l'ID' : ", () => {
        describe("- si l'ID n'est pas au bon format : ", () => {
            it("une erreur 400 de cast est renvoyé", async () => {
                const res = await request(app)
                    .delete(`/api/annonces/a373aa4497zzzee387387eerrrr87968766t737tt`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(400)
                expect(res.body.message).toBe('Cast to ObjectId failed for value \"a373aa4497zzzee387387eerrrr87968766t737tt\" (type string) at path \"_id\" for model \"Annonce\"')
            })
        })

        describe("- si aucunes annonces ne correspondent à l'ID recherché : ", () => {
            it("une erreur est renvoyé", async () => {
                const res = await request(app)
                    .delete(`/api/annonces/${annonceCreatedId}`)
                    .set('Authorization', `Bearer ${token}`)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe('Annonce non trouvé')
            })
        })
    })

    describe("Si le token est manquant pour : ", () => {
        describe("- la récupération de toutes les annonces : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer `)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("JsonWebTokenError")
                expect(res.body.data.message).toBe("jwt must be provided")
            })
        })

        describe("- la récupération d'une annonce : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .get(`/api/annonces/${getRes.body.data[0]._id}`)
                            .set('Authorization', `Bearer `)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("JsonWebTokenError")
                        expect(res.body.data.message).toBe("jwt must be provided")
                    })
            })
        })

        describe("- la modification d'une annonce : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/annonces/${getRes.body.data[0]._id}`)
                            .send({
                                title: "Nintendo Switch OLED",
                                photos: [
                                    "photo1",
                                    "photo2",
                                    "photo3"
                                ],
                                description: "Je propose ma Nintendo switch sous blister",
                                state: "Neuf"
                            })
                            .set('Authorization', `Bearer `)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("JsonWebTokenError")
                        expect(res.body.data.message).toBe("jwt must be provided")
                    })
            })
        })

        describe("- la suppression d'une annonce  : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .delete(`/api/annonces/${annonceCreatedId}`)
                    .set('Authorization', `Bearer `)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("JsonWebTokenError")
                expect(res.body.data.message).toBe("jwt must be provided")
            })
        })
    })

    describe("Si le token est expiré pour : ", () => {
        describe("- la récupération de toutes les annonces : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${tokenExpired}`)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("TokenExpiredError")
                expect(res.body.data.message).toBe("jwt expired")
            })
        })

        describe("- la récupération d'une annonce : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .get(`/api/annonces/${getRes.body.data[0]._id}`)
                            .set('Authorization', `Bearer ${tokenExpired}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("TokenExpiredError")
                        expect(res.body.data.message).toBe("jwt expired")
                    })
            })
        })

        describe("- la modification d'une annonce : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/annonces/${getRes.body.data[0]._id}`)
                            .send({
                                title: "Nintendo Switch OLED",
                                photos: [
                                    "photo1",
                                    "photo2",
                                    "photo3"
                                ],
                                description: "Je propose ma Nintendo switch sous blister",
                                state: "Neuf"
                            })
                            .set('Authorization', `Bearer ${tokenExpired}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                        expect(res.body.data.name).toBe("TokenExpiredError")
                        expect(res.body.data.message).toBe("jwt expired")
                    })
            })
        })

        describe("- la suppression d'une annonce : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                const res = await request(app)
                    .delete(`/api/annonces/${annonceCreatedId}`)
                    .set('Authorization', `Bearer ${tokenExpired}`)
                expect(res.statusCode).toBe(401)
                expect(res.body.message).toBe("L'utilisateur n'est pas autorisé à accèder à cette ressource.")
                expect(res.body.data.name).toBe("TokenExpiredError")
                expect(res.body.data.message).toBe("jwt expired")
            })
        })
    })

    describe("Modification/suppression de données d'une annonce d'un utilisateur X par un utilisateur Y : ", () => {
        describe("- la modification : ", () => {
            it("la réponse doit retourner une erreur", async () => {
                await request(app)
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .put(`/api/annonces/${getRes.body.data[1]._id}`)
                            .send({
                                title: "Nintendo Switch",
                                photos: [
                                    "newPhoto1",
                                    "newPhoto2",
                                    "newPhoto3"
                                ],
                                description: "Je propose ma Nintendo switch (pas OLED) sous blister",
                                state: "Bon",
                                userId: getRes.body.data[1].userId
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
                    .get("/api/annonces")
                    .set('Authorization', `Bearer ${token}`)
                    .then(async (getRes) => {
                        const res = await request(app)
                            .delete(`/api/annonces/${getRes.body.data[1]._id}`)
                            .send({
                                userId: getRes.body.data[1].userId
                            })
                            .set('Authorization', `Bearer ${token}`)
                        expect(res.statusCode).toBe(401)
                        expect(res.body.message).toBe("L'identifiant de l'utilisateur est invalide.")
                    })
            })
        })
    })
})


