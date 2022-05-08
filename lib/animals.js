const fs = require("fs");
const path = require("path");

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
    return result;
  } else {
    console.log("Error in filter by ID");
    return;
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
    path.join(__dirname, "../data/animals.json"),
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

module.exports = { filterByQuery, findById, createNewAnimal, validateAnimal };
