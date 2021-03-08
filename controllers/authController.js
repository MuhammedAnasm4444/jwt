const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports.signup_get = (req, res) =>{
    res.render('signup');
}


var db = require('../app');
const maxAge = 3 * 34 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({id}, 'my secret', {
        expiresIn:maxAge
    })
}

module.exports.login_get = (req, res) =>{
    res.render('login');
}
module.exports.signup_post = async(req, res) =>{
    const { email, password } = req.body;
   req.body.password = await bcrypt.hash(req.body.password,10)
   console.log(req.body)
   
    try {
       
       const user =  await User.User(req.body).then((res) => {
            var userId = res._id
           return userId
       })
       console.log(user)
       const token = createToken(user)
       console.log(token)
       res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge * 1000})
       res.status(201).json({_id:user})
      
      

    }
    catch (err) {
      console.log(err)
      res.status(400).send('error, user not created')
    }
}
module.exports.login_post = async (req, res) =>{
    
   try {

    console.log(req.body)
    const user  =   await User.Login(req.body)
    console.log("hello"+user._id)
        if(user){
            
            const token = createToken(user._id)
            res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge *1000})
            res.status(200).json({userId:user._id})
            console.log(user)

        }

   }
   catch (err) {
       res.status(404)

   }
    
}
module.exports.logout_get =  (req, res)=>{
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/');
}