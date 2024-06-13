const mongoose = require('mongoose');
const {Schema} = mongoose;

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

  exports.featureLayer=mongoose.model('FeatureLayer',featureLayerSchema);