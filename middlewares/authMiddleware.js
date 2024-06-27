module.exports = function (req, res, next) {
    console.log("checking session");
     if (req.session.userId) {
      return next();
    } else {
         console.log("session error");
         
         return res.status(401);
    }
  };
  