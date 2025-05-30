import * as publicOptionsModel from "../model/publicOptions.mjs"
import bcrypt from 'bcrypt'

async function getHeaderParams(req,res,next){
  try{
      // an einai sindedemenos apothikeuetai sto session, alios einai 0
      const lessonsInCart=2

      const userID= req.session.userID
      let imageBase64 = null;
  
  
      if(userID){
          const {profilepicture  } = await (publicOptionsModel.getProfileImage(userID))
  
          if (profilepicture) {
            const mimeType = "image"; 
            imageBase64 = `data:${mimeType};base64,${profilepicture.toString("base64")}`;
        }
    
      }
  
      if(req.session?.loggedinState){
          return res.json({ status: req.session.loggedinState, lessonsInCart, profileImage: imageBase64 });
  
      }
      else{
          return res.json({ status: null, lessonsInCart:0,profileImage: null });
      }
  }
  catch(error){
    next(error)
  }
   
}

async function loginUser(req,res,next){

    
    try{

        const { email, password } = req.body; 

        if(email=="" || password==""){
            return res.json({ userExists: false  });
        }

        else{
          const {userExists,hashedPassword,accountType,userID}= await publicOptionsModel.authenticate(email)

          if(!userExists){
              return res.json({ userExists: false  });
          }
          else{
              const check= await bcrypt.compare(password,hashedPassword)
              if(check){
                  req.session.userID= userID

                  if(accountType=="student"){
                      req.session.loggedinState = "student";
                      return res.json({ userExists: true,accountType:"student" });
                  }
                  else if(accountType=="instructor"){
                    req.session.loggedinState = "instructor";
                    return res.json({ userExists: true, accountType:"instructor" });
                  }
              }
              else{
                  return res.json({ userExists: false  });
              }

          }


        }

        // if (email === "123" && password === "123") {
        // // instructor student
        //     req.session.loggedinState = "student";
        //     res.json({ userExists: true,accountType:"student" });
        // }
        // else if(email === "12" && password === "12"){
        //     req.session.loggedinState = "instructor";
        //     res.json({ userExists: true, accountType:"instructor" });
        // } else {
        //     res.json({ userExists: false  });
        // }

    }
    catch(error){
        next(error)
    }
}

function logoutUser(req,res,next){
    if (req.session) {
        req.session.destroy((err) => {
          if (err) {
              console.error("Error destroying session:", err);
              next(err)
              // return res.status(500).end();
          }
          res.status(200).end();
        });
    } 

}

async function signupUser(req,res,next){

  try{

    const { firstName,lastName,email,passwordHash,countryPhoneCode,phoneNumber,accountType} = req.body; 

    //remove '+' from phone. validateSignUpInputs checks phoneNumber not phone

    const phone= (countryPhoneCode+phoneNumber).replace("+","")

    const isValid= await validateSignUpInputs(firstName,lastName,email,passwordHash,countryPhoneCode,phoneNumber,accountType)
      
    if(isValid){

      const userID=await publicOptionsModel.insertUser(firstName,lastName,passwordHash,email,phone,accountType)

      req.session.userID= userID

  
      if(accountType=="instructor"){
        req.session.loggedinState = "instructor";
  
      }
      else if(accountType=="student"){
        req.session.loggedinState = "student";
  
      }
      return res.json({ signUpSuccess: true  });
  
    }
    else{
      
      return res.json({ signUpSuccess: false  });
  
    }

  }
  catch(error){

    next(error)
  }
}

async function validateSignUpInputs(firstName,lastName,email,passwordHash,countryPhoneCode,phoneNumber,accountType){

    if(accountType!="student" && accountType!="instructor"){
      return false
    }
  
  
    if(!countryPhoneCode){
      return false
    }
    if(!firstName){
      return false
    }
  
  
    if(!lastName){
      return false
    }
  
  
    if(!email){
      return false
    }
    else if(!validateEmailExpression(email)){
      return false
    }
    else if((await checkEmailIsUsed(email))){
      return false
  
    }
  
  
    if(!passwordHash){
      return false
    }

  
    if(!phoneNumber){
      return false
    }      
    else if(phoneNumber.length!=10 || (/\p{L}/u.test(phoneNumber))){
      return false
    }
    
    return true
  
}


const validateEmailExpression = (email) => {
    // regex expression https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};
  
async function checkEmailIsUsed(userEmail){
    const alreadyUsed=await publicOptionsModel.checkEmailAlreadyUsed(userEmail)

  
    if(alreadyUsed){
      return true
    }
    else{
      return false
    }
}

async function checkEmailIsUsedPoint(req,res,next){

  try{
    // antistoixi sto /api/checkEmailIsUsed

    const { userEmail } = req.body; 
    let result= await checkEmailIsUsed(userEmail)

    res.json({ emailAlreadyUsed: result  });
  }
  catch(error){
    next(error)
  }
    
}



async function showLessons(req,res,next){
  try{
      const resort = req.query.resort;
      const sport = req.query.sport;
      const from = req.query.from;
      const to = req.query.to;
      const members = req.query.members;   
      const time = req.query.time;   

      const typeOfLesson=req.query.typeOfLesson
    
      const instructorId= req.query.instructorId
    
      // it exists only for group lessons
      const instructionID=req.query.instructionID!=""? Number(req.query.instructionID) :null
    
    
      // An einai sto kalathi tou xristi na mi fainetai
      // meeting points

      let lessons=await publicOptionsModel.showLessons(resort,sport,formatDB(from),formatDB(to),Number(members),Number(instructorId),instructionID,typeOfLesson,time)

      lessons.forEach(dayLessons => {
        dayLessons.forEach(lesson => {
 
          lesson.date = reformatDateUI(lesson.date)
        })
      })

      const teachingIDs = [];

    lessons.forEach(dayLessons => {
      dayLessons.forEach(lesson => {
        teachingIDs.push(lesson.teachingID);
      });
    });

    const uniqueTeachingIDs = [...new Set(teachingIDs)];


    // const lessons = [
      //     // 12/05/2024
      //     [{teachingID:"15", lessonID: "101", date: "12/05/2024", isAllDay: false, cost: "150", timeStart: "09:00", timeEnd: "17:00",full:true },
      //     { teachingID:"15",lessonID: "102", date: "12/05/2024", isAllDay: false, cost: "140", timeStart: "08:00", timeEnd: "16:00",full:false },
      //     { teachingID:"15",lessonID: "103", date: "12/05/2024", isAllDay: false, cost: "100", timeStart: "09:00", timeEnd: "10:30",full:false },
      //     { teachingID:"15",lessonID: "104", date: "12/05/2024", isAllDay: false, cost: "110", timeStart: "11:00", timeEnd: "12:30",full:false },
      //     { teachingID:"15",lessonID: "105", date: "12/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:false }],
        
      //     // 13/05/2024
      //     [{ teachingID:"15",lessonID: "1060", date: "13/05/2024", isAllDay: true, cost: "155", timeStart: "09:00", timeEnd: "17:00",full:false },
      //     { teachingID:"15",lessonID: "1061", date: "13/05/2024", isAllDay: false, cost: "155", timeStart: "09:00", timeEnd: "12:00",full:false },
      //     { teachingID:"15",lessonID: "1062", date: "13/05/2024", isAllDay: false, cost: "155", timeStart: "12:00", timeEnd: "17:00",full:false }],
        
      //     // 14/05/2024
      //     [{ teachingID:"15",lessonID: "111", date: "14/05/2024", isAllDay: false, cost: "160", timeStart: "08:00", timeEnd: "16:00",full:false },
      //     { teachingID:"15",lessonID: "112", date: "14/05/2024", isAllDay: false, cost: "150", timeStart: "09:30", timeEnd: "17:30",full:false },
      //     { teachingID:"15",lessonID: "113", date: "14/05/2024", isAllDay: false, cost: "100", timeStart: "08:30", timeEnd: "10:00",full:false },
      //     { teachingID:"15",lessonID: "114", date: "14/05/2024", isAllDay: false, cost: "110", timeStart: "10:30", timeEnd: "12:00",full:false },
      //     { teachingID:"15",lessonID: "115", date: "14/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:false }],
        
      //     // 15/05/2024
      //     [{ teachingID:"15",lessonID: "116", date: "15/05/2024", isAllDay: false, cost: "155", timeStart: "09:00", timeEnd: "17:00",full:false },
      //     { teachingID:"15",lessonID: "117", date: "15/05/2024", isAllDay: false, cost: "145", timeStart: "08:00", timeEnd: "16:00",full:false },
      //     { teachingID:"15",lessonID: "118", date: "15/05/2024", isAllDay: false, cost: "105", timeStart: "09:30", timeEnd: "11:00",full:true },
      //     { teachingID:"15",lessonID: "119", date: "15/05/2024", isAllDay: false, cost: "115", timeStart: "11:30", timeEnd: "13:00",full:false },
      //     { teachingID:"15",lessonID: "120", date: "15/05/2024", isAllDay: false, cost: "125", timeStart: "14:00", timeEnd: "15:30",full:true }],
        
      //     // 16/05/2024
      //     [{ teachingID:"15",lessonID: "121", date: "16/05/2024", isAllDay: false, cost: "150", timeStart: "08:00", timeEnd: "16:00",full:false },
      //     { teachingID:"15",lessonID: "122", date: "16/05/2024", isAllDay: false, cost: "160", timeStart: "09:00", timeEnd: "17:00",full:true },
      //     { teachingID:"15",lessonID: "123", date: "16/05/2024", isAllDay: false, cost: "95", timeStart: "10:00", timeEnd: "11:30",full:true },
      //     { teachingID:"15",lessonID: "124", date: "16/05/2024", isAllDay: false, cost: "105", timeStart: "12:00", timeEnd: "13:30",full:true },
      //     { teachingID:"15",lessonID: "125", date: "16/05/2024", isAllDay: false, cost: "115", timeStart: "14:00", timeEnd: "15:30",full:false }],
        
      //     // 17/05/2024
      //     [{ teachingID:"15",lessonID: "126", date: "17/05/2024", isAllDay: true, cost: "140", timeStart: "09:00", timeEnd: "17:00",full:false }],
        
        
      //     // 18/05/2024
      //     [{ teachingID:"15",lessonID: "131", date: "18/05/2024", isAllDay: false, cost: "150", timeStart: "08:00", timeEnd: "16:00",full:false },
      //     { teachingID:"15",lessonID: "132", date: "18/05/2024", isAllDay: false, cost: "160", timeStart: "09:00", timeEnd: "17:00",full:false },
      //     { teachingID:"15",lessonID: "133", date: "18/05/2024", isAllDay: false, cost: "95", timeStart: "10:00", timeEnd: "11:30",full:false },
      //     { teachingID:"15",lessonID: "134", date: "18/05/2024", isAllDay: false, cost: "105", timeStart: "12:00", timeEnd: "13:30",full:false },
      //     { teachingID:"15",lessonID: "135", date: "18/05/2024", isAllDay: false, cost: "115", timeStart: "14:00", timeEnd: "15:30",full:false }],
        
      //     // 19/05/2024
      //     [{ teachingID:"25",lessonID: "136", date: "19/05/2024", isAllDay: false, cost: "140", timeStart: "09:00", timeEnd: "17:00",full:true },
      //     { teachingID:"25",lessonID: "137", date: "19/05/2024", isAllDay: false, cost: "150", timeStart: "08:30", timeEnd: "16:30",full:false },
      //     { teachingID:"25",lessonID: "138", date: "19/05/2024", isAllDay: false, cost: "100", timeStart: "09:00", timeEnd: "10:30",full:true },
      //     { teachingID:"25",lessonID: "139", date: "19/05/2024", isAllDay: false, cost: "110", timeStart: "11:00", timeEnd: "12:30",full:true },
      //     { teachingID:"25",lessonID: "140", date: "19/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:true }],
      //   ];

    const meetingPointsTemp= await publicOptionsModel.getLessonsMeetingPoints(uniqueTeachingIDs)

    // const meetingPoints={"25":{location:"Πρώτο σαλέ"},"15":{location:"Δεύτερο σαλέ"} }

    let meetingPoints= {}


    
    meetingPointsTemp.forEach(meetingPoint=>{
      //  meetingPointID== null => after_agreement
      //  meetingPointID != null && location, picture ==null => after_agreement
      const meetingPointId= meetingPoint.meetingpointid
      const locationText= meetingPoint.location
      const picture= meetingPoint.picture
      const teachingID=meetingPoint.teachingid

      const value= {
        location: isNullOrEmpty(meetingPointId) || ( isNullOrEmpty(locationText) && isNullOrEmpty(picture))? "after_agreement" :locationText,
        picture:null
      }


      let imageBase64 = null;

      if (picture) {
        const mimeType = "image"; 
        imageBase64 = `data:${mimeType};base64,${picture.toString("base64")}`;
      }
      value.picture= imageBase64
      meetingPoints[teachingID]= value

    })

  
    
    
      res.json({lessons,meetingPoints})
  }
  catch(error){
    next(error)
  }

}

function isNullOrEmpty(value) {
  return value === null || value === "";
}

function reformatDateUI(input) {
  // input YYYY/MM/DD
  // output DD/MM/YYYY

  const [year, month, day] = input.split('/');
  return `${day}/${month}/${year}`;
}

function formatDB(dateStr) {
  // input 30-05-2025
  // output 2025/05/30
  const [day, month, year] = dateStr.split("-");
  return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
}

async function bookLesson(req,res,next){
    try{

        // if lesson is group  we send instructor and lesson information (instructionID id)    Ta group mathimata aforoun mia didaskalia   
        // if lesson is private we just send the instructor information                        Ta private mathimata aforoun  poles didaskalies (enan proponiti)
        // prepei se kathe periptosi members <= free spots
        
      

        const resort = req.query.resort;    
        const sport = req.query.sport;
        const lessonType = req.query.lessonType;
        const time = req.query.time;

        const from = req.query.from;
        const to = req.query.to;
        const members = req.query.members;   
 

        const orderBy = req.query.orderBy;
        let instructorName = req.query.instructorName.split(" ")[0]

        if(instructorName==='null'){
          instructorName=''
        }
            
      
        const pageNumber= req.query.pageNumber
      
        // console.log( resort, sport, from, to, members,lessonType,time,orderBy,instructorName,pageNumber);
      

        // const instructorLessons = [
        //   {
        //     instructorName: "Alice J.",
        //     reviewScore: "4.8",
        //     reviewCount: 1,
        //     experience: "1",
        //     languages: ["English", "French","Spanish"],
        //     typeOfLesson: "private",
        //     description: "Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1001",
        //     minPricePerDay: "150",
        //     minPricePerHour: "35"
        //   },
        //   {
        //     instructorName: "Carlos R.",
        //     reviewScore: "4.6",
        //     reviewCount: 2,
        //     experience: "8",
        //     languages: ["Spanish"],
        //     typeOfLesson: "group",
        //     instructionID:"1212",
        //     groupName:"Lesson for kids",
        //     description: "Energetic and great with beginners. Energetic and great with beginners. Energetic and great with beginners. Energetic and great with beginners.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1002",
        //     minPricePerDay: "130",
        //     minPricePerHour: "30"
        //   },
        //   {
        //     instructorName: "Lena M.",
        //     reviewScore: "5.0",
        //     reviewCount: 3,
        //     experience: "15",
        //     languages: ["German", "English"],
        //     typeOfLesson: "private",
        //     description: "Top-rated instructor with a personal approach. Top-rated instructor with a personal approach. Top-rated instructor with a personal approach. Top-rated instructor with a personal approach.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1003",
        //     minPricePerDay: "180",
        //     minPricePerHour: "40"
        //   },
        //   {
        //     instructorName: "Marco R.",
        //     reviewScore: "4.7",
        //     reviewCount: 4,
        //     experience: "10",
        //     languages: ["Italian", "English"],
        //     typeOfLesson: "private",
        //     description: "Great with kids and family groups. Great with kids and family groups. Great with kids and family groups. Great with kids and family groups. Great with kids and family groups.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1004",
        //     minPricePerDay: "140",
        //     minPricePerHour: "32"
        //   },
        //   {
        //     instructorName: "Akira T.",
        //     reviewScore: "4.9",
        //     reviewCount: 5,
        //     experience: "13",
        //     languages: ["French", "English"],
        //     instructionID:"1213",
        //     typeOfLesson: "group",
        //     groupName:"Lesson for adults",
        //     description: "Expert instructor for advanced levels. Expert instructor for advanced levels. Expert instructor for advanced levels. Expert instructor for advanced levels.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1005",
        //     minPricePerDay: "200",
        //     minPricePerHour: "45"
        //   },
        //   {
        //     instructorName: "Sophia L.",
        //     reviewScore: "4.5",
        //     reviewCount: 6,
        //     experience: "7",
        //     languages: ["Italian", "English"],
        //     instructionID:"12121221",
        //     typeOfLesson: "group",
        //     groupName:"Lesson for kids",
        //     description: "Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1006",
        //     minPricePerDay: "120",
        //     minPricePerHour: "28"
        //   },
        //   {
        //     instructorName: "Thomas D.",
        //     reviewScore: "4.4",
        //     reviewCount: 7,
        //     experience: "5",
        //     languages: ["French", "English"],
        //     typeOfLesson: "private",
        //     description: "Loves nature and cross-country adventures. Loves nature and cross-country adventures. Loves nature and cross-country adventures. Loves nature and cross-country adventures.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1007",
        //     minPricePerDay: "110",
        //     minPricePerHour: "25"
        //   },
        //   {
        //     instructorName: "Emma S.",
        //     reviewScore: "4.6",
        //     reviewCount: 8,
        //     experience: "9",
        //     languages: ["English"],
        //     instructionID:"111212",
        //     typeOfLesson: "group",
        //     groupName:"Lesson for kids",
        //     description: "Passionate about helping others improve quickly. Passionate about helping others improve quickly. Passionate about helping others improve quickly. Passionate about helping others improve quickly.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1008",
        //     minPricePerDay: "145",
        //     minPricePerHour: "34"
        //   },
        //   {
        //     instructorName: "Luis M.",
        //     reviewScore: "4.3", 
        //     reviewCount: 9,
        //     experience: "6",
        //     languages: ["Spanish"],
        //     typeOfLesson: "private",
        //     description: "Fun and motivating group leader.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1009",
        //     minPricePerDay: "125",
        //     minPricePerHour: "29"
        //   },
        //   {
        //     instructorName: "Zara A.",
        //     reviewScore: "4.9",
        //     reviewCount: 10,
        //     experience: "11",
        //     languages: ["English", "Italian"],
        //     instructionID:"12121212",
        //     typeOfLesson: "group",
        //     groupName:"Lesson for kids",
        //     description: "Technical and safety-focused expert.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1010",
        //     minPricePerDay: "190",
        //     minPricePerHour: "42"
        //   },
        //   {
        //     instructorName: "Zara A.",
        //     reviewScore: "4.9",
        //     reviewCount: 10,
        //     experience: "11",
        //     languages: ["English", "Italian"],
        //     instructionID:"12121212",
        //     typeOfLesson: "group",
        //     groupName:"Lesson for kids",
        //     description: "Technical and safety-focused expert.",
        //     image: "/images/startPage/Ski.jpg",
        //     instructorId: "inst_1010",
        //     minPricePerDay: "190",
        //     minPricePerHour: "42"
        //   },
        // ];

        
        // an den iparxoun mathimata to instructorLessons einai kenos pinakas  kai maxPages=0

        const instructorLessons=await publicOptionsModel.bookLesson(resort, sport, formatDB(from), formatDB(to), members,lessonType,time,orderBy,instructorName,pageNumber)

 
        instructorLessons.forEach(lesson=>{
          const picture=lesson.image
          let imageBase64 = null;
      
          if (picture) {
            const mimeType = "image"; 
            imageBase64 = `data:${mimeType};base64,${picture.toString("base64")}`;
          }
          lesson.image=imageBase64
        })
        const lessonsPerPage=4

        const maxPages= instructorLessons.length!=0?Math.ceil ( Number(instructorLessons[0].entries) /lessonsPerPage) : 0
        // console.log("aaa ",instructorLessons)

        res.json({
          instructorLessons,
    
          maxPages
        });
      
      
      
          
        // const startIndex = (pageNumber - 1) * lessonsPerPage;
        // const endIndex = startIndex + lessonsPerPage;

      
        // if(lessonType=="private"){
        //   const privateInstructors = instructorLessons.filter(
        //     (instructor) => instructor.typeOfLesson === "private"
        //   );
        //   res.json({
        //     instructorLessons: privateInstructors.slice(startIndex, endIndex),
      
        //     maxPages:4
        //   });
        // }
      
      
        // else{
        //     res.json({
        //     instructorLessons: instructorLessons.slice(startIndex, endIndex),
        //     maxPages:4
        //   });
        // }


    }
    catch(error){
      next(error)
    }

  
}


async function getReviews(req,res,next){
  try{

    const reviewsPerPage = 4;

    const page = req.params.page;

    // orio 90 selides


    const reviews = [
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 1,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 2,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 2,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 3,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 5,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 4,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 5,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 2,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 6,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 7,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 5,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 8,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 9,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 2,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 10,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 3,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Parnassou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 11,
        instructorName: "Γιάννης Μ."
        },
        {
        stars: 5,
        name: "Μαρία Α.",
        date: "24/12/2024",
        sport: "Ski",
        resort: "Mainalou",
        review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
        image: "img",
        lessonHours: 12,
        instructorName: "Γιάννης Μ."
        }
    ];

    // await new Promise(resolve => setTimeout(resolve, 2000));

    if (page === 'instructorInfo') {

        const {instructorID,reviewsPage}= req.body
        const maxPages=90

        const startIndex = (reviewsPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
    
        res.json({
        reviews: reviews.slice(startIndex, endIndex),
        maxPages  
        });

    }

    else if(page=='bookLesson'){
        // epistefei to poli 3 selides

        const { resort,sport,from,to,members,reviewsPage } = req.body; 

        // await new Promise(resolve => setTimeout(resolve, 4000));


        const maxPages=3
        
        const startIndex = (reviewsPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
    
        res.json({
        reviews: reviews.slice(startIndex, endIndex),
        maxPages  
        });
    }

    else if(page=='index'){
        // epistefei to poli 3 selides

        const {reviewsPage } = req.body; 

        const maxPages=3
        
        const startIndex = (reviewsPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;

    
        res.json({
            reviews: reviews.slice(startIndex, endIndex),

            maxPages  
        });
      }


  }
  catch(error){
      next(error)
  }

}

async function getInstructorInfo(req,res,next){

  try{
    const instructorId = req.params.instructorId;

    const userID= req.session.userID

     //if user is not logged in userEmail=""

    const message = await publicOptionsModel.getInstructorInfo(Number(instructorId))

    const profilePicture=message.profilePicture
    let imageBase64 = null;

    if (profilePicture) {
      const mimeType = "image"; 
      imageBase64 = `data:${mimeType};base64,${profilePicture.toString("base64")}`;
  }

  const starScore=message.starscore
  const total_reviews=message.total_reviews
  const cancelationPolicy= message.cancelationpolicy

  if(total_reviews!=null && total_reviews!=0){
    message.reviewStars= String(starScore/total_reviews)
    message.reviewCount=total_reviews
  }
  else{
    message.reviewStars= null
    message.reviewCount=null
  }



  if(cancelationPolicy=='dnot'){
    message.cancelationDays=-1
  }
  else{
    message.cancelationDays=Number(cancelationPolicy.slice(1))

  }

  let userEmail
  if(userID){
    userEmail= await publicOptionsModel.getUserEmail(userID)
  }
  else{
    userEmail=""
  }

  message.profilePicture=imageBase64
  message.userEmail=userEmail

  


    // const message={
    //     instructorName:"Alice J.",
    //     yearsOfExperience:"40+",
    //     reviewStars:"4.8",
    //     reviewCount:1,
    //     skiResorts:["Kalavryton","Parnassou"],
    //     sports:["Ski","Snowboard","Sit ski"],
    //     languages:["English","French","Spanish"],
    //     cancelationDays:-1,
    //     biography: "nserts a certain number of random Lorem Ipsum paragraphs into the current document. The count option indicates how many paragraphs to insert. For example, lorem_p3 will insert three paragraphs into the document. If the count option is not provided, one paragraph will be inserted. If the type of Lorem Ipsum text is not specified, the extension will generate paragraphs by default",
    //     userEmail:"myemail@gmail.com",
    //     instructorEmail:"instructoremail@gmail.com",
    //     profilePicture:imageBase64

    // }


    res.json({message})

  }
  catch(error){
    next(error)
  }

}
  

// checkEmailIsUsedPoint, loginUser, signupUser
  

export {getHeaderParams,loginUser,logoutUser,signupUser, checkEmailIsUsedPoint,showLessons,bookLesson,getReviews,getInstructorInfo}