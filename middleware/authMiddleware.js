const jwt  = require('jsonwebtoken')
const User  = require('../models/users')
var objectId = require('mongodb').ObjectID
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    // check json web token
    if(token){
     jwt.verify(token,'my secret', (err, decodedToken)=>{
         if(err){
             console.log(err.message)
             res.redirect('/login')
         }
         else{
            //  console.log("--------------------------------")
            //  console.log(decodedToken)
            //  console.log("--------------------------------")
             next();
         }

     })
    }
    else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token,'my secret', async(err, decodedToken)=>{
                if(err){
                    console.log(err.message)
                    res.locals.user = null;
                    res.redirect('/login')
                    next();
                }
                else{
                    console.log("...........................")
                    console.log(decodedToken);
                    console.log("...........................")
                    
                    let user = await User.Find({_id:objectId(decodedToken.id)})
                    console.log(user)
                    res.locals.user = user;
                    next();

             
                }
       
            })
        
   
        }
        else{
            res.locals.user = null;
            next()

        }

    }
  


module.exports = {requireAuth, checkUser}