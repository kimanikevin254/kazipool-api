const { Router } = require('express')
const { create_job, update_job, get_all_jobs, get_my_jobs, get_a_job, get_jobs_assigned_to_me } = require('../controllers/JobController')
const { protect } = require('../middleware/authMiddleware')

const router = Router()

router
    .get('/', protect, get_all_jobs)
    .get('/myjobs', protect, get_my_jobs)
    .get('/assigned_to_me', protect, get_jobs_assigned_to_me)
    .get('/:id', protect, get_a_job)
    .post('/create', protect ,create_job)
    .put('/update/:id', protect, update_job)

module.exports = router