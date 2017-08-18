let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let authenticate = require('./middleware/authenticate')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let userRoutes = require('./routes/userRoutes')
app.use('/', userRoutes)

let mRoutes = require('./routes/mainRoutes')
app.use('/', authenticate, mRoutes)

app.listen(3000, function(){
  console.log("App running on port 3000")
})