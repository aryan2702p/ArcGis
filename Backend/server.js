const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const Authrouter = require('./Routes/auth');
const FeatureRouter= require('./Routes/FeatureLayer');
const GraphicRouter= require('./Routes/Graphics');
const GraphicLayerRouter= require('./Routes/GraphicLayer');
//const path= require('path');

// Connect to MongoDB
// i have used my local mongodb connection (compass) to connect to the database
mongoose.connect('mongodb://localhost:27017/ArcGis');

const app = express();
// app.use(express.static('public'));
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Whitelist specific origin(s)
  methods: ['GET', 'POST','PUT'], // Allow specific HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(bodyParser.json());




const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/ArcGis',
  collection: 'sessions',
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with your secret key
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

  app.use('/auth',Authrouter.router);
  app.use('/api/save-feature',FeatureRouter.router);
  app.use('/api/save-graphic', GraphicRouter.router);
  app.use('/api/save-graphicLayer', GraphicLayerRouter.router);

  // Set session data
app.get('/set-session', (req, res) => {
  req.session.user = { username: 'exampleUser' };
  res.send('Session data set');
});

// Get session data
app.get('/get-session', (req, res) => {
  const userData = req.session.user || 'No session data found';
  res.send(userData);
});


// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


