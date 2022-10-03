var jwt = require('jsonwebtoken')

module.exports = async (req,res,next) => {
    if (!req.headers.authorization) {
        return res.badRequest({ error: "authorization is empty" });
      }
    
      var token = req.header("authorization").split("Bearer ")[1];
    
      if (!token) {
        return res.badRequest({ error: "authorization bearer invalid" });
      }
    
      return jwt.verify(token, sails.config.session.secret, async function (
        err,
        payload
      ) {
        if (err) {
          console.log(err.message);
          return res.status(401).json(
            {
              token_expired : true,
              msg : "TOKEN EXPIRED"
            });
        }
    
        req.user = await User.findOne({
          where: { id: payload.id },
          select: ["id", "name", "email", "picture", "job","role"],
        });
    
        return next();
      });
}