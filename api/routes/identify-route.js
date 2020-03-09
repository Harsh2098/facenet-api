const express = require("express");
const { exec } = require("child_process");
const router = express.Router();

const Student = require("../models/student");

router.post("/", (req, res, next) => {
  console.log("Face identification requested");

  if (!req.files) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "File not uploaded"
    });
  } else {
    let photo = req.files.photo;
    photo.mv("./core/identification_image.jpg");

    exec("cd core && python3 identify_face_image.py", function(
      error,
      stdout,
      stderr
    ) {
      console.log(stdout);
      var responseList = stdout.split(/\r?\n/);

      var name, probability;
      var successful = false;
      responseList.forEach(function(item) {
        if (item.includes("Name: ")) {
          name = item.replace("Name: ", "");
        }
        if (item.includes("Probability: ")) {
          item = item.replace("Probability: ", "");
          item = item.replace("]", "");
          item = item.replace("[", "");
          probability = parseFloat(item);
        }
        if (item.includes("Completed")) {
          successful = true;
        }
      });

      if (successful) {
        Student.findOne({
          name: name
        })
          .exec()
          .then(student => {
            if (student) {
              if (probability > 0.5) {
                return res.status(200).json({
                  statusCode: 200,
                  statusMessage: "Face identification successful",
                  roll_no: student.roll_no,
                  course_code: student.course_code,
                  name: name,
                  probability: probability
                });
              } else {
                return res.status(200).json({
                  statusCode: 200,
                  statusMessage: "Face identification successful",
                  roll_no: "",
                  course_code: "",
                  name: "unknown_person",
                  probability: probability
                });
              }
            } else {
              return res.status(400).json({
                statusCode: 400,
                statusMessage: "Student has not registered"
              });
            }
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
      } else {
        return res.status(400).json({
          statusCode: 400,
          statusMessage: "Face identification failed"
        });
      }
    });
  }
});

module.exports = router;
