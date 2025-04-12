import "./choseLessonParams.css"
import "./calendar.css"


import { Form,useNavigate } from "react-router-dom";
import { useState, useRef } from "react";


import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"
import Dropdown from "./../../reusableComponents/dropdown/dropdown.jsx"

import { useTranslation } from "react-i18next";



export default function ChoseLessonParams({onReservationClick,selectedSport,cancelSelectedSport}){

    const {t} = useTranslation("choseLessonParams")


    return(
        <>
        <section className="blackBackground">
            <article className="choseLessonParams">
                    <article className="illustrationContainer">
                        <img className="illustration" src="/illustrations/snowboarding.png" ></img>
                    </article>

                    <article className="lessonParams">
                        <button className="close" onClick={()=>{
                            onReservationClick()
                            cancelSelectedSport()
                        }}>
                            <img src="/icons/startPage/close.png"/>
                        </button>
                        <h2>
                            {t("header")}
                        </h2>
                        <p>
                          {t("message")}
                        </p>

                        <LessonParamsForm selectedSport={selectedSport} onReservationClick={onReservationClick}/>


                    </article>


            </article>
        </section>
        </>
    )
}


function LessonParamsForm({selectedSport,onReservationClick}){
  const {t} = useTranslation("choseLessonParams")

  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);

  const [selectedNumberOfParticipants,setSelectedNumberOfParticipants]=useState('')
  const [selectedActivity,setSelectedActivity]=useState(selectedSport||'')
  const [selectedResort,setSelectedResort]=useState('')

  const navigate = useNavigate(); // For programmatic navigation


  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Using hyphen format
  };

  const partNumber=selectedNumberOfParticipants.split(" ")[0]

  const constructURL = () => {
    // const dates = `${formatDate(arrivalDate)}and${formatDate(departureDate)}`;
    // return `/bookLesson/resort/${selectedResort}/sport/${selectedActivity}/from/${formatDate(arrivalDate)}/to/${formatDate(departureDate)}/members/${partNumber}`;
    return `/bookLesson?resort=${selectedResort}&sport=${selectedActivity}&from=${formatDate(arrivalDate)}&to=${formatDate(departureDate)}&members=${partNumber}`;


  };

  function handleSubmit(ev){
      const formURL = constructURL();
      navigate(formURL);
      
     
  }

  function checkAllFieldsSelected(){
    if (!arrivalDate || !departureDate || !selectedResort || !selectedActivity || !selectedNumberOfParticipants) {
      return false
    }
    else{
      return true
    }
  }


  return(
    <>
      <Form method="get" id="lessonParamsForm">
          <Dropdown namespace={"choseLessonParams"} selected={selectedResort} setSelected={setSelectedResort} options={["Aniliou", "Vasilitsas", "Velouhiou", "Elatochoriou", "Kaimaktsalan", "Kalavryton", "Mainalou", "Parnassou", "Piliou", "Pisoderiou", "Falakrou", "3-5 Pigadia"]} text={"Resort"} icon={"/icons/lessonParams/pinIcon.png"}/>
          <CalendarContainer namespace={"choseLessonParams"} arrivalDate={arrivalDate} setArrivalDate={setArrivalDate} departureDate={departureDate} setDepartureDate={setDepartureDate}/>
          <Dropdown namespace={"choseLessonParams"} selected={selectedActivity} setSelected={setSelectedActivity} options={["Ski","Snowboard","Sit ski"]} text={"Sport"} icon={"/icons/lessonParams/ski.png"} selectedSport={selectedSport}/>
          <Dropdown namespace={"choseLessonParams"} selected={selectedNumberOfParticipants} setSelected={setSelectedNumberOfParticipants} options={["1 member","2 members","3 members","4 members","5 members","6 members"]} text={"Participant number"} icon={"/icons/lessonParams/numberOfParticipants.png"}/>
          <button type="submit" className={`finishLessonParams ${!checkAllFieldsSelected() ? 'disableSubmit' : ''}`} 
            onClick={(ev)=>{
                      ev.preventDefault()
                      if(checkAllFieldsSelected()){
                          onReservationClick();
                          handleSubmit(ev)}
                        }
                      }
          >
              {t("next")}
          </button>

      </Form>
    </>
  )
}


function CalendarContainer({arrivalDate,setArrivalDate,departureDate,setDepartureDate}){
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

                {isOpen && <Calendar onclose={()=>setIsOpen(false)} arrivalDate={arrivalDate} setArrivalDate={setArrivalDate} departureDate={departureDate} setDepartureDate={setDepartureDate} onOk={()=>setIsOpen(false)}/>}
                <input
                  type="hidden"
                  name="arrivalDate"
                  value={arrivalDate ? formatDate(arrivalDate) : ""}
                />
                <input
                  type="hidden"
                  name="departureDate"
                  value={departureDate ? formatDate(departureDate) : ""}
                />
            </div>
        </>
    )
}


export function Calendar({onclose,arrivalDate,setArrivalDate,departureDate,setDepartureDate,onOk}) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();
    const {t} = useTranslation("choseLessonParams")



    const prevMonth = () => {
        // Prevent going to months before the current month
        if (
          currentMonth.getFullYear() > today.getFullYear() ||
          (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())
        ) {
          setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
          );
        }
      };
    
      const nextMonth = () => {
        // Prevent going more than 12 months ahead
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);

        if (
          currentMonth.getFullYear() < maxDate.getFullYear() ||
          (currentMonth.getFullYear() === maxDate.getFullYear() && currentMonth.getMonth() < maxDate.getMonth())
        ) {
          setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
          );
        }
      };

  
    const getDaysInMonth = (year, month) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = new Date(firstDay);
      const dayOffset = (firstDay.getDay() + 6) % 7; // Offset for Monday start
      startDay.setDate(firstDay.getDate() - dayOffset);
      const endDay = new Date(lastDay);
      const endOffset = (6 - ((lastDay.getDay() + 6) % 7));
      endDay.setDate(lastDay.getDate() + endOffset);
  
      let days = [];
      let currentDate = new Date(startDay);
  
      while (currentDate <= endDay) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return days;
    };

    const handleDateClick = (date) => {
      // console.log('date ',date,arrivalDate,departureDate,!arrivalDate,arrivalDate.toDateString() !== date.toDateString())
      if (!arrivalDate || (arrivalDate && departureDate && arrivalDate.toDateString() !== departureDate.toDateString())) {
        setArrivalDate(date);
        setDepartureDate(date);
      } else if (date > arrivalDate) {

        setDepartureDate(date);
      } else if(date < arrivalDate) {

        const arrivalDateTemp = arrivalDate
        setArrivalDate(date);
        setDepartureDate(arrivalDateTemp)
      }
    };
  
    const isSelected = (day) => {
      return (
        (arrivalDate && day.toDateString() === arrivalDate.toDateString()) ||
        (departureDate && day.toDateString() === departureDate.toDateString()) ||
        (arrivalDate && departureDate && day > arrivalDate && day < departureDate)
      );
    };

  
    const daysCurrentMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const daysNextMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

    
    // console.log('aa ',today.getMonth(),today.getFullYear(),currentMonth.getMonth(),currentMonth.getFullYear(),currentMonth.getFullYear() === today.getFullYear() + 1 &&currentMonth.getMonth() === today.getMonth())

    return (
      <>
        <div className="dropdown-menu calendarMenu">
          <div className="calendar-header">
              <button type="button" className="closeCalendar" onClick={onclose}>
                <img src="/icons/startPage/close.png"/>

              
              </button>

          </div>
  
          <div className="calendar-grid-container">
            <CalendarGrid currentMonth={currentMonth} days={daysCurrentMonth} position={'left'} onDateClick={handleDateClick} isSelected={isSelected}>
              <button
                  onClick={prevMonth}
                  className="calendar-btn"
                  type="button"
                  disabled={
                      currentMonth.getFullYear() === today.getFullYear() &&
                      currentMonth.getMonth() === today.getMonth()
                  }
              >
                  ◀
              </button>
            </CalendarGrid>
            <CalendarGrid currentMonth={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)} days={daysNextMonth} position={'right'}  onDateClick={handleDateClick} isSelected={isSelected}>
              <button
                  onClick={nextMonth}
                  className="calendar-btn"
                  type="button"
                  disabled={
                      currentMonth.getFullYear() === today.getFullYear() + 1 &&
                      currentMonth.getMonth() === today.getMonth()
                  }
              >
                  ▶
              </button>
            </CalendarGrid>
              
          </div>

          <div className="bottom">
            <button type="button" onClick={()=>{setDepartureDate(null);setArrivalDate(null)}}>
              {t("clear")}
            </button>
            <button type="button" onClick={onOk}>
              Οκ
            </button>
          </div>
        </div>
      </>
    );
  }


function CalendarGrid({ currentMonth, days,children,position,onDateClick,isSelected }) {
    const today = new Date();
    const {t, i18n} = useTranslation("choseLessonParams")

    const currentLanguage = i18n.language;

    return (
      <div className="calendar-grid-wrapper">
        <div className="calendarTop">
          {position=='left'?children:null}
          <h4 className="calendar-title">
            {currentMonth.toLocaleString(currentLanguage, { month: "long", year: "numeric" })}
          </h4>
          {position=='right'?children:null}

        </div>

        <div className="calendar-days">
          {[t("Monday"), t("Tuesday"), t("Wednesday"), t("Thursday"), t("Friday"), t("Saturday"),t("Sunday")].map((day) => (
            <div key={day} className="calendar-day-label">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day, index) => {
            const isOutsideMonth = day.getMonth() !== currentMonth.getMonth();
            const isBeforeToday =
              day.getFullYear() === today.getFullYear() &&
              day.getMonth() === today.getMonth() &&
              day.getDate() < today.getDate();

            return (
              <div
                key={index}
                onClick={(!isOutsideMonth&&!isBeforeToday)?()=>onDateClick(day):null}
                className={`calendar-day 
                  ${isOutsideMonth ? "calendar-day-outside" : ""}
                  ${isBeforeToday ? "calendar-day-before" : ""}
                  ${isSelected(day) ? "calendar-day-selected" : ""} 
                 `}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>

      </div>
    );
  }