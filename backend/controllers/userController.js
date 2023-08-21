const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler') //async functions wraped in async handler to handle exceptions
const User = require('../models/userModel')

//---------------------------------------------------------
// desc    register new user
// route   POST   /api/users
// access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10) // brypt unctions are async, 10 rounds default

  const hashedPassword = await bcrypt.hash(password, salt) // pw from form

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//---------------------------------------------------
// desc    Authenticate a user/ Login
// route   POST   /api/users/login
// access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // check for uer email

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    // pw from req not hashed, user.password from db , hashed compare

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

//---------------------------------------------------
// desc    Get user data
// route   GET   /api/users/me  get the current login user, send token, get an id from the token
// access  Private
const getMe = asyncHandler(async (req, res) => {
  // have access of user from authMiddleware
  // req.user = await User.findById(decoded.id).select('-password')

  // const { _id, name, email } = await User.findById(req.user.id)

  // res.status(200).json({
  //   id: _id,
  //   name,
  //   email,
  // })

  res.status(200).json(req.user)
})

//------------------------------------------------------
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
  // payload, secret, option expiresIn
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
