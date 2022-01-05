const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const multer = require('multer');
const path = require('path')
require('dotenv').config()
const { cloudinaryConfig } = require('./storage/cloudinary.config');

// Set up the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Log requests to the console.
app.use(logger('dev'));
app.use(cors())
// app.use('*',cloudinaryConfig);


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('*', cloudinaryConfig);
// Require our routes into the application.
// require('./server/routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const db = require("./models");
db.sequelize.sync();
// importing all blog routes
require("./routes/blog.routes")(app);
// importing all image upload, download , getall routes
require("./routes/image.routes")(app);


// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));
// Image Upload Routes


