const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return /^[A-Za-z]+$/.test(value)
            },
            message: props => `${props.value} is not a valid firstname.`
        }
    },
    lastname: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return /^[A-Za-z]+$/.test(value)
            },
            message: props => `${props.value} is not a valid lastname.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value)
            },
            message: props => `${props.value} is not a valid email.`
        }
    },
    password: {
        type: String,
        required: true
    },
    pseudo: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
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

module.exports = mongoose.model('User', userSchema, 'Users')

