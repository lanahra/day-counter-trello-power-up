require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'https://trello.com' }));
app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
  console.log('Server listening on port ' + listener.address().port);
});
