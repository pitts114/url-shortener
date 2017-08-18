var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var mongo = require("mongodb")
var mongo_uri = process.env.MONGODB_URI //ENV['MONGODB_URI']
var urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: false}));


app.get("/api", (req, res) => {
  res.end()
})

app.post("/api/", (req, res) =>{
  console.log(req.body)

})


app.listen(app.get("port"), function (){
  console.log("Node app is running at http://localhost:" + app.get('port'))
})



function isValidURL (str) {
}
//
