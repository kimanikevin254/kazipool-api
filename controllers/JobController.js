const Job = require('../models/Job')
const Category = require('../models/Category')
const User = require('../models/User')
const { job_fields, assign_job_fields } = require('../utils/required_fields')

const create_job = async (req, res) => {
    try {
        // extract data
        const { title, type, compensation, category, description, skill_level, skills } = req.body

        // check if all fields are passed
        const missingFields = job_fields.filter(field => !Object.keys(req.body).includes(field))

        if(missingFields.length > 0){
            return res.status(400).json({
                "error": true,
                "Missing fields": missingFields
            })
        }

        // check if category exists
        let categoryExists = await Category.findOne({ title: category })

        if(!categoryExists){
            // return res.status(400).json({
            //     message: 'Category does not exist'
            // })

            // create the Category
            categoryExists = await Category.create({
                title: category
            })
        }

        // create the job
        const jobDoc = await Job.create({
            title, type, compensation, category: categoryExists, description, skill_level, skills, owner: req.user, assigned_to: null
        })

        res.status(201).json({
            "job": jobDoc
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Unable to create the job'
        })
    }
}

const update_job = async (req, res) => {
    try {
        // extract data
        const { title, type, compensation, category, description, skill_level, skills } = req.body
        const { id } = req.params

        // check if the job exists
        const jobExists = await Job.findById(id)

        if(!jobExists){
            return res.status(400).json({
                message: 'Job does not exist'
            })
        }

        // check if the user is the job owner
        if(JSON.stringify(jobExists.owner._id) !== JSON.stringify(req.user._id)){
            return res.status(400).json({
                message: 'Unauthorized request'
            })
        }

        // check if all fields are passed
        const missingFields = job_fields.filter(field => !Object.keys(req.body).includes(field))

        if(missingFields.length > 0){
            return res.status(400).json({
                "error": true,
                "Missing fields": missingFields
            })
        }

        // check if category exists
        let categoryExists = await Category.findOne({ title: category })

        if(!categoryExists){
            // return res.status(400).json({
            //     message: 'Category does not exist'
            // })
            categoryExists = await Category.create({
                title: category
            })
        }

        // update the job
        const jobDoc = await Job.findByIdAndUpdate(id, {
            title, type, compensation, category: categoryExists, description, skill_level, skills
        })

        res.status(200).json({
            message: 'Job updated successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Unable to update the job'
        })
    }
}

const get_all_jobs = async (req, res) => {
    const jobs = await Job.find({ assigned_to: null })
        .sort({ createdAt: 'desc' })
        .populate({
            path: 'proposals',
            populate: {
                path: 'owner',
                select: '_id name username email'
            }
        })
    res.status(200).json({
        jobs
    })
}

const get_my_jobs = async (req, res) => {
    const jobs = await Job.find({ owner: req.user })
        .sort({ createdAt: 'desc' })
        .populate({
            path: 'proposals',
            populate: {
                path: 'owner',
                select: '_id name username email'
            }
        })
        .populate('assigned_to', ['_id', 'name', 'username'])
    res.status(200).json({
        jobs
    })
}

const get_a_job = async (req, res) => {
    try {
        const { id } = req.params

        // check if the job exists
        const jobExists = await Job.findById(id)
            .populate('category')
            .populate({
                path: 'proposals',
                populate: {
                    path: 'owner',
                    select: '_id name username email'
                }
            })

        if(!jobExists){
            return res.status(400).json({
                message: 'Job does not exist'
            })
        }

        // job exists
        res.status(200).json({
            job: jobExists
        })
    } catch (error) {
        res.status(400).json({
            message: 'Unable to fetch the job. Please try again later.'
        })
    }
}

const get_jobs_assigned_to_me = async (req, res) => {
    try {
        const jobs = await Job.find({ assigned_to: req.user })

        res.status(200).json(jobs)
    } catch (error) {
        console.log(error)

        res.status(400).json({
            message: 'Unable to fetch the jobs' 
        })
    }
} 



module.exports = {
    create_job,
    update_job,
    get_all_jobs,
    get_my_jobs,
    get_a_job,
    get_jobs_assigned_to_me
}