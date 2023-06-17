const fs = require('fs')
const jwt = require('jsonwebtoken')
const privateKey = require('../../services/auth/private_key')
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

        newAnnonce.save().then(annonce => {
            const message = `L'annonce ${annonce.title} a été créé`
            res.json({ message, data: annonce })
        })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
    })
}

const getAllAnnonces = async (req, res) => {
    Annonce.find()
        .then(annonces => {
            const message = 'La liste des annonces a été récupérée'
            res.json({ message, data: annonces })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

const getAnnonceById = async (req, res) => {
    Annonce.findById(req.params.annonceId).then(annonce => {
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvé' })
        }
        const message = `L'annonce ${annonce.title} a été retrouvé`
        res.json({ message, data: annonce })
    })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

const updateAnnonce = async (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, {
        title: req.body.title,
        description: req.description,
        state: req.body.state,
        updateAt: Date.now
    }).then(updatedAnnonce => {
        if (!updatedAnnonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' })
        }
        const message = `L'annonce a été modifié`
        res.json({ message, data: updatedAnnonce })
    })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

const deleteAnnonce = async (req, res) => {
    Annonce.findByIdAndRemove(req.params.annonceId)
        .then(deletedAnnonce => {
            if (!deletedAnnonce) {
                return res.status(404).json({ message: 'Annonce non trouvé' })
            }
            const message = `L'annonce ${deletedAnnonce.title} a été supprimée avec succès`
            res.json({ message, data: deletedAnnonce })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
}

module.exports = { 
    createAnnonce, 
    getAllAnnonces, 
    getAnnonceById, 
    updateAnnonce, 
    deleteAnnonce 
}


