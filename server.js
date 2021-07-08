var express = require('express');
var multer = require('multer');
var cors = require('cors');
require('dotenv').config()
var app = express();

var store = multer.diskStorage({
  destination: 'uploades/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: store // We also can use dest: "folder" to decide the destination of our storage folder
});


app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    throw new Error('You need to choose a file to upload');
  }
  else {
    console.log(req.file);
    const { originalname, mimetype, size } = req.file;

    res.json({ "name": originalname, "type": mimetype, "size": size });
  }
})

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
