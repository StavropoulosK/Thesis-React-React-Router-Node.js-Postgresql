import "./dropdownMultiple.css"
import "../selectList/selectList.css"

import { useState, useRef } from "react";

import useCloseOnOutsideClick from "../../hooks/closeOnClickOutside.jsx"

import { useTranslation } from "react-i18next";


export default function DropdownMultiple({namespace,options,text,icon,selected,setSelected}) {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {t} = useTranslation(namespace)


  useCloseOnOutsideClick(dropdownRef, () => setIsOpen(false));

  const handleChange = (value) => {
 
      const newSelected = selected.includes(value)
        ? selected.filter(v => v !== value)   // Deselect if already selected
        : [...selected, value];               // Add if not already selected
      setSelected(newSelected);
    
  };



  return (
    <div className="dropdown selectList" ref={dropdownRef}>
        <button onMouseDown={() => setIsOpen(!isOpen)} className={`dropdown-button ${isOpen?"selected":""}`} type="button">
          <img src={icon} />
          {t(text)}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
            <div className="dropdown-menu" >
                {options.map((option, index) => {
                    const value =option.value;
                    const label =option.label;
                    
                    const checked = selected.includes(value)
                    
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
        )}
    </div>
  );
}
