const User = require('../models/User')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')

const signup = async (req, res) => {
    const { name, username, email, password, country } = req.body

    // validate all fields
    if (!name || !username || !email || !country) {
        return res.status(400).json({
            message: 'Please provide all the required fields'
        });
    }

    // make sure email is in the right format
    if(!isEmail(email)){
        return res.status(400).json({
            message: 'Please provide a valid email'
        });
    }

    // make sure languages and skills are arrays
    // if(!Array.isArray(languages) || !Array.isArray(skills)){
    //     return res.status(400).json({
    //         message: 'skills and languages must be arrays'
    //     });
    // }

    // register the user
    try {

        // check if username is already taken
        const usernameExists = await User.findOne({ username })

        if(usernameExists){
            return res.status(400).json({
                message: 'This username has already been taken. Please choose another one'
            })
        }

        // check if user exists
        const userExists = await User.findOne({ email })

        if(userExists){
            res.status(400).json({
                message: 'This email has already been registered. Please try to log in'
            })
        } else {
            bcrypt.hash(password, 10, async function(err, hash) {
                if(hash){
                    const user = await User.create({
                        name, username, email, password: hash, country
                    })

                    // generate jwt token for the created user
                    const jwt = generateToken(user._id)

                    // attach the jwt to the cookie
                    res.cookie('jwt', jwt, { httpOnly: true })

                    res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    })
                }
            });
        }
        
    } catch (error) {
        console.log('Error', error)
        res.status(400).json({
            message: 'Unable to register the user'
        })
    }
}

const login = async (req, res) => {
    let { email, password } = req.body;

    // validate all fields
    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password'
        });
    }

    // make sure email is in the right format
    if(!isEmail(email)){
        return res.status(400).json({
            message: 'Please provide a valid email'
        });
    }

    // attempt to log in the user
    try {
        // check if user exists
        const userExists = await User.findOne({ email });

        // no user
        if(!userExists){
            return res.status(400).json({
                message: 'A user with this email was not found.'
            })
        }

        // user exists
        const user = await User.findOne({ email })

        // check if password is correct
        bcrypt.compare(password, user.password, function(err, result){
            if(result == true){
                 // generate jwt token for the logged in user
                 const jwt = generateToken(user._id)

                 // attach the jwt to the cookie
                 res.cookie('jwt', jwt, { 
                    httpOnly: true,
                    maxAge: 2 * 24 * 60 * 60 * 1000 // expire in 2 days(same as token) 
                })

                 res.status(201).json({
                     _id: user._id,
                     name: user.name,
                     email: user.email
                 })
            } else {
                return res.status(400).json({
                    message: 'Incorrect password'
                })
            }
        })


    } catch (error) {
        console.log('Error', error)
        res.status(400).json({
            message: 'Unable to register the user'
        })
    }
}

const logout = async (req, res) => {
    // replace the existing cookie
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({
        message: 'Logged out'
    })
}

module.exports = {
    signup,
    login,
    logout
}