import express from 'express'

import {authoriseStudent} from '../controller/authorise.mjs'
import * as studentOptions from '../controller/studentOptions.mjs'

import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();


router.route('/getStudentProfileParams').get(authoriseStudent,studentOptions.getStudentProfileParams)
router.route('/updateStudentInfo').post(authoriseStudent,studentOptions.updateStudentInfo)


router.route('/addLessonToCart').post(authoriseStudent,studentOptions.addLessonToCart)
router.route('/removeLessonsFromCart').post(authoriseStudent,studentOptions.removeLessonsFromCart)
router.route('/payLessonsInCart').post(authoriseStudent,studentOptions.payLessonsInCart)
router.route('/getCostOfLessonsInCart').get(authoriseStudent,studentOptions.getCostOfLessonsInCart)
router.route('/getPreviousStudentLessons/:page').get(authoriseStudent,studentOptions.getPreviousStudentLessons)
router.route('/getUpComingStudentLessons').get(authoriseStudent,studentOptions.getUpComingStudentLessons)
router.route('/cancelLessons').post(authoriseStudent,studentOptions.cancelLessons)
router.route('/sendEmailRequest').post(authoriseStudent,studentOptions.sendEmailRequest)
router.route('/postReview').post(authoriseStudent,studentOptions.postReview)
router.route('/getLessonsInCart').get(authoriseStudent,studentOptions.getLessonsInCart)
router.route('/updateStudentImage').post(authoriseStudent,upload.single("image"),studentOptions.updateStudentImage)

export default router