import "./overview.css"
import TopBar from "../../reusableComponents/topBar/TopBar";

import { useLocation,redirect,useNavigate } from 'react-router-dom';


export async function overViewLoader({request,params}){           

    let status

    try {

        const response = await fetch('/api/getLoginStatus')
    if (!response.ok) {
        throw new Error(`Error connecting to server`);
    }

        const data = await response.json();
        status= data.status

    if(!status){
        let params = new URLSearchParams();
        params.set("fromPage", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());

    }

    }
        catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return null
};



export function Overview(){
    const location = useLocation();
    const { fromPage } = location.state || {};

    console.log("#!#!# ",fromPage)

    const navigate = useNavigate();


    return(<>
    
        <TopBar completed={3}></TopBar>

        <section className="overview">

            {fromPage &&
                <button className="back" onClick={()=>navigate(fromPage)}>

                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20V4m0 0l6 6m-6-6l-6 6"></path></svg>


                    Επιστροφή
                </button>
            }

        </section>

    
    </>)
}
