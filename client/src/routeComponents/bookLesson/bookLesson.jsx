import "./bookLesson.css"
import { useTranslation } from "react-i18next";
import {useState,useRef,useEffect,memo,useCallback} from "react"
import {redirect,useLoaderData,useSearchParams,useNavigation} from "react-router-dom"

import { Calendar } from "../root/choseLessonParams";
import Dropdown from "../../reusableComponents/dropdown/dropdown";
import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"


import TopBar from "../../reusableComponents/topBar/TopBar";

import { Reviews } from "../../reusableComponents/reviews/reviews.jsx";

import { PageNavigation } from "../../reusableComponents/pageNavigation/pageNavigation";

import ShowLessons from "./showLessons.jsx";

function updateIfPastDate(dateStr) {

    //checks if a past date has been given from the url

    const [day, month, year] = dateStr.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (inputDate < today) {
      const todayStr = today.toLocaleDateString("en-GB").replaceAll('/', '-') 
      return todayStr;
    }
  
    return dateStr;
  }


export async function bookLessonLoader({request,params}) {


    const url = new URL(request.url);
    const resort = url.searchParams.get("resort");
    const sport = url.searchParams.get("sport");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const members = url.searchParams.get("members") 

    const fromCheck= updateIfPastDate(from)
    const toCheck=updateIfPastDate(to)

    if(from !=fromCheck || to!=toCheck){
        // dates have been tampered

        url.searchParams.set("from", fromCheck);
        url.searchParams.set("to", toCheck);
        return redirect(url.pathname+ url.search);

    }

    // private, group or undefined
    const lessonType = url.searchParams.get("lessonType");

    // morning,noon,all day or undefined 
    const time = url.searchParams.get("time");

    // priceHighToLow, priceLowToHigh, Review score, ( default is Review score)
    const orderBy= url.searchParams.get("orderBy")|| "Best reviews";

    const instructorName= url.searchParams.get("instructorName");

    const pageNumber= url.searchParams.get("pageNumber") || 1;

    // console.log("#### ",members,lessonType,time,orderBy,instructorName,pageNumber)


    if(!resort || !sport || !from || !to || !members){
        return redirect("/")
    }

    let lessons

    try {
        const queryParams = new URLSearchParams({
            resort,
            sport,
            from,
            to,
            members,
            lessonType,
            time,
            orderBy,
            instructorName,
            pageNumber

        });
        
        const response = await fetch(`/api/bookLesson?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Error fetching data. Status: ${response.status}`);
        }
        
        lessons = await response.json();

        const maxPages= lessons.maxPages


        if(maxPages!=0 && (pageNumber<1 || pageNumber>maxPages)){
            //redirect to page=1
            const url = new URL(request.url);
            const searchParams = url.searchParams;

            searchParams.set("pageNumber", "1");
            url.search = searchParams.toString();

            return redirect(url.pathname + url.search);

        }

        else if(maxPages==0 && pageNumber!=1  ){
            return redirect("/")
        }

        
    }
    catch (error) {
        console.error('Error in custom loader:', error);
        throw error;
    }


    return {
        lessons,
        params:{
            resort,
            sport,
            from,
            to,
            members,
            lessonType,
            time,
            orderBy,
            instructorName,
            pageNumber

        }
    };
}



export function BookLesson(){
    const { t } = useTranslation(["bookLesson", "choseLessonParams"]);

    //lessonType,time,orderBy,instructorName,pageNumber
    const params= useLoaderData().params

    const [instructorName, setInstructorName]= useState(params.instructorName)


    // it prevents the effect on SearchInput to trigger when user clicks clear filters
    const resetSearchRef=useRef(0)

    const resetInstructorName = useCallback(() => {
        setInstructorName("");
        resetSearchRef.current +=1 
    }, []);

    // instructionID is for group lessons
    const [showLessons,setShowLessons]=useState({instructorId:"",instructorName:"",resort:"",sport:"",from:"",to:"",members:"",instructionID:""})

    return(
        <>
            {showLessons.instructorId && <ShowLessons {...showLessons} onClose={()=>setShowLessons("")}/>}

            <TopBar completed={2}/> 
            <Menu resetInstructorName={resetInstructorName}></Menu>
            <div className="belowMenu">
                <div className="textContainer">
                    {t(`bookLesson:lessons_greek`)} {t(params.sport,{ ns: 'bookLesson' })} {t(`bookLesson:at_ski_resort`)} <br></br>
                    <p><b>{t(`choseLessonParams:${params.resort}`)}</b></p>
                </div>
                <SearchInput key={resetSearchRef.current} instructorName={instructorName} setInstructorName={setInstructorName} ></SearchInput>

                
    
            </div>

            <AllLessonContainer setShowLessons={setShowLessons}/>
            <Reviews></Reviews>

        </>
    )
}

function SearchInput({instructorName,setInstructorName}){
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [typing,setTyping]=useState(false)
    
    const searchInputRef = useRef();
    const { t } = useTranslation(["bookLesson"]);

    
    // it is used to prevent effect from triggering on first render
    const componentFirstRender=useRef(true)
    

    useEffect(() => {
        // when user stops typing for 1000 ms, the search filter triggers
        const handler = setTimeout(() => {

            if(componentFirstRender.current==true){
                // component has mounted
                componentFirstRender.current=false
            }
            else{
                setTyping(false)
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("instructorName", instructorName);
                    return params},{ replace: true });

            }
          
          
        }, 1000); 
    
        return () => {
          clearTimeout(handler); // Cleanup if user types again
        };
      }, [instructorName]);
    

    return(
        <>
        <label htmlFor="searchInput" className={`search ${typing?"selected":""}`}>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.553 15.553a7.06 7.06 0 1 0-9.985-9.985a7.06 7.06 0 0 0 9.985 9.985m0 0L20 20"/></svg>
            <input ref={searchInputRef} placeholder={t("Search")} type="text" id="searchInput" value={instructorName?instructorName:""}
              onChange={ev =>{
                    setTyping(true)
                    setInstructorName(ev.target.value)
                }
            }/>
        </label>
        </>
    )

}

function AllLessonContainer({setShowLessons}){

    const lessons= (useLoaderData()).lessons.instructorLessons
    const navigation = useNavigation();

    const lessonPage= parseInt(useLoaderData().params.pageNumber)
    const maxPages=parseInt((useLoaderData()).lessons.maxPages)

    const [searchParams, setSearchParams] = useSearchParams();


    const isLoading = navigation.state === "loading";


    return(
        <>
             <section className={`allLessonContainer ${isLoading?"loading":""}`}>

                {lessons.length==0 && <p style={{fontSize:"1.7rem"}}> Δεν βρέθηκαν μαθήματα με τις συγκεκριμένες επιλογές </p>}

                {lessons.length!=0 && lessons.map( (lesson,index) => {
                    return <Lesson key={index} instructorLesson={lesson} setShowLessons={setShowLessons}/>

                    })
                }
                { maxPages!=0 && <PageNavigation maxPages={maxPages} page={lessonPage} updateURL={(value)=>{
                    setSearchParams((prev) => {
                        const params = new URLSearchParams(prev);
                        params.set("pageNumber", value);
                        return params},{ replace: true });
                }}/>}

            </section>
        </>
    )
}

const Menu= memo( ({resetInstructorName})=>{
    // const [arrivalDate, setArrivalDate] = useState(null);
    // const [departureDate, setDepartureDate] = useState(null);

    //lessonType,time,orderBy,instructorName,pageNumber

    const params= useLoaderData().params

  
    const [selectedNumberOfParticipants,setSelectedNumberOfParticipants]=useState(params.members +" members")
    const [selectedActivity,setSelectedActivity]=useState(params.sport)
    const [selectedResort,setSelectedResort]=useState(params.resort)

    
    const [lessonType,setLessonType]=useState(params.lessonType)
    const [time,setTime]=useState(params.time)
    const [orderBy,setOrderBy]=useState(params.orderBy || "Best reviews")

    const [searchParams, setSearchParams] = useSearchParams();

    const { t } = useTranslation(["bookLesson"]);
    

    return(
        <section className="lessonMenu">
            <div className="top">
                <h4>{t("Filters")}</h4>
                <div className="necessaryFilters">
                    <Dropdown namespace={"choseLessonParams"} selected={selectedResort} setSelected={(value)=>{
                        if(value==selectedResort){
                            return
                        }
                        setSelectedResort(value)
                        setSearchParams((prev) => {
                            const params = new URLSearchParams(prev);
                            params.set("resort", value);
                            return params},{ replace: true });
                         
                            }
                        }
                        options={["Aniliou", "Vasilitsas", "Velouhiou", "Elatochoriou", "Kaimaktsalan", "Kalavryton", "Mainalou", "Parnassou", "Piliou", "Pisoderiou", "Falakrou", "3-5 Pigadia"]} text={"Resort"}
                        icon={"/icons/lessonParams/pinIcon.png"}
                    />

                    <CalendarContainer/>

                    <Dropdown namespace={"choseLessonParams"} selected={selectedActivity} setSelected={(value)=>{
                        if(value==selectedActivity){
                            return
                        }
                        setSelectedActivity(value)
                        setSearchParams((prev) => {
                            const params = new URLSearchParams(prev);
                            params.set("sport", value);
                            return params},{ replace: true });
                         
                            }
                        }
                        options={["Ski","Snowboard","Sit ski"]}
                        text={"Sport"}
                        icon={"/icons/lessonParams/ski.png"}
                    />
                    <Dropdown namespace={"choseLessonParams"} selected={selectedNumberOfParticipants} setSelected={(value)=>{
                        if(value==selectedNumberOfParticipants){
                            return
                        }
                        setSelectedNumberOfParticipants(value)
                        setSearchParams((prev) => {
                            const params = new URLSearchParams(prev);
                            params.set("members", value.split(" ")[0]);
                            return params},{ replace: true });
                         
                            }
                        }
                        options={["1 member","2 members","3 members","4 members","5 members","6 members"]} 
                        text={"Participant number"} 
                        icon={"/icons/lessonParams/numberOfParticipants.png"}
                    />

                </div>
            </div>

            <div className="secondaryFilters">
                        <div className="filterContainer">
                            <button className={`circle ${lessonType=="private"?"selected":""}`} onClick={()=>{
                                const newValue=lessonType!="private"?"private":""

                                setLessonType(newValue)
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    if (newValue === "") {
                                        // If the newValue is empty, remove the lessonType parameter
                                        params.delete("lessonType");
                                    }
                                    else {
                                        // Otherwise, update the lessonType parameter with the new value
                                        params.set("lessonType", newValue);
                                      }
                                    

                                    return params;
                                  },{ replace: true });     
                                
                                
                                }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><circle cx="8" cy="6" r="3.25"/><path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/></g></svg>
                            </button>
                            <span>{t("Private")} </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${lessonType=="group"?"selected":""}`} onClick={()=>{
                                const newValue=lessonType!="group"?"group":""

                                setLessonType(newValue)
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    if (newValue === "") {
                                        // If the newValue is empty, remove the lessonType parameter
                                        params.delete("lessonType");
                                    }
                                    else {
                                        // Otherwise, update the lessonType parameter with the new value
                                        params.set("lessonType", newValue);
                                      }
                                    

                                    return params;
                                  },{ replace: true });     

                                }
                            
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path strokeLinejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg> 
                            </button>
                            <span>{t("Group")} </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="morning"?"selected":""}`} onClick={()=>{
                                
                            
                                const newValue=time!="morning"?"morning":""
    
                                setTime(newValue)
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    if (newValue === "") {
                                        // If the newValue is empty, remove the lessonType parameter
                                        params.delete("time");
                                    }
                                    else {
                                        // Otherwise, update the lessonType parameter with the new value
                                        params.set("time", newValue);
                                      }
                                    

                                    return params;
                                  },{ replace: true }); 
                                }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path fill="currentColor" d="M32 768h960a32 32 0 1 1 0 64H32a32 32 0 1 1 0-64m129.408-96a352 352 0 0 1 701.184 0h-64.32a288 288 0 0 0-572.544 0zM512 128a32 32 0 0 1 32 32v96a32 32 0 0 1-64 0v-96a32 32 0 0 1 32-32m407.296 168.704a32 32 0 0 1 0 45.248l-67.84 67.84a32 32 0 1 1-45.248-45.248l67.84-67.84a32 32 0 0 1 45.248 0m-814.592 0a32 32 0 0 1 45.248 0l67.84 67.84a32 32 0 1 1-45.248 45.248l-67.84-67.84a32 32 0 0 1 0-45.248"/></svg>                            
                            </button>
                            <span>{t("Morning")} </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="noon"?"selected":""}`} onClick={()=>{

                                const newValue=time!="noon"?"noon":""

                                setTime(newValue)
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    if (newValue === "") {
                                        // If the newValue is empty, remove the lessonType parameter
                                        params.delete("time");
                                    }
                                    else {
                                        // Otherwise, update the lessonType parameter with the new value
                                        params.set("time", newValue);
                                      }
                                    

                                    return params;
                                  },{ replace: true }); 

                                }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 11a3 3 0 1 1 0-6a3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8a4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>                            
                            </button>
                            <span>{t("Noon")} </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="allDay"?"selected":""}`} onClick={()=>{
                                const newValue=time!="allDay"?"allDay":""

                                setTime(newValue)
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    if (newValue === "") {
                                        // If the newValue is empty, remove the lessonType parameter
                                        params.delete("time");
                                    }
                                    else {
                                        // Otherwise, update the lessonType parameter with the new value
                                        params.set("time", newValue);
                                      }
                                    

                                    return params;
                                  },{ replace: true }); 
                                }
                                
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="8.5"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l2.8 2.8"/></g></svg>                            
                            </button>
                            <span>{t("All day")} </span>
                        </div>

                        <div className="right">
                            <CancelBtn setTime={setTime} setLessonType={setLessonType} resetInstructorName={resetInstructorName}/>

                            <Dropdown namespace={"bookLesson"} text="Order by" selected={orderBy}
                                setSelected={(value)=>{
                                    if(value==orderBy){
                                        return
                                    }
                                    setOrderBy(value)
                                    setSearchParams((prev) => {
                                        const params = new URLSearchParams(prev);
                                        params.set("orderBy", value);

                                        
    
                                        return params;
                                      },{ replace: true }); 

                                }} 
                                options={[t("Best reviews"), t("Price Low to High"), t("Price High to Low")]} 
                                icon={"/icons/bookLesson/orderBy.png"}
                            />

                        </div>                                                                                                                                             



            </div>

        </section>
    )
})

function CancelBtn({setTime,setLessonType,resetInstructorName}){
    const [searchParams, setSearchParams] = useSearchParams();
    const [clicked,setClicked] = useState(false)
    const timeoutRef = useRef(null);

    const { t } = useTranslation(["bookLesson"]);


    function handleTime(){
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
    
          // Set a new timeout and store its ID
          timeoutRef.current = setTimeout(() => {
            setClicked(false)
          }, 350);
    }
    


    return(
    <>
        <button className={`cancelBtn ${clicked?"clicked":""}`}
         onClick={()=>{
                setClicked(true)
                handleTime()

                setTime("");
                setLessonType("")
                resetInstructorName();
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.delete("time");
                    params.delete("lessonType");
                    params.delete("instructorName")
                    return params;

                },{ replace: true })
                
            }
                
            }>
                {/* <img src="/icons/startPage/close.png"/> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"/></svg>
                {t("Clear filters")}
        </button>

    </>)

}


function Lesson({instructorLesson,setShowLessons}){

    const { t } = useTranslation(["bookLesson"]);


    const languages = instructorLesson.languages;

    const params= useLoaderData().params

  
    const members=params.members
    const sport=params.sport
    const resort=params.resort
    const from=params.from
    const to=params.to
    const instructorId=instructorLesson.instructorId
    const instructorName=instructorLesson.instructorName

    // only group lessons have instructionID
    const instructionID= instructorLesson.instructionID?instructorLesson.instructionID:""

    
    let languagesText = "";

    if (languages.length === 1) {
        languagesText = t(languages[0]);
    } else if (languages.length === 2) {
        languagesText = `${t(languages[0])} ${t("and")} ${t(languages[1])}`;
    } else {
        const firstLanguages = languages.slice(0, -2).map(lang => t(lang))

        const lastTwo = `${t(languages[languages.length - 2])} ${t("and")} ${t(languages[languages.length - 1])}`;

        languagesText = firstLanguages
            ? `${firstLanguages}, ${lastTwo}`
            : lastTwo;
    }

      return(
        <>
            <article className="lessonContainer">
                <img src={instructorLesson.image}></img>
                <div className="infoContainer">
                    <div className="top">
                        <h4>{instructorLesson.instructorName}</h4>
                        <span>
                            <img src="/icons/startPage/fullStar.png" alt="Star" className="star"/>
                            {instructorLesson.reviewScore} ({instructorLesson.reviewCount} {t('review', { count: instructorLesson.reviewCount })})
                            
                        </span> 
                        {instructorLesson.typeOfLesson=="group" && <h4 className="groupName"> {instructorLesson.groupName }</h4>}
                        {/* {instructorLesson && <h4 className="groupName"> {instructorLesson.instructorName }</h4>} */}


                    </div>
                    <div className="attributes">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 15 15"><path fill="currentColor" d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4c0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7c0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1m0 1.5L10.8 8H10L8.5 6.5L7.5 8l-1-1.5L5 8h-.9z"/></svg>
                            <span> {instructorLesson.experience} {t('experience', { count: parseInt( instructorLesson.experience) })} </span>
                        </div>

                        <div>
                            {
                                instructorLesson.typeOfLesson=="private"?
                                <svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="8" cy="6" r="3.25"/><path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/></g></svg>
                                :<svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path strokeLinejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg>
                            }

                            <span>
                                {
                                    instructorLesson.typeOfLesson=="private"?
                                    t("Private lesson"):
                                    `${t("Group lesson")}` 

                                }

                            </span>
                        </div>

                        <div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m5-9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-2 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M9 9h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"/></svg>
                            <span> {t("I speak")} {languagesText} </span>


                        </div>

                    </div>

                    <div className="description">

                        <p>{instructorLesson.description}</p>
                    </div>

                </div>
                <div className="right">
                        <span>{t("from")} <b>{instructorLesson.minPricePerHour}€/{t("hour")} </b></span>
                        <span>{t("from")} <b>{instructorLesson.minPricePerDay}€/{t("day")} </b></span>
                        <button onClick={()=>{
                            setShowLessons(
                                {resort,sport,from,to,members,instructorId,instructorName,instructionID}
                            )}
                        }
                        >
                            {t("View lessons")}
                        </button>
                        <button>{t("View profile")}</button>

                </div>
            </article>
        
        </>


      )
    
    
      

}


function CalendarContainer(){
    const params= useLoaderData().params 

    const [arrivalDay, arrivalMonth, arrivalYear] = params.from.split("-").map(Number);

    const arrival = new Date(arrivalYear, arrivalMonth - 1, arrivalDay);

    const [departureDay, departureMonth, departureYear] = params.to.split("-").map(Number);

    const departure = new Date(departureYear, departureMonth - 1, departureDay);

    const [arrivalDate,setArrivalDate] = useState(arrival)
    const [departureDate, setDepartureDate] = useState(departure);
    const [searchParams, setSearchParams] = useSearchParams();

  
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const {t} = useTranslation("choseLessonParams")



    useCloseOnOutsideClick(dropdownRef, () => setIsOpen(false));

    const formatDate = (date) => {

      if (!date) return "";
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatDateForURL = (date) => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Using hyphen format
      };
    

    return(
        <>
            <div className="dropdown calendar" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className={`dropdown-button ${isOpen?"selected":""}`} type="button">
                    <img src={"/icons/lessonParams/calendar.png"} />
                    {(arrivalDate&&departureDate)?`${formatDate(arrivalDate)} - ${formatDate(departureDate)}`:t("Date")}
                </button>

                {isOpen &&
                 <Calendar
                    onclose={()=>setIsOpen(false)} 
                    arrivalDate={arrivalDate} 
                    setArrivalDate={setArrivalDate} 
                    departureDate={departureDate} 
                    setDepartureDate={setDepartureDate} 
                    onOk={()=>{
                            setIsOpen(false)
                            if(arrivalDate&&departureDate){

                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    params.set("from", formatDateForURL(arrivalDate));
                                    params.set("to", formatDateForURL(departureDate));
                     
                                    return params},{ replace: true });

                            }
                        }
                    }
                 />}
               
            </div>
        </>
    )
}
