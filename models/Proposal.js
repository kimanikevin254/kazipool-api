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
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Proposal', proposalSchema)