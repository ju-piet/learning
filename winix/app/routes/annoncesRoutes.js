const express = require('express')
const router = express.Router()

const annoncesController = require('../controllers/annoncesController')

router.get('/', annoncesController.getAllAnnonces)
router.post('/', annoncesController.createAnnonce)
router.get('/:annonceId', annoncesController.getAnnonceById)
router.put('/:annonceId', annoncesController.updateAnnonce)
router.delete('/:annonceId', annoncesController.deleteAnnonce)

module.exports = router