import "./noteForm.css"

import { useState,useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";


export default function NoteForm({onClose,note,lessonID,fetcher}) {
    const [message, setMessage] = useState(note || "");

    const {t} = useTranslation("instructorSchedule")

    const noteRef = useRef(null);
  
    useEffect(() => {
    if (noteRef.current) {
        noteRef.current.focus();
    }
    }, []);


    const handleSubmit = () => {

        const formData = new FormData();

        formData.append("note", message)
        formData.append("lessonID", lessonID)

          
        fetcher.submit(formData, {
          method: "post",

        });
        onClose()
    };

 
  
    return (
      <div className="note-form-container">
        {/* einai sto parent */}
        {/* <ShowMessageScreen namespace="studentLessons" fetcher={fetcher}></ShowMessageScreen> */}

        <button className="close-button" onClick={onClose}>×</button>
  
        <div className="email-input-row">
            <h4>{t("write_msg")}</h4>
            
        </div>
  
        <textarea
          className="email-textarea"
          ref={noteRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("your_msg")+"..."}
        />
  
        <div className="note-buttons">
          <button onClick={handleSubmit}>{t("ok")}</button>
          <button onClick={onClose}>{t("cancel")}</button>
        </div>
      </div>
    );
  }
