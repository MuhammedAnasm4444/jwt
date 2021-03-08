const { response } = require('express');
var db =  require('../app');
const bcrypt = require('bcrypt')



const models = {
    User : (data) => {
        return new Promise((resolve, reject)=>{
            db.get().collection('users').insertOne(data).then((response)=>{
                resolve(response.ops[0])
            })
        })
       
    },
    Login : (data) => {
        return new Promise (async(resolve, reject) => {
            var user = await db.get().collection('users').findOne({email:data.email})
            console.log(user)
            if (user) {
               const auth = await bcrypt.compare(data.password, user.password)
               if (auth) {
                    return resolve(user)
               }
               throw Error("incorrect Password")
            }
            throw Error("incorrect Email")
        })

    }
    ,Find: (data)=>{
       var user = db.get().collection('users').findOne(data)
       return user
    },
        
    

    
}



module.exports  =  models