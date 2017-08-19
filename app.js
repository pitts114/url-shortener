var siteUrl = "https://dry-plains-62025.herokuapp.com/"
var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var mongo = require("mongodb")
var mongo_uri = process.env.MONGODB_URI //ENV['MONGODB_URI']
var urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
var mongo = require("mongodb").MongoClient


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/api/*", (req, res) => {
  //not using queries at the moment, so just get url from the pathname
  res.setHeader('Content-Type', 'application/json');

  var url = req.originalUrl.slice(5, req.originalUrl.length)
  if (!IsValidUrl(url)) {
    res.jsonp({
      error: "Invalid format."
    })
    res.end()
    return
  }
  res.jsonp({
    original_url: url,
    short_url: siteUrl + shortUrl(url)
  })
})

app.get("/*", (req, res) => {
  //if the short code has an associated url, redirect user to url.
  //else, redirect to the frontpage if the site
  var codeStr = req.originalUrl.slice(1, req.originalUrl.length)
  var redirectUrl = getRedirectUrl(codeStr)
  if (!redirectUrl) { //if redirectUrl is undefined (url hasnt been shortend yet)
    res.redirect(siteUrl)
    return
  }
  res.redirect(redirectUrl)
})


app.listen(app.get("port"), function() {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})



function IsValidUrl(str) {
  if (str.match(urlRegex))
    return true
  return false
}

function shortUrl(str) {
  //checks if a short url exists
  return false
}

function getRedirectUrl(codeStr) {
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



//website.com/1847
//take the code str and see if its in the database or redirect to frontpage
//





//
