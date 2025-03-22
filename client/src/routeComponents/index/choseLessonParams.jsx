import "./choseLessonParams.css"
import "./calendar.css"


import { Form } from "react-router-dom";
import { useState, useRef } from "react";


import useCloseOnOutsideClick from "./../../hooks/closeOnClickOutside.jsx"
import Dropdown from "./../../reusableComponents/dropdown/dropdown.jsx"


export default function ChoseLessonParams({onReservationClick,selectedSport,cancelSelectedSport}){

    console.log('asdasasd')

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

                        <Form action="/" method="get">
                            <Dropdown options={["Ανηλίου", "Βασιλίτσας", "Βελουχίου", "Ελατοχωρίου", "Καϊμακτσαλάν", "Καλαβρύτων", "Μαινάλου", "Παρνασσού", "Πηλίου", "Πισοδερίου", "Φαλακρού", "3-5 Πηγάδια"]} text={"Χιονοδρομικό Κέντρο"} icon={"../../../public/icons/lessonParams/pinIcon.png"}/>
                            <CalendarContainer/>
                            <Dropdown options={["Χιονοδρομία","Χιονοσανίδα","Καθιστή χιονοδρομία"]} text={"Δραστηριότητα"} icon={"../../../public/icons/lessonParams/ski.png"} selectedSport={selectedSport}/>
                            <Dropdown options={['1 άτομο','2 άτομα','3 άτομα','4 άτομα','5 άτομα','6 άτομα']} text={"Πλήθος ατόμων"} icon={"../../../public/icons/lessonParams/numberOfParticipants.png"}/>

                        </Form>

                    </article>


            </article>
        </section>
        </>
    )
}


function CalendarContainer(){
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useCloseOnOutsideClick(dropdownRef, () => setIsOpen(false));


    return(
        <>
            <div className="dropdown calendar" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button" type="button">
                    <img src={"../../../public/icons/lessonParams/calendar.png"} />
                    {"Ημερομηνίες"}
                </button>

                {isOpen && <Calendar/>}
            </div>
        </>
    )
}


function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();

    console.log('aa ',today)

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
  
    const daysCurrentMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const daysNextMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  
    return (
      <>
        <div className="dropdown-menu calendarMenu">
          <div className="calendar-header">
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
            <button
                onClick={nextMonth}
                className="calendar-btn"
                type="button"
                disabled={
                    currentMonth.getFullYear() === today.getFullYear() &&
                    currentMonth.getMonth() === today.getMonth() + 12
                }
            >
                ▶
            </button>
          </div>
  
          <div className="calendar-grid-container">
            <CalendarGrid currentMonth={currentMonth} days={daysCurrentMonth} />
            <CalendarGrid currentMonth={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)} days={daysNextMonth} />
          </div>
        </div>
      </>
    );
  }


  function CalendarGrid({ currentMonth, days }) {
    return (
      <div className="calendar-grid-wrapper">
        
        <h4 className="calendar-title">
           {currentMonth.toLocaleString("el-GR", { month: "long", year: "numeric" })}
         </h4>
        <div className="calendar-days">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="calendar-day-label">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.getMonth() !== currentMonth.getMonth() ? "calendar-day-outside" : ""}`}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  }