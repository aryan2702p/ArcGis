const {GraphicObject}= require('../models/Graphic');

exports.saveGraphics=async(req, res)=>{
  console.log('saving Graphics');
    const newGraphic = new GraphicObject(req.body);

    newGraphic.save()
        .then(graphic => res.status(201).json(graphic))
        .catch(err => res.status(400).json({ error: err.message }));
}

exports.fetchGraphicsById=async(req, res)=>{
    const {userId} = req.params;
    console.log("Fetching graphic by user id"+ userId);
    try {
        const Graphics = await GraphicObject.find({ userId: userId });
        //console.log("Fetched graphic"+ Graphics);
        res.status(200).json(Graphics);
      } catch (err) {
        res.status(400).json(err);
      }
    
}

exports.updateGraphic = async (req, res) => {
  try {
      const Graphics = await GraphicObject.findOne({ userId: req.params.userId, uid: req.params.uid });
      if (!Graphics) {
          return res.status(404).json({ message: 'Graphic not found' });
      }

      Graphics.graphic = req.body.graphic;
      Graphics.cost = req.body.cost;

      const updatedGraphic = await Graphics.save();
      res.json(updatedGraphic);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.deleteGraphics = async (req, res) => {
  try {
      const Graphics = await GraphicObject.findOneAndDelete({ userId: req.params.userId, uid: req.params.uid });
      if (!Graphics) {
          return res.status(404).json({ message: 'Graphic not found' });
      }

      res.json({ message: 'Graphic deleted' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.deleteAllGraphics = async (req, res) => {
  try {
      const Graphics = await GraphicObject.deleteMany({ userId: req.params.userId });
      if (!Graphics) {
          return res.status(404).json({ message: 'Graphics not found' });
      }
      console.log("All Graphics deleted");

      res.json({ message: 'All Graphics deleted' });

  } catch (error) {
    console.log("Error in delete all graphics"+ error);
      res.status(500).json({ message: error.message });
  }
};