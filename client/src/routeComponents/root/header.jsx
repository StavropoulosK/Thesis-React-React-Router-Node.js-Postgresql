import {Link,useNavigate  } from "react-router-dom"
import {memo,useState,useRef} from "react"

import useCloseOnOutsideClick from "../../hooks/closeOnClickOutside.jsx"



import "./header.css"

import { useTranslation } from "react-i18next";

// import grFlag from '/icons/header/greekFlag.svg';
// import enFlag from '/icons/header/englishFlag.svg';
// import profileImgHolder from '/icons/header/profile.svg';
// import logout from '/icons/header/logout.svg';

import grFlag from '/src/assets/icons/header/greekFlag.svg'
import enFlag from '/src/assets/icons/header/englishFlag.svg';
import profileImgHolder from '/src/assets/icons/header/profile.svg';
import logout from '/src/assets/icons/header/logout.svg';


const Header= memo (({setIsChooseLessonParamsOpen,loginStatus})=>{
    const {t, i18n } = useTranslation("header");
    const currentLanguage = i18n.language;

    const handleLanguageChange = () => {
        if(currentLanguage=='en'){
            i18n.changeLanguage('el'); 

        }
        else if(currentLanguage=='el'){
            i18n.changeLanguage('en'); 

        }
      };


    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} className="logo" onClick={()=>setIsChooseLessonParamsOpen(false)}> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={()=>{
                            console.log("click !!! ")
                            setIsChooseLessonParamsOpen(true)}}
                            
                        > {t("Book")}</button>
                        {!loginStatus&&<Link to={'/login'} onClick={()=>setIsChooseLessonParamsOpen(false)}> {t("Login")}</Link>}
                        {!loginStatus &&<Link to={'/protected'}> {t("Instructor signup")}</Link>}
                        {/* {true &&<Link to={'/protected'}> {t("Instructor signup")}</Link>} */}

                        {loginStatus=='student' &&<Link to={'/'}> {t("Lessons")}</Link>}

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

    const [showProfile,setShowProfile]= useState(false)

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

            </div>
        </>
    )
}

function ProfileDropdownCom(){

    const {t} = useTranslation("header");

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logoutUser", { method: "POST" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // On success, navigate to "/login" and pass current URL
            // navigate("/login", { state: { from: location.pathname } });

        } catch (error) {
            console.error("Error logging out:", error);
                                                            // ean den litourgisei i aposindesi apla fortoni i idia selida
            return
        }
        navigate("/")
        return 
    };


    return(
        <>
        
            <Link to='/Profile' className="dropdownLink">
                <img src={profileImgHolder}></img>
                    {t("Profile")}
            </Link> 

            {/* <Form method="post" className="dropdownLink"> */}
                    {/* <img src={logout}></img> */}
                    <button onClick={handleLogout} className="dropdownLink">
                        <img src={logout} alt="Logout" />
                        {t("Logout")}
                    </button>

            {/* </Form> */}

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