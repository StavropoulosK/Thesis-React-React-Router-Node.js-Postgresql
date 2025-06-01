import * as instructorOptionsModel from "../model/instructorOptions.mjs"



async function getInstructorProfileParams(req,res,next){
    try{
        // const instructorID="i121212"
        // const email="kostas.striker@gmail.com"
        // const phone="306951232693"
        // const knownLanguages=["English","Greek","Italian"]
        // const resorts=["Elatochoriou","Velouhiou"]
        // const sports=["Ski","Snowboard"]
        // const cancelationPolicy="dnot"
        // const biography= "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos velit numquam, voluptatum distinctio ex, libero deleniti, dolore illum ducimus officiis dolorem. Perspiciatis dolore voluptatem atque numquam veniam placeat omnis nemo"
        // const summary= "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos velit numquam, voluptatum distinctio ex, libero deleniti, dolore illum ducimus officiis dolorem. Perspiciatis dolore voluptatem atque numquam veniam placeat omnis nemo"
        // const yearsOfExperience="5"

        // const firstName="alex"
        // const lastName="mic"

        const instrcutorId= req.session.userID


        if(!instrcutorId){
            return res.status(401).end();

        }



        const { instructorid, email, phonenumber, languages, resorts, sports, cancelationpolicy, biographynote, summaryinfo, yearsofexperience, firstname, lastname, profilepicture  } = await (instructorOptionsModel.getInstructorProfileParams(instrcutorId))
        // console.log('bbb ',instructorid , email, phonenumber, languages, resorts, sports, cancelationpolicy, biographynote, summaryinfo, yearsofexperience, firstname, lastname )

        let imageBase64 = null;
        if (profilepicture) {
            const mimeType = "image"; 
            imageBase64 = `data:${mimeType};base64,${profilepicture.toString("base64")}`;
        }

        const instructorName=firstname +' '+lastname[0]+"."

        res.json({ profileImage: imageBase64 ,instructorName,instructorID:instructorid,firstName:firstname,lastName:lastname,email,phone:phonenumber,knownLanguages:languages,resorts,sports,cancelationPolicy:cancelationpolicy,biography:biographynote,summary:summaryinfo,yearsOfExperience:yearsofexperience})
    }
    catch(error){
        next(error)
    }
}

async function updateInstructorImage(req,res,next){
    try{
        const imageBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        await instructorOptionsModel.saveImage(instrcutorId, imageBuffer);


        res.send({message:"success"});
    }
    catch(error){
        console.log(error)
        return res.json({message:"failure"})
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

async function updateInstructorInfo(req,res,next){
    try{
        let { firstName, lastName, email, phoneNumber,resorts,knownLanguages,sports,cancelationPolicy,biography,summary,yearsOfExperience} = req.body;

        const instrcutorId= req.session.userID


        if(!instrcutorId){
            return res.status(401).end();

        }


        

        let updateValueName=""
        let updateValue=""
        let tableName=""

        // only update value is not null

        if(firstName!=null){
            updateValueName="firstName"
            updateValue=firstName
            tableName="USER"
        }
        else if(lastName!=null){
            updateValueName="lastName"
            updateValue=lastName
            tableName="USER"
        }
        else if(email!=null){
            updateValueName="email"
            updateValue=email
            tableName="USER"
        }
        else if(phoneNumber!=null){
            updateValueName="phoneNumber"
            updateValue=phoneNumber
            tableName="USER"
        }
        else if(knownLanguages!=null){
            //remove comma at first index
            if (knownLanguages.charAt(0) === ",") {
                knownLanguages = knownLanguages.slice(1);
              }
            updateValueName="languages"
            updateValue=convertStrToArray(knownLanguages)
            tableName="instructor"
        }

        else if(resorts!=null){
            //remove comma at first index

            if (resorts.charAt(0) === ",") {
                resorts = resorts.slice(1);
            }

            updateValueName="resorts"
            updateValue=convertStrToArray(resorts)
            tableName="instructor"
        }
        else if(sports!=null){
            //remove comma at first index

            if (sports.charAt(0) === ",") {
                sports = sports.slice(1);
            }

            updateValueName="sports"
            updateValue=convertStrToArray(sports)
            tableName="instructor"
        }
        else if(cancelationPolicy!=null){
            updateValueName="cancelationpolicy"
            updateValue=cancelationPolicy
            tableName="instructor"
        }
        else if(biography!=null){
            updateValueName="biographyNote"
            updateValue=biography
            tableName="instructor"
        }
        else if(summary!=null){
            updateValueName="summaryInfo"
            updateValue=summary
            tableName="instructor"
        }
        else if(yearsOfExperience!=null){
            updateValue=yearsOfExperience
            updateValueName="yearsofexperience"
            tableName="instructor"
        }



        // console.log('aaa ',firstName, lastName, email, phoneNumber,resorts,knownLanguages,sports,cancelationPolicy,biography,summary,yearsOfExperience, convertStrToArray(sports))
        // console.log('aaa ',sports,resorts,knownLanguages,updateValueName,updateValue)
        await (instructorOptionsModel.updateInstructorInfo(updateValueName,updateValue,tableName,instrcutorId))

      
        // await new Promise(resolve => setTimeout(resolve, 5000));
      
        //success, failure
      
      
        return res.json({message:"success"})
    }
    catch(error){
        console.log(error)

        return res.json({message:"failure"})

    }
}




async function getMonthStatistics(req,res,next){
    try{
        const selectedDate = req.query.selectedDate;

        // selectedDate is like April 2025

        const instrcutorId= req.session.userID


        if(!instrcutorId){
            return res.status(401).end();

        }

        const result =await instructorOptionsModel.getMonthStatistics(instrcutorId,selectedDate)

        console.log("aaa ",result)


        return res.json({profitPrivate:2000,profitGroup:3000,hoursPrivate:20,hoursGroup:40});
    }
    catch(error){
        next(error)
    }
}

async function getGeneralStatistics(req,res,next){
    try{

      const instrcutorId= req.session.userID


      if(!instrcutorId){
          return res.status(401).end();

      }

      const monthsToDisplay=[
          "April 2025",
          "March 2025",
          "February 2025",
          "January 2025",
          "December 2024",
          "November 2024",
          "October 2024",
          "September 2024",
          "August 2024",
          "July 2024",
          "June 2024"
      ]
      
      const reviewScores={
      "1":20,
      "2":30,
      "3":0,
      "4":40,
      "5":10
      }

    //   const result = await instructorOptionsModel.getGeneralStatistics(instrcutorId)
    //   console.log("bbb ",result)

  
      res.json({monthsToDisplay,reviewScores})
    }
    catch(error){
        next(error)
    }
}





async function updateNote(req,res,next){
    try{
        const { note,lessonID} = req.body

        const instrcutorId= req.session.userID


        if(!instrcutorId){
            return res.status(401).end();
  
        }
  
        await instructorOptionsModel.updateNote(instrcutorId,Number(lessonID),note)

        //note_success note_failure
      
        res.json({message:"note_success"})
    }
    catch(error){
        console.error(error)
        res.json({message:"note_failure"})
    }
}

function getWeekday(dateStr) {
    // input  '2025/04/25'
    // output Monday

    const [year, month, day] = dateStr.split('/');
    const isoDate = `${year}-${month}-${day}`;
  
    // Create a date object
    const date = new Date(isoDate);
  
    // Array of weekday names
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    // Get weekday index and return name
    return weekdays[date.getDay()];
  }

async function getInstructorSchedule(req,res,next){
    try{

        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        const date=reformatDateDB(req.params.date)

        const lessonss=[
          {
            resort:"Parnassou",
            date:"Monday 15/01/2025",
            time:"8:30-10:30",
            sport:"Ski",
            participants:3,
            lessonType:"private",
            meetingPoint:{
              title:"Άνω σαλέ",
            },
            studentInfos:[
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
             
            ],
            note:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quis cumque voluptatibus eos quibusdam sint reprehenderit! Nostrum qui omnis accusantium, nam voluptate ipsa sapiente enim expedita, itaque corrupti, sequi ut",
            lessonID:"12123"
      
          },
      
          {
            resort:"Parnassou",
            date:"Monday 15/01/2025",
            time:"10:30-12:30",
            sport:"Ski",
            participants:3,
            lessonType:"group",
            meetingPoint:{
              title:"Άνω σαλέ",
            },
            studentInfos:[
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
            ],
            note:"",
            lessonID:"1212"
          }
        ]


        const lessons = await instructorOptionsModel.getInstructorSchedule(instrcutorId,date)


        lessons.forEach(lesson=>{
            const date=getWeekday(lesson.date)+" "+reformatDateUI(lesson.date)
            lesson.date=date
            const meetingPointTitle=lesson.meetingPointTitle

            if(meetingPointTitle==null){
                lesson.meetingPoint={
                    title:"after_agreement",
                  }
            }
            else{
                lesson.meetingPoint={
                    title:meetingPointTitle,
                  }
            }
        })



          res.json({lessons:lessonss})
    }
    catch(error){
        next(error)
    }
}

async function getTeachings(req,res,next){
    try{
        // const meetingPoints=[
        //     {
        //       id:"1",
        //       resort:"laasd",
        //       text:"ano sale"
        //     },
        //     {
        //       id:"2",
        //       resort:"laasd",
        //       text:"ano sale"
        //     },
        //     {
        //       id:"3",
        //       resort:"laasd",
        //       text:"ano sale"
        //     },
        //     {
        //       id:"4",
        //       resort:"laasd",
        //       text:"ano sale"
        //     },
        //     {
        //       id:"15",
        //       resort:"",
        //       text:""
        //     },
        // ]
        
        
        // a) 1 member 2 members, b) meetingPoint einai to (index+1) (p.x. to 3 apo auta pou blepi o xristis) kai oxi to id . To meeting point mporei na einai location 1, location 2.... after_agreement

        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        const meetingPoints=  await instructorOptionsModel.getMeetingPoints(instrcutorId)

        meetingPoints.forEach(meetingPoint=>{
          const image= meetingPoint.image
          let imageBase64 = null;
          if (image) {
            const mimeType = "image"; 
            imageBase64 = `data:${mimeType};base64,${image.toString("base64")}`;
            meetingPoint.image= imageBase64
          }

        })



        // console.log('aa ',meetingPoints)
        const existingTeachings= await instructorOptionsModel.getExistingTeachings(instrcutorId)

        existingTeachings.forEach(teaching=>{
          const dateStart=teaching.selectedDateStart
          const dateEnd= teaching.selectedDateEnd
          const maxParticipants=teaching.selectedMaxParticipants
          const meetingPointID= teaching.meetingPoint

          if(meetingPointID==null){
            teaching.meetingPoint='after_agreement'

            teaching.meetingPointId="after_agreement"

          }
          else{
            const index = meetingPoints.findIndex(meetingPoint => meetingPoint.id === meetingPointID);

            teaching.meetingPoint= 'location '+String(index+1)
            teaching.meetingPointId= String(meetingPointID)
          }

          teaching.selectedMaxParticipants= maxParticipants==1?"1 member":`${maxParticipants} members`

          teaching.selectedDateStart=reformatDateUI(dateStart)
          teaching.selectedDateEnd=reformatDateUI(dateEnd)
        })

        // console.log("aaa ",existingTeachings)
        
        // const existingTeachings=[
        //     {
        //       teachingID:202,
        //       selectedResort:"Parnassou",
        //       selectedSport:"Ski",
        //       selectedDateStart:"24/05/2025",
        //       selectedDateEnd:"27/05/2025",
        //       selectedDays:["Monday","Tuesday"],
        //       timeStart:"07:20",
        //       timeEnd:"10:20",
        //       isLessonAllDay:"true",
        //       selectedLessonType:"private",
        //       selectedMaxParticipants:"1 member",
        //       meetingPoint:"location 1",
        //       hourCost:"202",
        //       groupName:"",
        //       meetingPointId:4
        //       lessons:[
        //           {
        //             lessonID: 1,
        //             date: "20/05/2025",
        //             canceled: false,
        //             time: "10:00-12:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 2,
        //             date: "21/05/2025",
        //             canceled: true,
        //             time: "11:00-13:00",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 3,
        //             date: "22/05/2025",
        //             canceled: false,
        //             time: "09:00-11:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 4,
        //             date: "23/05/2025",
        //             canceled: false,
        //             time: "14:00-16:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 5,
        //             date: "24/05/2025",
        //             canceled: true,
        //             time: "10:20-12:20",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 6,
        //             date: "25/05/2025",
        //             canceled: false,
        //             time: "08:30-10:30",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 7,
        //             date: "26/05/2025",
        //             canceled: false,
        //             time: "15:00-17:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 8,
        //             date: "27/05/2025",
        //             canceled: true,
        //             time: "13:00-15:00",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 9,
        //             date: "28/05/2025",
        //             canceled: false,
        //             time: "12:00-14:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 10,
        //             date: "29/05/2025",
        //             canceled: false,
        //             time: "10:00-12:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 11,
        //             date: "30/05/2025",
        //             canceled: true,
        //             time: "09:00-11:00",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 12,
        //             date: "31/05/2025",
        //             canceled: false,
        //             time: "10:20-12:20",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 13,
        //             date: "01/06/2025",
        //             canceled: false,
        //             time: "10:20-12:20",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 14,
        //             date: "02/06/2025",
        //             canceled: true,
        //             time: "11:00-13:00",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 15,
        //             date: "03/06/2025",
        //             canceled: false,
        //             time: "12:30-14:30",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 16,
        //             date: "04/06/2025",
        //             canceled: false,
        //             time: "08:00-10:00",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 17,
        //             date: "05/06/2025",
        //             canceled: true,
        //             time: "14:00-16:00",
        //             hasParticipants: false,
        //           },
        //           {
        //             lessonID: 18,
        //             date: "06/06/2025",
        //             canceled: false,
        //             time: "13:30-15:30",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 19,
        //             date: "07/06/2025",
        //             canceled: false,
        //             time: "09:30-11:30",
        //             hasParticipants: true,
        //           },
        //           {
        //             lessonID: 20,
        //             date: "08/06/2025",
        //             canceled: true,
        //             time: "10:00-12:00",
        //             hasParticipants: false,
        //           }
           
                
        //       ]
        
        //     },
        
        //     {
        //       teachingID:203,
        //       selectedResort:"Parnassou",
        //       selectedSport:"Ski",
        //       selectedDateStart:"24/05/2025",
        //       selectedDateEnd:"27/05/2025",
        //       selectedDays:["Monday","Tuesday","Wednesday"],
        //       timeStart:"07:20",
        //       timeEnd:"12:30",
        //       isLessonAllDay:"false",
        //       selectedLessonType:"group",
        //       selectedMaxParticipants:"2 members",
        //       meetingPoint:"after_agreement",
        //       hourCost:"202",
        //       groupName:"group name",
        //       meetingPointId:4,
        //       lessons:[
        //         {
        //           lessonID: 1,
        //           date: "20/05/2025",
        //           canceled: false,
        //           time: "10:00-12:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 2,
        //           date: "21/05/2025",
        //           canceled: true,
        //           time: "11:00-13:00",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 3,
        //           date: "22/05/2025",
        //           canceled: false,
        //           time: "09:00-11:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 4,
        //           date: "23/05/2025",
        //           canceled: false,
        //           time: "14:00-16:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 5,
        //           date: "24/05/2025",
        //           canceled: true,
        //           time: "10:20-12:20",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 6,
        //           date: "25/05/2025",
        //           canceled: false,
        //           time: "08:30-10:30",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 7,
        //           date: "26/05/2025",
        //           canceled: false,
        //           time: "15:00-17:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 8,
        //           date: "27/05/2025",
        //           canceled: true,
        //           time: "13:00-15:00",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 9,
        //           date: "28/05/2025",
        //           canceled: false,
        //           time: "12:00-14:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 10,
        //           date: "29/05/2025",
        //           canceled: false,
        //           time: "10:00-12:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 11,
        //           date: "30/05/2025",
        //           canceled: true,
        //           time: "09:00-11:00",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 12,
        //           date: "31/05/2025",
        //           canceled: false,
        //           time: "10:20-12:20",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 13,
        //           date: "01/06/2025",
        //           canceled: false,
        //           time: "10:20-12:20",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 14,
        //           date: "02/06/2025",
        //           canceled: true,
        //           time: "11:00-13:00",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 15,
        //           date: "03/06/2025",
        //           canceled: false,
        //           time: "12:30-14:30",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 16,
        //           date: "04/06/2025",
        //           canceled: false,
        //           time: "08:00-10:00",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 17,
        //           date: "05/06/2025",
        //           canceled: true,
        //           time: "14:00-16:00",
        //           hasParticipants: false,
        //         },
        //         {
        //           lessonID: 18,
        //           date: "06/06/2025",
        //           canceled: false,
        //           time: "13:30-15:30",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 19,
        //           date: "07/06/2025",
        //           canceled: false,
        //           time: "09:30-11:30",
        //           hasParticipants: true,
        //         },
        //         {
        //           lessonID: 20,
        //           date: "08/06/2025",
        //           canceled: true,
        //           time: "10:00-12:00",
        //           hasParticipants: false,
        //         }
         
              
        //     ]
        
        //     }
        // ]


        const profileParamsAreFilled= await instructorOptionsModel.profileParamsAreFilled(instrcutorId)

        // const profileParamsAreFilled=true
        
        res.json({meetingPoints,existingTeachings,profileParamsAreFilled})
    }
    catch(error){
        next(error)
    }
}

async function cancelInstructorLessons(req,res,next){
    try{
        const {lessonIDsArray}= req.body

        
        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        await instructorOptionsModel.cancelInstructorLessons(instrcutorId,convertStrToArray(lessonIDsArray).map(Number))



        // cancelLessons_success, cancelLessons_failure
      
      
        res.json({message:"cancelLessons_success"})
    }
    catch(error){
        console.log(error)
        res.json({message:"cancelLessons_failure"})
    }
}

async function updateTeaching(req,res,next){
    try{
        const {meetingPointId,teachingID} =req.body

        const meetingPointFinal= meetingPointId!="after_agreement"?meetingPointId:null


        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }



        await instructorOptionsModel.updateTeaching(instrcutorId,meetingPointFinal,teachingID)

        // updateTeaching_success, updateTeaching_failure

        res.json({message:"updateTeaching_success"})
    }
    catch(error){
        console.log(error)
        res.json({message:"updateTeaching_failure"})
    }
}

function getMatchingWeekdaysInRange(startDateStr, endDateStr, targetDays) {

//  start = "27/05/2025";
//  end = "04/07/2025";
//  days = ["Monday", "Tuesday"];

//  result is like  [
// '2025/06/04', '2025/06/08', '2025/06/09',
// '2025/06/11', '2025/06/15', '2025/06/16']

  function parseDate(str) {
      // Parse dd/mm/yyyy into Date
      const [dd, mm, yyyy] = str.split('/').map(Number);
      return new Date(yyyy, mm - 1, dd); // Month is 0-based
  }

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  const result = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (targetDays.includes(getDayName(d))) {
      result.push(formatDate(d));
    }
  }

  return result;

  function getDayName(date) {
    return date.toLocaleDateString("en-EN", { weekday: "long" });
  }

  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }
}

function reformatDateDB(input) {
  // input DD/MM/YYYY
  // output YYYY/MM/DD

  const [day, month, year] = input.split('/');
  return `${year}/${month}/${day}`;
}

function reformatDateUI(input) {
  // input YYYY/MM/DD
  // output DD/MM/YYYY

  const [year, month, day] = input.split('/');
  return `${day}/${month}/${year}`;
}



async function createTeaching(req,res,next){
    try{
        const {selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay} =req.body


        //islessonallday is string
        // console.log("#### ",selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay)

        const isAllDay= isLessonAllDay=="true"?true:false
        const maxParticipants=Number(selectedMaxParticipants.split(" ")[0])
        const finalMeetingPointID= meetingPointId!="after_agreement"?meetingPointId:null

        const days=convertStrToArray(selectedDays)
        const finalGroupName= selectedLessonType=="private"?null:groupName
        
        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        const datesArray=getMatchingWeekdaysInRange(selectedDateStart,selectedDateEnd,days)

        // console.log("!! ",selectedDays,selectedDateStart,selectedDateEnd,getMatchingWeekdaysInRange(selectedDateStart,selectedDateEnd,days))

        await instructorOptionsModel.createTeaching(instrcutorId,reformatDateDB(selectedDateStart),reformatDateDB(selectedDateEnd),selectedResort,selectedSport,maxParticipants,finalGroupName,days,finalMeetingPointID, Number(hourCost),timeStart,timeEnd,selectedLessonType,isAllDay,datesArray)
        // createTeaching_success, createTeaching_failure
      
        res.json({message:"createTeaching_success"})
    }
    catch(error){
      console.log(error)
      res.json({message:"createTeaching_failure"})

    }
}




async function updateMeetingPoint(req,res,next){
    try{
        const { meetingPointId,resort,text,updateField } = req.body; // Access request body

        // console.log("aaa ",meetingPointId,resort,text,updateField )

        if(updateField!="resortText" && updateField!="locationText"){
          return res.status(401).end();

        }

        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        let updateValue= resort!=null?resort:text


        await instructorOptionsModel.updateMeetingPoint(meetingPointId,updateField,updateValue)


      
        // updateMeetingPoint_success, updateMeetingPoint_failure
      
        res.json({message:"updateMeetingPoint_success"})
    }
    catch(error){
        console.log(error)
        res.json({message:"updateMeetingPoint_failure"})

    }
}

async function deleteMeetingPoint(req,res,next){
    try{
        const { meetingPointId } = req.body; 


        //deleteMeetingPoint_success, deleteMeetingPoint_failure

        const instrcutorId= req.session.userID

        if(!meetingPointId){
            return res.status(401).end();

        }

        await instructorOptionsModel.deleteMeetingPoint(meetingPointId,instrcutorId)
              
        res.json({message:"deleteMeetingPoint_success"})
    }
    catch(error){
        console.log(error)
        res.json({message:"deleteMeetingPoint_failure"})
    }
}

async function createMeetingPoint(req,res,next){
    try{
        // createMeetingPoint_success, api/updateMeetingPoint

        const instrcutorId= req.session.userID

        if(!instrcutorId){
            return res.status(401).end();

        }

        await instructorOptionsModel.createMeetingPoint(instrcutorId)

        res.json({message:"createMeetingPoint_success"})
    }
    catch(error){
      console.log(error)

      res.json({message:"createMeetingPoint_failure"})
    }
}

async function updateMeetingPointImage(req,res,next){
  try{
      const imageBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      const instrcutorId= req.session.userID
      const meetingPointID=req.body.meetingPointId

      if(!instrcutorId){
          return res.status(401).end();

      }

      await instructorOptionsModel.updateMeetingPointImage(meetingPointID,instrcutorId, imageBuffer);


      res.send({message:"success"});
  }
  catch(error){
    console.log(error)
    res.send({message:"failure"});
  }
}


export {getInstructorProfileParams,updateInstructorInfo,getMonthStatistics,getGeneralStatistics,updateNote,getInstructorSchedule,
getTeachings,cancelInstructorLessons,updateTeaching,createTeaching,updateMeetingPoint,deleteMeetingPoint,createMeetingPoint,updateInstructorImage,updateMeetingPointImage}