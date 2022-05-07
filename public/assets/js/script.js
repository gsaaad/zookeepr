const $animalForm = document.querySelector("#animal-form");

const handleAnimalFormSubmit = (event) => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = "";
  }

  const selectedTraits = $animalForm.querySelector(
    '[name="personality"'
  ).selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  //add Fetch Api to function, handle Submit Form.

  fetch("/api/animals", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(animalObject),
  })
    //first, fetch api/animals, POST method
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      alert("Error: " + response.statusText);
    })
    //then if response is good, return jsonResponse, else, Alert + error + the status text
    .then((postResponse) => {
      console.log(postResponse);
      alert("Thank you for adding an animal!s");
    });
  //then show us that animal input post, and send user a message back!
};

$animalForm.addEventListener("submit", handleAnimalFormSubmit);
