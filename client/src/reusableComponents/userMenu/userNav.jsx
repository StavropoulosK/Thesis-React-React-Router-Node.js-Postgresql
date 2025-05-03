import "./userNav.css"

import { NavLink, useNavigate,Outlet, useNavigation } from "react-router-dom";
import { useState } from "react";

import { useTranslation } from "react-i18next";




export function UserNav({options}){

    const {t} = useTranslation("userNav")


    const navigate = useNavigate();

    const [showNavBar,setShowNavBar]= useState(true)
    const [pendingIndex, setPendingIndex] = useState(null);


    
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logoutUser", { method: "POST" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }


        } catch (error) {
            console.error("Error logging out:", error);
                                                            
            return
        }
        navigate("/");

        
        return 
    };

    const navigation = useNavigation();

    return(

        <>
        
        
            <nav className="userNav">

                {options.map((option,index)=>{
                    return(
                    <NavLink
                        to={option.linkTo}  
                        key={index} 
                        className={({ isActive, isPending }) => {
                            if(isPending){
                                return "active"
                            }
                            else if(isActive && navigation.state!="loading"){
                                return "active"
                            }
                            else{
                                return ""
                            }
                      }}>

                        {option.svg}
                        {<span className={showNavBar?"textSpan visible":"textSpan hidden"}>{t(option.text)}</span>}
                    </NavLink>)


                })}

                <button onClick={handleLogout} className="navElement">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.496 21H6.5c-1.105 0-2-1.151-2-2.571V5.57c0-1.419.895-2.57 2-2.57h7M16 15.5l3.5-3.5L16 8.5m-6.5 3.496h10"/></svg>
                    {<span className={showNavBar?"textSpan visible":"textSpan hidden"}>{t("logout")}</span> } 

                </button>

                <button onClick={()=>setShowNavBar(prev=>!prev)} className="navElement" >
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M20.438 6.062h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 1 0 1m0 6.438h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 1 0 1m0 6.435h-9a.5.5 0 1 1 0-1h9a.5.5 0 0 1 0 1M5.562 8.062a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5m0-4a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5m0 10.438a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5m0-4a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5m0 10.438a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5m0-4a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5"></path></svg>                   
                    {<span className={showNavBar?"textSpan visible":"textSpan hidden"}>{t("Collapse")}</span>}

                </button>

            </nav>

            <Outlet></Outlet>
        
        </>
    )
}