const {FeatureLayer}= require('../models/FeatureLayer');

exports.saveLayer=async (req, res)=>{
    try {
        const newLayer = new FeatureLayer({
          data: req.body.data,
        });
        await newLayer.save();
        res.status(201).send(newLayer);
      } catch (error) {
        res.status(500).send(error.message);
      }

}