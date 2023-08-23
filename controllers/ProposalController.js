const Job = require('../models/Job')
const Proposal = require('../models/Proposal')
const User = require('../models/User')
const { proposal_fields, assign_job_fields } = require('../utils/required_fields')

const create_job_proposal = async (req, res) => {
    try {
        const { jobId, bid_amount, project_duration, cover_letter } = req.body

        // check if all fields are passed
        const missingFields = proposal_fields.filter(field => !Object.keys(req.body).includes(field))

        if(missingFields.length > 0){
            return res.status(400).json({
                "error": true,
                "Missing fields": missingFields
            })
        }

        // check if job exists
        const jobExists = await Job.findById(jobId)

        if(!jobExists){
            return res.status(400).json({
                message: 'Job does not exist'
            })
        }

        // create proposal
        const proposalDoc = await Proposal.create({
            bid_amount: bid_amount,
            project_duration: project_duration,
            cover_letter: cover_letter,
            job: jobExists,
            owner: req.user
        })

        // add the proposal to the job
        jobExists.proposals.push(proposalDoc._id)
        await jobExists.save()

        res.status(201).json({
            "proposal": proposalDoc
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Unable to save the proposal.'
        })
    }
}

const get_job_proposals = async (req, res) => {
    try {
        const { jobId } = req.params

        // check if job exists
        const jobExists = await Job.findById(jobId)

        if(!jobExists){
            return res.status(400).json({
                message: 'Job does not exist'
            })
        }

        // fetch the job proposals
        const proposals = await Proposal.find({ job: jobExists._id }).populate('owner', ['_id', 'name', 'username', 'email']).populate('job')

        res.status(200).json({
            job: {
                _id: jobExists._id,
                title: jobExists.title,
            },
            proposals
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Unable to fetch the proposals'
        })
    }
}

const get_a_proposal = async (req, res) => {
    try {
        const { id } = req.params

        if(!id){
            return res.status(400).json({
                message: 'id is required'
            })
        }

        // retrieve proposal
        const proposalDoc = await Proposal.findById(id).populate('owner', ['_id', 'name', 'username', 'email']).populate('job', ['title'])

        if(!proposalDoc){
            return res.status(400).json({
                message: 'Proposal does not exist'
            })
        }

        res.status(200).json({
            proposal: proposalDoc
        })
    } catch (error) {
        res.status(400).json({
            message: 'Unable to fetch the proposal'
        })
    }
}

const accept_proposal = async (req, res) => {
    try {
        const { jobId, userId, proposalId } = req.body

        // check if all fields are passed
        const missingFields = assign_job_fields.filter(field => !Object.keys(req.body).includes(field))

        if(missingFields.length > 0){
            return res.status(400).json({
                "error": true,
                "Missing fields": missingFields
            })
        }

        // check if proposal exists
        let proposalExists = await Proposal.findById(proposalId)

        if(!proposalExists){
            return res.status(400).json({
                message: 'Proposal does not exist'
            })
        }

        // check if user exists
        let userExists = await User.findById(userId)

        if(!userExists){
            return res.status(400).json({
                message: 'User does not exist'
            })
        }

        // check if job exists
        let jobExists = await Job.findById(jobId)

        if(!jobExists){
            return res.status(400).json({
                message: 'Job does not exist'
            })
        }

        // make sure proposal belongs to the specied job
        if(JSON.stringify(proposalExists.job._id) !== JSON.stringify(jobExists._id)){
            return res.status(400).json({
                message: 'Proposal does not belong to the specified job'
            })
        }

        // make sure user is not self assigning the job
        if(JSON.stringify(userExists._id) === JSON.stringify(req.user._id)){
            return res.status(400).json({
                message: 'You cannot assign yourself your own job'
            })
        }

        // make sure the user is not assigning a job they do not own
        if(JSON.stringify(jobExists.owner._id) !== JSON.stringify(req.user._id)){
            return res.status(400).json({
                message: 'You cannot assign a job you do not own'
            })
        }

        // accept proposal
        proposalExists.accepted = true
        await proposalExists.save()

        // assign the job to the specified user
        jobExists.assigned_to = userExists
        await jobExists.save()

        res.status(200).json({
            message: `Job successfuly assigned to ${userExists.name}`
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Could not assign the job. Please try again later.'
        })
    }
}

module.exports = {
    create_job_proposal,
    get_job_proposals,
    get_a_proposal,
    accept_proposal
}