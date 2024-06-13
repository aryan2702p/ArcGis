const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Authrouter = require('./Routes/auth');
const FeatureRouter= require('./Routes/FeatureLayer');
const GraphicRouter= require('./Routes/Graphics');

// Connect to MongoDB
// i have used my local mongodb connection (compass) to connect to the database
mongoose.connect('mongodb://localhost:27017/ArcGis');

const app = express();
app.use(bodyParser.json());
app.use(cors());


  app.use('/auth',Authrouter.router);
  app.use('/api/save-feature',FeatureRouter.router);
  app.use('/api/save-graphic', GraphicRouter.router);

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


