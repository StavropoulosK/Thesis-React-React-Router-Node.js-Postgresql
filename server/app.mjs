import express from "express"
import path from 'path'
import { fileURLToPath } from "url"
import { dirname } from "path"
import session from "express-session"
import helmet from "helmet"
import 'dotenv/config'




import studentOptionsRouter from './routes/studentOptions.mjs'
import publicOptionsRouter from './routes/publicOptions.mjs'
import instructorOptionsRouter from './routes/instructorOptions.mjs'

import { errorHandler } from "./controller/errorHandler.mjs"

const __filename=fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

const PORT= process.env.PORT || 3000

// works on localhost 
// const distPath= path.join (__dirname,'../client/dist')

// works on flyio or localhost 
// for fly io the dist folder must be in the same folder where fly.toml file is. therefore we just copy dist from client into the server folder

const distPath= path.join (__dirname,'./client/dist')


const publicPath= path.join (__dirname,'./public')


const app=express()


// In choselessonparams.jsx useeffect must be commented out during development (due to strict mode in react)


//helmet increase header security https://blog.logrocket.com/using-helmet-node-js-secure-application/
app.use(helmet())

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      // Allow fonts from self and Google Fonts
      "font-src": ["'self'", "https://fonts.gstatic.com"],

      // Allow styles from self and Google Fonts
      "style-src": ["'self'", "https://fonts.googleapis.com"],
    },
  })
);


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


const server = app.listen(PORT,()=>{
  console.log(`server listening on http://localhost:${PORT}`)

})



app.use('/api',studentOptionsRouter)
app.use('/api',publicOptionsRouter)
app.use('/api',instructorOptionsRouter)


app.use(errorHandler)


app.get('*',(req,res)=>{

  // xrisimopoioume client side routing. 
  const staticFileRegex = /\.(js|css|png|jpg|jpeg|gif|ico|json|woff|woff2|ttf|eot|svg)$/i;
  // console.log('asassas')

  if (staticFileRegex.test(req.url)) {
    // console.log("### ",req.url)

    res.status(404).send("File not found or invalid route!");
    return
  }

  res.sendFile('index.html',{root:distPath});

})


process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
     console.log('Http server closed.');
  });
});

//ctr c and fly io
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing http server.');
  server.close(() => {
     console.log('Http server closed.');
  });
});































// 4600 reusable components
// 12000 route components
// 4200 o server (xoris comments)











