const express = require("express");
const router = express.Router();

const {exec} = require("child_process");

const Student = require("../models/student");

const checkBasicAuth = require("../auth/check-basic-auth");

router.post("/image", checkBasicAuth, (req, res, next) => {
  console.log("Upload face requested");

  if (!req.files) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "File not uploaded"
    });
  } else {
    Student.findOne({
      roll_no: req.headers.roll_no
    })
      .exec()
      .then(student => {
        var statusCode, statusMessage;

        if (student) {
          let photo = req.files.photo;
          let fileName = student.name + "_" + Date.now();
          photo.mv(
            "./core/train_img/" + student.roll_no + "/" + fileName + ".jpg"
          );
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


router.post("/video", checkBasicAuth, (req, res, next) => {
  console.log("Upload video requested");

  if (!req.files) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: "File not uploaded"
    });
  } else {
    Student.findOne({
      roll_no: req.headers.roll_no
    })
      .exec()
      .then(student => {

        if (student) {
          let video = req.files.video;
          let fileName = student.roll_no + "_" + Date.now();
         
          var path = "train_vid/" + fileName + ".mp4"

          video.mv("./core/"+path);
          
          exec("cd core && python3 vid2img.py " + path +" "+ student.roll_no , function(
            error,
            stdout,
            stderr
          ) {
            console.log(stdout);
            var responseList = stdout.split(/\r?\n/);
            var successful = false,
            noOfSavedImages = 0;
            responseList.forEach(function(item) {
              if (item.includes("Images Saved: ")) {
                noOfSavedImages = parseInt(item.replace("Images Saved:", ""));
              }
              if (item.includes("Completed")) {
                successful = true;
              }
            });
            if (successful) {
              return res.status(200).json({
                statusCode: 200,
                statusMessage: "Video Uploaded successfully and converted to Images",
                numberOfSavedImages: noOfSavedImages
              });
            }else {
              return res.status(400).json({
                statusCode: 400,
                statusMessage: "Error in converting to Images"
              });
            }
          
        });


       } else {
        return res.status(404).json({
          statusCode: 404,
          statusMessage: "Student with the given Roll NO does not exist" 
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
});

module.exports = router;
