import "./instructorTeachings.css"

import { useState,useRef } from "react"
import {useLoaderData,redirect,useFetcher } from "react-router-dom"

import { ToggleInput } from "../../reusableComponents/toggleInput/toggleInput"
import { useTranslation } from "react-i18next";
import ShowMessageScreen from "../../reusableComponents/showMessageScreen/showMessageScreen";
import MiddleScreenPopup from "../../reusableComponents/middleScreenPopup/middleScreenPopup";
import { CalendarContainer } from "../instructorSchedule/instructorSchedule";
import Dropdown from "../../reusableComponents/dropdown/dropdown";
import DropdownMultiple from "../../reusableComponents/dropdownMultiple/dropdownMultiple";
import UpdateLessons from "../../reusableComponents/updateLessons/updateLessons";

export async function instructorTeachingsLoader({request,params}){
    let data        

    console.log("loader")

    try {
        const response = await fetch('/api/getTeachings')

        // const response = await fetch(`/api/getTeachings`);
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

    if(!data.profileParamsAreFilled){
        // instructor must have created his profile to create a teaching

        return redirect("/instructorMenu/profile?showMessage=true")
    }

    return data

}

export async function instructorTeachingsAction({request,params}){
    const formData = await request.formData();
    const reason = formData.get("reason")
    let message

    if(reason=="meetingPointUpdate"){
        const meetingPointId = formData.get("meetingPointId");
        const resort= formData.get("resort") 
        const text= formData.get("text") 

        let updateField=""

        if(resort!=null){
            //user is updating resort name
            updateField="resortText"
        }

        else if(text !=null){
            // user is updating text value
            updateField="locationText"

        }

        try {
            const response = await fetch('/api/updateMeetingPoint', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({resort,text,updateField,meetingPointId})
              });


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }

    }

    else if (reason=="updateMeetingPointImage"){
        const image = formData.get("image"); 
        const meetingPointId = formData.get("meetingPointId"); 

         if (!image.type.startsWith("image/")) {
            message = "wrong_type_failure";
            return {message}
        } else if (image.size > 5 * 1024 * 1024) { // 5MB limit
            message = "tooBig_failure";
            return {message}
        }

        const backendFormData = new FormData();
        backendFormData.append("image", image);
        backendFormData.append("meetingPointId", meetingPointId);

        const response = await fetch("/api/updateMeetingPointImage", {
            method: "POST",
            body: backendFormData,
        });

        if (!response.ok) {
            const params = new URLSearchParams(window.location.search);
            const newParams=new URLSearchParams()
            newParams.set("fromPage", window.location.pathname+"?"+params.toString());
            
            return redirect("/login?" + newParams.toString());
        }

       
        message = (await response.json()).message;

    }

    else if(reason=="meetingPointDelete"){
        const meetingPointId = formData.get("meetingPointId");

        try {
            const response = await fetch('/api/deleteMeetingPoint', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({meetingPointId})
              });


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }
    }

    else if(reason=="meetingPointAdd"){

        try {
            const response = await fetch('/api/createMeetingPoint')


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }
    }

    else if(reason=="createTeaching"){
        const selectedDateStart = formData.get("selectedDateStart");
        const selectedDateEnd = formData.get("selectedDateEnd");
        const selectedResort = formData.get("selectedResort");
        const selectedSport = formData.get("selectedSport");
        const selectedMaxParticipants = formData.get("selectedMaxParticipants");
        const groupName = formData.get("groupName");
        const selectedDays = formData.get("selectedDays");
        const meetingPointId = formData.get("meetingPoint");
        const hourCost = formData.get("hourCost");
        const timeStart = formData.get("timeStart");
        const timeEnd = formData.get("timeEnd");
        const selectedLessonType = formData.get("selectedLessonType");
        const isLessonAllDay = formData.get("isLessonAllDay");

        // console.log("^^^^ ",selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay)

        try {
            const response = await fetch('/api/createTeaching', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPointId,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay})
              });


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }



    }

    else if(reason=="updateTeaching"){
        const meetingPointId = formData.get("meetingPoint");
        const teachingID = formData.get("teachingID");

        try {
            const response = await fetch('/api/updateTeaching', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({meetingPointId,teachingID})
              });


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }

    }

    else if(reason=="cancelLesson"){
        const lessonIDsArray = formData.get("lessonIDsArray");

        try {
            const response = await fetch('/api/cancelInstructorLessons', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({lessonIDsArray})
              });


            if (!response.ok) {
                const params = new URLSearchParams(window.location.search);
                const newParams=new URLSearchParams()
                newParams.set("fromPage", window.location.pathname+"?"+params.toString());
                
                return redirect("/login?" + newParams.toString());
            }

           
            message = (await response.json()).message;
            


        }
        catch (error) {
            console.error('Error connecting to server', error);
            throw error;
        }
    }

    

    return {message}

  
}

export function InstructorTeachings(){

    const data=useLoaderData()
    const {t} = useTranslation("instructorTeachings");

    const [showPopUp,setShowPopUp]=useState(false)

    const meetingPointRef=useRef(null)

    const fetcher= useFetcher()

    const buttonOptionCreate={
        svg:<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path></svg>,
        text:t("createTeaching"),
        onClick:null
    }

    const buttonOptionChange={
        svg:<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><path fill="#fff" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"></path></svg>,
        text:t("updateTeaching"),
        onClick:null
    }

    const handleDeleteMeetingPoint=()=>{
        const formData = new FormData();
        formData.append("meetingPointId", meetingPointRef.current);
        formData.append("reason", "meetingPointDelete");

        fetcher.submit(formData, { method: "post"});
    }

    const handleAddMeetingPoint=()=>{
        const formData = new FormData();
        formData.append("reason", "meetingPointAdd");

        fetcher.submit(formData, { method: "post"});
    }
    


    return(<>
    <section className="instructorTeachings">
        <h2>{t("meetingPoints")}</h2>

        <section className="meetingPoints">
            <ShowMessageScreen namespace="instructorTeachings" fetcher={fetcher}/>
            {showPopUp && <MiddleScreenPopup message={t("deleteMeetingPoint")} onConfirm={()=>{setShowPopUp(false);handleDeleteMeetingPoint()}} onClose={()=>setShowPopUp(false)} namespace="instructorTeachings" />}

            <div className="meetingPointsContainer">
                {
                    data.meetingPoints.map((meetingPoint,index) => (

                        <article key={meetingPoint.id} className="meetingPoint">
                            <button className="delete" onClick={()=>{setShowPopUp(true);meetingPointRef.current=meetingPoint.id}}>×</button>
                            <span className="id">{t("location")} {index+1}</span>
                            <InputContainer meetingPoint={meetingPoint} name="resort" fetcher={fetcher}/>
                            <InputContainer meetingPoint={meetingPoint} name="text" fetcher={fetcher}/>
                            <ImageUpload fetcher={fetcher} meetingPointId={meetingPoint.id} image={meetingPoint.image}/>
                            {/* {index!=1 && <button>
                                <img src="/images/showLessons/map.png"></img>
                            </button>}

                            {index==1 && <button className="addImage">
                                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="currentColor" d="M12 6.5a5.5 5.5 0 1 0-11 0a5.5 5.5 0 0 0 11 0M7 7l.001 2.504a.5.5 0 0 1-1 0V7H3.496a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 1 0V6h2.497a.5.5 0 0 1 0 1zm10.75-2.5h-5.063a6.5 6.5 0 0 0-.709-1.5h5.772A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75v-5.772c.463.297.967.536 1.5.709v5.063q.001.313.103.594l5.823-5.701a2.25 2.25 0 0 1 3.02-.116l.128.116l5.822 5.702q.102-.28.104-.595V6.25a1.75 1.75 0 0 0-1.75-1.75m.58 14.901l-5.805-5.686a.75.75 0 0 0-.966-.071l-.084.07l-5.807 5.687q.274.097.582.099h11.5c.203 0 .399-.035.58-.099M15.253 6.5a2.252 2.252 0 1 1 0 4.504a2.252 2.252 0 0 1 0-4.504m0 1.5a.752.752 0 1 0 0 1.504a.752.752 0 0 0 0-1.504"></path></svg>
                            
                            </button>} */}

                        </article>
                    ))
                }


            </div>

            <button className="createMeetingPoint" onClick={handleAddMeetingPoint}>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path></svg>
                 {t("addMeetingPoint")}
            </button>


        </section>

        <section className="createTeaching">
                <h2>{t("createTeaching")}</h2>
                <Teaching buttonOption={buttonOptionCreate} fetcher={fetcher} type="create"/>
        </section>

        <section className="previousTeachings">

                <h2>{t("existingTeaching")}</h2>

                <div className="teachingContainer">

                    {data.existingTeachings.map((teachingValues, index) => {
                        return (
                            // <Teaching key={teaching.teachingID} buttonOption={buttonOptionCreate} fetcher={fetcher} type="create" teachingValues={teaching}/>

                            <Teaching key={String(teachingValues.teachingID)+teachingValues.meetingPointId+String(data.meetingPoints.length)} buttonOption={buttonOptionChange} fetcher={fetcher} type="existing" teachingValues={teachingValues}/>

                        );
                    })}
                  

                </div>

        </section>


    </section>
    
    </>)
}

function parseDateFromString(dateStr) {
    // dateStr is DD/MM/YYYY
    if(!dateStr){
        return null

    }
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

function Teaching({buttonOption,fetcher,type,teachingValues}){

    const [showUpdateLessons,setShowUpdateLessons] = useState(false)
    const selectedTeachingRef= useRef(null)
    const {t} = useTranslation('instructorTeachings')

    const data=useLoaderData()

    const meetingPointsOptions=data.meetingPoints.map((meetingPoint,index)=>{return "location "+String(index+1)})
    meetingPointsOptions.unshift("after_agreement")

    const [selectedDateStart, setSelectedDateStart]= useState( parseDateFromString(teachingValues?.selectedDateStart)|| null)
    const [selectedDateEnd, setSelectedDateEnd]= useState( parseDateFromString(teachingValues?.selectedDateEnd)||null)
    const [selectedResort, setSelectedResort]= useState(teachingValues?.selectedResort||null)
    const [selectedSport, setSelectedSport]= useState(teachingValues?.selectedSport||null)
    const [selectedMaxParticipants, setSelectedMaxParticipants]= useState(teachingValues?.selectedMaxParticipants||null)
    const [groupName,setGroupName]= useState(teachingValues?.groupName||"")
    const [selectedDays,setSelectedDays]=useState(teachingValues?.selectedDays||[])
    const [meetingPoint,setMeetingPoint] = useState(teachingValues?.meetingPoint||"")
    const [timeStart,setTimeStart]=useState(teachingValues?.timeStart||"")
    const [timeEnd,setTimeEnd]=useState(teachingValues?.timeEnd||"")
    const [selectedLessonType, setSelectedLessonType] = useState(teachingValues?.selectedLessonType||"private");
    const [isLessonAllDay, setIsLessonAllDay] = useState(teachingValues?.isLessonAllDay||"false");
    const [hourCost,setHourCost]=useState(teachingValues?.hourCost||"")

    // console.log("!@ ",selectedDateStart,selectedDateEnd,selectedResort,selectedSport,selectedMaxParticipants,groupName,selectedDays,meetingPoint,hourCost,timeStart,timeEnd,selectedLessonType,isLessonAllDay)


    const disableBtn=()=>{

        if(type=="create"){

            if(selectedDateStart==null || selectedDateEnd==null || selectedResort==null || selectedSport==null || selectedMaxParticipants== null || selectedDays.length==0 || meetingPoint=="" || timeStart.length!=5 || timeEnd.length!=5 || (timeStart>=timeEnd) || hourCost=="" || (selectedDateStart>selectedDateEnd) || (selectedLessonType=="group" && groupName=="")){
                return true
            }
        }
        else if(type=="existing"){

            if(meetingPoint==teachingValues?.meetingPoint){
                return true
            }
        }
    }




    const selectedDaysCount=selectedDays.length

    const selectedDaysText=selectedDaysCount!=0?String(selectedDaysCount)+" "+t("day",{count:selectedDaysCount}):t("select_days")

    const disabledGroupName= selectedLessonType=="private"

    const endInputRef = useRef(null);

    const formatDate = (date) => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
  

    const onCreateNewTeaching=()=>{

        let meetingPointId

        if(meetingPoint!="after_agreement"){

            const index= meetingPoint.split(" ")[1]-1
            meetingPointId=data.meetingPoints[index].id
        }
        else{
            meetingPointId="after_agreement"
        }
        

        const formData = new FormData();
        formData.append("reason", "createTeaching");

        formData.append("selectedDateStart", formatDate(selectedDateStart));
        formData.append("selectedDateEnd", formatDate(selectedDateEnd));
        formData.append("selectedResort", selectedResort);
        formData.append("selectedSport", selectedSport);
        formData.append("selectedMaxParticipants", selectedMaxParticipants);
        formData.append("groupName", groupName);
        formData.append("selectedDays", selectedDays);
        formData.append("meetingPoint", meetingPointId);
        formData.append("timeStart", timeStart);
        formData.append("timeEnd", timeEnd);
        formData.append("selectedLessonType", selectedLessonType);
        formData.append("isLessonAllDay", isLessonAllDay);
        formData.append("hourCost", hourCost);


        fetcher.submit(formData, { method: "post"});
    }

    const onUpdateTeaching=()=>{

        let meetingPointId

        if(meetingPoint!="after_agreement"){

            const index= meetingPoint.split(" ")[1]-1
            meetingPointId=data.meetingPoints[index].id
        }
        else{
            meetingPointId="after_agreement"
        }

        const formData = new FormData();


        formData.append("reason", "updateTeaching");
        formData.append("meetingPoint", meetingPointId);
        formData.append("teachingID", teachingValues.teachingID);


        fetcher.submit(formData, { method: "post"});
    }

    if(type=="create"){
        buttonOption.onClick=onCreateNewTeaching
    }
    else if(type=="existing"){
        buttonOption.onClick=onUpdateTeaching

    }




    const dayOptions = [
        { value: "Monday", label: t("Monday") },
        { value: "Tuesday", label: t("Tuesday") },
        { value: "Wednesday", label: t("Wednesday") },
        { value: "Thursday", label: t("Thursday") },
        { value: "Friday", label: t("Friday") },
        { value: "Saturday", label: t("Saturday") },
        { value: "Sunday", label: t("Sunday") },
      ];

    return(

    <article className="teachingArticle">

        {showUpdateLessons && <UpdateLessons lessons={teachingValues.lessons} onClose={()=>setShowUpdateLessons(false)} fetcher={fetcher}></UpdateLessons>}

        <div className={`teaching ${type=="existing"?"existing":""}`}>
            {/* <CalendarContainer selectedDate={selectedDateStart} setSelectedDate={(day)=>{setSelectedDateStart(day) }} />
            <CalendarContainer selectedDate={selectedDateEnd} setSelectedDate={(day)=>{setSelectedDateEnd(day) }} />

            <Dropdown namespace={"choseLessonParams"} selected={selectedResort} setSelected={setSelectedResort} options={["Aniliou", "Vasilitsas", "Velouhiou", "Elatochoriou", "Kaimaktsalan", "Kalavryton", "Mainalou", "Parnassou", "Piliou", "Pisoderiou", "Falakrou", "3-5 Pigadia"]} text={"Resort"} icon={"/icons/lessonParams/pinIcon.png"}/>
            <Dropdown namespace={"choseLessonParams"} selected={selectedSport} setSelected={setSelectedSport} options={["Ski","Snowboard","Sit ski"]} text={"Sport"} icon={"/icons/lessonParams/ski.png"}/>
            <Dropdown namespace={"choseLessonParams"} selected={selectedMaxParticipants} setSelected={setSelectedMaxParticipants} options={["1 member","2 members","3 members","4 members","5 members","6 members"]} text={"Participant number"} icon={"/icons/lessonParams/numberOfParticipants.png"}/>
            <TwoOptionToggle
                optionLeft="Male"
                optionRight="Female"
                onChange={(val) => console.log("Selected:", val)}
            />
            <TimeInput time={timeStart} setTime={setTimeStart}></TimeInput>
            <CostInput cost={hourCost} setCost={setHourCost} />
            <NameInput groupName={groupName} setGroupName={setGroupName}></NameInput>
            <DropdownMultiple namespace="instructorTeachings" options={dayOptions} text={(selectedDaysText)} icon="/icons/teachings/calendarDay.png" selected={selectedDays} setSelected={setSelectedDays}></DropdownMultiple> */}
            <div className="field">
                <h4>{t("resortLocation")}</h4>
                <Dropdown namespace={"choseLessonParams"} selected={selectedResort} setSelected={setSelectedResort} options={["Aniliou", "Vasilitsas", "Velouhiou", "Elatochoriou", "Kaimaktsalan", "Kalavryton", "Mainalou", "Parnassou", "Piliou", "Pisoderiou", "Falakrou", "3-5 Pigadia"]} text={t("resortLocation")} icon={"/icons/lessonParams/pinIcon.png"}/>

            </div>

            <div className="field">
                <h4>{t("sport")}</h4>
                <Dropdown namespace={"choseLessonParams"} selected={selectedSport} setSelected={setSelectedSport} options={["Ski","Snowboard","Sit ski"]} text={"Sport"} icon={"/icons/lessonParams/ski.png"}/>

            </div>

            <div className="field">
                <h4>{t("dateStart")}</h4>
                <CalendarContainer selectedDate={selectedDateStart} setSelectedDate={(day)=>{setSelectedDateStart(day) }} />

            </div>

            <div className="field">
                <h4>{t("dateEnd")}</h4>
                <CalendarContainer selectedDate={selectedDateEnd} setSelectedDate={(day)=>{setSelectedDateEnd(day) }} />

            </div>

            <div className="field">
                <h4>{t("daysSelection")}</h4>
                <DropdownMultiple namespace="instructorTeachings" options={dayOptions} text={(selectedDaysText)} icon="/icons/teachings/calendarDay.png" selected={selectedDays} setSelected={setSelectedDays}></DropdownMultiple> 

            </div>

            <div className="field timeSelection">
                <h4>{t("timestart")}-{t("timeEnd")}</h4>
                <div className="container">
                    <TimeInput time={timeStart} setTime={setTimeStart} placeholder={t("placeholderStart")} nextRef={endInputRef} ></TimeInput>
                    <span>  -  </span>
                    <TimeInput time={timeEnd} setTime={setTimeEnd} placeholder={t("placeholderEnd")}  inputRef={endInputRef}></TimeInput>


                </div>

            </div>


            <div className="field">
                <h4>{t("isAllDay")}</h4>
                <TwoOptionToggle
                    optionLeft={"true"}
                    optionRight={"false"}
                    selected={isLessonAllDay}
                    setSelected={(value)=>{setIsLessonAllDay(value)}}
                />
            </div>


            <div className="field">
                <h4>{t("lessonType")}</h4>
                <TwoOptionToggle
                    optionLeft="private"
                    optionRight="group"
                    selected={selectedLessonType}
                    setSelected={(value)=>{setSelectedLessonType(value)}}
                />
            </div>

            <div className="field">
                <h4>{t("maxNumber")}</h4>
                <Dropdown namespace={"choseLessonParams"} selected={selectedMaxParticipants} setSelected={setSelectedMaxParticipants} options={["1 member","2 members","3 members","4 members","5 members","6 members"]} text={"Participant number"} icon={"/icons/lessonParams/numberOfParticipants.png"}/>

            </div>

            <div className="field meetingPointChange">
                <h4>{t("meetingPoint")} {type=="existing"?t("canChange"):""}</h4>
                <Dropdown namespace={"instructorTeachings"} selected={meetingPoint} setSelected={setMeetingPoint} options={meetingPointsOptions} text={t("meetingPoint")} shouldBreak={true} icon={"/icons/teachings/map.png"}/>

            </div>


            <div className="field">
                <h4>{t("hourCost")} {selectedLessonType=="group"?t("perPerson"):""}</h4>
                <CostInput cost={hourCost} setCost={setHourCost} />

            </div>

            <div className="field">
                <h4 className={disabledGroupName?"disabled":""}>{t("groupTitle")}</h4>
                <NameInput groupName={groupName} setGroupName={setGroupName} disabled={disabledGroupName}></NameInput>

            </div>
        
        
        </div>

        <div className="buttonContainer">

            <button onClick={disableBtn()?null:buttonOption.onClick} className={`optionBtn ${disableBtn()?"disabled":""}`}>
                {buttonOption.svg!=null?buttonOption.svg:"+ "}
                {buttonOption.text}
            </button>

            {type=="existing" && <button className="optionBtn updateLesson" onClick={()=>{setShowUpdateLessons(true);selectedTeachingRef.current=teachingValues.teachingID}}>
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 32 32"><path fill="#fff" d="M7.5 4A3.5 3.5 0 0 0 4 7.5v2c0 .98.402 1.865 1.05 2.5A3.5 3.5 0 0 0 4 14.5v3c0 .98.402 1.865 1.05 2.5A3.5 3.5 0 0 0 4 22.5v2A3.5 3.5 0 0 0 7.5 28h17a3.5 3.5 0 0 0 3.5-3.5v-2a3.5 3.5 0 0 0-1.05-2.5A3.5 3.5 0 0 0 28 17.5v-3a3.5 3.5 0 0 0-1.05-2.5A3.5 3.5 0 0 0 28 9.5v-2A3.5 3.5 0 0 0 24.5 4zM6 22.5A1.5 1.5 0 0 1 7.5 21H10v5H7.5A1.5 1.5 0 0 1 6 24.5zm6 3.5v-5h12.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5zm0-7v-6h12.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5zm0-8V6h12.5A1.5 1.5 0 0 1 26 7.5v2a1.5 1.5 0 0 1-1.5 1.5zm-2-5v5H7.5A1.5 1.5 0 0 1 6 9.5v-2A1.5 1.5 0 0 1 7.5 6zm0 7v6H7.5A1.5 1.5 0 0 1 6 17.5v-3A1.5 1.5 0 0 1 7.5 13z"></path></svg>
            
                {t("overview")}
            </button>
            }

        </div>


        
    </article>

        
    )


}


function TimeInput({time,setTime,placeholder,nextRef =null,inputRef=null}) {
  
    const handleChange = (e) => {
        const raw = e.target.value;
        const isDeleting = time.length > raw.length;
      
        // Remove non-digits
        let input = raw.replace(/\D/g, '');
      
        if (input.length > 4) return;

        if(parseInt(input[0], 10) >= 2){
            input='0'+input
        }
        
      
        if (!isDeleting) {
          if (input.length >= 2) {
            input = `${input.slice(0, 2)}:${input.slice(2)}`;
          } 
        }
        else if(input.length==3){
            input = `${input.slice(0, 2)}:${input.slice(2)}`;

        }

      
        setTime(input);

        if (input.length === 5 && nextRef?.current) {

            nextRef.current.focus();
        }
    };
  
    return (
        <Input type="text" value={time} handleChange={handleChange} placeholder={placeholder} ref={inputRef}>
             <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z"></path></svg> 

        </Input>

    );
  }

function CostInput({cost,setCost}){

    const {t} = useTranslation("instructorTeachings");


    const handleChange = (e) => {
        const raw = e.target.value;
        
        let input = raw.replace(/\D/g, '');

        if(input.length>3){
            return
        }

        setCost(input)
        
        }

    return (
        <Input type="text" value={cost} handleChange={handleChange} placeholder={t("hourCost")}>
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><path fill="currentColor" d="M15.039 20q-2.893 0-4.953-1.608q-2.059-1.607-2.855-4.084h-3.5v-1h3.3q-.114-.581-.101-1.324t.1-1.292h-3.3v-1h3.54q.776-2.476 2.826-4.084T15.038 4q1.495 0 2.83.488t2.42 1.35l-.713.689q-.944-.723-2.097-1.125T15.038 5q-2.49 0-4.232 1.353t-2.477 3.34h6.594v1H8.056q-.12.598-.114 1.35t.114 1.265h6.867v1H8.31q.753 1.986 2.496 3.339T15.039 19q1.286 0 2.439-.402t2.097-1.125l.714.689q-1.085.863-2.42 1.35t-2.83.488"></path></svg>
        
        
        </Input>

    );
}

function NameInput({groupName,setGroupName,disabled}){

    const {t} = useTranslation("instructorTeachings");

    const handleChange = (e) => {
        const raw = e.target.value;
        
        let input = raw
    
        if(input.length>30){
            return
        }
    
        setGroupName(input)
        
        }
    
        return (
            <Input type="text" value={groupName} handleChange={handleChange} placeholder={t("groupName")} disabled={disabled}>
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 50 50"><path fill="currentColor" d="M22 40.1c-.9 0-1.7-.3-2.3-.9l-8.9-8.9c-1.2-1.2-1.2-3.3 0-4.5l11.9-11.9c1-1 3-1.8 4.5-1.8h7.6c1.8 0 3.2 1.4 3.2 3.2v7.6c0 1.5-.8 3.4-1.8 4.5L24.3 39.2c-.6.6-1.4.9-2.3.9M27.2 14c-1 0-2.4.6-3 1.3L12.3 27.2c-.5.5-.5 1.2 0 1.7l8.9 8.9c.5.4 1.2.4 1.7 0l11.9-11.9c.7-.7 1.3-2.1 1.3-3v-7.6c0-.7-.5-1.2-1.2-1.2h-7.7z"></path><path fill="currentColor" d="M30 24c-2.2 0-4-1.8-4-4s1.8-4 4-4s4 1.8 4 4s-1.8 4-4 4m0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"></path></svg>            
            
            </Input>
    
        );
}


function Input({ type, value, handleChange, placeholder, children, disabled=false, ref=null }) {
    return (
        <div className="input-wrapper">
        {children && <span className={`input-icon ${disabled?"disabled":""}`}>{children}</span>}
        <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            tabIndex={disabled ? -1 : 0}
            className={`input-field ${disabled ? "input-disabled" : ""}`}
            ref={ref}
            />
        </div>
    );
}


function TwoOptionToggle({ optionLeft, optionRight, selected,setSelected }) {
    const {t} = useTranslation("instructorTeachings");

    const handleClick = (value) => {
      setSelected(value);
    };
  
    return (
      <div className="two-option-toggle">
        <button
          className={`option ${selected === optionLeft ? 'selected' : ''}`}
          onClick={() => handleClick(optionLeft)}
        >
          {t(optionLeft)}
        </button>
        <button
          className={`option ${selected === optionRight ? 'selected' : ''}`}
          onClick={() => handleClick(optionRight)}
        >
          {t(optionRight)}
        </button>
      </div>
    );
  }


function InputContainer({meetingPoint,name,fetcher}){
    const {t} = useTranslation("instructorTeachings");
    const [value,setValue]=useState(meetingPoint[name])


    const handleClick = () => {
        if(value==meetingPoint[name] || (meetingPoint[name]===null && value==="")){
            return
        }
        const formData = new FormData();
        formData.append(name, value);
        formData.append("meetingPointId", meetingPoint.id);
        formData.append("reason", "meetingPointUpdate");
        fetcher.submit(formData, { method: "post"});
    };

    const inputText= value||""
    // const inputText= ((value!=null)||meetingPoint[name])?value:t(name)

    return(
        <div className="inputContainer">
                <ToggleInput svg={null} inputText={inputText} handleChange={(e)=>{if(e.target.value.length>30) return; setValue(e.target.value);}} namespace={null} loaderText={meetingPoint[name]|| t(name)} errorText={""} onClick={handleClick}/>

        </div>

    )


}


function ImageUpload({fetcher,image=null,meetingPointId}) {
    const fileInputRef = useRef();
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("image", file);
      formData.append("meetingPointId", meetingPointId);
      formData.append("reason", "updateMeetingPointImage");

      fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data", 
      });
    }

    return (

        <button onClick={() => fileInputRef.current.click()} className={image==null?"addImage":""}>
            <input
                type="file"
                name="image"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            {image==null && <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="currentColor" d="M12 6.5a5.5 5.5 0 1 0-11 0a5.5 5.5 0 0 0 11 0M7 7l.001 2.504a.5.5 0 0 1-1 0V7H3.496a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 1 0V6h2.497a.5.5 0 0 1 0 1zm10.75-2.5h-5.063a6.5 6.5 0 0 0-.709-1.5h5.772A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75v-5.772c.463.297.967.536 1.5.709v5.063q.001.313.103.594l5.823-5.701a2.25 2.25 0 0 1 3.02-.116l.128.116l5.822 5.702q.102-.28.104-.595V6.25a1.75 1.75 0 0 0-1.75-1.75m.58 14.901l-5.805-5.686a.75.75 0 0 0-.966-.071l-.084.07l-5.807 5.687q.274.097.582.099h11.5c.203 0 .399-.035.58-.099M15.253 6.5a2.252 2.252 0 1 1 0 4.504a2.252 2.252 0 0 1 0-4.504m0 1.5a.752.752 0 1 0 0 1.504a.752.752 0 0 0 0-1.504"></path></svg>}
            {image!=null && <img src={image}/>}
        </button>

    );
    
};
