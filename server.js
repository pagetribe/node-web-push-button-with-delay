
const webpush = require('web-push')
var express = require('express')
var app = express()
app.use(express.json())       // to support JSON-encoded bodies replaces bodyparser
app.use(express.urlencoded()) // to support URL-encoded bodies

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY
webpush.setVapidDetails('mailto:val@karpov.io', publicVapidKey, privateVapidKey)

app.use(express.static('public'))

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.post('/sendNotification', (req, res) => {
 const subscription = req.body.subscription
 const delay = req.body.delay
 
 const payload = JSON.stringify({ title: `Testing with delay of ${delay} seconds` })
 
 setTimeout(function() {
    webpush.sendNotification(subscription, payload)
    .then(function() {
      res.sendStatus(201)
    })
    .catch(function(error) {
      res.sendStatus(500)
      console.log(error)
    })
  }, delay * 1000)
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
