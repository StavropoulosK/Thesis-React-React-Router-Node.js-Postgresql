import { useState, useRef } from "react";
import "./textContainer.css";
import { useTranslation } from "react-i18next";


export default function TextContainer({ id, header, text, isSendingData, onChange, maxChars }) {
  const [value, setValue] = useState(text || "");
  const initialValueRef = useRef(text || "");
  const {t} = useTranslation("instructorProfile")

  const isTextChanged = () => value !== initialValueRef.current;



  return (
    <article className="textAreaContainer">
      <label htmlFor={id}>{header}</label>

      <textarea
        id={id}
        name={id}
        rows="5"
        cols="33"
        value={value}
        onChange={(e) =>{ if(e.target.value.length<=maxChars){setValue(e.target.value)}} }
      />
      <span className="char-counter">{value.length}/{maxChars}</span>


      <div className="buttonContainer">
        <button
          className={isTextChanged() && !isSendingData ? "displayFull" : ""}
          onClick={()=>setValue(initialValueRef.current)}
        >
          {t("cancel")}
        </button>
        <button
          className={isTextChanged() && !isSendingData ? "displayFull" : ""}
          onClick={()=>onChange(value)}
        >
          {t("save")}
        </button>
      </div>
    </article>
  );
}
