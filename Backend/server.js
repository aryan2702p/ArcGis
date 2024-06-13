const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {Authrouter} = require('./Routes/auth');

// Connect to MongoDB
// i have used my local mongodb connection (compass) to connect to the database
mongoose.connect('mongodb://localhost:27017/ArcGis');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Define a schema and model for the features
const featureLayerSchema = new mongoose.Schema({
    data: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  const GraphicObjectSchema = new mongoose.Schema({
    geometry: {
        type: {
            type: String,
            enum: ['point'],
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    attributes: {
        Name: {
            type: String,
            required: true
        },
        Type: {
            type: String,
            enum: ['National Monument'],
            required: true
        }
    }
});
 const GraphicObject = mongoose.model('GraphicObject', GraphicObjectSchema);
  const FeatureLayer = mongoose.model('FeatureLayer', featureLayerSchema);
// Endpoint to save modified features
app.post('/api/save-feature', async (req, res) => {
    console.log("layer edit request");
    try {
      const newLayer = new FeatureLayer({
        data: req.body.data,
      });
      await newLayer.save();
      res.status(201).send(newLayer);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post('/api/save-graphic', async (req, res) => {
    console.log("graphic edit request");
    const newGraphic = new GraphicObject(req.body);

    newGraphic.save()
        .then(graphic => res.json(graphic))
        .catch(err => res.status(400).json({ error: err.message }));
  });


// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});

app.use('/auth',Authrouter.router);
