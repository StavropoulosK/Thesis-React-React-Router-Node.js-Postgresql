import express from "express"
import path from 'path'
import { fileURLToPath } from "url"
import { dirname } from "path"
import session from "express-session"
import 'dotenv/config'


import studentOptionsRouter from './routes/studentOptions.mjs'
import publicOptionsRouter from './routes/publicOptions.mjs'
import instructorOptionsRouter from './routes/instructorOptions.mjs'

import { errorHandler } from "./controller/errorHandler.mjs"

const __filename=fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

const PORT= process.env.SERVERPORT || 3000

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

app.listen(PORT,()=>{
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
  console.log("### ",req.url)
  res.status(404).send("File not found or invalid route!");
  return
}

  res.sendFile('index.html',{root:distPath});

})


























































// na megaloso to meeting point, na balo piasmena mathimata, taksinomimena ta mathimata, na fainetai i ora pou diarki to kathe matima, sto payment na dixno to farms (p.x. 4 4-paules gia to kodiko kartas )

// tous aresan ta xromata, oti lei ola ta attributes sta lessons, tous fanikan ola poli apla.



// elegxoi

// na mi steli res.json enas controller
// controller public options logoutUser
// kinito
// indexes
// redis
// emailjs







