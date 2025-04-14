import {Link,useNavigate,useLocation  } from "react-router-dom"
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


    const { pathname } = useLocation();


    const handleLanguageChange = () => {
        if(currentLanguage=='en'){
            i18n.changeLanguage('el'); 

        }
        else if(currentLanguage=='el'){
            i18n.changeLanguage('en'); 

        }
      };

    const fastSmoothScrollToTop = () => {
        const start = window.scrollY;
        const duration = 50; // 200ms (much faster than default)
        const startTime = performance.now();
      
        const animateScroll = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, start * (1 - progress));
      
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };
      
        requestAnimationFrame(animateScroll);
    };



    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} preventScrollReset={pathname=="/"?false:false} className="logo" onClick={()=>{
                                setIsChooseLessonParamsOpen(false)
                                if(pathname=="/"){
                                    return
                                    fastSmoothScrollToTop()
                                }
                            }}
                        >
                            Easy Snow
                        </Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={()=>{
                            setIsChooseLessonParamsOpen(true)}}
                            
                        > {t("Book")}</button>
                         {/*  ###############################################################     na to antigrapso pantou      onClick={()=>setIsChooseLessonParamsOpen(false)}       */}
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
    const location = useLocation();


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
        if (location.pathname === "/") {
            navigate("/", { replace: true });
        } else {
            navigate("/");
        }
        
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