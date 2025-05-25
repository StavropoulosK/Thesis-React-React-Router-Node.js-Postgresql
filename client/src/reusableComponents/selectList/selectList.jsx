import "./selectList.css"

import {useState,useRef} from "react"
import { useTranslation } from "react-i18next";


export default function SelectList({ options = [], multiple = false, onChange, text,initialSelected = multiple ? [] : "", gridLayout=false,isSendingData }) {
    const [selected, setSelected] = useState(initialSelected);
    const {t} = useTranslation("instructorProfile")

    const initialSelectedRef = useRef(initialSelected);  

    const handleChange = (value) => {
      if (multiple) {
        const newSelected = selected.includes(value)
          ? selected.filter(v => v !== value)   // Deselect if already selected
          : [...selected, value];               // Add if not already selected
        setSelected(newSelected);
      } else {
        setSelected(value);
      }
    };

    const isSelectionChanged = () => {
        if (multiple) {
          const a = [...selected].sort();
          const b = [...initialSelectedRef.current].sort();
          return a.length !== b.length || a.some((v, i) => v !== b[i]);
        } else {
          return selected !== initialSelectedRef.current;
        }
    };

    const disabled= (!isSelectionChanged() ) || isSendingData
  
    return (
      <article className={`selectList`}>
        <h2>{text}</h2>

        <div className="allContainer">


            <div className={`optionsContainer ${gridLayout?"displayGrid":""}`}>


        
                {options.map((option, index) => {
                    const value =option.value;
                    const label =option.label;
                    
                    const checked = multiple
                    ? selected.includes(value)
                    : selected === value;
                    
                    return (
                        <div key={index} className={`selectList-option`}>
                            <button
                                type="button"
                                className={`select-list-button ${checked ? 'selected' : ''}`}
                                onClick={() => handleChange(value)}
                            >
                                <span className="label-text">{label}</span>
                                <span className={`icon-wrapper ${checked?"selected":""}`}>
                                    {checked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 15 15">
                                        <path fill="none" stroke="#fff" strokeLinecap="square" d="m1 7l4.5 4.5L14 3" strokeWidth="1.5"/>
                                        </svg>
                                    )}
                                </span>
                                
                            </button>
                        </div>)})}
                
            </div>

            <div className="buttonContainer">
                <button className={ !disabled?"displayFull":""}   onClick={disabled?null:() => setSelected(initialSelectedRef.current)}>{t("cancel")}</button>
                <button className={!disabled?"displayFull":""} onClick={disabled?null:()=>{ initialSelectedRef.current=selected; onChange(selected)}}>{t("save")}</button>

            </div>

        </div>


      </article>
    );
  }