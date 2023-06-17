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
        required: true
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

const annonceModel = mongoose.model('Annonce', annonceSchema, 'Annonces')

module.exports = annonceModel