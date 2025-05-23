async function getInstructorProfileParams(req,res,next){
    try{
        const knownLanguages=["English","Greek","Italian"]
        const resorts=["Elatochoriou","Velouhiou"]
        const sports=["Ski","Snowboard"]
        const cancelationPolicy=["dnot"]
        const biography= "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos velit numquam, voluptatum distinctio ex, libero deleniti, dolore illum ducimus officiis dolorem. Perspiciatis dolore voluptatem atque numquam veniam placeat omnis nemo"
        const summary= "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos velit numquam, voluptatum distinctio ex, libero deleniti, dolore illum ducimus officiis dolorem. Perspiciatis dolore voluptatem atque numquam veniam placeat omnis nemo"
        const yearsOfExperience="5"

        const firstName="alex"
        const lastName="mic"


        const instructorName=firstName +' '+lastName[0]+"."

        res.json({instructorName,instructorID:"i121212",firstName,lastName,email:"kostas.striker@gmail.com",phone:"306951232693",knownLanguages,resorts,sports,cancelationPolicy,biography,summary,yearsOfExperience})
    }
    catch(error){
        next(error)
    }
}

async function updateInstructorInfo(req,res,next){
    try{
        const { firstName, lastName, email, phoneNumber,resorts,knownLanguages,sports,cancelationPolicy,biography,summary,yearsOfExperience} = req.body;

        // console.log('aaa ',firstName, lastName, email, phoneNumber,resorts,knownLanguages,sports,cancelationPolicy,biography,summary,yearsOfExperience)
      
        await new Promise(resolve => setTimeout(resolve, 5000));
      
        //success, failure
      
      
        return res.json({message:"success"})
    }
    catch(error){
        next(error)
    }
}

async function getMonthStatistics(req,res,next){
    try{
        const selectedDate = req.query.selectedDate;
        await new Promise(resolve => setTimeout(resolve, 2000));

        return res.json({profitPrivate:2000,profitGroup:3000,hoursPrivate:20,hoursGroup:40});
    }
    catch(error){
        next(error)
    }
}

async function getGeneralStatistics(req,res,next){
    try{
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
    
    
        res.json({monthsToDisplay,reviewScores})
    }
    catch(error){
        next(error)
    }
}



async function updateNote(req,res,next){
    try{
        const { note,lessonID} = req.body; 

        //note_success note_failure
      
        res.json({message:"note_failure"})
    }
    catch(error){
        next(error)
    }
}

async function getInstructorSchedule(req,res,next){
    try{
        const date=req.params.date

        const lessons=[
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
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              },
              {
                name:"Γεωργία Θάμου",
                email:"myemail@gmail.com",
                phone:'6999999999',
                level:"Beginner"
              }
            ],
            note:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quis cumque voluptatibus eos quibusdam sint reprehenderit! Nostrum qui omnis accusantium, nam voluptate ipsa sapiente enim expedita, itaque corrupti, sequi ut",
            lessonID:"12123"
      
          },
      
          {
            resort:"Parnassou",
            date:"Monday 15/01/2025",
            time:"8:30-10:30",
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
      
        res.json({lessons})
    }
    catch(error){
        next(error)
    }
}

async function getTeachings(req,res,next){
    try{
        const meetingPoints=[
            {
              id:"1",
              resort:"laasd",
              text:"ano sale"
            },
            {
              id:"2",
              resort:"laasd",
              text:"ano sale"
            },
            {
              id:"3",
              resort:"laasd",
              text:"ano sale"
            },
            {
              id:"4",
              resort:"laasd",
              text:"ano sale"
            },
            {
              id:"15",
              resort:"",
              text:""
            },
        ]
        
        // a) 1 member 2 members, b) meetingPoint einai to index (p.x. to 3 apo auta pou blepi o xristis) kai oxi to id . To meeting point mporei na einai location 1, location 2.... after_agreement
        
        
        const existingTeachings=[
            {
              teachingID:202,
              selectedResort:"Parnassou",
              selectedSport:"Ski",
              selectedDateStart:"24/05/2025",
              selectedDateEnd:"27/05/2025",
              selectedDays:["Monday","Tuesday"],
              timeStart:"07:20",
              timeEnd:"10:20",
              isLessonAllDay:"true",
              selectedLessonType:"private",
              selectedMaxParticipants:"1 member",
              meetingPoint:"location 1",
              hourCost:"202",
              groupName:"",
              lessons:[
                  {
                    lessonID: 1,
                    date: "20/05/2025",
                    canceled: false,
                    time: "10:00-12:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 2,
                    date: "21/05/2025",
                    canceled: true,
                    time: "11:00-13:00",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 3,
                    date: "22/05/2025",
                    canceled: false,
                    time: "09:00-11:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 4,
                    date: "23/05/2025",
                    canceled: false,
                    time: "14:00-16:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 5,
                    date: "24/05/2025",
                    canceled: true,
                    time: "10:20-12:20",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 6,
                    date: "25/05/2025",
                    canceled: false,
                    time: "08:30-10:30",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 7,
                    date: "26/05/2025",
                    canceled: false,
                    time: "15:00-17:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 8,
                    date: "27/05/2025",
                    canceled: true,
                    time: "13:00-15:00",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 9,
                    date: "28/05/2025",
                    canceled: false,
                    time: "12:00-14:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 10,
                    date: "29/05/2025",
                    canceled: false,
                    time: "10:00-12:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 11,
                    date: "30/05/2025",
                    canceled: true,
                    time: "09:00-11:00",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 12,
                    date: "31/05/2025",
                    canceled: false,
                    time: "10:20-12:20",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 13,
                    date: "01/06/2025",
                    canceled: false,
                    time: "10:20-12:20",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 14,
                    date: "02/06/2025",
                    canceled: true,
                    time: "11:00-13:00",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 15,
                    date: "03/06/2025",
                    canceled: false,
                    time: "12:30-14:30",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 16,
                    date: "04/06/2025",
                    canceled: false,
                    time: "08:00-10:00",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 17,
                    date: "05/06/2025",
                    canceled: true,
                    time: "14:00-16:00",
                    hasParticipants: false,
                  },
                  {
                    lessonID: 18,
                    date: "06/06/2025",
                    canceled: false,
                    time: "13:30-15:30",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 19,
                    date: "07/06/2025",
                    canceled: false,
                    time: "09:30-11:30",
                    hasParticipants: true,
                  },
                  {
                    lessonID: 20,
                    date: "08/06/2025",
                    canceled: true,
                    time: "10:00-12:00",
                    hasParticipants: false,
                  }
           
                
              ]
        
            },
        
            {
              teachingID:203,
              selectedResort:"Parnassou",
              selectedSport:"Ski",
              selectedDateStart:"24/05/2025",
              selectedDateEnd:"27/05/2025",
              selectedDays:["Monday","Tuesday","Wednesday"],
              timeStart:"07:20",
              timeEnd:"12:30",
              isLessonAllDay:"false",
              selectedLessonType:"group",
              selectedMaxParticipants:"2 members",
              meetingPoint:"after_agreement",
              hourCost:"202",
              groupName:"group name",
              lessons:[
                {
                  lessonID: 1,
                  date: "20/05/2025",
                  canceled: false,
                  time: "10:00-12:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 2,
                  date: "21/05/2025",
                  canceled: true,
                  time: "11:00-13:00",
                  hasParticipants: false,
                },
                {
                  lessonID: 3,
                  date: "22/05/2025",
                  canceled: false,
                  time: "09:00-11:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 4,
                  date: "23/05/2025",
                  canceled: false,
                  time: "14:00-16:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 5,
                  date: "24/05/2025",
                  canceled: true,
                  time: "10:20-12:20",
                  hasParticipants: true,
                },
                {
                  lessonID: 6,
                  date: "25/05/2025",
                  canceled: false,
                  time: "08:30-10:30",
                  hasParticipants: false,
                },
                {
                  lessonID: 7,
                  date: "26/05/2025",
                  canceled: false,
                  time: "15:00-17:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 8,
                  date: "27/05/2025",
                  canceled: true,
                  time: "13:00-15:00",
                  hasParticipants: false,
                },
                {
                  lessonID: 9,
                  date: "28/05/2025",
                  canceled: false,
                  time: "12:00-14:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 10,
                  date: "29/05/2025",
                  canceled: false,
                  time: "10:00-12:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 11,
                  date: "30/05/2025",
                  canceled: true,
                  time: "09:00-11:00",
                  hasParticipants: false,
                },
                {
                  lessonID: 12,
                  date: "31/05/2025",
                  canceled: false,
                  time: "10:20-12:20",
                  hasParticipants: true,
                },
                {
                  lessonID: 13,
                  date: "01/06/2025",
                  canceled: false,
                  time: "10:20-12:20",
                  hasParticipants: true,
                },
                {
                  lessonID: 14,
                  date: "02/06/2025",
                  canceled: true,
                  time: "11:00-13:00",
                  hasParticipants: false,
                },
                {
                  lessonID: 15,
                  date: "03/06/2025",
                  canceled: false,
                  time: "12:30-14:30",
                  hasParticipants: true,
                },
                {
                  lessonID: 16,
                  date: "04/06/2025",
                  canceled: false,
                  time: "08:00-10:00",
                  hasParticipants: true,
                },
                {
                  lessonID: 17,
                  date: "05/06/2025",
                  canceled: true,
                  time: "14:00-16:00",
                  hasParticipants: false,
                },
                {
                  lessonID: 18,
                  date: "06/06/2025",
                  canceled: false,
                  time: "13:30-15:30",
                  hasParticipants: true,
                },
                {
                  lessonID: 19,
                  date: "07/06/2025",
                  canceled: false,
                  time: "09:30-11:30",
                  hasParticipants: true,
                },
                {
                  lessonID: 20,
                  date: "08/06/2025",
                  canceled: true,
                  time: "10:00-12:00",
                  hasParticipants: false,
                }
         
              
            ]
        
            }
        ]
        
        const profileParamsAreFilled=true
        
        res.json({meetingPoints,existingTeachings,profileParamsAreFilled})
    }
    catch(error){
        next(error)
    }
}

async function cancelInstructorLessons(req,res,next){
    try{
        const {lessonIDsArray}= req.body


        // cancelLessons_success, cancelLessons_failure
      
      
        res.json({message:"cancelLessons_success"})
    }
    catch(error){
        next(error)
    }
}

async function updateTeaching(req,res,next){
    try{
        const {meetingPointId,teachingID} =req.body


        // console.log("!$#!#$ ",meetingPointId,teachingID)

        // updateTeaching_success, updateTeaching_failure

        res.json({message:"updateTeaching_success"})
    }
    catch(error){
        next(error)
    }
}

async function createTeaching(req,res,next){
    try{
        const {selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay} =req.body


        //islessonallday is string
        // console.log("#### ",selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay)
      
        // createTeaching_success, createTeaching_failure
      
        res.json({message:"createTeaching_failure"})
    }
    catch(error){
        next(error)
    }
}

async function updateMeetingPoint(req,res,next){
    try{
        const { meetingPointId,resort,text,updateField } = req.body; // Access request body

        // await new Promise(resolve => setTimeout(resolve, 5000));
      
        if(updateField=="resortName"){
          // console.log("resortName")
      
        }
        else if(updateField=="resort_text"){
          // console.log("resort_text")
        }
      
        // updateMeetingPoint_success, updateMeetingPoint_failure
      
        res.json({message:"updateMeetingPoint_success"})
    }
    catch(error){
        next(error)
    }
}

async function deleteMeetingPoint(req,res,next){
    try{
        const { meetingPointId } = req.body; 


        //deleteMeetingPoint_success, deleteMeetingPoint_failure
      
      
        res.json({message:"deleteMeetingPoint_failure"})
    }
    catch(error){
        next(error)
    }
}

async function createMeetingPoint(req,res,next){
    try{
        // createMeetingPoint_success, api/updateMeetingPoint

        res.json({message:"createMeetingPoint_success"})
    }
    catch(error){
        next(error)
    }
}


export {getInstructorProfileParams,updateInstructorInfo,getMonthStatistics,getGeneralStatistics,updateNote,getInstructorSchedule,
getTeachings,cancelInstructorLessons,updateTeaching,createTeaching,updateMeetingPoint,deleteMeetingPoint,createMeetingPoint}