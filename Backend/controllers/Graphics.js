const {GraphicObject}= require('../models/Graphic');

exports.saveGraphics=async(req, res)=>{
    const newGraphic = new GraphicObject(req.body);

    newGraphic.save()
        .then(graphic => res.status(201).json(graphic))
        .catch(err => res.status(400).json({ error: err.message }));
}

exports.fetchGraphicsById=async(req, res)=>{
    const {userId} = req.params;
    try {
        const Graphics = await GraphicObject.find({ user: userId });
        res.status(200).json(Graphics);
      } catch (err) {
        res.status(400).json(err);
      }
    
}