function authoriseStudent(req,res,next){

    if (req.session.loggedinState!=="student") {
      return res.status(401).end();
    } else {
        next();
      }
  }
  
  
function authoriseInstructor(req,res,next){
    if (req.session.loggedinState!=="instructor") {
        return res.status(401).end();
    } else {
        next();
    }
}

export {authoriseStudent, authoriseInstructor}
