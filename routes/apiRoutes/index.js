const router = require("express").Router();
const animalRoutes = require("../apiRoutes/animalRoutes");
const zooKeepersRoutes = require("../apiRoutes/zookeepersRoutes");

router.use(animalRoutes);
router.use(zooKeepersRoutes);
module.exports = router;
