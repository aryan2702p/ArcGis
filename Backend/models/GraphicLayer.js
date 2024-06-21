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
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  });

  exports.GraphicLayer=mongoose.model('GraphicLayer',GraphicLayerSchema);