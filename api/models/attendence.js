const mongoose = require("mongoose");

const attendenceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        required: true,
    },
    roll_no: {
        type: String,
        required: true,
    },
    course_code: {
        type: String,
        required: true,
    },
});

attendenceSchema.index(
    { date: 1, roll_no: 1, course_code: 1 },
    { unique: true }
);

module.exports = mongoose.model("Attendence", attendenceSchema);
