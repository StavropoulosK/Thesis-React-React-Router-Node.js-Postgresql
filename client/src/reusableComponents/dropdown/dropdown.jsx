import { useState, useRef } from "react";
import "./dropdown.css"; 

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
        <button onMouseDown={() => setIsOpen(!isOpen)} className={`dropdown-button ${isOpen?"selected":""}`} type="button">
          <img src={icon} />
          {t(selected||text)}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill="currentColor" d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
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
    </div>
  );
}
