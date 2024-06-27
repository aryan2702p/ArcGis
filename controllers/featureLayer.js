const { featureLayer}= require('../models/FeatureLayer');

exports.saveLayer=async (req, res)=>{
    try {
        const newLayer = new featureLayer
        ({
          data: req.body.data,
        });
        await newLayer.save();
        res.status(201).send(newLayer);
        console.log("layes saved sucess");
      } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
      }

}

exports.GetLayer=async (req, res)=>{
  const {id} = req.params;
  try {
      const layer = await featureLayer.findById(id);
      res.status(200).json(layer);
      console.log("layer Fetched")
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }

}