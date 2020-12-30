const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist/adminpanel'));

// Send all requests to index.html
console.log("im here")
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/adminpanel/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 4000);
