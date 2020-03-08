const express = require("express");
const router = express.Router();

const checkBasicAuth = require("../auth/check-basic-auth");

const Student = require("../models/student");

router.post("/image", checkBasicAuth, (req, res, next) => {
  console.log("Upload face requested");

  if (!req.files) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "File not uploaded"
    });
  } else if (!req.body.name || !req.body.roll_no) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "Name or Roll Number not specified"
    });
  } else {
    Student.findOne({
      roll_no: req.body.roll_no
    })
      .exec()
      .then(student => {
        var statusCode, statusMessage;

        if (student) {
          let photo = req.files.photo;
          photo.mv("./core/known/" + req.body.name + ".jpg");
          statusCode = 200;
          statusMessage = "File uploaded successfully";
        } else {
          statusCode = 404;
          statusMessage = "Student with given roll number does not exist";
        }

        return res.status(statusCode).json({
          statusCode: statusCode,
          statusMessage: statusMessage
        });
      })
      .catch(err => {
        console.log({
          error: err
        });
        return res.status(500).json({
          statusCode: 500,
          statusMessage: "Internal server error"
        });
      });
  }
});

module.exports = router;
