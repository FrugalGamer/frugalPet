"use strict"

// These are my dude's stats. I'm declaring them here so I can manipulate them more easily across my code
let mood = { "current": 100 };
let hunger = { "current": 100 };
let energy = { "current": 100 };
let hygiene = { "current": 100 };
let health = { "current": 100 };
let age = { "current": 0 };

// These are skills
let logic = { "current": 0 };
let social = { "current": 0 };
let physical = { "current": 0 };
let reading = { "current": 0 };

// These are used to modify how quickly our stats count down. BIGGER numbers mean they tick down SLOWER
let gameSpeed = 1;
let pauseGame = false;
let moodMultiplier = 1;
let hungerMultiplier = 6;
let energyMultiplier = 8;
let hygieneMultiplier = 7;
let healthMultiplier = 1;

// Determines whether or not the dude is sleeping, showering, eating, etc.
let sleeping = false;
let showering = false;
let eating = false;

// This is just for sending things to my debug script
let debugObject = {statusArray: 0, arrayName: "thoughts"};

// This counter is global because I'm using it to run clock events. I have a feeling that this is not good programming practice, but it will have to do
let timedCounter = 0;

// This is for navigating the menu buttons and needs to remain current in between function calls. I chose -1 because it doesn't represent any existing menu items
let currentItem = -1;

function buttonNavigation(button) {
	// Grab all the menu items on the screen
	let menuArray = document.querySelectorAll(".lcdMenus input");

	// Remove any previous highlights we've shown
	for(let i=0; i < menuArray.length; i++){
		menuArray[i].classList.remove("selected");
	}

	// This code is used if we're only interacting with the main menu
	switch(button){
		case "left":
			// If we haven't got any menu items highlighted
			if(currentItem == 0 || currentItem == -1){
				// Highlight the last item in the menu
				menuArray[7].classList.add("selected");
				currentItem = 7;
			}
			// If we do, move to the next one and then increment the index variable
			else{
				menuArray[currentItem-1].classList.add("selected");
				--currentItem;
			}
			break;
		case "enter":
			// Simulate a click on the selected menu item
			menuArray[currentItem].click();
			// Reset the index
			currentItem = -1;
			break;
		case "right":
			// If we haven't got any menu items highlighted
			if(currentItem == 7 || currentItem == -1){
				// Highlight the first item in the menu
				menuArray[0].classList.add("selected");
				currentItem = 0;
			}
			// If we do, move to the next one and then increment the index variable
			else{
				menuArray[currentItem+1].classList.add("selected");
				++currentItem;
			}
			break;
	}
}

// These functions run when the page finishes loading and set up everything for the game
function init() {
	document.getElementById("name1").innerText = generateName();

	// This loads any local storage info that's been saved into the browser previously
	if(localStorage.name)
		loadPetFromLocal();
	// Begins the thoughts array
	initializeStatus(thoughts, "thoughts");
}

// This is the array that picks out the dude's thoughts. It's a simple function that takes an array and its name, and randomly picks one element
function initializeStatus(statusArray, name) {
		let rand = statusArray.length;
		let pick = Math.floor(Math.random() * rand-1);
		let statusWin = document.getElementById('statusText');

		debugObject.arrayName = name;
		debugObject.statusArray = pick;
		statusWin.innerHTML = "&quot;" + statusArray[pick] + "&quot;";
}

// Chooses a random name
function generateName() {
	let nameList = names.length;
	let nameChoice = Math.floor(Math.random() * nameList);

	return names[nameChoice];
}

// This function handles showing and hiding windows, which will be used multiple times across the page
function toggleWindow(windowID){
	let wid = windowID;
	let popupPrompt = document.getElementById(wid);
	let widStyle = popupPrompt.style.display;

	if(widStyle == "block")
		popupPrompt.style.display = "none";
	else
		popupPrompt.style.display = "block";
};

// This is for sanitizing user input. I got it from StackOverflow and haven't messed with it much yet. It will need to be validated to make sure everything works, but right now at least it doesn't break anything.
function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
};

// This is specifically for submitting a name for your fellow. It may be generalized in the future.
function submitName(){
	let userInput = document.getElementById("changeName-input").value;
	let nameTag = document.getElementById('name1');
	document.body.style.backgroundImage = "";
	screen.setDefault();
	
	// This is a silly easter egg
	if(userInput == "Frank"){
		// Change the background to something dumb and make the dude say something
		document.body.style.backgroundImage = "url(images/shakingHotDog.webp)";
		screen.setFrank();
		nameTag.innerHTML = "FRANK!!!!!!!!!111!!!!"
	}
	else if(userInput != ""){
		nameTag.innerHTML = sanitize(userInput);
	}
	else
		nameTag.innerHTML = "Unnamed Loser";

	toggleWindow('modalWindow');
};

// This is the screen object. Eventually I want the rest of the code to touch the screen as little as possible, which is why I'm hiding it behind an object
let screen = {
	viewport: document.querySelector("#screen #pet"),

	setDefault: function() {
		// this should eventually be changed to a "call stack" type function, so that I can go back to whatever the previous animation was before changing it
		screen.viewport.innerHTML = "<img src='images/dude_default.png' alt='dude' id='petSprite' style='margin-left: 0px;'>";
	},
	// This is used to slow down the idle animation. Otherwise he zooms across the screen like he's taken speed
	idleTimer: 0,
	setIdle: function() {
		screen.idleTimer++;
		// Only run if the idle timer has run out
		if(screen.idleTimer == 80){
			// Here I'm generating a 0 or an 1 to determine whether we'll take one step to the left or to the right
			let coinFlip = Math.floor(Math.random()+0.5);
			// Get the current left margin for the sprite
			let currentMargin = document.querySelector("#petSprite").style.marginLeft;
			// Get rid of the px on the end so we can manipulate the numbers
			let margin = currentMargin.split("px");

			if(coinFlip == 1){
				// only add the new line if the dude isn't too far to the right of the screen.
				if(currentMargin != "108px"){
					document.querySelector("#petSprite").style.marginLeft = (Number(margin[0]) + 12) + "px";
				}
			}
			else{
				// only add more space if the dude isn't too far to the left of the screen.
				if(currentMargin != "-108px"){
					document.querySelector("#petSprite").style.marginLeft = (Number(margin[0]) - 12) + "px";
				}
			}

			// Reset the timer so it starts again
			screen.idleTimer = 0;
		}
	},

	// Note for later: these should all be changed to only supply the image path, and the object should set the innerHTML separately. This way all animations will stay in the same place on the screen that they were before.
	setEating: function() {
		screen.viewport.innerHTML = "<img src='images/dude_eating.png' alt='dude eating some pixels' id='petSprite'>";
	},

	setSleeping: function() {
		screen.viewport.innerHTML = "<img src='images/dude_sleeping.png' alt='dude sleeping' id='petSprite'>";
	},

	setShower: function() {
		screen.viewport.innerHTML = "<img src='images/dude_shower.png' alt='dude in a tub showering' id='petSprite'>"
	},
	setTraining: function(trainType) {
		// The only thing I change here is the filename, so I'm using a switch case to figure out which type of exercise we want to show.
		let filename = "";
		switch(trainType){
			case "reading": filename = "dude_reading.png"; break;
			case "chess": filename = "dude_chess.png"; break;
			case "speech": filename = "dude_talking.png"; break;
			case "exercise": filename = "dude_exercise.png"; break;
			default: filename = "dude.png"; break;
		}
			screen.viewport.innerHTML = "<img src='images/" + filename + "' alt='Training in progress...' id='petSprite'>";
			// Set a 3-second timer, then switch back to the default sprite
			setTimeout(() => { screen.setDefault(); }, 3000);
	},
	setFrank: function(){
		screen.viewport.innerHTML = "<img src='images/FRANK.png' alt='IT'S FRANK id='petSprite'>";
		return;
	},
	setDeath: function(){
		screen.viewport.innerHTML = "<img src='images/dude_dead.png' alt='Tombstone' id='petSprite'>";
		return;
	},
	// Did you know you can pass functions as parameters? I just learned you can!
	showMenu: function(option1, option2, fnName) {
		// I'm hiding the sprite right now because if I don't, the rest of my code freaks out trying to figure out where it went.
		screen.viewport.innerHTML = "<img src='images/dude_default.png' alt='hidden' id='petSprite' style='display: none;'>";
		screen.viewport.innerHTML += "<div id='screenMenu'><a href='#' class='screenText' id='screenText1'>" + sanitize(option1) + "</a><br><a href='#' class='screenText' id='screenText2'>" + sanitize(option2) + "</a></div>";

		// Bind the function that was passed to the link I just printed.
		document.getElementById("screenText1").onclick = fnName;
		document.getElementById("screenText2").onclick = fnName;
		return false;
	},
};

// This counts down our various stats
function decrementStat(stat, multiplier){
	stat.current = stat.current - (.05*gameSpeed) / multiplier;
	// Clamp the value to zero
	if(stat.current < 0)
		stat.current = 0;
}

// This counts up our various stats
function incrementStat(stat, multiplier){
	stat.current = parseFloat(stat.current) + (.05*gameSpeed) / multiplier;
	// Clamp the value to 100
	if(stat.current > 100)
		stat.current = 100;
}

// This handles aging
function ageUp() {
	// Only ages up the dude if the game isn't paused, or isn't dead
	if(pauseGame == false && hunger.current != 0 && energy.current != 0)
		age.current += .0001;
	document.getElementById("dudeAge").innerText = Math.floor(age.current);
	// Runs every frame
	window.requestAnimationFrame(ageUp);
}
ageUp();

// Feeding function
function feedMe(input) {
	// Convert input to a string first
	let mealType = String(input);
	// Check to see if we're sleeping or showering first
	if(showering == false && sleeping == false){
		eating = true;
		screen.setEating();
		let eatCounter = 0;
		initializeStatus(foodNoises, "foodNoises");

		// I don't know how to count the number of times I've added to hunger.current, so eating duration is currently tied to framerate. This works for now, but may cause problems in the future
		function feed(){
			if(hunger.current >= 100 || eatCounter == 200){
				eating = false;
				screen.setDefault();
				// Set thoughts back to normal
				initializeStatus(thoughts, "thoughts");
				return;
			}
			// For this, BIGGER numbers mean that it will tick FASTER
			if(mealType == "meal")
				incrementStat(hunger, hungerMultiplier/8);
			else if(mealType == "snack"){
				health.current = health.current -0.1;
				incrementStat(hunger, hungerMultiplier/4);
			}
			else
				// This should never happen. But it's here just in case
				incrementStat(hunger, hungerMultiplier/8);
			eatCounter++;
			window.requestAnimationFrame(feed);
		}
		feed();
		return false;
	}
}

// Simple play games function. This will grow later
function playWithMe(input) {
	// Convert the input to string first
	console.log(input.children);
	let gameType = String(input);
	if(gameType == 'Guess'){
		// Play the left/right game
		let answer = Math.floor(Math.random()+0.5);
		console.log(answer);

	}
	else if(gameType == "Jump"){
		// Play the jump game
	}
	else
		return 0;
}

// Showering function
function cleanMe() {
	// Check to make sure we're not doing anything else first
	if(eating == false && sleeping == false){
		showering = true;
		screen.setShower();

		initializeStatus(showerThoughts, "showerThoughts");

		function shower() {
			if(hygiene.current >= 100){
				showering = false;
				screen.setDefault();
				initializeStatus(thoughts, "thoughts");
				return;
			}
			incrementStat(hygiene, hygieneMultiplier/5);
			window.requestAnimationFrame(shower);
		}
		shower();
	}
}

// Sleeping function
function putToBed(){
	let button = document.getElementById('sleepButton-icon');
	let wake;
	// This is so we can restore the multipliers to what they were
	let origHunger = hungerMultiplier;
	let origHygiene = hygieneMultiplier;

	// Check to see if the player has pressed the button while we're awake
	if(button.value == "Sleep"){
		// Check to make sure we're not doing anything else first
		if(eating == false && showering == false){
			sleeping = true;
			// Start dreaming
			initializeStatus(dreams, "dreams");
			// This makes the other counters run a bit slower during sleep.
			hungerMultiplier = hungerMultiplier*2;
			hygieneMultiplier = hygieneMultiplier*2;
			screen.setSleeping();

			// Change the button to read wake so that we can wake him up
			button.value = "Wake";

			function sleep() {
				// Only run this if the player hasn't clicked the "Wake" button
				if(energy.current >= 100 || button.value == "Sleep"){
					// Gets back to having regular thoughts
					initializeStatus(thoughts, "thoughts");
					// Set multipliers back to normal
					hungerMultiplier = origHunger;
					hygieneMultiplier = origHygiene;

					sleeping = false;
					screen.setDefault();
					// Change button text back
					button.value = "Sleep";
					return;
				}
				incrementStat(energy, energyMultiplier/2);
				wake = window.requestAnimationFrame(sleep);
			}
			sleep();
		}
	}
	// If the player presses the button while we're asleep, we wake the dude early
	else{
		// Set multipliers back to normal
		hungerMultiplier = origHunger;
		hygieneMultiplier = origHygiene;
		sleeping = false;
		screen.setDefault();

		// Change button text back
		button.value = "Sleep";
		cancelAnimationFrame(wake);
	}
}

function train(discipline) {
	//console.log("Begin training");
	switch(discipline) {
			case "chess":
				incrementStat(logic, 0.1);
				screen.setTraining("chess");
				break;
			case "speech":
				incrementStat(social, 0.1);
				screen.setTraining("speech");
				break;
			case "exercise":
				incrementStat(health, 0.1);
				incrementStat(physical, 0.1);
				decrementStat(energy, 0.1);
				screen.setTraining("exercise");
				break;
			case "read":
				incrementStat(reading, 0.1);
				screen.setTraining("reading");
				break;
			default:
				break;
	}
}

// Time functions are here
function changeSpeed(speed) {

	if(typeof(speed) == "number"){
		// If our numbers ever get to 0, the dude dies, we we just prevent gameSpeed from every becoming 0
		if(gameSpeed + speed == 0)
			gameSpeed = 1;
		else
			gameSpeed += speed;
	}
	else
		// Catchall for if anyone tries to manually send something other than numbers
		gameSpeed = 1;

	// Update the displayed game speed
	document.getElementById("speedDisplay").value = gameSpeed;
}

function pause() {
	// This pauses the game
	if(pauseGame == false){
		pauseGame = true;
		document.getElementById("pauseButton").value = "▶️ Resume";
		screen.viewport.innerHTML = "&nbsp;&nbsp;&nbsp;*~'* Paused *'~*<br><br><br>";
	}
	// This resumes when you press the button again
	else{
		pauseGame = false;
		document.getElementById("pauseButton").value = "⏸️ Pause";
		if(hunger.current != 0)
			screen.setDefault();
		window.requestAnimationFrame(gameLoop);
	}
}

function disableButtons() {
		// This disables the buttons so we can't trigger the animations after the dude has died
		let buttons = document.querySelectorAll(".lcdMenus");
		// Top menu
		for(let child of buttons[0].children)
			child.disabled = true;
		// Bottom menu
		for(let child of buttons[1].children)
			child.disabled = true;
}

// This is supposed to display little messages from our dude about how he's feeling
function checkStatus() {
	let statusWin = document.getElementById('statusText');
	// Default text that shows up before the first thought is loaded
	let currentStatus = "I'm feeling pretty good";
	let pickThought = "";

	// Lower this number if you'd like the thoughts to cycle more quickly
	if(timedCounter >= 800){
		// This condition checks to see if the dude is dreaming
		if(sleeping == true){
			let pickThought = Math.floor(Math.random() * dreams.length);

			statusWin.innerHTML = "&quot;" + dreams[pickThought] + "&quot;";
			timedCounter = 0;
		}
		else {
			// Changes the thoughts array if hunger is below 25%
			if(hunger.current < 25){
				pickThought = Math.floor(Math.random() * gettingHungry.length);

				statusWin.innerHTML = "&quot;" + gettingHungry[pickThought] + "&quot;";
			}
			// Changes the thoughts array if energy is below 25%
			else if(energy.current < 25){
				pickThought = Math.floor(Math.random() * gettingSleepy.length);

				statusWin.innerHTML = "&quot;" + gettingSleepy[pickThought] + "&quot;";
			}
			// Changes the thoughts array if hygiene is below 25%
			else if(hygiene.current < 25){
				pickThought = Math.floor(Math.random() * gettingStinky.length);

				statusWin.innerHTML = "&quot;" + gettingStinky[pickThought] + "&quot;";
			}
			// These are normal thoughts
			else{
				pickThought = Math.floor(Math.random() * thoughts.length);

				statusWin.innerHTML = "&quot;" + thoughts[pickThought] + "&quot;";
			}
			timedCounter = 0;
		}
	}
	timedCounter++;
}

// This is my game loop. It updates all values on the screen every 1 second or so
function gameLoop(){
	let moodTag = document.getElementById("mood");
	let hungerTag = document.getElementById("hunger");
	let energyTag = document.getElementById("energy");
	let hygieneTag = document.getElementById("hygiene");
	let healthTag = document.getElementById("health");

	let logicTag = document.getElementById("logic");
	let socialTag = document.getElementById("social");
	let physicalTag = document.getElementById("physical");
	let readingTag = document.getElementById("reading");

	// This ticks down through our stats. Normally I would separate all of this repeated code into a separate function, but I can't figure out how to do that and still run it every game tick.
	
	// If we're not eating, decrement the hunger counter
	if(eating == false)
		decrementStat(hunger, hungerMultiplier*gameSpeed);

	// If we're not sleeping, decrement the energy counter
	if(sleeping == false)
		decrementStat(energy, energyMultiplier*gameSpeed);

	// If we're not showering, decrement the hygiene counter
	if(showering == false)
		decrementStat(hygiene, hygieneMultiplier*gameSpeed);

	// Current mood is just an average of all stats
	mood.current = (hunger.current + energy.current + hygiene.current) / 3;

	// This updates whatever's showing on the screen to the values in the code
	moodTag.innerText = Math.round(mood.current);
	hungerTag.innerText = Math.round(hunger.current);
	energyTag.innerText = Math.round(energy.current);
	hygieneTag.innerText = Math.round(hygiene.current);
	healthTag.innerText = Math.round(health.current);
		// Health is affected by many different things, so I'm clamping it here in one place
		if(health.current >= 100)
			health.current = 100;

	// And here are the stats
	logicTag.innerText = Math.round(logic.current);
	socialTag.innerText = Math.round(social.current);
	physicalTag.innerText = Math.round(physical.current);
	readingTag.innerText = Math.round(reading.current);

	checkStatus();
	// Only show idle animation if we're not doing any of the three below things
	if(!(eating || sleeping || showering))
		screen.setIdle();

	// Death scenario - this will break the game loop and the game is over
	if(hunger.current == 0){
		let statusWin = document.getElementById('statusText');
		statusWin.innerText = "Your dude died of hunger";
		disableButtons();
		screen.setDeath();
		return;
	}
	else if(energy.current == 0){
		let statusWin = document.getElementById('statusText');
		statusWin.innerText = "Your dude died of exhaustion";
		disableButtons();
		screen.setDeath();
		return;
	}

	// Run the gameLoop function constantly
	if(pauseGame == false)
		window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);