const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  // Bearer jdgnagne4rns  token: Bearer space token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //  get token from header    turn it into array, split by space ' ' , Bearer is the [0] index, token is the [1] index
      token = req.headers.authorization.split(' ')[1]

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // get user from the token    dont want password hash, wont included password
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }
