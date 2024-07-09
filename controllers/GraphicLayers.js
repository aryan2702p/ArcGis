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
    
      const layer = await GraphicLayer.find({ user: userId });
      res.status(200).json(layer);
      console.log("layer Fetched");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }

}

exports.UpdateLayer= async(req, res)=>{
  try {
    const totalCost = parseFloat(req.body.total_cost);

    if (isNaN(totalCost)) {
      return res.status(400).send('Invalid total_cost value');
    }

    const updateData = {
      data: req.body.data,
      total_cost: totalCost
    };
    //console.log("layer data",req.body)
    const layer = await GraphicLayer.findOneAndUpdate(
      { user: req.body.userId },
      { $set: updateData },
      { new: true, upsert: true } // Create document if it doesn't exist
    );
    res.status(200).json(layer);

    console.log('Updated GraphicLayer:');
  } catch (err) {
    console.error('Error updating GraphicLayer:', err);
    res.status(500).send(err.message);

  }
}