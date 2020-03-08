const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  roll_no: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  course_code: String,
  admin: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
