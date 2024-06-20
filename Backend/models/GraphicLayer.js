const mongoose = require('mongoose');
const Schema = mongoose;

const GraphicLayerSchema = new mongoose.Schema({
    data: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  exports.GraphicLayer=mongoose.model('GraphicLayer',GraphicLayerSchema);