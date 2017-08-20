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
  res.setHeader('Content-Type', 'application/json')
console.log(req.url)

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
    var collection = db.collection("urls")
    collection.find({
      url: url
    }).toArray((err, docs) => {
      if (err) throw err
      if (docs.length == 0) { //if not found, make a new doc, change codeCount,
        //then send response
        collection.insert({code: codeCount++, url: url})
        collection.update({_id: "codeCount"}, {$set: {val: codeCount}}, (err) => {
          if (err) throw err
          db.close()
        })
        res.jsonp({
          original_url: url,
          short_url: siteUrl + (codeCount - 1).toString()
        })
        res.end()
      } else { //if found, send json
        res.jsonp({
          original_url: url,
          short_url: siteUrl + docs[0].code.toString()
        })
        res.end()
      }
    })
  })

})

app.get("/*", (req, res) => {
  //if the short code has an associated url, redirect user to url.
  //else, redirect to the frontpage if the site
  var codeStr = req.originalUrl.slice(1, req.originalUrl.length)
  console.log(codeStr)
  if (isNaN(Number(codeStr))) {
    res.redirect(siteUrl)
    return
  }

  mongo.connect(mongo_uri, function(err, db) {
    if (err) {
      console.log("Error connecting to the database")
      throw err
    }
    var collection = db.collection("urls")
    collection.find({
      code: Number(codeStr)
    }).toArray(function(err, docs) {
      if (err) throw err
      if (docs.length == 1) {
        var url = docs[0].url
        console.log("redirecting to " + url)
        res.redirect("http://" + url.replace("http://", '').replace("https://", ''))
        res.end()
      } else if (docs.length == 0) {
        console.log(codeStr + " not found in database, go to frontpage")
        res.redirect(siteUrl)
      } else {
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
  if (err) throw err
  var collection = db.collection("urls")
  collection.find({
    _id: "codeCount"
  }).toArray((err, docs) => {
    if (err) throw err
    codeCount = docs[0].val
    db.close()
  })
})

app.listen(app.get("port"), function() {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})



function IsValidUrl(str) {
  if (str.toLowerCase().match(urlRegex))
    return true
  return false
}


function getRedirectUrl(codeStr, res) {
  mongo.connect(mongo_uri, (err, db) => {
    if (err) {
      console.log("Could not connect to database")
      throw err
    }
    var collection = db.collection("urls")
    var result = collection.find({
      code: Number(codeStr)
    }, (err, results) => {
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
