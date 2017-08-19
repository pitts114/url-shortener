var siteUrl = "https://dry-plains-62025.herokuapp.com/"
var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var mongo_uri = process.env.MONGODB_URI //ENV['MONGODB_URI']
var urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
var mongo = require("mongodb").MongoClient
//document format: {code, url}
var codeCount = 1000 //this assigns the url a code in the database, should get
//desired value from database

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
  mongo.connect(mongo_uri, (err, db) => {
    //see if the code for the url exists
  })

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

//sets the codeCount to the next code
//when a url is shortened, the count in the database will increase
mongo.connect(mongo_uri, (err, db) => {
  var collection = db.collction("url")
  collection.find({_id:"codeCount"}).toArray((err, docs) => {
    if (err) throw err
    codeCount = docs[0].val
    db.close()
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
      console.log("docs found for " + url)
      console.log(docs)
      var code
      if (docs.length == 0){ //not found
        console.log("making new code for " + url)
        code = makeCode(collection, url)
      }
      else {
        code = docs[0].code.toString()
      }

      res.jsonp({
        "original_url": url,
        "short_url": siteUrl + code
      })
      res.end()
      db.close()
    })
  })
}


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
