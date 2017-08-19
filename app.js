var siteUrl = "https://dry-plains-62025.herokuapp.com/"
var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var mongo_uri = process.env.MONGODB_URI //ENV['MONGODB_URI']
var urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
var mongo = require("mongodb").MongoClient
//document format: {code, url}

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/api/*", (req, res) => {
  //creates a short code from url and returns json
  //not using queries at the moment, so just get url from the pathname
  //if wildcard is a valid url, create a shortcode and return json, or return
  //existing json
  res.setHeader('Content-Type', 'application/json');

  var url = req.originalUrl.slice(5, req.originalUrl.length)
  if (!IsValidUrl(url)) { //not valid
    res.jsonp({
      error: "Invalid format."
    })
    res.end()
    return
  }
  shortenUrl(url, res)
})

app.get("/*", (req, res) => {
  //if the short code has an associated url, redirect user to url.
  //else, redirect to the frontpage if the site
  var codeStr = req.originalUrl.slice(1, req.originalUrl.length)
  if (isNaN(Number(codeStr))){
    res.redirect(siteUrl)
    return
  }

  mongo.connect(mongo_uri, function (err, db) {
    if (err) {
      console.log("Error connecting to the database")
      throw err
    }
    var collection = db.collection("urls")
    collection.find({code: Number(codeStr)}).toArray(function(err, docs) {
        if (err) throw err
        if (docs.length == 1){
          var url = docs[0].url
          res.redirect(url)
        }
        else if (docs.length == 0){
          console.log(codeStr + " not found in database, go to frontpage")
          res.redirect(siteUrl)
        }
        else {
          console.log("More than 2 docs for " + codeStr)
          res.redirect(siteUrl)
        }
        db.close()
    })
  })
})


app.listen(app.get("port"), function() {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})



function IsValidUrl(str) {
  if (str.match(urlRegex))
    return true
  return false
}

function shortenUrl(url, res) {
  //send json response
  //if url not found in database, make new code and add to database
  //send repsonse
  mongo.connect(mongo_uri, (err, db) => {
    if (err){
      console.log("Error connection to database")
      throw err
    }
    var collection = db.collection("urls")
    collection.find({url: url}).toArray((err, docs) => {
      if (err) throw err

    })
  })
}

function makeCode(collection){
  //returns a code to associate with url
var code = collection.find({_id: "codeCount"}).toArray()[0].val
collection.updateOne({_id: "codeCount"}, {$set: {val: code + 1 }})
return code.toString()
}

/*
function getRedirectUrl(codeStr, res) {
  mongo.connect(mongo_uri, (err, db) => {
    if (err){
      console.log("Could not connect to database")
      throw err
    }
    var collection = db.collection("urls")
    var result = collection.find({code: Number(codeStr)}, (err, results) =>{
      if (err) {
        console.log("error finding stuff")
        throw err
      }
    }).toArray()
    console.log(result)
    if (result[0].url) {
      return result[0].url
    }
    return undefined
  })
}
*/


//website.com/1847
//take the code str and see if its in the database or redirect to frontpage
//





//
