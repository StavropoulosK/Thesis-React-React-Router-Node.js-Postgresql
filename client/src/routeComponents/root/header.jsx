import {Link } from "react-router-dom"
import {memo} from "react"

import "./header.css"

// const Header= memo (({onReservationClick,onLogoClickDuringSettingReservationParams,urlPath})=>{


const Header= memo (({setIsChooseLessonParamsOpen,urlPath})=>{

        


    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} className="logo" onClick={urlPath==="/"?()=>setIsChooseLessonParamsOpen(false):null}> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={()=>setIsChooseLessonParamsOpen(true)}> Κράτηση</button>
                        <Link to={'/'}> Είσοδος</Link>
                        <Link to={'/'}> Εγγραφή Προπονητή</Link>
                        <button>asdasd</button>
                    </div>

                </nav>


            
            </header>

            
        </>
    )
})

export default Header