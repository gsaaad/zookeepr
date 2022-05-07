const express = require("express");
const fs = require("fs");
const path = require("path");
const animals = require("./data/animals.json");

var animalsList = animals.animals;
console.log(animalsList);
// console.log(animalsList.length, "this is animal list length");

const PORT = process.env.PORT || 3001;

//use express
const app = express();

//parse incoming string/array data
app.use(express.urlencoded({ extended: true }));

//parse incoming JSON data
app.use(express.json());

//this allows you to access the public folder and utilize CSS/scripts images etc upon loading
app.use(express.static("public"));

//functions

function filterByQuery(query, animalsArray) {
  //had to add animals because it was JSON, turned to array
  let filteredResults = animalsArray;
  //personalityTraits
  let personalityTraitsArray = [];

  //   console.log(filteredResults);

  if (query.personalityTraits) {
    //save PersonalityTraits as a dedicated array
    //if personalityTraits is a string, place it intro a new array and save

    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    //loop through each trait in the personality traits array
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  //return the filtered results
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
}

function createNewAnimal(body, animalsArray) {
  console.log(body, "This is body, from inside createNewAnimal");
  //function's main code
  const animal = body;
  // add to animalsArray
  animalsArray.push(animal);

  //then write into the file itself
  //writeFileSync is synchronous, if data was large enough, use async version
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  //return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  //if no name, or type is not string, not valid
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }

  //if no species, or type not string, not valid
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  //if no diet, or type is not string, not valid
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  //if no personalit traits, or array is not an array, not valid
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

//GET animals DATA
app.get("/api/animals", (req, res) => {
  let results = animalsList;
  // console.log(animals);
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  console.log("Sending results, all animals");
  res.json(results);
});

//sidePage animals data by ID
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animalsList);
  console.log("Sending results, by chosen ID");
  res.json(result);
});

//POST animals DATA
app.post("/api/animals", (req, res) => {
  //req body is where our incoming content will be
  console.log(req.body);
  //set id based on what the next index of the array will be

  console.log(animalsList.length);

  req.body.id = animalsList.length.toString();

  //if any data in req.body is incorrect, send 404 error back

  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted, check input!");
  } else {
    //add animal to json file and animals array in this function

    const animal = createNewAnimal(req.body, animalsList);
    res.json(animal);
  }
});

//get ROUTE, MAIN page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// get ROUTE, side Page/sideData animals
app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});
// get ROUTE, side Page/sideData Zookeepers
app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

//get ROUTE, * Wild Card {COMES LAST}, if user somehow asks for any other route, come here~
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// SERVER IS LIVE
app.listen(PORT, () => {
  console.log(`SERVER ONLINE~, now on port ~${PORT}`);
});
