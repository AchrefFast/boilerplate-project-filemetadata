var express = require('express');
// Muter is a nodejs middleware for handling multipart/form-data which is primary used for uploading files.
// For more information go to :http://expressjs.com/en/resources/middleware/multer.html 
var multer = require('multer');
var cors = require('cors');
require('dotenv').config()
var app = express();
// This is an object that controls the way of how we sotre our files.(destination, and filnames)
var store = multer.diskStorage({
  destination: 'uploades/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
// Here we're creating our multer object and we used the "storage" options to choose the way of saving the file.
var upload = multer({
  storage: store // We also can use dest: "folder" to decide the destination of our storage folder
});


app.use(cors()); // For Testing purposes with FreecodeCamp.
app.use('/public', express.static(process.cwd() + '/public'));// load the static files from public folder

// When visiting the base url send the index.html file from views folder.
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// The POST request when the user upload or submit a file.
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {

  // If the user didn't choose a file
  if (!req.file) {
    throw new Error('You need to choose a file to upload');
  }
  else {
    console.log(req.file);
    const { originalname, mimetype, size } = req.file; // Using Destructuring assignment to get specific values from the req.file object.

    res.json({ "name": originalname, "type": mimetype, "size": size });
  }
})

// If the user send a wrong request that doesn't match one of the above ones.
app.all('*', function (req, res) {
  throw new Error('Bad Request');
})

app.use(function (err, req, res, next) {
  if (err.message === 'Bad Request') {
    res.send(err.message);
  }
  else if (err.message === 'You need to choose a file to upload') {
    res.send(err.message);
  }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
