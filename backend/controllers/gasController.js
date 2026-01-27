const Gas = require("../models/Gas");

exports.getBySize = async (req, res) => {
  const gas = await Gas.find({ size: req.params.size });
  res.json(gas);
};
