var express = require("express")
var app = express()
var mongo = require("mongodb")
//var mongo_uri = ENV['MONGODB_URI']

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


app.get("/api", (req, res) => {
  res.end()
})



app.listen(app.get("port"), function (){
  console.log("Node app is running at http://localhost:" + app.get('port'))
})

//
