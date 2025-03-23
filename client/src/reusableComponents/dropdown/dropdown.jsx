import { useState, useRef } from "react";
import "./dropdown.css"; // Import the CSS file

import useCloseOnOutsideClick from "../../hooks/closeOnClickOutside.jsx"

export default function Dropdown({options,text,icon,selectedSport}) {
  const [selected, setSelected] = useState(selectedSport||'');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useCloseOnOutsideClick(dropdownRef, () => setIsOpen(false));



  return (
    <div className="dropdown" ref={dropdownRef}>
        <button onMouseDown={() => setIsOpen(!isOpen)} className="dropdown-button" type="button">
          <img src={icon} />
          {selected||text}
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
                  {el}
                </li>)
              } 
            </ul>
        )}

        <input
          type="hidden"
          name={text}
          value={selected}
          readOnly
        />
    </div>
  );
}
