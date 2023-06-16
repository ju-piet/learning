const User = require('../../database/models/user')
const auth = require('../auth/auth')
const bcrypt = require('bcrypt')
const fs = require('fs')

//TEST
const imageBuffer = fs.readFileSync('C:\\Users\\julie\\OneDrive\\Bureau\\repositories\\learning\\winix\\src\\images\\julien.jpg')
const base64Image = imageBuffer.toString('base64')
//FIN DU TEST

module.exports = (app) => {
    app.put('/api/users/:id', auth, (req, res) => {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const updatedUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                pseudo: req.body.pseudo,
                photo: base64Image
            })
            User.findByIdAndUpdate(req.params.id, 
                {$set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                    pseudo: req.body.pseudo,
                    photo: base64Image
                }
            }).then(updatedUser=> {
                if (!updatedUser) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé' })
                }
                const message = `L'utilisateur a été modifié`
                res.json({ message, data: updatedUser})
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
        })
    })
}
