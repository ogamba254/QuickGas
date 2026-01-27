const router = require("express").Router();
const { getBySize } = require("../controllers/gasController");

router.get("/:size", getBySize);

module.exports = router;
