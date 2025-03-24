import "./choseLessonParams.css"
import "./calendar.css"


import { Form,useNavigate } from "react-router-dom";
import { useState, useRef } from "react";


import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"
import Dropdown from "./../../reusableComponents/dropdown/dropdown.jsx"


export default function ChoseLessonParams({onReservationClick,selectedSport,cancelSelectedSport}){

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
                            <img src="icons/startPage/close.png"/>
                        </button>
                        <h2>
                            Ξεκίνηστε και εσείς να κατεβαίνετε το βουνό
                        </h2>
                        <p>
                            Παρακαλούμε επιλέξτε  χιονοδρομικό κέντρο,  ημερομηνίες,  άθλημα και πόσα άτομα θα συμμετέχετε  για να δείτε τα διαθέσιμα μαθήματα
                        </p>

                        {/* <Form action="/" method="get" id="lessonParamsForm">
                            <Dropdown options={["Ανηλίου", "Βασιλίτσας", "Βελουχίου", "Ελατοχωρίου", "Καϊμακτσαλάν", "Καλαβρύτων", "Μαινάλου", "Παρνασσού", "Πηλίου", "Πισοδερίου", "Φαλακρού", "3-5 Πηγάδια"]} text={"Χιονοδρομικό Κέντρο"} icon={"../../../icons/lessonParams/pinIcon.png"}/>
                            <CalendarContainer/>
                            <Dropdown options={["Χιονοδρομία","Χιονοσανίδα","Καθιστή χιονοδρομία"]} text={"Δραστηριότητα"} icon={"../../../icons/lessonParams/ski.png"} selectedSport={selectedSport}/>
                            <Dropdown options={['1 άτομο','2 άτομα','3 άτομα','4 άτομα','5 άτομα','6 άτομα']} text={"Πλήθος ατόμων"} icon={"../../../icons/lessonParams/numberOfParticipants.png"}/>
                            <button type="submit" className="finishLessonParams">
                                Επόμενο
                            </button>

                        </Form> */}
                        <LessonParamsForm selectedSport={selectedSport} onReservationClick={onReservationClick}/>


                    </article>


            </article>
        </section>
        </>
    )
}


function LessonParamsForm({selectedSport,onReservationClick}){

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

  const constructURL = () => {
    const dates = `${formatDate(arrivalDate)}and${formatDate(departureDate)}`;
    return `/bookLesson/resort/${selectedResort}/dates/${dates}/sport/${selectedActivity}/members/${selectedNumberOfParticipants}`;
  };

  function handleSubmit(ev){
      ev.preventDefault()
      if(checkAllFieldsSelected()){
        const formURL = constructURL();
        navigate(formURL);
      }
     
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
          <Dropdown selected={selectedResort} setSelected={setSelectedResort} options={["Ανηλίου", "Βασιλίτσας", "Βελουχίου", "Ελατοχωρίου", "Καϊμακτσαλάν", "Καλαβρύτων", "Μαινάλου", "Παρνασσού", "Πηλίου", "Πισοδερίου", "Φαλακρού", "3-5 Πηγάδια"]} text={"Χιονοδρομικό Κέντρο"} icon={"../../../icons/lessonParams/pinIcon.png"}/>
          <CalendarContainer arrivalDate={arrivalDate} setArrivalDate={setArrivalDate} departureDate={departureDate} setDepartureDate={setDepartureDate}/>
          <Dropdown selected={selectedActivity} setSelected={setSelectedActivity} options={["Χιονοδρομία","Χιονοσανίδα","Καθιστή χιονοδρομία"]} text={"Δραστηριότητα"} icon={"../../../icons/lessonParams/ski.png"} selectedSport={selectedSport}/>
          <Dropdown selected={selectedNumberOfParticipants} setSelected={setSelectedNumberOfParticipants} options={['1 άτομο','2 άτομα','3 άτομα','4 άτομα','5 άτομα','6 άτομα']} text={"Πλήθος ατόμων"} icon={"../../../icons/lessonParams/numberOfParticipants.png"}/>
          <button type="submit" className={`finishLessonParams ${!checkAllFieldsSelected() ? 'disableSubmit' : ''}`} onClick={(ev)=>{onReservationClick();handleSubmit(ev)}}>
              Επόμενο
          </button>

      </Form>
    </>
  )
}


function CalendarContainer({arrivalDate,setArrivalDate,departureDate,setDepartureDate}){
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);


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
                    <img src={"../../../icons/lessonParams/calendar.png"} />
                    {(arrivalDate&&departureDate)?`${formatDate(arrivalDate)} - ${formatDate(departureDate)}`:"Ημερομηνία"}
                </button>

                {isOpen && <Calendar onclose={()=>setIsOpen(false)} arrivalDate={arrivalDate} setArrivalDate={setArrivalDate} departureDate={departureDate} setDepartureDate={setDepartureDate}/>}
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


function Calendar({onclose,arrivalDate,setArrivalDate,departureDate,setDepartureDate}) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();



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
                <img src="icons/startPage/close.png"/>

              
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
              Εκκαθάριση
            </button>
            <button type="button" onClick={onclose}>
              Οκ
            </button>
          </div>
        </div>
      </>
    );
  }


  function CalendarGrid({ currentMonth, days,children,position,onDateClick,isSelected }) {
    const today = new Date();

    return (
      <div className="calendar-grid-wrapper">
        <div className="calendarTop">
          {position=='left'?children:null}
          <h4 className="calendar-title">
            {currentMonth.toLocaleString("el-GR", { month: "long", year: "numeric" })}
          </h4>
          {position=='right'?children:null}

        </div>

        <div className="calendar-days">
          {["Δευ", "Τρ", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"].map((day) => (
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