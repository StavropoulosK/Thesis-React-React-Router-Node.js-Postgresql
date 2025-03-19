import "./choseLessonParams.css"


export default function ChoseLessonParams(){

    return(
        <>
        <section className="blackBackground">
            <article className="choseLessonParams">
                    <article className="illustrationContainer">
                        <img className="illustration" src="/illustrations/snowboarding.png" ></img>
                    </article>

                    <article className="lessonParams">
                        <button>
                            <img src="icons/startPage/close.png"/>
                        </button>
                        <h2>
                            Ξεκίνηστε και εσείς να κατεβαίνετε το βουνό
                        </h2>
                        <p>
                            Παρακαλούμε επιλέξτε  χιονοδρομικό κέντρο,  ημερομηνίες,  άθλημα και πόσα άτομα θα συμμετέχετε  για να δείτε τα διαθέσιμα μαθήματα
                        </p>
                    </article>

            </article>
        </section>
        </>
    )
}