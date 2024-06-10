const mongoose = require('mongoose');
const fastify = require('fastify')();
const cors = require('@fastify/cors');

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/ArcGis')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use CORS middleware
fastify.register(cors, {
  origin: true,
});

// Parse JSON bodies
fastify.register(require('@fastify/formbody'));

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

const FeatureLayer = mongoose.model('FeatureLayer', featureLayerSchema);

// Endpoint to save modified features
fastify.post('/api/save-feature', async (request, reply) => {
  console.log("Layer saved to database");
  try {
    const newLayer = new FeatureLayer({
      data: request.body.data,
    });
    await newLayer.save();
    reply.status(201).send(newLayer);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    console.log('Server running on port 5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
