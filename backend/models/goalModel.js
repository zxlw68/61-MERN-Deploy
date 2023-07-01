const { text } = require('body-parser')
const mongoose = require('mongoose')
const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // need to know which modal this ObjectId pertains to, 'User' modal
    },

    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
  },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Goal', goalSchema) //model name:Goal, takes in goalSchema
