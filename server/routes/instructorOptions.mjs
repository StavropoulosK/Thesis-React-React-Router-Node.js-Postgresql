import express from 'express'

import * as instructorOptions from '../controller/instructorOptions.mjs'
import {authoriseInstructor} from '../controller/authorise.mjs'
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

router.route('/getInstructorProfileParams').get(authoriseInstructor,instructorOptions.getInstructorProfileParams)
router.route('/updateInstructorInfo').post(authoriseInstructor,instructorOptions.updateInstructorInfo)
router.route('/getMonthStatistics').get(authoriseInstructor,instructorOptions.getMonthStatistics)
router.route('/getGeneralStatistics').get(authoriseInstructor,instructorOptions.getGeneralStatistics)
router.route('/updateNote').post(authoriseInstructor,instructorOptions.updateNote)
router.route('/getInstructorSchedule/:date').get(authoriseInstructor,instructorOptions.getInstructorSchedule)
router.route('/getTeachings').get(authoriseInstructor,instructorOptions.getTeachings)
router.route('/cancelInstructorLessons').post(authoriseInstructor,instructorOptions.cancelInstructorLessons)
router.route('/updateTeaching').post(authoriseInstructor,instructorOptions.updateTeaching)
router.route('/createTeaching').post(authoriseInstructor,instructorOptions.createTeaching)
router.route('/updateMeetingPoint').post(authoriseInstructor,instructorOptions.updateMeetingPoint)
router.route('/deleteMeetingPoint').post(authoriseInstructor,instructorOptions.deleteMeetingPoint)
router.route('/createMeetingPoint').get(authoriseInstructor,instructorOptions.createMeetingPoint)
router.route('/updateInstructorImage').post(authoriseInstructor,upload.single("image"),instructorOptions.updateInstructorImage)



export default router
