const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/User')
const decode = require('jwt-decode')

const protect = async (req, res, next) => {
    const { jwt } = req.cookies

    if(jwt){
        // decode the jwt and check if it has expired
        if(Date.now() >= decode(jwt).exp * 1000){
            return res.status(400).json({
                message: 'Expired token'
            })
        }

        // decode the jwt token
        const decoded = jsonwebtoken.verify(jwt, `${process.env.JWT_SECRET}`)

        // fetch the user associated with the id and attach them to the req object
        req.user = await User.findById(decoded.id).select('-password')

        next()
    } else {
        res.status(400).json({
            message: 'Unauthorized request'
        })
    }
}

module.exports = { protect }