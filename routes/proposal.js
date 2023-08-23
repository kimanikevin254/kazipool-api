const { Router } = require('express')
const { protect } = require('../middleware/authMiddleware')
const { create_job_proposal, get_job_proposals, get_a_proposal, accept_proposal } = require('../controllers/ProposalController')

const router = Router()

router
    .post('/', protect, create_job_proposal)
    .get('/proposal/:id', protect, get_a_proposal)
    .get('/:jobId', protect, get_job_proposals)
    .post('/accept', protect, accept_proposal)

module.exports = router