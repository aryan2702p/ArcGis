const mongoose = require('mongoose');
const {Schema} = mongoose;

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
    },
    user:{ type: Schema.Types.ObjectId, 
        ref: 'User', required: true
    }
});

exports.User=mongoose.model('Graphics',GraphicObjectSchema);