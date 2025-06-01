import * as studentOptionsModel from "../model/studentOptions.mjs"
import { saveImage } from "../model/instructorOptions.mjs";

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
      console.log('bb ',removedLessons)

      return res.status(200).end();
  }
  catch(error){
    next(error)
  }

}

async function payLessonsInCart(req,res,next){
  try{
    const {  cardHolderName,cardNumber,expirationDate,cvv} = req.body;

    const cardNumberNoSpace= cardNumber.replace(/\s/g, "");
    
    // await new Promise(resolve => setTimeout(resolve, 12000));

    const isValid = isValidPaymentInput( cardHolderName,cardNumberNoSpace,expirationDate,cvv)


    let message

    if(isValid){
      message="payment_succeeded"
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


      const page=Number(req.params.page)

      const lessons = [
        {
            instructorInfo:{
                instructorID:'12',
                instructorName: "Alice J.",
                reviewScore: "4.8",
                reviewCount: 12,
                experience: "1",
                languages: ["English", "French", "Spanish"],
                cancelationDays: "-1",
                image: "/images/startPage/Ski.jpg",
                email:"123123myemail@gmail.com",
                phoneNumber:"+306951232693"
  
            },
            teachingInfo:{
                typeOfLesson: "private",
                resort: "Parnassou",
                sport: "Ski",
                groupName: "",           // only for group lessons
            },
            reviewInfo:{
              stars:"",
              text:"",
            },
            participantsInfo:{
                level: "Beginner",
                participants: "4",      //  how many participants the person book for 
            },
            lessonInfo:
            [ {
                  // occupancy: "",           // only for group lessons (e.g. 4/6)
                  lessonID: "1",
                  date: "30/04/2025",
                  timeStart: "09:00",
                  timeEnd: "17:00",
                  cost: "150",
                  meetingPoint: { location: "Δεύτερο σαλέ" },
                  isAllDay: false,
                  canceled:true
  
  
              },
              {
                  lessonID: "2",
                  date: "29/04/2025",
                  timeStart: "12:00",
                  timeEnd: "14:00",
                  cost: "150",
                  isAllDay: true,
  
                  meetingPoint: { location: "Δεύτερο σαλέ" },
                  canceled:true
  
              },
  
  
            ]
        },
  
        {
          instructorInfo:{
            instructorID:'12',
            instructorName: "Andrew R.",
            reviewScore: "3.8",
            reviewCount: 1,
            experience: "2",
            languages: ["English", "French"],
            cancelationDays: "-1",
            image: "/images/startPage/Ski.jpg",
            email:"myemail!!@gmail.com",
            phoneNumber:"+306951232692"
  
          },
          reviewInfo:{
            stars:4,
            text:"awesome isntuctor",
          },
          teachingInfo:{
              typeOfLesson: "group",
              resort: "Kalavryton",
              sport: "Snowboard",
              groupName: "Lessons for kids",           // only for group lessons
          },
          participantsInfo:{
              level: "Beginner",
              participants: "3",      
  
  
          },
          lessonInfo:
          [ {
                lessonID: "3",
                date: "13/04/2025",
                timeStart: "12:00",
                timeEnd: "14:00",
                cost: "250",
                meetingPoint: { location: "Δεύτερο σαλέ" },
                isAllDay: true,
  
              
  
            },
            { 
                lessonID: "4",
                date: "14/04/2026",
                timeStart: "12:00",
                timeEnd: "14:00",
                cost: "260",
                isAllDay: false,
                meetingPoint: { location: "Δεύτερο σαλέ" }
            
            },
  
  
          ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "3",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:-1,
          text:"",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "3a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "3b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "4",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "4a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "4b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "5",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "5a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "5b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "6",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "6a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "6b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "7",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "7a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "7b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "8",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "8a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "8b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "9",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"
  
        },
        reviewInfo:{
          stars:4,
          text:"awesome isntuctor",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "9a",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "9b",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" }
          
          },
  
  
        ]
      },
      ]
  
      const lessonsPerPage = 3;
  
      const maxPages= Math.ceil(lessons.length / lessonsPerPage)
      const startIndex = (page - 1) * lessonsPerPage;
      const endIndex = startIndex + lessonsPerPage;
    
      // Return a slice of the lessons array for the given page
      const lessonsToSend= lessons.slice(startIndex, endIndex);
      const studentEmail="123kostas@gmail.com"
  
  
      res.json({previousLessons:lessonsToSend,maxPages,studentEmail})
  }
  catch(error){
    next(error)
  }
    
}

async function getUpComingStudentLessons(req,res,next){
  try{
    // ta mathimata katigoriopoiountai ana kratisi
    // ta idiotika mathimata : ana kratisi/ ana instructor/ ana resort/ana sport
    // ta group mathimata : ana kratisi/ ana didaskalia

    // esto kai ena mathima apo mia apo tis pano katigories na min exei teliosi, stelnontai ola ta mathimata tis katigorias
    // console.log("fetching")

    //cancelatioDays=-1 for no cancelation policy

    const studentEmail="kostas@gmail.com"

    const lessons = [
      {
          instructorInfo:{
              instructorID:'12',
              instructorName: "Alice J.",
              reviewScore: "4.8",
              reviewCount: 12,
              experience: "6",
              languages: ["English", "French", "Spanish"],
              cancelationDays: "-1",
              image: "/images/startPage/Ski.jpg",
              email:"myemail@gmail.com",
              phoneNumber:"+306951232693"
  
          },
          reviewInfo:{
            stars:"",
            text:"",
          },
          teachingInfo:{
              typeOfLesson: "private",
              resort: "Parnassou",
              sport: "Ski",
              groupName: "",           // only for group lessons
          },
          participantsInfo:{
              level: "Beginner",
              participants: "4",      //  how many participants the person book for 
          },
          lessonInfo:
          [ {
                // occupancy: "",           // only for group lessons (e.g. 4/6)
                lessonID: "101",
                date: "30/05/2025",
                timeStart: "09:00",
                timeEnd: "17:00",
                cost: "150",
                meetingPoint: { location: "Δεύτερο σαλέ" },
                isAllDay: false,
                canceled:true
  
  
            },
            {
                lessonID: "102",
                date: "29/05/2025",
                timeStart: "12:00",
                timeEnd: "14:00",
                cost: "150",
                isAllDay: true,
  
                meetingPoint: { location: "Δεύτερο σαλέ" },
                canceled:true

            },
  
  
          ]
      },
  
      {
        instructorInfo:{
          instructorID:'12',
          instructorName: "Michael R.",
          reviewScore: "3.8",
          reviewCount: 1,
          experience: "2",
          languages: ["English", "French"],
          cancelationDays: "15",
          image: "/images/startPage/Ski.jpg",
          email:"myemail!!@gmail.com",
          phoneNumber:"+306951232693"

        },
        reviewInfo:{
          stars:"",
          text:"",
        },
        teachingInfo:{
            typeOfLesson: "group",
            resort: "Kalavryton",
            sport: "Snowboard",
            groupName: "Lessons for kids",           // only for group lessons
        },
        participantsInfo:{
            level: "Beginner",
            participants: "3",      
  
  
        },
        lessonInfo:
        [ {
              lessonID: "1011",
              date: "13/04/2025",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "250",
              meetingPoint: { location: "Δεύτερο σαλέ" },
              isAllDay: true,
  
            
  
          },
          { 
              lessonID: "1022",
              date: "14/04/2026",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "260",
              isAllDay: false,
              meetingPoint: { location: "Δεύτερο σαλέ" },
              canceled:true
          
          },

          { 
            lessonID: "1023",
            date: "14/04/2026",
            timeStart: "12:00",
            timeEnd: "14:00",
            cost: "260",
            isAllDay: false,
            meetingPoint: { location: "Δεύτερο σαλέ" },
            canceled:false
        
        },

        { 
          lessonID: "1024",
          date: "14/04/2026",
          timeStart: "12:00",
          timeEnd: "14:00",
          cost: "260",
          isAllDay: false,
          meetingPoint: { location: "Δεύτερο σαλέ" },
          canceled:false
      
      },

      { 
        lessonID: "1025",
        date: "14/04/2026",
        timeStart: "12:00",
        timeEnd: "14:00",
        cost: "260",
        isAllDay: false,
        meetingPoint: { location: "Δεύτερο σαλέ" },
        canceled:true
    
    },
  
  
        ]
    },
    ]
  
  
    res.json({upComingLessons:lessons,studentEmail:studentEmail})
  }
  catch(error){
    next(error)
  }
  
}

async function cancelLessons(req,res,next){

  try{
    const {lessons} = req.body

    //cancel_success, cancel_failure

    // console.log("!#!# ",lessons)


    res.json({message:"cancel_success"})
  }
  catch(error){
    next(error)
  }

}

async function sendEmailRequest(req,res,next){
  try{
    const {studentEmail,instructorEmail,userMessage} = req.body

    //email_success, email_failure
  
  
    res.json({message:"email_success"})
  }
  catch(error){
    next(error)
  }
   
}

async function postReview(req,res,next){
  try{
    const {stars,review,lessonIDS,instructorID} = req.body

    //review_success, review_failure
  
    // console.log("!@12 ",stars,review,lessonIDS,instructorID)
  
  
    res.json({message:"review_success"})
  }
  catch(error){
    next(error)
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


function groupLessons(lessons) {
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
      cost: String(  Math.round(lesson.costPerHour * calculateHoursBetween(lesson.timeStart, lesson.timeEnd) ) ),
      meetingPoint: {location:finalLocation,picture:imageBase64_b },
      costPerHour: lesson.costPerHour,
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

    // console.dir(groupLessons(lessons), { depth: null });

    res.json({lessons:groupLessons(lessons)})

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

      await renewCartLessonsExecution(studentId)

     
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
    console.log('ids to remove ',lessonIDSToRemove)

  }


  // piasimo private lesson
  // piasimo theseon se group lesson (gia 4 atoma na mi fainetai)
  // automati afairesi mathimaton apo to kalathi (allagi imerominiasa, piasimo)
  // programma
  // statistika
  

export {getStudentProfileParams,updateStudentInfo,addLessonToCart,removeLessonsFromCart,payLessonsInCart,getCostOfLessonsInCart,
    getPreviousStudentLessons,getUpComingStudentLessons,cancelLessons,sendEmailRequest,postReview,getLessonsInCart,updateStudentImage,renewCartLessons,renewCartLessonsExecution}