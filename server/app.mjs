import express from "express"
import path from 'path'
import { fileURLToPath } from "url"
import { dirname } from "path"
import session from "express-session"
import 'dotenv/config'
import { type } from "os"



const __filename=fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

const PORT= process.env.PORT || 3000

const distPath= path.join (__dirname,'../client/dist')

const publicPath= path.join (__dirname,'./public')




const app=express()

// app.use(express.static(publicPath))


app.use(express.static(distPath))     // ta public files topothetountai kata to build sto distpath kai serbirontai apo eki.




app.use(express.json())

app.use(session({
    name:'cookieSid',
    secret: process.env.SESSION_SECRET || "PynOjAuHetAuWawtinAytVunar", // κλειδί για κρυπτογράφηση του cookie
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:20*60*1000,      // 20 min
        sameSite:true,
        secure:false,
    }
}))



app.get('/api/getHeaderParams', (req, res) => {

  // an einai sindedemenos apothikeuetai sto session, alios einai 0
  const lessonsInCart=2

  if(req.session?.loggedinState){
    return res.json({ status: req.session.loggedinState, lessonsInCart});

  }
  else{
    return res.json({ status: null, lessonsInCart});
  }
})

function authoriseStudent(req,res,next){

  if (req.session.loggedinState!=="student") {
    return res.status(401).end();
  } else {

      next();
    }
}


function authoriseInstructor(req,res,next){
  console.log(req.session.userID)
  if (req.session.loggedinState!=="instructor") {
    return res.status(401).end();
  } else {
      next();
    }
}


app.post("/api/loginUser", (req, res) => {

    const { email, password } = req.body; // Access request body

    if (email === "123" && password === "123") {
      // instructor student
      req.session.loggedinState = "student";
      res.json({ userExists: true });
    } else {
      res.json({ userExists: false  });
    }
});


app.post("/api/logoutUser", (req,res)=>{
  if (req.session) {
      req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).end();
        }
        res.status(200).end();
      });
  } 
})

app.post('/api/checkEmailIsUsed',async (req,res)=>{
      const { userEmail } = req.body; 
      let result= await checkEmailIsUsed(userEmail)

      res.json({ emailAlreadyUsed: result  });

})


app.post("/api/addLessonToCart",authoriseStudent,async (req,res)=>{

    // await new Promise(resolve => setTimeout(resolve, 2000));

    const { lessonIDs} = req.body;

    return res.status(200).end();

})

app.post("/api/removeLessonsFromCart",authoriseStudent,async (req,res)=>{

  // await new Promise(resolve => setTimeout(resolve, 2000));

  // lessonIDS is an array
  const { lessonIDS} = req.body;



  return res.status(200).end();

})

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

app.post("/api/payLessonsInCart",authoriseStudent, async (req,res)=>{
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

})

app.get("/api/getCostOfLessonsInCart",authoriseStudent, async(req,res)=>{
  
  res.json({cost:400})
})

app.get('/api/getLessonsInCart',authoriseStudent,async (req,res)=>{

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
            cancelationDays: "5",
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


          },
          {
              lessonID: "102",
              date: "14/05/2024",
              timeStart: "12:00",
              timeEnd: "14:00",
              cost: "150",
              isAllDay: true,

              meetingPoint: { location: "Δεύτερο σαλέ" }
            
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
})

app.get("/api/showLessons",async(req,res)=>{
  const resort = req.query.resort;
  const sport = req.query.sport;
  const from = req.query.from;
  const to = req.query.to;
  const members = req.query.members;   

  const typeOfLesson=req.query.typeOfLesson

  const instructorId= req.query.instructorId

  // it exists only for group lessons
  const instructionID=req.query.instructionID


  // An einai sto kalathi tou xristi na mi fainetai

  // prepei members <= free spots

  // console.log("##### ",resort,sport,from,to,members,instructorId,instructionID,typeOfLesson)

  // epistrefi mono tis meres pou iparxi kapoio eleuthero. gia autes tis meres epistrefi kai ta piasmena

  // id mathimatos, imerominia, diarki oli mera, kostos, ora enarksis , ora liksis, full
  // await new Promise(resolve => setTimeout(resolve, 2000));


    const lessons = [
      // 12/05/2024
      [{teachingID:"15", lessonID: "101", date: "12/05/2024", isAllDay: false, cost: "150", timeStart: "09:00", timeEnd: "17:00",full:true },
      { teachingID:"15",lessonID: "102", date: "12/05/2024", isAllDay: false, cost: "140", timeStart: "08:00", timeEnd: "16:00",full:false },
      { teachingID:"15",lessonID: "103", date: "12/05/2024", isAllDay: false, cost: "100", timeStart: "09:00", timeEnd: "10:30",full:false },
      { teachingID:"15",lessonID: "104", date: "12/05/2024", isAllDay: false, cost: "110", timeStart: "11:00", timeEnd: "12:30",full:false },
      { teachingID:"15",lessonID: "105", date: "12/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:false }],
    
      // 13/05/2024
      [{ teachingID:"15",lessonID: "1060", date: "13/05/2024", isAllDay: true, cost: "155", timeStart: "09:00", timeEnd: "17:00",full:false },
      { teachingID:"15",lessonID: "1061", date: "13/05/2024", isAllDay: false, cost: "155", timeStart: "09:00", timeEnd: "12:00",full:false },
      { teachingID:"15",lessonID: "1062", date: "13/05/2024", isAllDay: false, cost: "155", timeStart: "12:00", timeEnd: "17:00",full:false }],
    
      // 14/05/2024
      [{ teachingID:"15",lessonID: "111", date: "14/05/2024", isAllDay: false, cost: "160", timeStart: "08:00", timeEnd: "16:00",full:false },
      { teachingID:"15",lessonID: "112", date: "14/05/2024", isAllDay: false, cost: "150", timeStart: "09:30", timeEnd: "17:30",full:false },
      { teachingID:"15",lessonID: "113", date: "14/05/2024", isAllDay: false, cost: "100", timeStart: "08:30", timeEnd: "10:00",full:false },
      { teachingID:"15",lessonID: "114", date: "14/05/2024", isAllDay: false, cost: "110", timeStart: "10:30", timeEnd: "12:00",full:false },
      { teachingID:"15",lessonID: "115", date: "14/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:false }],
    
      // 15/05/2024
      [{ teachingID:"15",lessonID: "116", date: "15/05/2024", isAllDay: false, cost: "155", timeStart: "09:00", timeEnd: "17:00",full:false },
      { teachingID:"15",lessonID: "117", date: "15/05/2024", isAllDay: false, cost: "145", timeStart: "08:00", timeEnd: "16:00",full:false },
      { teachingID:"15",lessonID: "118", date: "15/05/2024", isAllDay: false, cost: "105", timeStart: "09:30", timeEnd: "11:00",full:true },
      { teachingID:"15",lessonID: "119", date: "15/05/2024", isAllDay: false, cost: "115", timeStart: "11:30", timeEnd: "13:00",full:false },
      { teachingID:"15",lessonID: "120", date: "15/05/2024", isAllDay: false, cost: "125", timeStart: "14:00", timeEnd: "15:30",full:true }],
    
      // 16/05/2024
      [{ teachingID:"15",lessonID: "121", date: "16/05/2024", isAllDay: false, cost: "150", timeStart: "08:00", timeEnd: "16:00",full:false },
      { teachingID:"15",lessonID: "122", date: "16/05/2024", isAllDay: false, cost: "160", timeStart: "09:00", timeEnd: "17:00",full:true },
      { teachingID:"15",lessonID: "123", date: "16/05/2024", isAllDay: false, cost: "95", timeStart: "10:00", timeEnd: "11:30",full:true },
      { teachingID:"15",lessonID: "124", date: "16/05/2024", isAllDay: false, cost: "105", timeStart: "12:00", timeEnd: "13:30",full:true },
      { teachingID:"15",lessonID: "125", date: "16/05/2024", isAllDay: false, cost: "115", timeStart: "14:00", timeEnd: "15:30",full:false }],
    
      // 17/05/2024
      [{ teachingID:"15",lessonID: "126", date: "17/05/2024", isAllDay: true, cost: "140", timeStart: "09:00", timeEnd: "17:00",full:false }],
     
    
      // 18/05/2024
      [{ teachingID:"15",lessonID: "131", date: "18/05/2024", isAllDay: false, cost: "150", timeStart: "08:00", timeEnd: "16:00",full:false },
      { teachingID:"15",lessonID: "132", date: "18/05/2024", isAllDay: false, cost: "160", timeStart: "09:00", timeEnd: "17:00",full:false },
      { teachingID:"15",lessonID: "133", date: "18/05/2024", isAllDay: false, cost: "95", timeStart: "10:00", timeEnd: "11:30",full:false },
      { teachingID:"15",lessonID: "134", date: "18/05/2024", isAllDay: false, cost: "105", timeStart: "12:00", timeEnd: "13:30",full:false },
      { teachingID:"15",lessonID: "135", date: "18/05/2024", isAllDay: false, cost: "115", timeStart: "14:00", timeEnd: "15:30",full:false }],
    
      // 19/05/2024
      [{ teachingID:"25",lessonID: "136", date: "19/05/2024", isAllDay: false, cost: "140", timeStart: "09:00", timeEnd: "17:00",full:true },
      { teachingID:"25",lessonID: "137", date: "19/05/2024", isAllDay: false, cost: "150", timeStart: "08:30", timeEnd: "16:30",full:false },
      { teachingID:"25",lessonID: "138", date: "19/05/2024", isAllDay: false, cost: "100", timeStart: "09:00", timeEnd: "10:30",full:true },
      { teachingID:"25",lessonID: "139", date: "19/05/2024", isAllDay: false, cost: "110", timeStart: "11:00", timeEnd: "12:30",full:true },
      { teachingID:"25",lessonID: "140", date: "19/05/2024", isAllDay: false, cost: "120", timeStart: "13:00", timeEnd: "14:30",full:true }],
    ];

    const meetingPoints={"25":{location:"Πρώτο σαλέ"},"15":{location:"Δεύτερο σαλέ"} }
    

  res.json({lessons,meetingPoints})

})

app.get('/api/bookLesson', async (req, res) => {

  const resort = req.query.resort;
  const sport = req.query.sport;
  const from = req.query.from;
  const to = req.query.to;
  const members = req.query.members;   
  const lessonType = req.query.lessonType;
  const time = req.query.time;
  const orderBy = req.query.orderBy;
  const instructorName = req.query.instructorName;

  const pageNumber= req.query.pageNumber

  

  console.log( resort, sport, from, to, members,lessonType,time,orderBy,instructorName,pageNumber);
  // instructorName, reviewScore, reviewCount, experience, languages [], typeOfLesson, description, image, instructorId, minPricePerDay, minPricePerHour
  // maxPages

  // if lesson is group  we send instructor and lesson information (instructionID id)    Ta group mathimata aforoun mia didaskalia   
  // if lesson is private we just send the instructor information                        Ta private mathimata aforoun  poles didaskalies (enan proponiti)
  // prepei se kathe periptosi members <= free spots
  
  const instructorLessons = [
    {
      instructorName: "Alice J.",
      reviewScore: "4.8",
      reviewCount: 1,
      experience: "1",
      languages: ["English", "French","Spanish"],
      typeOfLesson: "private",
      description: "Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1001",
      minPricePerDay: "150",
      minPricePerHour: "35"
    },
    {
      instructorName: "Carlos R.",
      reviewScore: "4.6",
      reviewCount: 2,
      experience: "8",
      languages: ["Spanish"],
      typeOfLesson: "group",
      instructionID:"1212",
      groupName:"Lesson for kids",
      description: "Energetic and great with beginners. Energetic and great with beginners. Energetic and great with beginners. Energetic and great with beginners.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1002",
      minPricePerDay: "130",
      minPricePerHour: "30"
    },
    {
      instructorName: "Lena M.",
      reviewScore: "5.0",
      reviewCount: 3,
      experience: "15",
      languages: ["German", "English"],
      typeOfLesson: "private",
      description: "Top-rated instructor with a personal approach. Top-rated instructor with a personal approach. Top-rated instructor with a personal approach. Top-rated instructor with a personal approach.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1003",
      minPricePerDay: "180",
      minPricePerHour: "40"
    },
    {
      instructorName: "Marco R.",
      reviewScore: "4.7",
      reviewCount: 4,
      experience: "10",
      languages: ["Italian", "English"],
      typeOfLesson: "private",
      description: "Great with kids and family groups. Great with kids and family groups. Great with kids and family groups. Great with kids and family groups. Great with kids and family groups.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1004",
      minPricePerDay: "140",
      minPricePerHour: "32"
    },
    {
      instructorName: "Akira T.",
      reviewScore: "4.9",
      reviewCount: 5,
      experience: "13",
      languages: ["Japanese", "English"],
      instructionID:"1213",
      typeOfLesson: "group",
      groupName:"Lesson for adults",
      description: "Expert instructor for advanced levels. Expert instructor for advanced levels. Expert instructor for advanced levels. Expert instructor for advanced levels.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1005",
      minPricePerDay: "200",
      minPricePerHour: "45"
    },
    {
      instructorName: "Sophia L.",
      reviewScore: "4.5",
      reviewCount: 6,
      experience: "7",
      languages: ["Korean", "English"],
      instructionID:"12121221",
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      description: "Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style. Calm and clear teaching style.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1006",
      minPricePerDay: "120",
      minPricePerHour: "28"
    },
    {
      instructorName: "Thomas D.",
      reviewScore: "4.4",
      reviewCount: 7,
      experience: "5",
      languages: ["French", "English"],
      typeOfLesson: "private",
      description: "Loves nature and cross-country adventures. Loves nature and cross-country adventures. Loves nature and cross-country adventures. Loves nature and cross-country adventures.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1007",
      minPricePerDay: "110",
      minPricePerHour: "25"
    },
    {
      instructorName: "Emma S.",
      reviewScore: "4.6",
      reviewCount: 8,
      experience: "9",
      languages: ["English"],
      instructionID:"111212",
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      description: "Passionate about helping others improve quickly. Passionate about helping others improve quickly. Passionate about helping others improve quickly. Passionate about helping others improve quickly.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1008",
      minPricePerDay: "145",
      minPricePerHour: "34"
    },
    {
      instructorName: "Luis M.",
      reviewScore: "4.3", 
      reviewCount: 9,
      experience: "6",
      languages: ["Spanish"],
      typeOfLesson: "private",
      description: "Fun and motivating group leader.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1009",
      minPricePerDay: "125",
      minPricePerHour: "29"
    },
    {
      instructorName: "Zara A.",
      reviewScore: "4.9",
      reviewCount: 10,
      experience: "11",
      languages: ["English", "Urdu"],
      instructionID:"12121212",
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      description: "Technical and safety-focused expert.",
      image: "/images/startPage/Ski.jpg",
      instructorId: "inst_1010",
      minPricePerDay: "190",
      minPricePerHour: "42"
    },
  ];

  // an den iparxoun mathimata to instructorLessons einai kenos pinakas  kai maxPages=0


  const lessonsPerPage=4
    
  const startIndex = (pageNumber - 1) * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;

  if(lessonType=="private"){
    const privateInstructors = instructorLessons.filter(
      (instructor) => instructor.typeOfLesson === "private"
    );
    res.json({
      instructorLessons: privateInstructors.slice(startIndex, endIndex),

      maxPages:4
    });
  }


  else{
      res.json({
      instructorLessons: instructorLessons.slice(startIndex, endIndex),
      maxPages:4
    });
  }


  
})

app.post('/api/reviews/:page', async (req, res) => {
  const reviewsPerPage = 4;

  const page = req.params.page;


  const reviews = [
    {
      stars: 3,
      name: "Μαρία Α.",
      date: "24/12/2024",
      sport: "Ski",
      resort: "Parnassos",
      review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
      image: "img",
      lessonHours: 1,
      instructorName: "Γιάννης Μ."
    },
    {
      stars: 2,
      name: "Μαρία Α.",
      date: "24/12/2024",
      sport: "Ski",
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
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
      resort: "Parnassos",
      review: "Πολύ καλός προπονητής και πέρασα ευχάριστα και διασκεδαστικά μαζί του.",
      image: "img",
      lessonHours: 12,
      instructorName: "Γιάννης Μ."
    }
  ];

  // await new Promise(resolve => setTimeout(resolve, 2000));

  if (page === 'instructor') {
    res.json(reviews);

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


})

app.post('/api/signupUser', async(req,res)=>{

  const { firstName,lastName,email,password,passwordCheck,countryPhoneCode,phoneNumber,accountType} = req.body; 

  const isValid= await validateSignUpInputs(firstName,lastName,email,password,passwordCheck,countryPhoneCode,phoneNumber,accountType)
  
  if(isValid){
    req.session.loggedinState = "instructor";
    res.json({ signUpSuccess: true  });

  }
  else{
    res.json({ signUpSuccess: false  });

  }
})

app.get('*',(req,res)=>{

    // xrisimopoioume client side routing. 
    const staticFileRegex = /\.(js|css|png|jpg|jpeg|gif|ico|json|woff|woff2|ttf|eot|svg)$/i;
    // console.log('asassas')

    if (staticFileRegex.test(req.url)) {
      console.log("### ",req.url)
      res.status(404).send("File not found or invalid route!");
      return
    }
  
      res.sendFile('index.html',{root:distPath});
  
  })

app.listen(PORT,()=>{
    console.log(`server listening on http://localhost:${PORT}`)
})











async function validateSignUpInputs(firstName,lastName,email,password,passwordCheck,countryPhoneCode,phoneNumber,accountType){

  if(accountType!="user" && accountType!="instructor"){
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


  if(!password){
    return false
  }
  else if(password.length<8){
    return false

  }
  else if(!(/\d/.test(password))){
    return false

  }
  else if(!(/\p{L}/u.test(password))){
    return false
  }

  if(!passwordCheck){
    return false

  }
  else if(passwordCheck!=password){
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
  await new Promise(resolve => setTimeout(resolve, 2000));


  if(userEmail=="12@gmail.com"){
    return true
  }
  else{
    return false
  }
}




































////
// https://github.com/Uncover-F/TAS?tab=readme-ov-file

// async function translateText() {
//   const endpointsUrl = 'https://raw.githubusercontent.com/Uncover-F/TAS/Uncover/.data/endpoints.json';
  
//   // Parameters for translation (customize as needed)
//   const params = {
//       text: 'Tell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare ell me a joke about Cloudflare',  // Text to translate
//       source_lang: 'en',  // Source language code
//       target_lang: 'fr'   // Target language code
//   };

//   try {
//       // Get the list of endpoints
//       const endpointsResponse = await fetch(endpointsUrl);
//       if (!endpointsResponse.ok) {
//           throw new Error(`Error fetching endpoints: ${endpointsResponse.status} - ${endpointsResponse.statusText}`);
//       }
//       const endpoints = await endpointsResponse.json();

//       // Try each endpoint until one works
//       let result = null;
//       for (const endpoint of endpoints) {
//           const url = new URL(endpoint);
//           url.search = new URLSearchParams(params).toString();

//           try {
//               const response = await fetch(url);
//               if (response.ok) {
//                   result = await response.json();
//                   break;
//               } else {
//                   console.error(`Error at ${url}: ${response.status} - ${response.statusText}`);
//               }
//           } catch (error) {
//               console.error(`Request exception at ${url}:`, error);
//           }
//       }

//       // Print the result or an error message
//       if (result !== null) {
//           console.log(result);
//       } else {
//           console.error('All endpoints failed.');
//       }
//   } catch (error) {
//       console.error('Error:', error);
//   }
// }

// translateText();



