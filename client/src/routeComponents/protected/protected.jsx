import {redirect  } from "react-router-dom";

export async function protectedLoader({request,params}){            // ta prostateymena loaders kai actions tha elegxoun an iparxei session, an den iparxei pernoun to trexon url, kanoun redirect sto /login bazontas
                                                                    // sta url params to trexon url. to login exei stin forma ena krifo field me to location from, otan patithi i forma , o loginaction diabazi to formdata gia to from
                                                                    // kai kanei redirect. episis to form exei replace gia na min kataxorithi to login sto istoriko. 
    console.log("protected loader")
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
            params.set("from", new URL(request.url).pathname);
            console.log("####### ",params)
            return redirect("/login?" + params.toString());

        }

    }
    catch (error) {
        console.error('Error connecting to server', error);
        throw error;
    }

    return null
  };


  export default function Protected(){

    return(<>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div>

            Protected component
        </div>
    </>)
  }
