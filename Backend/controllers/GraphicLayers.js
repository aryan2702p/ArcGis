const { GraphicLayer}= require('../models/GraphicLayer');

exports.saveLayer=async (req, res)=>{
    try {
        const newLayer = new GraphicLayer
        ({
          data: req.body.data,
          user: req.body.userId,
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
  const {userId} = req.params;
  try {
    console.log("userId: " + userId);
      const layer = await GraphicLayer.find({ user: userId });
      res.status(200).json(layer);
      console.log("layer Fetched",layer);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }

}