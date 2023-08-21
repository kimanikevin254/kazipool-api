var jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, `${process.env.JWT_SECRET}`, { expiresIn: '2 days' })

module.exports = { generateToken }