import express from 'express'

import * as publicOptions from '../controller/publicOptions.mjs'

const router = express.Router();

router.route('/getHeaderParams').get(publicOptions.getHeaderParams)
router.route('/loginUser').post(publicOptions.loginUser)
router.route('/logoutUser').post(publicOptions.logoutUser)
router.route('/signupUser').post(publicOptions.signupUser)
router.route('/checkEmailIsUsed').post(publicOptions.checkEmailIsUsedPoint)
router.route('/getInstructorInfo/:instructorId').get(publicOptions.getInstructorInfo)


router.route('/showLessons').get(publicOptions.showLessons)
router.route('/bookLesson').get(publicOptions.bookLesson)

router.route('/reviews/:page').post(publicOptions.getReviews)


export default router


// student model previous lesson l.date>=
