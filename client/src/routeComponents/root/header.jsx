import {Link} from "react-router-dom"

import "./header.css"



export default function Header({onReservationClick}){

    console.log('header exe')


    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} className="logo"> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button onClick={onReservationClick}> Κράτηση</button>
                        <Link to={'/'}> Είσοδος</Link>
                        <Link to={'/'}> Εγγραφή Προπονητή</Link>
                        <button>asdasd</button>
                    </div>

                </nav>


            
            </header>

            
        </>
    )
}