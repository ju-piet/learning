const express = require('express')
const router = express.Router()

const auth = require('../../services/auth/auth')
const annoncesController = require('../controllers/annoncesController')

router.get('/', auth, annoncesController.getAllAnnonces)
router.post('/', auth, annoncesController.createAnnonce)
router.get('/:annonceId', auth, annoncesController.getAnnonceById)
router.put('/:annonceId', auth, annoncesController.updateAnnonce)
router.delete('/:annonceId', auth, annoncesController.deleteAnnonce)

module.exports = router