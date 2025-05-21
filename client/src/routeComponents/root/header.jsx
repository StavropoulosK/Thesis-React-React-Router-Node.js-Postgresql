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
            <header className="mainHeader">
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
                        
                        {loginStatus!="instructor" && <button onClick={()=>{
                            setIsChooseLessonParamsOpen(true)}}
                            
                        >
                             {t("Book")}
                        
                        </button>}


                        {loginStatus=="instructor" &&<Link to={'/instructorMenu/instructorSchedule'} className="optional"> {t("Schedule")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'/instructorMenu/teachings'} className="optional"> {t("Lessons")}</Link>}
                        {loginStatus=="instructor" &&<Link to={'instructorMenu/statistics'} className="optional"> {t("Statistics")}</Link>}



                         {/*  ###############################################################     na to antigrapso pantou      onClick={()=>setIsChooseLessonParamsOpen(false)}       */}
                        {!loginStatus&&<Link to={'/login'} onClick={()=>setIsChooseLessonParamsOpen(false)}> {t("Login")}</Link>}
                        {!loginStatus &&<Link className="optional" to={'/signup/instructor'}> {t("Instructor signup")}</Link>}

                        {loginStatus=='student' &&<Link className="optional" to={'/studentMenu/lessons/studentLessons'}> {t("studentLessons")}</Link>}

                        {loginStatus && <Profile loginStatus={loginStatus}/>}


                        {loginStatus=="student" && lessonsInCart!=0 && 

                            <button className="shoppingCart" onClick={()=> navigate("/overview")}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3"/></svg>                       
                                <span className="cart-badge">{lessonsInCart}</span>


                            </button>
                        }


    

        
                        
                        <button onClick={handleLanguageChange} className="changeLngBtn">
                            {/* <img src={currentLanguage=='el'?enFlag:grFlag} alt="Icon" /> */}
                            {currentLanguage=='el'?"EN":"EL"}
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
                <ProfileDropdownCom loginStatus={loginStatus}/>

            </div>
        </>
    )
}

function ProfileDropdownCom({loginStatus}){

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


            { loginStatus=="student" && 
                <>

                    <Link to='/studentMenu/profile' className="dropdownLink">
                        {/* <img src={profileImgHolder}></img> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"/></svg>
                        {t("Profile")}
                    </Link> 

                    <Link className="showMobile dropdownLink" to={'/studentMenu/lessons/studentLessons'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fffefe" fillRule="evenodd" d="M18.5 3.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m-2.25.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M5.376 3.084a.75.75 0 0 1 1.04-.208l5.994 3.996l.642-.578a2.25 2.25 0 0 1 2.91-.084l1.507 1.204a.75.75 0 0 1 .272.47l.449 2.841l3.226 2.151a.75.75 0 1 1-.832 1.248l-3.5-2.333a.75.75 0 0 1-.325-.507l-.27-1.712l-.659.658a.75.75 0 0 1-.946.094l-9.3-6.2a.75.75 0 0 1-.208-1.04m10.501 4.978l-.851-.68a.75.75 0 0 0-.97.027l-.358.322l1.506 1.004zM11 8.934a.75.75 0 0 1 .285 1.022a.75.75 0 0 0 .239.991l.882.588l.565-.565a.75.75 0 0 1 1.06 1.06l-.374.374l1.64 1.172a1.75 1.75 0 0 1 0 2.848l-1.907 1.363l3.762 2.418l2.202-.44a.75.75 0 1 1 .294 1.47l-2.5.5a.75.75 0 0 1-.552-.104l-14-9a.75.75 0 0 1 .81-1.262l8.627 5.545l.032-.024l2.36-1.687a.25.25 0 0 0 0-.406l-2.35-1.68l-1.383-.922a2.25 2.25 0 0 1-.713-2.976A.75.75 0 0 1 11 8.934" color="#fffefe"></path></svg>

                        {t("studentLessons")}
                        
                    </Link>
                </>
            }

            { loginStatus=="instructor" && 
                <>

                    {/* <Link to='/profileee' className="dropdownLink"> */}
                    <Link to='/instructorMenu/profile' className="dropdownLink">

                        {/* <img src={profileImgHolder}></img> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"/></svg>
                        {t("Profile")}
                    </Link> 

                    <Link className="showMobile dropdownLink" to={'/instructorMenu/teachings'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fffefe" fillRule="evenodd" d="M18.5 3.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m-2.25.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M5.376 3.084a.75.75 0 0 1 1.04-.208l5.994 3.996l.642-.578a2.25 2.25 0 0 1 2.91-.084l1.507 1.204a.75.75 0 0 1 .272.47l.449 2.841l3.226 2.151a.75.75 0 1 1-.832 1.248l-3.5-2.333a.75.75 0 0 1-.325-.507l-.27-1.712l-.659.658a.75.75 0 0 1-.946.094l-9.3-6.2a.75.75 0 0 1-.208-1.04m10.501 4.978l-.851-.68a.75.75 0 0 0-.97.027l-.358.322l1.506 1.004zM11 8.934a.75.75 0 0 1 .285 1.022a.75.75 0 0 0 .239.991l.882.588l.565-.565a.75.75 0 0 1 1.06 1.06l-.374.374l1.64 1.172a1.75 1.75 0 0 1 0 2.848l-1.907 1.363l3.762 2.418l2.202-.44a.75.75 0 1 1 .294 1.47l-2.5.5a.75.75 0 0 1-.552-.104l-14-9a.75.75 0 0 1 .81-1.262l8.627 5.545l.032-.024l2.36-1.687a.25.25 0 0 0 0-.406l-2.35-1.68l-1.383-.922a2.25 2.25 0 0 1-.713-2.976A.75.75 0 0 1 11 8.934" color="#fffefe"></path></svg>

                        {t("Lessons")}
                        
                    </Link>

                    <Link className="showMobile dropdownLink" to={'/instructorMenu/instructorSchedule'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48"><g fill="#fff"><path fillRule="evenodd" d="M12 21a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 0h2v2h-2zm8-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm-18 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm4 0v2h-2v-2zm6-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm2 2h-2v2h2z" clipRule="evenodd"></path><path d="M36 32.5a1 1 0 1 0-2 0v2.914l1.293 1.293a1 1 0 0 0 1.414-1.414L36 34.586z"></path><path fillRule="evenodd" d="M12 7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h10V7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h3a3 3 0 0 1 3 3v16.07A7.001 7.001 0 0 1 35 42a6.99 6.99 0 0 1-5.745-3H9a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h3zm16 28a7 7 0 0 1 6-6.93V18H8v18a1 1 0 0 0 1 1h19.29a7 7 0 0 1-.29-2m12 0a5 5 0 1 1-10 0a5 5 0 0 1 10 0" clipRule="evenodd"></path></g></svg>
                        {t("Schedule")}
                        
                    </Link>

                    <Link className="showMobile dropdownLink" to={'/instructorMenu/statistics'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" fillRule="evenodd" d="M5.5 18a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path><rect width={3} height={7} x={6.5} y={11.5} fill="#fff" rx={0.5}></rect><rect width={3} height={13} x={10.5} y={5.5} fill="#fff" rx={0.5}></rect><rect width={3} height={10} x={14.5} y={8.5} fill="#fff" rx={0.5}></rect></svg>
                        {t("Statistics")}
                        
                    </Link>
                </>
            }


            <button onClick={handleLogout} className="dropdownLink">
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