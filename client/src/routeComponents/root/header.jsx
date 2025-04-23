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



const Header= memo (({setIsChooseLessonParamsOpen,loginStatus,lessonsInCart})=>{
    const {t, i18n } = useTranslation("header");
    const currentLanguage = i18n.language;

    const navigate = useNavigate();

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
                        {!loginStatus &&<Link to={'/signup/instructor'}> {t("Instructor signup")}</Link>}
                        {/* {true &&<Link to={'/protected'}> {t("Instructor signup")}</Link>} */}

                        {loginStatus=='student' &&<Link to={'/'}> {t("Lessons")}</Link>}

                        {loginStatus && <Profile loginStatus={loginStatus}/>}


                        {loginStatus=="student" && lessonsInCart!=0 && 

                            <button className="shoppingCart" onClick={()=> navigate("/overview")}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3"/></svg>                       
                                <span className="cart-badge">{lessonsInCart}</span>


                            </button>
                        }

                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Schedule")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Lessons")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'/'}> {t("Statistics")}</Link>}

    

        
                        
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


        } catch (error) {
            console.error("Error logging out:", error);
                                                            
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
        
            <Link to='/studentMenu/profile' className="dropdownLink">
                {/* <img src={profileImgHolder}></img> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"/></svg>
                {t("Profile")}
            </Link> 


            <button onClick={handleLogout} className="dropdownLink">
                {/* <img src={logout} alt="Logout" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.496 21H6.5c-1.105 0-2-1.151-2-2.571V5.57c0-1.419.895-2.57 2-2.57h7M16 15.5l3.5-3.5L16 8.5m-6.5 3.496h10"/></svg>
                {t("Logout")}
            </button>


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