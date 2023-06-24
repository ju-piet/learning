const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersController')
const auth = require('../../services/auth/auth')

router.get('/', auth, usersController.getAllUser)
router.post('/', usersController.createUser)
router.get('/:userId', auth, usersController.getUserById)
router.put('/:userId', auth, usersController.updateUser)
router.delete('/:userId', auth, usersController.deleteUser)

module.exports = router