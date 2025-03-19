import {Link} from "react-router-dom"

import "./header.css"
import Dropdown from "../../reusableComponents/dropdown/dropdown.jsx"



export default function Header(){



    return(
        <>
            <header>
                <nav>
                    <div className="nav-left">
                        <Link to={'/'} className="logo"> Easy Snow</Link>

                    </div>


                    <div className="nav-right">
                        <button> Κράτηση</button>
                        <Link to={'/'}> Είσοδος</Link>
                        <Link to={'/'}> Εγγραφή Προπονητή</Link>
                        <button>asdasd</button>
                    </div>

                </nav>


            
            </header>

            
        </>
    )
}