let express = require('express');
let app = express();
require('dotenv').config();

let listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + 'index.html');
});