const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

//--------------------------------------------------------------
// desc    Get goals
// route   GET /api/goals
// access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id }) // () find all goals,  req.user from protect/authMiddleware

  res.status(200).json(goals)
})

//-------------------------------------------------------
// desc    Set goals
// route   POST /api/goals
// access  Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const goal = await Goal.create({
    user: req.user.id,
    text: req.body.text,
  })

  res.status(200).json(goal)
})

//----------------------------------------------------------------
// desc    UPdate goals
// route   PUT /api/goals/:id
// access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id)

  // check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // meke sure the loggedin user matches the goal user
  // goal has a user field on it, its a object id, toString()
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    // id, update, option
    new: true, // option, create it if not exit
  })
  res.status(200).json(updatedGoal)
})

//-------------------------------------------------------------
// desc    Delete goals
// route   DELETE /api/goals/:id
// access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id)

  // check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // meke sure the loggedin user matches the goal user
  // goal has a user field on it, its a object id, toString()
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // await goal.remove()  not a function
  await Goal.deleteOne({ _id: req.params.id }) // no need assign to a variable

  // await Goal.findByIdAndRemove(req.params.id)
  // await Goal.findByIdAndDelete(req.params.id)

  // await Goal.deleteOne(goal) create random goal// .exec()  The exec method executes the query asynchronously and returns a promise.

  res.status(200).json({ id: req.params.id }) // reason fro the frontend
})

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
}
