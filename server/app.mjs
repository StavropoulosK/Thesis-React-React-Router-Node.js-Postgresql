import express from "express"
import path from 'path'
import { fileURLToPath } from "url"
import { dirname } from "path"
import session from "express-session"
import 'dotenv/config'



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



app.get('/api/getLoginStatus', (req, res) => {

  if(req.session?.loggedinState){
    return res.json({ status: req.session.loggedinState });

  }
  else{
    return res.json({ status: null });
  }
})

app.post("/api/loginUser", (req, res) => {

    const { email, password } = req.body; // Access request body

    if (email === "123" && password === "123") {
      req.session.loggedinState = "instructor";
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


  // await new Promise(resolve => setTimeout(resolve, 4000 ));
  

  console.log( resort, sport, from, to, members,lessonType,time,orderBy,instructorName,pageNumber);
  // instructorName, reviewScore, reviewCount, experience, languages [], typeOfLesson, reservedSports, description, image, instructorId, minPricePerDay, minPricePerHour
  // maxPages
  
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
      groupName:"Lesson for kids",
      reservedSports: '2/4',
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
      typeOfLesson: "group",
      groupName:"Lesson for adults",
      reservedSports: '3/5',
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
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      reservedSports: '2/5',
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
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      reservedSports: "4/5",
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
      typeOfLesson: "group",
      groupName:"Lesson for kids",
      reservedSports: "4/6",
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

  await new Promise(resolve => setTimeout(resolve, 2000));

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



