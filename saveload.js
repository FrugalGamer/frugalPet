"use strict"

// From here: https://foolishdeveloper.com/save-textarea-text-to-a-file-using-javascript/
function downloadFile(filename, content) {
  // It works on all HTML5 Ready browsers as it uses the download attribute of the <a> element:
  const element = document.createElement("a");
  
  //A blob is a data type that can store binary data
  // “type” is a MIME type
  // It can have a different value, based on a file you want to save
  const blob = new Blob([content], { type: "plain/text" });
  //createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
  const fileUrl = window.URL.createObjectURL(blob);
  
  //setAttribute() Sets the value of an attribute on the specified element.
  element.setAttribute("href", window.URL.createObjectURL(blob)); //file location
  element.setAttribute("download", filename); // file name
  element.style.display = "none";
  
  //use appendChild() method to move an element from one element to another
  document.body.appendChild(element);
  element.click();
  
  //The removeChild() method of the Node interface removes a child node from the DOM and returns the removed node
  //document.body.removeChild(element);
  //Release fileURL object for memory reasons
  URL.revokeObjectURL(blob.URL);
};

function savePetToFile(){
	// Create a new object for storing pet data in
	let data = new Object();

	// Here we just grab all the data from the screen and our pet objects and throw it in the right place
	data.name = document.querySelector("#name1").innerText;
	data.age = age.current;
	data.hunger = hunger.current;
	data.energy = energy.current;
	data.hygiene = hygiene.current;
	data.health = health.current;
	data.logic = logic.current;
	data.social = social.current;
	data.physical = physical.current;
	data.reading = reading.current;

	// Turn the object into a JSON string
	let jsonString= JSON.stringify(data);
	let filename = "frugalGotchi-" + data.name + ".json";
	// Call my save file function
	downloadFile(filename, jsonString);
};

function savePetToLocal() {
	localStorage.name = document.querySelector("#name1").innerText;
	localStorage.age = age.current;
	localStorage.hunger = hunger.current;
	localStorage.energy = energy.current;
	localStorage.hygiene = hygiene.current;
	localStorage.health = health.current;
	localStorage.logic = logic.current;
	localStorage.social = social.current;
	localStorage.physical = physical.current;
	localStorage.reading = reading.current;
}

function loadPetFromFile(elm) {
	// This is what happens when the user clicks the load button
	new Response(document.querySelector("#" + elm).files[0]).json().then(json => {
		loadPet(json);
	}, err => {
		// not json
		console.log("JSON Load file: No file selected");
	});
	// This hides the modal window on the page in case it's still showing
	toggleWindow('modalLoadWindow');
};

function loadPetFromLocal() {
	let pet = { ...localStorage };
	
	console.log(pet.age);
	document.querySelector("#name1").innerText = pet.name;
	age.current = parseFloat(pet.age);
	hunger.current = pet.hunger;
	energy.current = pet.energy;
	hygiene.current = pet.hygiene;
	health.current = pet.health;
	logic.current = pet.logic;
	social.current = pet.social;
	physical.current = pet.physical;
	reading.current = pet.reading;
}

function loadPet(content) {
	// This loads data into the pet, from wherever it's called
	document.querySelector("#name1").innerText = content.name;
	age.current = content.age;
	hunger.current = content.hunger;
	energy.current = content.energy;
	hygiene.current = content.hygiene;
	health.current = content.health;
	logic.current = content.logic;
	social.current = content.social;
	physical.current = content.physical;
	reading.current = content.reading;
};

function newPet() {
	document.querySelector("#name1").innerText = generateName();
	age.current = 0;
	hunger.current = 100;
	energy.current = 100;
	hygiene.current = 100;
	health.current = 100;
	logic.current = 0;
	social.current = 0;
	physical.current = 0;
	reading.current = 0;
	toggleWindow('modalNewWindow');
}