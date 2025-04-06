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

app.get('/api/reviews', (req, res) => {
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
          lessonHours: 0.5,
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
          lessonHours: 4,
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
        }
      ];

      // await new Promise(resolve => setTimeout(resolve, 12000));

    res.json(reviews);
  });

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


  if (page === 'instructor') {
    res.json(reviews);

  }

  else if(page=='bookLesson'){
    // epistefei to poli 3 selides

    const { resort,sport,from,to,members,reviewsPage } = req.body; 
    // console.log('aaa ',resort,sport,from,to,members,page,reviewsPage)

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
  console.log('asassas')
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
    console.log('asassas')

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