import {Link } from "react-router-dom"
import {memo,useState,useRef} from "react"

import useCloseOnOutsideClick from "../../hooks/closeOnClickOutside.jsx"



import "./header.css"

import { useTranslation } from "react-i18next";

import grFlag from '../../assets/icons/greekFlag.svg';
import enFlag from '../../assets/icons/englishFlag.svg';
import profileImgHolder from '../../assets/icons/profile.svg';
import logout from '../../assets/icons/logout.svg';




const Header= memo (({setIsChooseLessonParamsOpen,loginStatus})=>{
    const {t, i18n } = useTranslation("header");
    const currentLanguage = i18n.language;

    const handleLanguageChange = () => {
        if(currentLanguage=='en'){
            i18n.changeLanguage('el'); // Change language dynamically

        }
        else if(currentLanguage=='el'){
            i18n.changeLanguage('en'); // Change language dynamically

        }
      };


        console.log('aa header',loginStatus)


    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        {/* <Link to={'/'} className="logo" onClick={urlPath==="/"?()=>setIsChooseLessonParamsOpen(false):null}> Easy Snow</Link> */}
                        <Link to={'/'} className="logo" onClick={()=>setIsChooseLessonParamsOpen(false)}> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={()=>setIsChooseLessonParamsOpen(true)}> {t("Book")}</button>
                        {!loginStatus&&<Link to={'/Login'} onClick={()=>setIsChooseLessonParamsOpen(false)}> {t("Login")}</Link>}
                        {!loginStatus &&<Link to={'/'}> {t("Instructor signup")}</Link>}
                        {loginStatus=='user' &&<Link to={'/'}> {t("Lessons")}</Link>}

                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Schedule")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Lessons")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Statistics")}</Link>}


                        {loginStatus && <Profile loginStatus={loginStatus}/>}

                        
                        <button onClick={handleLanguageChange} className="changeLngBtn">
                            <img src={currentLanguage=='el'?enFlag:grFlag} alt="Icon" />

                        </button>
                    </div>

                </nav>


            
            </header>

            
        </>
    )
})


function Profile({loginStatus   }){

    const [showProfile,setShowProfile]= useState(true)

    const profile = useRef(null);

    useCloseOnOutsideClick(profile, ()=>setShowProfile(false));



    return(
        <>

            <div className="profile" ref={profile}>

                
                <button onClick={()=>setShowProfile(!showProfile)} className="profileBtn">
                                <img src="/icons/startPage/userProfileDropdown.png" alt="Profile Icon" />

                </button>

                { showProfile && <ProfileDropdown loginStatus={loginStatus}/>}

            </div>
        </>
    )

}

function ProfileDropdown({loginStatus}){


    return (
        <>
            <div className="profileDropdown" >
                <ProfileDropdownCom/>
                {/* {loginStatus=='user' && <UserDropdown/>}
                {loginStatus=='instructor' && <InstructorDropdown/>} */}

            </div>
        </>
    )
}

function ProfileDropdownCom(){

    const {t} = useTranslation("header");


    return(
        <>
        
            <Link to='/Profile' className="dropdownLink">
                <img src={profileImgHolder}></img>
                    {t("Profile")}
            </Link> 

            <Link to='/Logout' className="dropdownLink">
                    <img src={logout}></img>
                    {t("Logout")}
            </Link> 
        </>
    )
}

// function InstructorDropdown(){

//     return(
//         <>
        
//             <Link to='/Profile' className="dropdownLink">
//                 <img src={profileImgHolder}></img>
//                     Προφιλ
//             </Link> 

//             <Link to='/Profile' className="dropdownLink">
//                     <img src={logout}></img>
//                     Αποσύνδεση!!
//             </Link> 
//         </>
//     )
// }

export default Header