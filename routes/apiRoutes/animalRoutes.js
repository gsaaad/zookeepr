//ROUTES for API/DATA
const router = require("express").Router();
const {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
} = require("../../lib/animals");

const { animals } = require("../../data/animals.json");

//get Animal Data using Query

router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

//get Animal Data using ID
// router.get("/animals/:id", (req, res) => {
//   const result = findById(req.params.id, animals);
//   console.log(result);
//   if (result) {
//     res.json(result);
//   } else {
//     res.send(404);
//   }
// });
router.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

//Post Animal Data

router.post("./animals", (req, res) => {
  //set id based on what the next index of the array will be

  req.body.id = animals.length.toString();

  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted");
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

module.exports = router;
