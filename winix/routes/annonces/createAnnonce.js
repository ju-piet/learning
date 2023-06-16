const Annonce = require('../../database/models/annonce')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

//TEST
const switchPhoto1 = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\switch1.jpg')
const switchPhoto2 = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\switch2.png')
const base64Switch1 = switchPhoto1.toString('base64')
const base64Switch2 = switchPhoto2.toString('base64')

const photoArray = [base64Switch1, base64Switch2]
//FIN DU TEST

module.exports = (app) => {
    app.post('/api/annonces', (req, res) => {
        const authorizationHeader = req.headers.authorization   
  
        if(!authorizationHeader) {
            const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
            return res.status(401).json({ message })
        }
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, privateKey, (error, decodedToken) => {
            if(error) {
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
    })
}
