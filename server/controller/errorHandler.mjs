function errorHandler(err, req, res, next) {
    console.log('error Handler')
    console.error(err)
    if (res.headersSent) {
       // Αν έχει σταλεί απάντηση, τότε δεν μπορούμε να στείλουμε και άλλη οπότε παραπέμπουμε στον default error handler
       return next(err); //  default error handler
    } else {
        // res.status(500).send('<p>Σφάλμα: ' + err.message +'<br>'+err.stack+'</br>'+ '</p><a href="/">Επιστροφή</a>')
        res.status(500).send(err.message)

    }
 
 }
 export{errorHandler}
