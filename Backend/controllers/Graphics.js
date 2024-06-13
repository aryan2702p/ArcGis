const {GraphicObject}= require('../models/Graphic');

exports.saveGraphics=async(req, res)=>{
    const newGraphic = new GraphicObject(req.body);

    newGraphic.save()
        .then(graphic => res.json(graphic))
        .catch(err => res.status(400).json({ error: err.message }));
}