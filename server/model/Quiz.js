const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Quiz = mongoose.model('Quiz', {
  _id: { type: String, default: uuid },
  name: String,
  played_times: {
    type: Number,
    default: 0
  },
  questions: [
    {
      _id: false,
      answers: [
        {
          _id: false,
          text: String,
          valid: Boolean,
        },
      ],
      text: String,
    },
  ],
});
