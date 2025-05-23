async function getStudentProfileParams(req,res,next){

  try{

    res.json({firstName:"alex",lastName:"mic",email:"kostas.striker@gmail.com",phone:"306951232693"})

  }
  catch(error){
    next(error)
  }


}

async function updateStudentInfo(req,res,next){
  try{
    const { firstName, lastName, email, phoneNumber} = req.body;


    console.log("!!! ",firstName,lastName,email,phoneNumber, firstName.length,lastName.length, email.length, phoneNumber.length)
  
    await new Promise(resolve => setTimeout(resolve, 5000));
  
    //success, failure
  
  
    return res.json({message:"success"})
  }
  catch(error){
    next(error)
  }
}

async function addLessonToCart(req,res,next){
  try{
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const { lessonIDs} = req.body;

    return res.status(200).end();
  }
  catch(error){
    next(error)
  }

}

async function removeLessonsFromCart(req,res,next){
  try{
     // await new Promise(resolve => setTimeout(resolve, 2000));

      // lessonIDS is an array
      const { lessonIDS} = req.body;



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
    res.json({cost:400})

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

async function getLessonsInCart(req,res,next){
  try{
      // elegxoume an ta mathimata einai akomi eleuthera, alios ta afairoume apo to kalathi

      // ta private lessons katigoriopoiountai me basi ton proponiti (kai to resort,sport)  (mpori na einai poles didaskalies)
      // ta group lessons katigoriopoiountai me basi tin didaskalia   (mono mia didaskalia)

      const lessons = [
        {
            instructorInfo:{
                instructorName: "Alice J.",
                reviewScore: "4.8",
                reviewCount: 12,
                experience: "6",
                languages: ["English", "French", "Spanish"],
                cancelationDays: "-1",
                image: "/images/startPage/Ski.jpg",

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
                date: "12/05/2024",
                timeStart: "09:00",
                timeEnd: "17:00",
                cost: "150",
                meetingPoint: { location: "Δεύτερο σαλέ" },
                isAllDay: false,
                canceled:true


            },
            {
                lessonID: "102",
                date: "14/05/2024",
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
            instructorName: "Michael R.",
            reviewScore: "3.8",
            reviewCount: 1,
            experience: "2",
            languages: ["English", "French"],
            cancelationDays: "15",
            image: "/images/startPage/Ski.jpg",

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
                date: "13/05/2024",
                timeStart: "12:00",
                timeEnd: "14:00",
                cost: "250",
                meetingPoint: { location: "Δεύτερο σαλέ" },
                isAllDay: true,

            

            },
            { 
                lessonID: "1022",
                date: "14/05/2024",
                timeStart: "12:00",
                timeEnd: "14:00",
                cost: "260",
                isAllDay: false,
                meetingPoint: { location: "Δεύτερο σαλέ" }
            
            },


        ]
    },
    ]


    res.json({lessons})

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
  

export {getStudentProfileParams,updateStudentInfo,addLessonToCart,removeLessonsFromCart,payLessonsInCart,getCostOfLessonsInCart,
    getPreviousStudentLessons,getUpComingStudentLessons,cancelLessons,sendEmailRequest,postReview,getLessonsInCart}