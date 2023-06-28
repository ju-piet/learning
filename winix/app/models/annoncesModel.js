const mongoose = require('mongoose')

const annonceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return /^[A-Za-zé]+$/.test(value)
            },
            message: props => `${props.value} is not a valid state.`
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Annonce', annonceSchema, 'Annonces')
