const express = require("express");
const { exec } = require("child_process");
const router = express.Router();

const checkBasicAuth = require("../auth/check-basic-auth");

const Student = require("../models/student");

router.post("/", checkBasicAuth, (req, res, next) => {
  console.log("Face identification requested");

  if (!req.files) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "File not uploaded"
    });
  } else {
    let photo = req.files.photo;
    photo.mv("./core/identification_image.jpg");

    exec("rm core/unknown/* && python3 core/splitfaces.py", function(
      error,
      stdout,
      stderr
    ) {
      console.log(stdout);
      var responseList = stdout.split(/\r?\n/);

      var successful = false;
      var noOfFaces = 0;
      responseList.forEach(function(item) {
        if (item.includes("Number of faces detected: ")) {
          item = item.replace("Number of faces detected: ", "");
          noOfFaces = parseInt(item);
        }
        if (item.includes("Completed")) {
          successful = true;
        }
      });

      if (successful) {
        exec(
          "face_recognition --show-distance true --cpus -1 ./core/known ./core/unknown | cut -d ',' -f2",
          function(error, stdout, stderr) {
            console.log(stdout);

            var responseList = stdout.split(/\r?\n/);
            responseList.pop();

            var studentList = [];
            var unknownStudentCount = 0;

            for (index in responseList) {
              Student.findOne({
                name: responseList[index]
              })
                .select("-_id -__v")
                .exec()
                .then(student => {
                  if (student) {
                    studentList.push(student);
                  } else {
                    unknownStudentCount++;
                  }

                  if (index == responseList.length - 1) {
                    return res.status(200).json({
                      statusCode: 200,
                      statusMessage: "Face recognition successful",
                      students: studentList,
                      noOfFaces: noOfFaces,
                      unknownStudents: unknownStudentCount
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
            }
          }
        );
      } else {
        return res.status(400).json({
          statusCode: 400,
          statusMessage: "Faces could not be detected properly"
        });
      }
    });
  }
});

module.exports = router;
