const mongoose = require('mongoose')

const proposalSchema = mongoose.Schema({
    bid_amount: {
        type: Number,
        required: true
    },
    project_duration: {
        type: String,
        required: true
    },
    cover_letter: {
        type: String,
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Proposal', proposalSchema)