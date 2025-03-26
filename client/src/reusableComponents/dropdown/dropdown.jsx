import { useState, useRef } from "react";
import "./dropdown.css"; // Import the CSS file

import useCloseOnOutsideClick from "../../hooks/closeOnClickOutside.jsx"

import { useTranslation } from "react-i18next";


export default function Dropdown({namespace,options,text,icon,selected,setSelected}) {
  // const [selected, setSelected] = useState(selectedSport||'');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {t} = useTranslation(namespace)


  useCloseOnOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <div className="dropdown" ref={dropdownRef}>
        <button onMouseDown={() => setIsOpen(!isOpen)} className="dropdown-button" type="button">
          <img src={icon} />
          {t(selected||text)}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
            <ul className="dropdown-menu" >
              {options.map((el,index)=>
                <li key={index} onClick={()=>
                {
                  setIsOpen(false)
                  setSelected(el)}
                }>
                  {t(el)}
                </li>)
              } 
            </ul>
        )}

        {/* <input
          type="hidden"
          name={text}
          value={selected}
          readOnly
        /> */}
    </div>
  );
}
