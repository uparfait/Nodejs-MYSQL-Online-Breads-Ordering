async function Authorisation(req,res,next) {
   if(!req.session.admin) {
      return res.redirect("/adminstrator/signin");
   }
   next();
} 
module.exports = Authorisation;