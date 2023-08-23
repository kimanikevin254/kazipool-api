const Job = require('../models/Job')
const Proposal = require('../models/Proposal')
const { proposal_fields } = require('../utils/required_fields')

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
        const proposals = await Proposal.find({ job: jobExists }).populate('owner', ['_id', 'name', 'username', 'email'])

        res.status(200).json({
            proposals
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Unable to fetch the proposals'
        })
    }
}

module.exports = {
    create_job_proposal,
    get_job_proposals
}