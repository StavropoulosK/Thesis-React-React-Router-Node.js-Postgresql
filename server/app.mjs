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
// const tempPath= path.join(__dirname,'../client')

// const publicPath= path.join (__dirname,'./src')
// app.use(express.static(publicPath))


const app=express()

app.use(express.static(distPath))



app.use(express.json())

app.use(session({
    name:'cookieSid',
    secret: process.env.SESSION_SECRET || "PynOjAuHetAuWawtinAytVunar", // κλειδί για κρυπτογράφηση του cookie
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:20*60*1000,      // 20 min
        sameSite:true,
        secure:false
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

app.get('*',(req,res)=>{

    // xrisimopoioume client side routing. 
    const staticFileRegex = /\.(js|css|png|jpg|jpeg|gif|ico|json|woff|woff2|ttf|eot|svg)$/i;
    
    if (staticFileRegex.test(req.url)) {
      console.log('returnn')
      return; // Let static file handling take care of it
    }
  
      res.sendFile('index.html',{root:distPath});
  
  })

app.listen(PORT,()=>{
    console.log(`server listening on http://localhost:${PORT}`)
})
