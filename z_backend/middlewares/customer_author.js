
async function cutomer_authorisation(req,res,next) {
   if(!req.session.customer) {
      return res.redirect("/customer/signin");
   }
   next()
} 
module.exports = cutomer_authorisation;