const express = require("express");
const { exec } = require("child_process");
const mongoose = require("mongoose");
const router = express.Router();

const Attendence = require("../models/attendence");

const checkAdminAuth = require("../auth/check-admin-auth");

router.post("/", checkAdminAuth, (req, res, next) => {
    if (!req.body.studentList || req.body.studentList.size == 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: "Students list is empty",
        });
    }

    req.body.studentList.forEach((student) => {
        if (!student.roll_no || !student.date || !student.course_code) {
            return res.status(400).json({
                statusCode: 400,
                statusMessage: "Student roll number/course code/date missing",
            });
        }

        const newStudent = Attendence({
            _id: new mongoose.Types.ObjectId(),
            date: student.date,
            course_code: student.course_code,
            roll_no: student.roll_no,
        });

        newStudent
            .save()
            .then((result) => {
                console.log("Attendence for " + student.roll_no + " added");
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    statusCode: 500,
                    error: err,
                });
            });
    });

    return res.status(200).json({
        statusCode: 200,
        statusMessage: "Attendence for all student added",
    });
});

router.get("/", checkAdminAuth, (req, res, next) => {
    if (!req.body.date || !req.body.course_code) {
        Attendence.find()
            .select("-_id -__v")
            .then((result) => {
                if (result.length > 0) {
                    return res.status(200).json({
                        statusCode: 200,
                        statusMessage: "Sending attendence list",
                        result,
                    });
                } else {
                    return res.status(404).json({
                        statusCode: 404,
                        statusMessage: "No attendence records",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    statusCode: 500,
                    statusMessage: "Internal server error",
                    error: err,
                });
            });
    } else {
        Attendence.find({
            date: req.body.date,
            course_code: req.body.course_code,
        })
            .select("-_id -__v")
            .then((result) => {
                if (result.length > 0) {
                    return res.status(200).json({
                        statusCode: 200,
                        statusMessage: "Sending attendence list",
                        result,
                    });
                } else {
                    return res.status(404).json({
                        statusCode: 404,
                        statusMessage: "No attendence records",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    statusCode: 500,
                    statusMessage: "Internal server error",
                    error: err,
                });
            });
    }
});

router.delete("/", checkAdminAuth, (req, res, next) => {
    if (!req.body.date || !req.body.course_code) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: "Attendence date/course code missing",
        });
    }

    Attendence.deleteMany({
        date: req.body.date,
        course_code: req.body.course_code,
    })
        .then((users) => {
            if (users) {
                return res.status(200).json({
                    statusCode: 200,
                    statusMessage:
                        "Attendence records for given date and course code deleted",
                });
            } else {
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: "Attendence recorsd don't exist",
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                statusCode: 500,
                statusMessage: "Internal server error",
            });
        });
});

module.exports = router;

/**
 {
	"studentList" : [
		{
			"roll_no": "107116035",
			"date": "2020-05-03",
			"course_code": "EEPC10"
		},
		{
			"roll_no": "107116085",
			"date": "2020-05-03",
			"course_code": "EEPC10"
		}
	]
}
 */
