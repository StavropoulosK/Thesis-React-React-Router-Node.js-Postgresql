import "./bookLesson.css"
import { useTranslation } from "react-i18next";
import {useState,useRef} from "react"
import {redirect,useLoaderData,useSearchParams } from "react-router-dom"

import { Calendar } from "../root/choseLessonParams";
import Dropdown from "../../reusableComponents/dropdown/dropdown";
import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"


import TopBar from "../../reusableComponents/topBar/TopBar";

import { Reviews } from "../../reusableComponents/reviews/reviews";

// oxi kritikes. 


export async function bookLessonLoader({request,params}) {
    const url = new URL(request.url);
    const resort = url.searchParams.get("resort");
    const sport = url.searchParams.get("sport");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const members = url.searchParams.get("members");

    // private, group or undefined
    const lessonType = url.searchParams.get("lessonType");

    // morning,noon,all day or undefined 
    const time = url.searchParams.get("time");

    // priceHighToLow, priceLowToHigh, Reviews , undefined (which is the same as Reviews)
    const orderBy= url.searchParams.get("orderBy");

    const instructorName= url.searchParams.get("instructorName");

    const pageNumber= url.searchParams.get("pageNumber") || 1;

    // console.log("###### ",    lessonType,time,orderBy,instructorName,pageNumber)
    console.log("########loader")


    if(!resort || !sport || !from || !to || !members){

        return redirect("/")
    }

    const nextReviewPage=url.searchParams.get("nextReviewPage")

    const reviewsPage = nextReviewPage|| 1;
    

    const reviewDataPromise =   fetch('/api/reviews/bookLesson', {
                                    method: 'POST',
                                    headers: {
                                    'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({resort,sport,from,to,members,reviewsPage})
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`An error happened! Status: ${response.status}`);
                                    }
                                    return response.json(); 
                                })
                                .catch(error => {
                                    console.error('Error fetching reviews:', error);
                                    throw error;
                                })

    
    ////////////////////////////////////////////////////////////////////////////////////////////////////   Na bebeotho oti einai true mono otan alazi to review page
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  exo 2 fetchers. auto na leitourgi mono gia ton ena

    if(nextReviewPage){
    // reviews fetcher called the loader
        return {
            reviewDataPromise,
        };

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

        
    }
    catch (error) {
        console.error('Error in custom loader:', error);
        throw error;
    }


    return {
        reviewDataPromise,
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

    const lessons= (useLoaderData()).lessons.instructorLessons

    const maxPages=(useLoaderData()).lessons.maxPages

    //lessonType,time,orderBy,instructorName,pageNumber
    const params= useLoaderData().params

    const [instructorName, setInstructorName]= useState(params.instructorName)

    const inputRef = useRef();

    const focusInput = () => {
        // on input focus place cursor at the end of the text.

        const input = inputRef.current;
        if (input) {
        input.focus();
        // Move cursor to the end of the text
        const length = input.value.length;
        input.setSelectionRange(length, length);
        }
    };

    console.log("!!! ",params.resort,t(params.resort))


    return(
        <>
            <TopBar completed={2}/>
            <Menu resetInstructorName={()=>setInstructorName("")}></Menu>
            <div className="belowMenu">
                    <div className="textContainer">
                        Μαθήματα {t(`bookLesson:${params.sport}`)} στο χιονοδρομικό κέντρο <br></br>
                        <p><b>{t(`choseLessonParams:${params.resort}`)}</b></p>
                    </div>

                    <label htmlFor="searchInput" className="search" onClick={focusInput}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.553 15.553a7.06 7.06 0 1 0-9.985-9.985a7.06 7.06 0 0 0 9.985 9.985m0 0L20 20"/></svg>
                        <input ref={inputRef} placeholder="Αναζήτηση" type="text" id="searchInput" value={instructorName?instructorName:""}  onChange={ev => setInstructorName(ev.target.value)}/>
                    </label>

                    
    
            </div>



            <section className="allLessonContainer">

                {lessons.map( (lesson,index) => {
                    return <Lesson key={index} instructorLesson={lesson}/>

                    })
                }
            </section>
            <Reviews></Reviews>
        </>
    )
}


function Menu({resetInstructorName}){
    // const [arrivalDate, setArrivalDate] = useState(null);
    // const [departureDate, setDepartureDate] = useState(null);

    //lessonType,time,orderBy,instructorName,pageNumber

    const params= useLoaderData().params

  
    const [selectedNumberOfParticipants,setSelectedNumberOfParticipants]=useState(params.members)
    const [selectedActivity,setSelectedActivity]=useState(params.sport)
    const [selectedResort,setSelectedResort]=useState(params.resort)

    
    const [lessonType,setLessonType]=useState(params.lessonType)
    const [time,setTime]=useState(params.time)
    const [orderBy,setOrderBy]=useState(params.orderBy)
    const [pageNumber,setPageNumber]=useState(params.pageNumber)

    const [searchParams, setSearchParams] = useSearchParams();


    console.log('#### ',lessonType,time,orderBy)


    return(
        <section className="lessonMenu">
            <div className="top">
                <h4>Επιλογές</h4>
                <div className="necessaryFilters">
                    <Dropdown className="small" namespace={"choseLessonParams"} selected={selectedResort} setSelected={setSelectedResort} options={["Aniliou", "Vasilitsas", "Velouhiou", "Elatochoriou", "Kaimaktsalan", "Kalavryton", "Mainalou", "Parnassou", "Piliou", "Pisoderiou", "Falakrou", "3-5 Pigadia"]} text={"Resort"} icon={"/icons/lessonParams/pinIcon.png"}/>
                    <CalendarContainer className="big"/>
                    <Dropdown className="small" namespace={"choseLessonParams"} selected={selectedActivity} setSelected={setSelectedActivity} options={["Ski","Snowboard","Sit ski"]} text={"Sport"} icon={"/icons/lessonParams/ski.png"} />
                    <Dropdown className="small" namespace={"choseLessonParams"} selected={selectedNumberOfParticipants} setSelected={setSelectedNumberOfParticipants} options={["1 member","2 members","3 members","4 members","5 members","6 members"]} text={"Participant number"} icon={"/icons/lessonParams/numberOfParticipants.png"}/>

                </div>
            </div>

            <div className="secondaryFilters">
                        <div className="filterContainer">
                            <button className={`circle ${lessonType=="private"?"selected":""}`} onClick={()=>{
                                setLessonType(lessonType!="private"?"private":"")
                                setSearchParams((prev) => {
                                    const params = new URLSearchParams(prev);
                                    params.set("filter", "temp"); // Add or update 'filter'
                                    return params;
                                  });                                }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><circle cx="8" cy="6" r="3.25"/><path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/></g></svg>
                            </button>
                            <span>Ιδιωτικό </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${lessonType=="group"?"selected":""}`} onClick={()=>setLessonType(lessonType!="group"?"group":"")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path strokeLinejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg> 
                            </button>
                            <span>Ομαδικό </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="morning"?"selected":""}`} onClick={()=>setTime(time!="morning"?"morning":"")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path fill="currentColor" d="M32 768h960a32 32 0 1 1 0 64H32a32 32 0 1 1 0-64m129.408-96a352 352 0 0 1 701.184 0h-64.32a288 288 0 0 0-572.544 0zM512 128a32 32 0 0 1 32 32v96a32 32 0 0 1-64 0v-96a32 32 0 0 1 32-32m407.296 168.704a32 32 0 0 1 0 45.248l-67.84 67.84a32 32 0 1 1-45.248-45.248l67.84-67.84a32 32 0 0 1 45.248 0m-814.592 0a32 32 0 0 1 45.248 0l67.84 67.84a32 32 0 1 1-45.248 45.248l-67.84-67.84a32 32 0 0 1 0-45.248"/></svg>                            
                            </button>
                            <span>Πρωί </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="noon"?"selected":""}`} onClick={()=>setTime(time!="noon"?"noon":"")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 11a3 3 0 1 1 0-6a3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8a4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>                            
                            </button>
                            <span>Μεσημέρι </span>
                        </div>

                        <div className="filterContainer">
                            <button className={`circle ${time=="allDay"?"selected":""}`} onClick={()=>setTime(time!="allDay"?"allDay":"")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="8.5"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l2.8 2.8"/></g></svg>                            
                            </button>
                            <span>Όλη μέρα </span>
                        </div>

                        <div className="right">
                            <button className="cancelBtn" onClick={()=>{setTime("");setLessonType("");resetInstructorName()}}>
                                <img src="/icons/startPage/close.png"/>
                                Ακύρωση φίλτρων
                            </button>


                            <Dropdown className="small" namespace={"bookLesson"} text="Order by" selected={orderBy} setSelected={setOrderBy} options={["Best reviews", "Price Low to High", "Price High to Low"]} icon={"/icons/bookLesson/orderBy.png"}/>

                        </div>                                                                                                                                             



            </div>

        </section>
    )
}


function Lesson({instructorLesson}){

    // const instructorLesson = 
    //     {
    //       instructorName: "Alice Johnson",
    //       reviewScore: "4.8",
    //       reviewCount: 120,
    //       experience: "12",
    //       languages: ["English", "French"],
    //       typeOfLesson: "private",
    //       description: "Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels Patient and skilled instructor for all levels.",
    //       image: "/images/startPage/Ski.jpg",
    //       instructorId: "inst_1001",
    //       minPricePerDay: 150,
    //       minPricePerHour: "35"
    //     }

        
    const languagesText = instructorLesson.languages.map( (language,i) => i< instructorLesson.languages.length-1? `${language} and `: language )


      return(
        <>
            <article className="lessonContainer">
                <img src={instructorLesson.image}></img>
                <div className="infoContainer">
                    <div className="top">
                        <h4>{instructorLesson.instructorName}</h4>
                        <span>
                            <img src="/icons/startPage/fullStar.png" alt="Star" className="star"/>
                            {instructorLesson.reviewScore} ({instructorLesson.reviewCount} κριτικές)
                            
                        </span> 
                        {instructorLesson.typeOfLesson=="group" && <h4 className="groupName"> {instructorLesson.groupName }</h4>}
                        {/* {instructorLesson && <h4 className="groupName"> {instructorLesson.instructorName }</h4>} */}


                    </div>
                    <div className="attributes">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 15 15"><path fill="currentColor" d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4c0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7c0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1m0 1.5L10.8 8H10L8.5 6.5L7.5 8l-1-1.5L5 8h-.9z"/></svg>
                            <span> {instructorLesson.experience} χρόνια εμπειρίας </span>
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
                                    "Ιδιωτικό μάθημα":
                                    `Ομαδικό μάθημα ${instructorLesson.reservedSports}` 

                                }

                            </span>
                        </div>

                        <div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m5-9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-2 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M9 9h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2"/></svg>
                            <span> Μιλάω {languagesText} </span>


                        </div>

                    </div>

                    <div className="description">

                        <p>{instructorLesson.description}</p>
                    </div>

                </div>
                <div className="right">
                        <span>Από <b>{instructorLesson.minPricePerHour}€/ώρα </b></span>
                        <span>Από <b>{instructorLesson.minPricePerDay}€/μέρα </b></span>
                        <button>Προβολή μαθημάτων</button>
                        <button>Προβολή προφίλ</button>

                </div>
            </article>
        
        </>


      )
    
    
      

}


function CalendarContainer(){
    const params= useLoaderData().params 

    const [arrivalDay, arrivalMonth, arrivalYear] = params.from.split("-").map(Number);

    const arrival = new Date(arrivalYear, arrivalMonth - 1, arrivalDay);

    const [departureDay, departureMonth, departureYear] = params.from.split("-").map(Number);

    const departure = new Date(departureYear, departureMonth - 1, departureDay);

    const [arrivalDate,setArrivalDate] = useState(arrival)
    const [departureDate, setDepartureDate] = useState(departure);

  
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


    return(
        <>
            <div className="dropdown calendar" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button" type="button">
                    <img src={"/icons/lessonParams/calendar.png"} />
                    {(arrivalDate&&departureDate)?`${formatDate(arrivalDate)} - ${formatDate(departureDate)}`:t("Date")}
                </button>

                {isOpen && <Calendar onclose={()=>setIsOpen(false)} arrivalDate={arrivalDate} setArrivalDate={setArrivalDate} departureDate={departureDate} setDepartureDate={setDepartureDate}/>}
                {/* <input
                  type="hidden"
                  name="arrivalDate"
                  value={arrivalDate ? formatDate(arrivalDate) : ""}
                />
                <input
                  type="hidden"
                  name="departureDate"
                  value={departureDate ? formatDate(departureDate) : ""}
                /> */}
            </div>
        </>
    )
}


