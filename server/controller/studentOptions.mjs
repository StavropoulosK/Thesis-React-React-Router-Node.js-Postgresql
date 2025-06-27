import * as studentOptionsModel from "../model/studentOptions.mjs"
import { saveImage } from "../model/instructorOptions.mjs";
import 'dotenv/config'
import emailjs from '@emailjs/nodejs';

const EMAILJS_PUBLIC_API_KEY=  process.env.EMAILJS_PUBLIC_API_KEY
const EMAILJS_PRIVATE_API_KEY= process.env.EMAILJS_PRIVATE_API_KEY


async function getStudentProfileParams(req,res,next){
  

  try{

     const studentId= req.session.userID


        if(!studentId){
            return res.status(401).end();

        }



        const { email, phonenumber, firstname, lastname, profilepicture  } = await (studentOptionsModel.getStudentProfileParams(studentId))

        let imageBase64 = null;
        if (profilepicture) {
            const mimeType = "image"; 
            imageBase64 = `data:${mimeType};base64,${profilepicture.toString("base64")}`;
        }



    res.json({firstName:firstname,lastName:lastname,email,phone:phonenumber,profileImage: imageBase64 })

  }
  catch(error){
    next(error)
  }


}

async function updateStudentInfo(req,res,next){
  try{
    const { firstName, lastName, email, phoneNumber} = req.body;
  
    const userID= req.session.userID


    if(!userID){
        return res.status(401).end();

    }

    let updateValueName=""
    let updateValue=""

    // only update value is not null

    if(firstName!=null){
        updateValueName="firstName"
        updateValue=firstName
    }
    else if(lastName!=null){
        updateValueName="lastName"
        updateValue=lastName
    }
    else if(email!=null){
        updateValueName="email"
        updateValue=email
    }
    else if(phoneNumber!=null){
        updateValueName="phoneNumber"
        updateValue=phoneNumber
    }
  
    await (studentOptionsModel.updateStudentInfo(updateValueName,updateValue,userID))

    //success, failure
  
  
    return res.json({message:"success"})
  }
  catch(error){
    console.log(error)

    return res.json({message:"failure"})
  }
}

async function updateStudentImage(req,res,next){
  try{
      const imageBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      const studentId= req.session.userID

      if(!studentId){
          return res.status(401).end();

      }

      await saveImage(studentId, imageBuffer);


      res.send({message:"success"});
  }
  catch(error){
      console.log(error)

      return res.json({message:"failure"})
  }
}







async function addLessonToCart(req,res,next){
  try{
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const { lessonIDs,members,selectedLevel} = req.body;

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }

    
    const insertedLessons = await studentOptionsModel.addLessonToCart(studentId,lessonIDs,Number(members),selectedLevel)
    req.session.cartLessons = req.session.cartLessons + insertedLessons
    return res.status(200).end();
  }
  catch(error){
    next(error)
  }

}

const convertStrToArray = (val) =>{
  // if value is null return empty array

  if(typeof val === 'string' && val.length!=0){
      return val.split(',')
  }
  else{
      return []
  }

} 

async function removeLessonsFromCart(req,res,next){
  try{
     // await new Promise(resolve => setTimeout(resolve, 2000));

      // lessonIDS is an array
      const { lessonIDS} = req.body;

      const studentId= req.session.userID

      if(!studentId){
          return res.status(401).end();

      }

      const removedLessons= await studentOptionsModel.removeLessonsFromCart(studentId,convertStrToArray(lessonIDS).map(Number))

      req.session.cartLessons = req.session.cartLessons - removedLessons

      return res.status(200).end();
  }
  catch(error){
    next(error)
  }

}

async function payLessonsInCart(req,res,next){

  try{
    const {  cardHolderName,cardNumber,expirationDate,cvv} = req.body;

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }


    const cardNumberNoSpace= cardNumber.replace(/\s/g, "");
    
    const isValid = isValidPaymentInput( cardHolderName,cardNumberNoSpace,expirationDate,cvv)


    let message

    if(isValid){

      // 1) insert reservation to db
      // 2) check if insertion classes from another insertion (by the time user paid, the lesson may have been reserved by someone else)
      // 3) if there is a class, remove reservation from db and notify user. if there is no class, authorize payment. if payment fails notify user, if payment succeeds notify user and remove lessons from cart.

      message =await reserveLessons(req,studentId,cardHolderName,cardNumber,expirationDate,cvv)
    }
    else{

      message="payment_failed"
    }

    res.json({message})
  }
  catch(error){
    next(error)
  }

}

async function reserveLessons(req,studentId,cardHolderName,cardNumber,expirationDate,cvv){
      // 1) insert reservation to db
      // 2) check if insertion classes from another insertion (by the time user paid, the lesson may have been reserved by someone else)
      // 3) if there is a class, remove reservation from db and notify user. if there is no class, authorize payment. if payment fails notify user, if payment succeeds notify user, insert payment and remove lessons from cart.

    
    const reservationID= await studentOptionsModel.createNewReservation(studentId)


    const reservLesIDs= await studentOptionsModel.insertReservationLesson(reservationID,studentId)
    const existingClasses= await studentOptionsModel.checkForLessonClasses(reservationID)

    if(existingClasses !=0){
      await studentOptionsModel.deleteReservation(reservationID)
      return 'check_cart_failed'
    }
    else{
      const cost=  (await studentOptionsModel.getCostOfLessonsInCart(studentId) )
      const paymentSucceded= await makePayment(cardHolderName,cardNumber,expirationDate,cvv,cost)
      if(paymentSucceded){
        await studentOptionsModel.clearCart(studentId)
        await studentOptionsModel.insertPayment(cost,reservationID)
        req.session.cartLessons=0
        return 'payment_succeeded'
      }
      else{
        return 'payment_failed'
      }
    }

  }

async function makePayment(cardHolderName,cardNumber,expirationDate,cvv,cost){
  // connect to bank api
  return true
}


async function getCostOfLessonsInCart(req,res,next){
  try{

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }

    const cost=  (await studentOptionsModel.getCostOfLessonsInCart(studentId) )

    res.json({cost})

  }
  catch(error){
    next(error)
  }

}

async function getPreviousStudentLessons(req,res,next){

  try{
      // stars=-1 if user has not submitted review before

      const studentId= req.session.userID
      if(!studentId){
          return res.status(401).end();

      }


      const page=Number(req.params.page)

      // const lessonss = [
      //   {
      //       instructorInfo:{
      //           instructorID:'12',
      //           instructorName: "Alice J.",
      //           reviewScore: "4.8",
      //           reviewCount: 12,
      //           experience: "1",
      //           languages: ["English", "French", "Spanish"],
      //           cancelationDays: "-1",
      //           image: "/images/startPage/Ski.jpg",
      //           email:"123123myemail@gmail.com",
      //           phoneNumber:"+306951232693"
  
      //       },
      //       teachingInfo:{
      //           typeOfLesson: "private",
      //           resort: "Parnassou",
      //           sport: "Ski",
      //           groupName: "",           // only for group lessons
      //       },
      //       reviewInfo:{
      //         stars:"",
      //         text:"",
      //       },
      //       participantsInfo:{
      //           level: "Beginner",
      //           participants: "4",      //  how many participants the person book for 
      //       },
      //       lessonInfo:
      //       [ {
      //             lessonID: "1",
      //             date: "30/04/2025",
      //             timeStart: "09:00",
      //             timeEnd: "17:00",
      //             cost: "150",
      //             meetingPoint: { location: "Δεύτερο σαλέ" },
      //             isAllDay: false,
      //             canceled:true
  
  
      //         },
      //         {
      //             lessonID: "2",
      //             date: "29/04/2025",
      //             timeStart: "12:00",
      //             timeEnd: "14:00",
      //             cost: "150",
      //             isAllDay: true,
  
      //             meetingPoint: { location: "Δεύτερο σαλέ" },
      //             canceled:true
  
      //         },
  
  
      //       ]
      //   },
  
      //   {
      //     instructorInfo:{
      //       instructorID:'12',
      //       instructorName: "Andrew R.",
      //       reviewScore: "3.8",
      //       reviewCount: 1,
      //       experience: "2",
      //       languages: ["English", "French"],
      //       cancelationDays: "-1",
      //       image: "/images/startPage/Ski.jpg",
      //       email:"myemail!!@gmail.com",
      //       phoneNumber:"+306951232692"
  
      //     },
      //     reviewInfo:{
      //       stars:4,
      //       text:"awesome isntuctor",
      //     },
      //     teachingInfo:{
      //         typeOfLesson: "group",
      //         resort: "Kalavryton",
      //         sport: "Snowboard",
      //         groupName: "Lessons for kids",           // only for group lessons
      //     },
      //     participantsInfo:{
      //         level: "Beginner",
      //         participants: "3",      
  
  
      //     },
      //     lessonInfo:
      //     [ {
      //           lessonID: "3",
      //           date: "13/04/2025",
      //           timeStart: "12:00",
      //           timeEnd: "14:00",
      //           cost: "250",
      //           meetingPoint: { location: "Δεύτερο σαλέ" },
      //           isAllDay: true,
  
              
  
      //       },
      //       { 
      //           lessonID: "4",
      //           date: "14/04/2026",
      //           timeStart: "12:00",
      //           timeEnd: "14:00",
      //           cost: "260",
      //           isAllDay: false,
      //           meetingPoint: { location: "Δεύτερο σαλέ" }
            
      //       },
  
  
      //     ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "3",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:-1,
      //     text:"",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "3a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "3b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "4",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "4a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "4b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "5",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "5a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "5b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "6",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "6a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "6b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "7",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "7a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "7b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "8",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "8a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "8b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
  
      // {
      //   instructorInfo:{
      //     instructorID:'12',
      //     instructorName: "Michael R.",
      //     reviewScore: "3.8",
      //     reviewCount: 1,
      //     experience: "9",
      //     languages: ["English", "French"],
      //     cancelationDays: "15",
      //     image: "/images/startPage/Ski.jpg",
      //     email:"myemail!!@gmail.com",
      //     phoneNumber:"+306951232693"
  
      //   },
      //   reviewInfo:{
      //     stars:4,
      //     text:"awesome isntuctor",
      //   },
      //   teachingInfo:{
      //       typeOfLesson: "group",
      //       resort: "Kalavryton",
      //       sport: "Snowboard",
      //       groupName: "Lessons for kids",           // only for group lessons
      //   },
      //   participantsInfo:{
      //       level: "Beginner",
      //       participants: "3",      
  
  
      //   },
      //   lessonInfo:
      //   [ {
      //         lessonID: "9a",
      //         date: "13/04/2025",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "250",
      //         meetingPoint: { location: "Δεύτερο σαλέ" },
      //         isAllDay: true,
  
            
  
      //     },
      //     { 
      //         lessonID: "9b",
      //         date: "14/04/2026",
      //         timeStart: "12:00",
      //         timeEnd: "14:00",
      //         cost: "260",
      //         isAllDay: false,
      //         meetingPoint: { location: "Δεύτερο σαλέ" }
          
      //     },
  
  
      //   ]
      // },
      // ]

      const lessons= groupStudentLessons (await studentOptionsModel.getPreviousStudentLessons(studentId)  )
  
      const lessonsPerPage = 3;
  
      const maxPages= Math.ceil(lessons.length / lessonsPerPage)
      const startIndex = (page - 1) * lessonsPerPage;
      const endIndex = startIndex + lessonsPerPage;
    
      // Return lessons for the given page
      const lessonsToSend= lessons.slice(startIndex, endIndex);
      const studentEmail= await studentOptionsModel.getStudentEmail(studentId)

 
      // console.dir(temp, { depth: null });

      
      res.json({previousLessons:lessonsToSend,maxPages,studentEmail})
  }
  catch(error){
    next(error)
  }
    
}

function groupStudentLessons(lessons) {
  const grouped = new Map();

  for (const lesson of lessons) {


    const profileImg= lesson.image
    const lessonImg= lesson.picture

    let imageBase64_a = null;
    if (profileImg) {
        const mimeType = "image"; 
        imageBase64_a = `data:${mimeType};base64,${profileImg.toString("base64")}`
    }

    let imageBase64_b = null;
    if (lessonImg) {
        const mimeType = "image"; 
        imageBase64_b = `data:${mimeType};base64,${lessonImg.toString("base64")}`
    }

    const meetingPointId= lesson.meetingpointid
    const locationText= lesson.locationText


    const finalLocation= (meetingPointId==null) || (isNullOrEmpty(locationText) && isNullOrEmpty(lessonImg)) ?"after_agreement":locationText

    const isPrivate = lesson.typeOfLesson === "private";
    const finalCostPerHour=  lesson.typeOfLesson === "private"?lesson.costPerHour:lesson.costPerHour*Number(lesson.participants)


    // Choose key fields based on lesson type
    const key = isPrivate
      ? `${lesson.reservationid}|${lesson.instructorid}|${lesson.resort}|${lesson.sport}|${lesson.lowestlevel}|${lesson.participants}`
      : `${lesson.reservationid}|${lesson.instructionID}|${lesson.resort}|${lesson.sport}|${lesson.lowestlevel}|${lesson.participants}`;


    // Prepare lessonInfo item
    const lessonInfoItem = {
      lessonID: String(lesson.lessonid),
      reservationID: String(lesson.reservationid),
      date: reformatDateUI(lesson.date),
      timeStart: lesson.timeStart,
      timeEnd: lesson.timeEnd,
      cost: String(  Math.round(finalCostPerHour * calculateHoursBetween(lesson.timeStart, lesson.timeEnd) ) ), 
      meetingPoint: {location:finalLocation,picture:imageBase64_b },
      costPerHour: finalCostPerHour,
      isAllDay: lesson.isAllDay,
      canceled:lesson.canceled

    };


    // If this group doesn't exist yet, create it
    if (!grouped.has(key)) {

      const groupObject = {
        instructorInfo: {
          instructorId: lesson.instructorid,
          instructorName: lesson.instructorName,
          reviewScore: lesson.reviewScore,
          reviewCount: lesson.reviewCount,
          experience: lesson.experience,
          languages: lesson.languages,
          cancelationDays:
            lesson.cancelationpolicy == "dnot"
              ? "-1"
              : String(lesson.cancelationpolicy.slice(1)),
          image: imageBase64_a,
          phoneNumber: lesson.phonenumber,
          email: lesson.email,
        },
        reviewInfo : {
          stars: -1,
          text:"",
        },
        teachingInfo: {
          typeOfLesson: lesson.typeOfLesson,
          resort: lesson.resort,
          sport: lesson.sport,
          groupName: lesson.groupName != null ? lesson.groupName : "",
        },
        participantsInfo: {
          level: lesson.lowestlevel,
          participants: lesson.participants,
        },
        lessonInfo: [lessonInfoItem],
      };

      grouped.set(key, groupObject);


      
    } else {
      // If group exists, just add the lessonInfo item
      grouped.get(key).lessonInfo.push(lessonInfoItem);
    }

    // Conditionally add reviewInfo only if review exist
    if (lesson.stars != null ){
      const group = grouped.get(key);
      group.reviewInfo = {
        stars: lesson.stars,
        text: lesson.text ?? "",
      };
    } 

  }


  // Return grouped results as an array
  return Array.from(grouped.values());
}



async function getUpComingStudentLessons(req,res,next){
  try{
    // dixnontai mono ta erxomena mathimata.
    // ta erxomena mathimata katigoriopoiountai ana kratisi
    // ta idiotika mathimata : ana kratisi/ ana instructor/ ana resort/ana sport/ ana participant info
    // ta group mathimata : ana kratisi/ ana didaskalia / ana participant info

    //cancelatioDays=-1 for no cancelation policy

    const studentId= req.session.userID


    if(!studentId){
        return res.status(401).end();

    }


    const lessons= groupStudentLessons (await studentOptionsModel.getUpComingStudentLessons(studentId))


    const studentEmail= await studentOptionsModel.getStudentEmail(studentId)


    // const lessons = [
    //   {
    //       instructorInfo:{
    //           instructorID:'12',
    //           instructorName: "Alice J.",
    //           reviewScore: "4.8",
    //           reviewCount: 12,
    //           experience: "6",
    //           languages: ["English", "French", "Spanish"],
    //           cancelationDays: "-1",
    //           image: "/images/startPage/Ski.jpg",
    //           email:"myemail@gmail.com",
    //           phoneNumber:"+306951232693"
  
    //       },
    //       reviewInfo:{
    //         stars:"",
    //         text:"",
    //       },
    //       teachingInfo:{
    //           typeOfLesson: "private",
    //           resort: "Parnassou",
    //           sport: "Ski",
    //           groupName: "",           // only for group lessons
    //       },
    //       participantsInfo:{
    //           level: "Beginner",
    //           participants: "4",      //  how many participants the person book for 
    //       },
    //       lessonInfo:
    //       [ {
    //             // occupancy: "",           // only for group lessons (e.g. 4/6)
    //             lessonID: "101",
    //             date: "30/05/2025",
    //             timeStart: "09:00",
    //             timeEnd: "17:00",
    //             cost: "150",
    //             meetingPoint: { location: "Δεύτερο σαλέ" },
    //             isAllDay: false,
    //             canceled:true
  
  
    //         },
    //         {
    //             lessonID: "102",
    //             date: "29/05/2025",
    //             timeStart: "12:00",
    //             timeEnd: "14:00",
    //             cost: "150",
    //             isAllDay: true,
  
    //             meetingPoint: { location: "Δεύτερο σαλέ" },
    //             canceled:true

    //         },
  
  
    //       ]
    //   },
  
    //   {
    //     instructorInfo:{
    //       instructorID:'12',
    //       instructorName: "Michael R.",
    //       reviewScore: "3.8",
    //       reviewCount: 1,
    //       experience: "2",
    //       languages: ["English", "French"],
    //       cancelationDays: "15",
    //       image: "/images/startPage/Ski.jpg",
    //       email:"myemail!!@gmail.com",
    //       phoneNumber:"+306951232693"

    //     },
    //     reviewInfo:{
    //       stars:"",
    //       text:"",
    //     },
    //     teachingInfo:{
    //         typeOfLesson: "group",
    //         resort: "Kalavryton",
    //         sport: "Snowboard",
    //         groupName: "Lessons for kids",           // only for group lessons
    //     },
    //     participantsInfo:{
    //         level: "Beginner",
    //         participants: "3",      
  
  
    //     },
    //     lessonInfo:
    //     [ {
    //           lessonID: "1011",
    //           date: "13/04/2025",
    //           timeStart: "12:00",
    //           timeEnd: "14:00",
    //           cost: "250",
    //           meetingPoint: { location: "Δεύτερο σαλέ" },
    //           isAllDay: true,
  
            
  
    //       },
    //       { 
    //           lessonID: "1022",
    //           date: "14/04/2026",
    //           timeStart: "12:00",
    //           timeEnd: "14:00",
    //           cost: "260",
    //           isAllDay: false,
    //           meetingPoint: { location: "Δεύτερο σαλέ" },
    //           canceled:true
          
    //       },

    //       { 
    //         lessonID: "1023",
    //         date: "14/04/2026",
    //         timeStart: "12:00",
    //         timeEnd: "14:00",
    //         cost: "260",
    //         isAllDay: false,
    //         meetingPoint: { location: "Δεύτερο σαλέ" },
    //         canceled:false
        
    //     },

    //     { 
    //       lessonID: "1024",
    //       date: "14/04/2026",
    //       timeStart: "12:00",
    //       timeEnd: "14:00",
    //       cost: "260",
    //       isAllDay: false,
    //       meetingPoint: { location: "Δεύτερο σαλέ" },
    //       canceled:false
      
    //   },

    //   { 
    //     lessonID: "1025",
    //     date: "14/04/2026",
    //     timeStart: "12:00",
    //     timeEnd: "14:00",
    //     cost: "260",
    //     isAllDay: false,
    //     meetingPoint: { location: "Δεύτερο σαλέ" },
    //     canceled:true
    
    // },
  
  
    //     ]
    // },
    // ]
  
  
    res.json({upComingLessons:lessons,studentEmail:studentEmail})
  }
  catch(error){

    next(error)
  }
  
}

async function cancelLessons(req,res,next){

  try{
    const {lessons} = req.body

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }

    // lessons is an array with strings like '241 35' first is lessonID, second is reservationID 

    const lessonTuples = lessons.map(pair => {
      const [lesson_id, reservation_id] = pair.split(' ').map(Number);
      return `(${lesson_id}, ${reservation_id})`;
    });

    await studentOptionsModel.cancelLessons(lessonTuples)


    //cancel_success, cancel_failure

    // console.log("!#!# ",lessons)


    res.json({message:"cancel_success"})
  }
  catch(error){
    console.error(error)
    res.json({message:"cancel_failure"})
  }

}

async function sendEmailRequest(req,res,next){
  try{
    const {studentEmail,instructorEmail,userMessage} = req.body

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }


    const studentName= await studentOptionsModel.getStudentName(studentId)
   
    await emailjs.send(
      'service_x3w1eap','easy_snow',{
              to_email: instructorEmail ,
              from_name: studentName,
              from_email: studentEmail,
              message: userMessage,
          },{
              publicKey: EMAILJS_PUBLIC_API_KEY,
              privateKey: EMAILJS_PRIVATE_API_KEY,
            }
    )


    //email_success, email_failure
  
  
    res.json({message:"email_success"})
  }
  catch(error){
    console.error(error)
    res.json({message:"email_failure"})

  }
   
}

async function postReview(req,res,next){
  
  try{
    const {stars,review,lessonIDS,instructorID} = req.body

    //review_success, review_failure

    const lessonIDSFinal = lessonIDS.split(',').map(s => s.trim())

  
    const studentId= req.session.userID
    // lessonid 383 , reservlesid 57
    if(!studentId){
        return res.status(401).end();

    }

    // lessonIDSFinal is an array with strings like '241 35' first is lessonID, second is reservationID 

    const lessonTuples = lessonIDSFinal.map(pair => {
      const [lesson_id, reservation_id] = pair.split(' ').map(Number);
      return `(${lesson_id}, ${reservation_id})`;
    });


    const existingReviewID= await studentOptionsModel.getReviewID(lessonTuples)
    const firstLesson = Number(lessonIDSFinal[0].split(" ")[0])
    const reservationID=Number(lessonIDSFinal[0].split(" ")[1])

    if(existingReviewID==-1){
        
        const newReviewID=await studentOptionsModel.createReview(studentId,review,stars)

        await studentOptionsModel.insertIntoReviewLesson(newReviewID,reservationID,firstLesson)


    }

    else{
        await studentOptionsModel.updateReview(existingReviewID,review,stars)

    }

  
    res.json({message:"review_success"})
  }
  catch(error){
    console.error(error)
    res.json({message:"review_failure"})
  }
   
}


function reformatDateUI(input) {
  // input YYYY/MM/DD
  // output DD/MM/YYYY

  const [year, month, day] = input.split('/');
  return `${day}/${month}/${year}`;
}

function calculateHoursBetween(timeStart, timeEnd) {
  // Parse HH:MM strings into Date objects on the same arbitrary day
  const [startHours, startMinutes] = timeStart.split(":").map(Number);
  const [endHours, endMinutes] = timeEnd.split(":").map(Number);

  const startDate = new Date(0, 0, 0, startHours, startMinutes);
  const endDate = new Date(0, 0, 0, endHours, endMinutes);

  let diffMs = endDate - startDate;

  const hours = diffMs / (1000 * 60 * 60);
  return hours;
}

function isNullOrEmpty(value) {
  return value === null || value === "";
}


function groupCartLessons(lessons) {
  const grouped = new Map();

  for (const lesson of lessons) {

    const profileImg= lesson.image
    const lessonImg= lesson.picture

    let imageBase64_a = null;
    if (profileImg) {
        const mimeType = "image"; 
        imageBase64_a = `data:${mimeType};base64,${profileImg.toString("base64")}`
    }

    let imageBase64_b = null;
    if (lessonImg) {
        const mimeType = "image"; 
        imageBase64_b = `data:${mimeType};base64,${lessonImg.toString("base64")}`
    }

    const meetingPointId= lesson.meetingpointid
    const locationText= lesson.locationText

    const finalLocation= (meetingPointId==null) || (isNullOrEmpty(locationText) && isNullOrEmpty(lessonImg)) ?"after_agreement":locationText

    const isPrivate = lesson.typeOfLesson === "private";

    const finalCostPerHour=  lesson.typeOfLesson === "private"?lesson.costPerHour:lesson.costPerHour*Number(lesson.participants)

    // Choose key fields based on lesson type
    const key = isPrivate
      ? `${lesson.instructorid}|${lesson.resort}|${lesson.sport}|${lesson.level}|${lesson.participants}`
      : `${lesson.instructionID}|${lesson.resort}|${lesson.sport}|${lesson.level}|${lesson.participants}`;

    // Prepare lessonInfo item
    const lessonInfoItem = {
      lessonID: String(lesson.lessonID),
      date: reformatDateUI(lesson.date),
      timeStart: lesson.timeStart,
      timeEnd: lesson.timeEnd,
      cost: String(  Math.round(finalCostPerHour * calculateHoursBetween(lesson.timeStart, lesson.timeEnd) ) ),
      meetingPoint: {location:finalLocation,picture:imageBase64_b },
      costPerHour: finalCostPerHour,
      isAllDay: lesson.isAllDay,
    };


    // If this group doesn't exist yet, create it
    if (!grouped.has(key)) {
      grouped.set(key, {
        instructorInfo: {
          instructorName: lesson.instructorName,
          reviewScore: lesson.reviewScore,
          reviewCount: lesson.reviewCount,
          experience: lesson.experience,
          languages: lesson.languages,
          cancelationDays: lesson.cancelationpolicy=="dnot"?"-1": String(lesson.cancelationpolicy.slice(1) ),
          image: imageBase64_a
        },
        teachingInfo: {
          typeOfLesson: lesson.typeOfLesson,
          resort: lesson.resort,
          sport: lesson.sport,
          groupName: lesson.groupName!=null?lesson.groupName:""
        },
        participantsInfo: {
          level: lesson.level,
          participants: lesson.participants
        },
        lessonInfo: [lessonInfoItem]
      });
    } else {
      // If group exists, just add the lessonInfo item
      grouped.get(key).lessonInfo.push(lessonInfoItem);
    }
  }


  // Return grouped results as an array
  return Array.from(grouped.values());
}

async function getLessonsInCart(req,res,next){
  try{
      // we check if lessons are still available, else we remove them from cart
      // elegxoume an ta mathimata einai akomi eleuthera, alios ta afairoume apo to kalathi

      // ta private lessons katigoriopoiountai me basi ton proponiti (kai to resort,sport), kai participants info  (mpori na einai poles didaskalies)
      // ta group lessons katigoriopoiountai me basi tin didaskalia, kai participants info  (mono mia didaskalia)

    const studentId= req.session.userID

    if(!studentId){
        return res.status(401).end();

    }

    // const lessons = [
    //     {
    //         instructorInfo:{
    //             instructorName: "Alice J.",
    //             reviewScore: "4.8",         
    //             reviewCount: 12,            
    //             experience: "6",
    //             languages: ["English", "French", "Spanish"],
    //             cancelationDays: "-1",                           
    //             image: "/images/startPage/Ski.jpg",

    //         },
    //         teachingInfo:{
    //             typeOfLesson: "private",
    //             resort: "Parnassou",
    //             sport: "Ski",
    //             groupName: "",           // only for group lessons is not null 
    //         },
    //         participantsInfo:{
    //             level: "Beginner",
    //             participants: "4",      //  how many participants the person book for 
    //         },
    //         lessonInfo:
    //         [ {
    //             lessonID: "101",                
    //             date: "12/05/2024",             
    //             timeStart: "09:00",
    //             timeEnd: "17:00",
    //             cost: "150",                   
    //             meetingPoint: { location: "Δεύτερο σαλέ" },
    //             isAllDay: false,


    //         },
    //         {
    //             lessonID: "102",
    //             date: "14/05/2024",
    //             timeStart: "12:00",
    //             timeEnd: "14:00",
    //             cost: "150",
    //             isAllDay: true,

    //             meetingPoint: { location: "Δεύτερο σαλέ" },

                
    //         },


    //         ]
    //     },

    //     {
    //     instructorInfo:{
    //         instructorName: "Michael R.",
    //         reviewScore: "3.8",
    //         reviewCount: 1,
    //         experience: "2",
    //         languages: ["English", "French"],
    //         cancelationDays: "15",
    //         image: "/images/startPage/Ski.jpg",

    //     },
    //     teachingInfo:{
    //         typeOfLesson: "group",
    //         resort: "Kalavryton",
    //         sport: "Snowboard",
    //         groupName: "Lessons for kids",           // only for group lessons
    //     },
    //     participantsInfo:{
    //         level: "Beginner",
    //         participants: "3",      


    //     },
    //     lessonInfo:
    //     [ {
    //             lessonID: "1011",
    //             date: "13/05/2024",
    //             timeStart: "12:00",
    //             timeEnd: "14:00",
    //             cost: "250",
    //             meetingPoint: { location: "Δεύτερο σαλέ" },
    //             isAllDay: true,

            

    //         },
    //         { 
    //             lessonID: "1022",
    //             date: "14/05/2024",
    //             timeStart: "12:00",
    //             timeEnd: "14:00",
    //             cost: "260",
    //             isAllDay: false,
    //             meetingPoint: { location: "Δεύτερο σαλέ" }
            
    //         },


    //     ]
    // },
    // ]

    const lessons= await studentOptionsModel.getLessonsInCart(studentId)


    // console.dir(groupCartLessons(lessons), { depth: null });

    res.json({lessons:groupCartLessons(lessons)})

  }
  catch(error){
    next(error)
  }
   
}

function isValidPaymentInput(cardHolderName,cardNumber,expirationDate,cvv){
    let fail
  
    if (!cardNumber) {
      fail=true
    } 
    else if (cardNumber.length !== 16) {
  
      fail=true
    }
  
  
    if (!cvv) {
  
      fail=true
    } 
    else if (cvv.length !== 3) {
  
      fail=true
    } 
  
  
    if (!expirationDate) {
  
      fail=true
  
    } 
    else if (expirationDate.length !== 5 || !/^\d{2}\/\d{2}$/.test(expirationDate)) {
  
      fail=true
    }
  
    if (!cardHolderName) {
  
      fail=true
    }
  
    if(fail){
      return false
    }
    else{
      return true
    }
  
}


async function renewCartLessons(req,res,next){
    try{
      const studentId= req.session.userID

      const accountType=req.session.loggedinState 

      if(!studentId || accountType!="student"){

          return res.status(401).end();


      }

      const removedLessonsCount= await renewCartLessonsExecution(studentId)

      req.session.cartLessons=  req.session.cartLessons- removedLessonsCount

      next()
    }
    catch(error){
      next(error)
    }
}

async function renewCartLessonsExecution(studentId){
    const lessonIDSToRemove= await studentOptionsModel.getTakenLessonsInCart(studentId)
    if(lessonIDSToRemove.length!=0){
      await studentOptionsModel.removeLessonsFromCart(studentId,(lessonIDSToRemove).map(Number))

    }

    return lessonIDSToRemove.length

}
  

export {getStudentProfileParams,updateStudentInfo,addLessonToCart,removeLessonsFromCart,payLessonsInCart,getCostOfLessonsInCart,
    getPreviousStudentLessons,getUpComingStudentLessons,cancelLessons,sendEmailRequest,postReview,getLessonsInCart,updateStudentImage,renewCartLessons,renewCartLessonsExecution}