import "./emailForm.css"

import { useState,useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";


export default function EmailForm({onClose,studentEmail,instructorEmail,fetcher}) {
    const [message, setMessage] = useState('');

    const {t} = useTranslation("emailForm")

    const textareaRef = useRef(null);
  
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
    }, []);


    const disabled= message.length==0


    const handleSubmit = () => {

        if(disabled){
            return
        }
        const formData = new FormData();

        formData.append("studentEmail", studentEmail)
        formData.append("instructorEmail", instructorEmail)
        formData.append("userMessage", message)

          
        fetcher.submit(formData, {
          method: "post",
          action:"/api/postEmailRequest",

        });
        onClose()
    };

 
  
    return (
      <div className="email-form-container">
        {/* einai sto parent */}
        {/* <ShowMessageScreen namespace="studentLessons" fetcher={fetcher}></ShowMessageScreen> */}

        <button className="close-button" onClick={onClose}>×</button>
  
        <div className="email-input-row">
            <h4>{t("write_msg")}</h4>
            <p>{t("email_adr")}</p>
            <p>{studentEmail}</p>
        </div>
  
        <textarea
          className="email-textarea"
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("your_msg")}
        />
  
        <div className="email-buttons">
          <button onClick={handleSubmit} className={disabled?"disabled":""}>{t("ok")}</button>
          <button onClick={onClose}>{t("cancel")}</button>
        </div>
      </div>
    );
  }
