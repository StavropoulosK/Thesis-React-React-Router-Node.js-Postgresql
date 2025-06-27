import "./instructorSchedule.css"
import "../root/calendar.css"

import { useTranslation } from "react-i18next";
import {useLoaderData,redirect,useFetcher } from "react-router-dom"
import {useState,useRef} from "react"
import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"
import { EnlargeImgButton } from "../../reusableComponents/lessonDetails/lessonDetails.jsx";
import ShowMessageScreen from "../../reusableComponents/showMessageScreen/showMessageScreen.jsx";
import NoteForm from "../../reusableComponents/noteForm/noteForm.jsx";


const getFormattedDate=(givenDay)=>{
  const day = String(givenDay.getDate()).padStart(2, '0');
  const month = String(givenDay.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = givenDay.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate
}

export async function instructorScheduleLoader({request,params}){
    let data        
    const today = new Date();


    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");
  
    const formattedDate = dateParam ?? getFormattedDate(today);


    // console.log("#### ",formattedDate)

    try {
        // const response = await fetch('/api/getGeneralStatistics')

        const response = await fetch(`/api/getInstructorSchedule/${encodeURIComponent(formattedDate)}`);
    if (!response.ok) {
        // user is not logged in
        const params = new URLSearchParams(window.location.search);
        const newParams=new URLSearchParams()
        newParams.set("fromPage", window.location.pathname+"?"+params.toString());
        
        return redirect("/login?" + newParams.toString());
    }

    data = await response.json();

    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return data

}


export async function updateNoteAction({request,params}){
    const formData = await request.formData();

    const note = formData.get("note");
    const lessonID= formData.get("lessonID")
    
    let message

    try {

        const response = await fetch('/api/updateNote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              note,lessonID
            })
          });
    
        if (!response.ok) {
            // user is not logged in
            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }

        message = (await response.json()).message;
    }
    catch (error) {
        console.error('Error connecting to server', error);
        return {message:"note_failure"}
    }

    return {message}

}


export function InstructorSchedule(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visibleNoteForm,setVisibleNoteForm]=useState(false)
    const {t} = useTranslation("instructorSchedule")


    const noteRef=useRef({note:"",lessonID:""})

    const fetcherNotes=useFetcher()

    const fetcherLessons= useFetcher()

    const [showFull,setShowFull]=useState(false)

    // const { lessons } = fetcherLessons?.data?.lessons ? fetcherLessons.data : useLoaderData();

    const { lessons,datesWithLessons } = fetcherLessons?.data?.lessons ? fetcherLessons.data : useLoaderData();

    return(
        <>
        
            <section className="instructorSchedule">

                <h2>{t("schedule")}</h2>
                <CalendarContainer selectedDate={selectedDate} setSelectedDate={(day)=>{setSelectedDate(day); fetcherLessons.load(`/instructorMenu/instructorSchedule?date=${encodeURIComponent(getFormattedDate(day))}`) }} datesWithLessons={datesWithLessons} showOnlySelectDates={true} />

                <h4>{t("lessons")}</h4>

                <div className="instructorLessonContainer">

                  {lessons.map((lesson,index)=>{
                    return(
                      
                      <article key={lesson.lessonID} className={`instructorLesson ${lesson.lessonCanceled?"lessonCanceled":""}`}>

                        <div className="top">

                          <div className="lessonInfo">
                              <h3>{t("lessonInfo")}</h3>

                              <div className="attributeInfoContainer">



                                  <div className="attributeInfo">
                                      <img src="/icons/lessonParams/pinIcon.png"></img>
                                      {t("resort")} {t(lesson.resort)}
                                  </div>

                                  <div className="attributeInfo">
                                    <img src="/icons/lessonParams/calendar.png"></img>
                                    {t("date")} {t(lesson.date.split(" ")[0])} {lesson.date.split(" ")[1]}
                                  </div>

                                  <div className="attributeInfo">

                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z"></path></svg>
                                    {t("time")} {lesson.time}
                                  </div>

                                  <div className="attributeInfo">
                                    <img src="/icons/lessonParams/ski.png"></img>
                                    {t("sport")} {t(lesson.sport)}

                                  </div>

                                  <div className="attributeInfo">
                                    <img className="participantsIcon" src="/icons/lessonParams/numberOfParticipants.png"></img>
                                    {t("participants")} {lesson.participants}

                                  </div>

                                  <div className="attributeInfo">
                                    {
                                      lesson.lessonType=="private"?
                                      <svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="8" cy="6" r="3.25"/><path d="M2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/></g></svg>
                                      :<svg className="typeOfLesson" xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path strokeLinejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg>
                                    } 
                                    {t("lessonType")} {t(lesson.lessonType)}

                                  </div>

                              </div>

                          </div>

                          <div className="meetingInfo">
                              <h3>{t("meeting_point")}</h3>

                              <div className="attributeInfo">
                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9 19l-5.21 1.737a.6.6 0 0 1-.79-.57V5.433a.6.6 0 0 1 .41-.569L9 3m0 16l6 2m-6-2V3m6 18l5.59-1.863a.6.6 0 0 0 .41-.57V3.832a.6.6 0 0 0-.79-.569L15 5m0 16V5m0 0L9 3"></path></svg>
                                    <span>{lesson.meetingPoint.title!="after_agreement"?lesson.meetingPoint.title:t("after_agreement")} </span>
                                    <EnlargeImgButton showFull={showFull} setShowFull={setShowFull} picture={lesson.meetingPoint.picture}/>
                              </div>
                          </div>

                        </div>

                        <div className="studentInformation">
                            <h3>{t("student_info")}</h3>

                            <div className="studentInfoContainer">

                                {
                                  lesson.studentInfos?.map((studentInfo,index)=>{

                                    return(
                                    
                                      <div className={`studentInfo ${studentInfo.studentCanceled?'canceled':""}`} key={index} >
                                          <img src={studentInfo.profilePicture!=null?studentInfo.profilePicture:"/images/startPage/imageIcon.png"}></img>

                                          <div className="studentAttributeContainer">
                                              <div className="studentAttribute">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21"></path></g></svg>
                                                <span>{studentInfo.name} </span>
                                              </div>

                                              <div className="studentAttribute">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1607 1213q44 0 84 16t72 48l220 220q31 31 47 71t17 85q0 44-16 84t-48 72l-14 14q-54 54-99 96t-94 70t-109 44t-143 15q-125 0-257-39t-262-108t-256-164t-237-207t-206-238t-162-256T38 775T0 523q0-83 14-142t43-108t70-93t96-99l16-16q31-31 71-48t85-17q44 0 84 17t72 48l220 220q31 31 47 71t17 85q0 44-15 78t-37 63t-48 51t-49 45t-37 44t-15 49q0 38 27 65l551 551q27 27 65 27q26 0 48-15t45-37t45-48t51-49t62-37t79-15m-83 707q72 0 120-13t88-39t76-64t85-86q27-27 27-65q0-18-14-42t-38-52t-51-55t-56-54t-51-47t-37-35q-27-27-66-27q-26 0-48 15t-44 37t-45 48t-52 49t-62 37t-79 15q-44 0-84-16t-72-48L570 927q-31-31-47-71t-17-85q0-44 15-78t37-63t48-51t49-46t37-44t15-48q0-39-27-66q-13-13-34-36t-47-51t-54-56t-56-52t-51-37t-43-15q-38 0-65 27l-85 85q-37 37-64 76t-40 87t-14 120q0 112 36 231t101 238t153 234t192 219t219 190t234 150t236 99t226 36"/></svg>
                                                <span>{studentInfo.phone} </span>

                                              </div>

                                              <div className="studentAttribute">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-.67 2L12 10.75L5.67 6ZM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2a1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1"></path></svg>                                            
                                                
                                                
                                                <span>{studentInfo.email} </span>
                                              </div>

                                              <div className="studentAttribute">
                                                  <img src="/icons/showLessons/level.png">

                                                  </img>
                                                  <span>{t(studentInfo.level)} </span> 
                                              </div>

                                              <div className="studentAttribute">
                                                  <img className="participantsIcon" src="/icons/lessonParams/numberOfParticipants.png"></img>
                                                  {t("participants")} {studentInfo.participants}


                                              </div>


                                          </div>

                                      </div>
                                    )
                                  })
                                }

                            </div>

                        </div>

                        
                        <div className="noteContainer">

                            {lesson.note && <h3>{t("note")}</h3>}
                            {lesson.note}

                            <button onClick={()=>{setVisibleNoteForm(true);noteRef.current.note=lesson.note;noteRef.current.lessonID=lesson.lessonID}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V9h14zM5 7V5h14v2zm2 4h10v2H7zm0 4h7v2H7z"></path></svg>
                              <span>{t("add_note")}</span>
                            </button>

                        </div>
                        {/* {onClose,note,lessonID,fetcher} */}
                        
                      </article>
                      
                    )}
                  )}


                </div>

              { visibleNoteForm && <NoteForm note={noteRef.current.note} lessonID={noteRef.current.lessonID} onClose={()=>setVisibleNoteForm(false)} fetcher={fetcherNotes}></NoteForm> }
              <ShowMessageScreen namespace="instructorSchedule" fetcher={fetcherNotes}></ShowMessageScreen>



            </section>
        </>
    )
}

export function CalendarContainer({selectedDate,setSelectedDate,datesWithLessons=[],showOnlySelectDates=false}){
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
                    {selectedDate?formatDate(selectedDate):t("selectDate")}
                </button>

                {isOpen && <CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate}  onSelect={()=>setIsOpen(false)} datesWithLessons={datesWithLessons} showOnlySelectDates={showOnlySelectDates}/>}
            </div>
        </>
    )
}


function hasDateAvailableLessons(date, datesWithLessons) {

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  const formatted = `${year}/${month}/${day}`;

  return datesWithLessons.includes(formatted);
}



function CalendarGrid({selectedDate,setSelectedDate,onSelect,datesWithLessons,showOnlySelectDates}) {
    const today = new Date();
    const { t, i18n } = useTranslation('choseLessonParams');
    const currentLanguage = i18n.language;
  
    const [currentDate, setCurrentDate] = useState(new Date());



  
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const startDay = (start.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const totalDaysInMonth = end.getDate();
    const totalCellsBeforeNextMonth = startDay + totalDaysInMonth;
    const daysInLastWeek = totalCellsBeforeNextMonth % 7;
    const remainingDays = daysInLastWeek === 0 ? 0 : 7 - daysInLastWeek;

    const days = [];

    for (let i = 0; i < totalCellsBeforeNextMonth; i++) {
    const day = new Date(start);
    day.setDate(day.getDate() - startDay + i);
    days.push(day);
    }

    // Add trailing days from next month to complete final row
    for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(end);
    day.setDate(end.getDate() + i);
    days.push(day);
    }
  
    const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
  
    const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
  
    const onDateClick = (day) => {
      setSelectedDate(day);
    };
  
    const isSelected = (day) => {
      return (
        selectedDate &&
        day.getDate() === selectedDate.getDate() &&
        day.getMonth() === selectedDate.getMonth() &&
        day.getFullYear() === selectedDate.getFullYear()
      );
    };
  
    return (
      <div className="calendar-grid-wrapper">
        <div className="calendarTop">
          <button
            onClick={prevMonth}
            className="calendar-btn"
            type="button"
            disabled={
              currentDate.getFullYear() === today.getFullYear() &&
              currentDate.getMonth() === today.getMonth()
            }
          >
            ◀
          </button>
          <h4 className="calendar-title">
            {currentDate.toLocaleString(currentLanguage, { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={nextMonth}
            className="calendar-btn"
            type="button"
            disabled={
              currentDate.getFullYear() === today.getFullYear() + 1 &&
              currentDate.getMonth() === today.getMonth()
            }
          >
            ▶
          </button>
        </div>
  
        <div className="calendar-days">
          {[t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday'), t('Sunday')].map((day) => (
            <div key={day}>
              <div className="desktop calendar-day-label">{day}</div>
              <div className="mobile calendar-day-label">{day[0]}</div>
            </div>
          ))}
        </div>
  
        <div className="calendar-grid">
          {days.map((day, index) => {
            const isOutsideMonth = day.getMonth() !== currentDate.getMonth();
            const isBeforeToday =
              day.toDateString() === today.toDateString()
                ? false
                : day < today && !isOutsideMonth;

            let hasAvailableLessons=true
            if(showOnlySelectDates){
              hasAvailableLessons= hasDateAvailableLessons(day,datesWithLessons)
            }

  
            return (
              <div
                key={index}
                onClick={!isOutsideMonth && !isBeforeToday && hasAvailableLessons ? () => { onDateClick(day); onSelect()} : null}
                className={`calendar-day 
                  ${isOutsideMonth ? 'calendar-day-outside' : ''}
                  ${isBeforeToday ? 'calendar-day-before' : ''}
                  ${isSelected(day) ? 'calendar-day-selected' : ''}
                  ${(!hasAvailableLessons && !isBeforeToday && !isOutsideMonth) ? "calendar-day-before" : ""} 

                `}
              >
                <span>{day.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }