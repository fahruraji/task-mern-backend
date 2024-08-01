const jwt = require('jsonwebtoken');
const asyncHolder = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHolder(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(` `)[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('_password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('You are not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }