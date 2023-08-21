const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    country: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    skills: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema)