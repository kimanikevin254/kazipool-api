const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: { // one-time project, contract, part-time, full-time
        type: String,
        required: true
    },
    compensation: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skill_level: { // beginner, intermediate, expert
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposals: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proposal',
    }],
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Job', jobSchema)