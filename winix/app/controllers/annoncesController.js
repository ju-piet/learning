const fs = require('fs')
const jwt = require('jsonwebtoken')
const privateKey = require('../service/private_key')
const Annonce = require('../models/annoncesModel')

//TEST
const switchPhoto1 = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\switch1.jpg')
const switchPhoto2 = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\switch2.png')
const base64Switch1 = switchPhoto1.toString('base64')
const base64Switch2 = switchPhoto2.toString('base64')
const photoArray = [base64Switch1, base64Switch2]
//FIN DU TEST

const createAnnonce = async (req, res) => {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
        return res.status(401).json({ message })
    }
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, privateKey, (error, decodedToken) => {
        if (error) {
            const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
            return res.status(401).json({ message, data: error })
        }

        const newAnnonce = new Annonce({
            title: req.body.title,
            photos: photoArray,
            description: req.body.description,
            state: req.body.state,
            userId: decodedToken.userId,
        })

        newAnnonce.save()
            .then(annonce => {
                const message = `L'annonce ${annonce.title} a été créé`
                return res.json({ message, data: annonce })
            })
            .catch(err => {
                if (err.name == 'ValidationError') {
                    return res.status(400).json({ message: err.message, data: err })
                }
                if (err.name == 'UniqueConstraintError') {
                    return res.status(400).json({ message: err.message, data: err })
                }
                return res.status(500).json({ error: err.message })
            })
    })
}

const getAllAnnonces = async (req, res) => {
    Annonce.find()
        .then(annonces => {
            const message = 'La liste des annonces a été récupérée'
            return res.json({ message, data: annonces })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

const getAnnonceById = async (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then(annonce => {
            if (!annonce) {
                return res.status(404).json({ message: 'Annonce non trouvé' })
            }
            const message = `L'annonce ${annonce.title} a été retrouvé`
            return res.json({ message, data: annonce })
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }
            const message = "L'annonce n'a pas pu être retrouvée"
            return res.status(500).json({ message, data: err })
        })
}

const updateAnnonceById = async (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then(annonce => {
            if (!annonce) {
                return res.status(404).json({ message: 'Annonce non trouvée' })
            }

            const newTitle = req.body.title !== undefined ? req.body.title : annonce.email
            const newDescription = req.body.description !== undefined ? req.body.description : annonce.description
            const newPhotos = req.body.photos !== undefined ? req.body.photos : annonce.photos
            const newState = req.body.state !== undefined ? req.body.state : annonce.state

            Annonce.findByIdAndUpdate(req.params.annonceId,
                {
                    $set: {
                        title: newTitle,
                        description: newDescription,
                        photos: newPhotos,
                        state: newState,
                        updateAt: Date.now
                    }
                }, { runValidators: true })
                .then(updatedAnnonce => {
                    if (!updatedAnnonce) {
                        return res.status(404).json({ message: 'Annonce non trouvée' })
                    }

                    Annonce.findById(req.params.annonceId)
                        .then(annonce => {
                            const message = `L'annonce ${annonce.title} a été modifié`
                            return res.json({ message, data: annonce })
                        })
                })
                .catch(err => {
                    if (err.name === "CastError") {
                        return res.status(400).json({ message: err.message, data: err })
                    }
                    return res.status(500).json({ error: err.message })
                })
        })
}

const deleteAnnonceById = async (req, res) => {
    Annonce.findByIdAndRemove(req.params.annonceId)
        .then(deletedAnnonce => {
            if (!deletedAnnonce) {
                return res.status(404).json({ message: 'Annonce non trouvé' })
            }
            const message = `L'annonce ${deletedAnnonce.title} a été supprimée avec succès`
            return res.json({ message, data: deletedAnnonce })
        })
        .catch(err => {
            if (err.name === "CastError") {
                return res.status(400).json({ message: err.message, data: err })
            }

            return res.status(500).json({ error: err.message })
        })
}

module.exports = {
    createAnnonce,
    getAllAnnonces,
    getAnnonceById,
    updateAnnonceById,
    deleteAnnonceById
}


