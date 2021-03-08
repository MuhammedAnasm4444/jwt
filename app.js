var express = require('express')
var hbs = require('express-handlebars')
var MongoClient = require('mongodb').MongoClient
var path = require('path');
var authRoutes = require('./routes/authentication')
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

var app = express();
var hbsHelper = hbs.create({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout/',
    partialsDir:__dirname+'/views/partials/',
    
    // Specify helpers which are only registered on this instance.
    helpers:{
      times: function(n, block) {
        var accum = '';
        for(var i = 1; i <= n; ++i)
            accum += block.fn(i);
        return accum;
    },
    
    }
    
  });


app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbsHelper.engine)

var db = null;
var connect = function(done) {
 const url = 'mongodb://localhost:27017'
 const dbname = 'smoothie'
 MongoClient.connect(url, (err, data)=>{
  if(err) return done(err)

  db = data.db(dbname)

 })
 done()
}
module.exports.get=function(){
 
  return db
}
connect(()=>{
  console.log("database connected")
})


app.use(authRoutes )
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render('home')
} )
app.get('/smoothies',requireAuth,(req, res)=> res.render('smoothies'))

 app.listen(3000)