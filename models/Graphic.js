const mongoose = require('mongoose');
const Schema = mongoose;

const GraphicObjectSchema = new mongoose.Schema({
    graphic: { type: Object, required: true },
    cost: { type: Number, required: true },
    uid: { type: Number, required: true},
   
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

exports.GraphicObject=mongoose.model('Graphics',GraphicObjectSchema);