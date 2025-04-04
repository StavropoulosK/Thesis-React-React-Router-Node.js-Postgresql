import "./topBar.css"

import { useTranslation } from "react-i18next";


const icons = [

    <img src={"/icons/lessonParams/calendar.png"} />,

    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.586 12.586L19 19M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/></svg>,
  
    <svg className="border" xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24"><path  fill="currentColor" d="M22.707 6.707a1 1 0 0 0-1.414-1.414L18 8.586l-1.293-1.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0zM2 7a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2zm20.707 6.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L18 16.586l3.293-3.293a1 1 0 0 1 1.414 0M2 15a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2z"/></svg>,
  
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 56 56"><path fill="currentColor" d="M9.625 47.71h36.75c4.898 0 7.36-2.413 7.36-7.241V15.555c0-4.828-2.462-7.266-7.36-7.266H9.625c-4.898 0-7.36 2.438-7.36 7.266v24.914c0 4.828 2.461 7.242 7.36 7.242M6.039 15.767c0-2.438 1.313-3.703 3.656-3.703h36.633c2.32 0 3.633 1.265 3.633 3.703v1.968H6.039Zm3.656 28.172c-2.344 0-3.656-1.243-3.656-3.68V23.055h43.922v17.203c0 2.437-1.313 3.68-3.633 3.68ZM12.39 37h5.743c1.383 0 2.297-.914 2.297-2.25v-4.336c0-1.312-.914-2.25-2.297-2.25H12.39c-1.383 0-2.297.938-2.297 2.25v4.336c0 1.336.914 2.25 2.297 2.25"/></svg>,
   
  ];

const text =[
    "Date selection", 
    "Lesson selection",
    "Overview",
    "Payment"
]

export default function TopBar({ completed }) {
    const { t } = useTranslation("topBar");


    const stepPositions = [12.5, 37.5, 62.5, 87.5]; // Circle centers
    const segmentWidth = 20;
  
    // Determine where the progress line should end
    const progressEnd = stepPositions[completed - 1] 
  
    return (
      <div className="topBar">
        <div className="line-wrapper">
  
          <div className="progress-line" style={{ width: `${progressEnd}%` }} />

          <div className="remaining-line" style={{ width: `${100 - progressEnd}%`, left: `${progressEnd}%` }}/>
  
          {/* Circles */}
          {stepPositions.map((pos, i) => {
                return(
                <>
                    <Circle i={i} completed={completed} pos={pos} text={"aasdasd"}>
                        {icons[i]}

                    </Circle>
                    <span className="text" style={{ left: `${pos}%` }}>{t(text[i])}</span>
                </>)
          })}
        </div>
      </div>
    );
  }

  function Circle({i,completed,pos,children,text}){
    const isCompleted = i < completed-1;

    return (
        <div
          key={i}
          className={`circle ${isCompleted ? "circle-blue" : "circle-black"}`}
          style={{ left: `${pos}%` }}
        >
          {children}
  
          {isCompleted && i < completed - 1 && (
            <div className="circle-small">
                  <svg className="tick" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path fill="#fff" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"/></svg>
            </div>
          )}
        </div>
      );
    
  }
  
