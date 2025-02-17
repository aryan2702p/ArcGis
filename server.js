const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const Authrouter = require('./Routes/auth');
const FeatureRouter= require('./Routes/FeatureLayer');
const GraphicRouter= require('./Routes/Graphics');
const GraphicLayerRouter= require('./Routes/GraphicLayer');
const indexRouter= require('./Routes/static/index');
const LoginRoter= require('./Routes/static/login');
const SignupRouter= require('./Routes/static/signup');

//const path= require('path');
// Connect to MongoDB
// i have used my local mongodb connection (compass) to connect to the database

const uri = process.env.MONGODB_URI;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const app = express();
// app.use(express.static('public'));
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Whitelist specific origin(s)
  methods: ['GET', 'POST','PUT'], // Allow specific HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(bodyParser.json());




const store = new MongoDBStore({
  uri: uri,
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


// static files route
app.use('/', indexRouter.router);
app.use('/login', LoginRoter.router);
app.use('/signup', SignupRouter.router);



  app.use('/auth',Authrouter.router);
  app.use('/api/save-feature',FeatureRouter.router);
  app.use('/api/graphic', GraphicRouter.router);
  app.use('/api/save-graphicLayer', GraphicLayerRouter.router);
  app.use(express.static(path.join(__dirname, 'public')));



// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


