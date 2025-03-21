import "./choseLessonParams.css"

import { Form } from "react-router-dom";


import Dropdown from "./../../reusableComponents/dropdown/dropdown.jsx"


export default function ChoseLessonParams({onReservationClick}){

    return(
        <>
        <section className="blackBackground">
            <article className="choseLessonParams">
                    <article className="illustrationContainer">
                        <img className="illustration" src="/illustrations/snowboarding.png" ></img>
                    </article>

                    <article className="lessonParams">
                        <button className="close" onClick={onReservationClick}>
                            <img src="icons/startPage/close.png"/>
                        </button>
                        <h2>
                            Ξεκίνηστε και εσείς να κατεβαίνετε το βουνό
                        </h2>
                        <p>
                            Παρακαλούμε επιλέξτε  χιονοδρομικό κέντρο,  ημερομηνίες,  άθλημα και πόσα άτομα θα συμμετέχετε  για να δείτε τα διαθέσιμα μαθήματα
                        </p>

                        <Form action="/" method="get">
                            <Dropdown options={["Ανηλίου", "Βασιλίτσας", "Βελουχίου", "Ελατοχωρίου", "Καϊμακτσαλάν", "Καλαβρύτων", "Μαινάλου", "Παρνασσού", "Πηλίου", "Πισοδερίου", "Φαλακρού", "3-5 Πηγάδια"]} text={"Χιονοδρομικό Κέντρο"} icon={"../../../public/icons/lessonParams/pinIcon.png"}/>
                            <Dropdown options={["Χιονοδρομία","Χιονοσανίδα","Καθιστή χιονοδρομία"]} text={"Δραστηριότητα"} icon={"../../../public/icons/lessonParams/ski.png"}/>
                            <Dropdown options={['1 άτομο','2 άτομα','3 άτομα','4 άτομα','5 άτομα','6 άτομα']} text={"Πλήθος ατόμων"} icon={"../../../public/icons/lessonParams/numberOfParticipants.png"}/>

                        </Form>

                    </article>


            </article>
        </section>
        </>
    )
}