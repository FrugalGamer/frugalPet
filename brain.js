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

// Determines whether or not the dude is sleeping
let sleeping = false;
let showering = false;
let eating = false;

// This counter is global because I'm using it to run clock events. I have a feeling that this is not good programming practice, but it will have to do
let timedCounter = 0;

// These functions run when the page finishes loading and set up everything for the game
function init() {
	document.getElementById("name1").innerText = generateName();

	 initializeStatus(thoughts);
}

function initializeStatus(statusArray) {
		let rand = statusArray.length;
		let pick = Math.floor(Math.random() * rand-1);
		let statusWin = document.getElementById('statusText');

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

	if(userInput != "")
		nameTag.innerHTML = sanitize(userInput);
	else
		nameTag.innerHTML = "Unnamed Loser";

	toggleWindow('modalWindow');
};

// This is the screen object. Eventually I want the rest of the code to touch the screen as little as possible, which is why I'm hiding it behind an object
let screen = {
	viewport: document.querySelector("#screen #pet"),

	// Break the ASCII dude into four separate lines. This makes it easier to add spaces and new items, since I can just push and pop them onto the array.
	line1: ["&nbsp0<br>"],
	line2: ["/|&bsol;<br>"],
	line3: ["&nbsp;|<br>"],
	line4: ["/&nbsp;&bsol;"],

	setDefault: function() {
		// this should eventually be changed to a "call stack" type function, so that I can go back to whatever the previous animation was before changing it
		screen.viewport.innerHTML = "&nbsp;0<br>" + "/|&bsol;<br>" + "&nbsp;|<br>" + "/&nbsp;&bsol;";
	},
	// This is used to slow down the idle animation. Otherwise he zooms across the screen like he's taken speed
	idleTimer: 0,
	setIdle: function() {
		screen.idleTimer++;
		// Only run if the idle timer has run out
		if(screen.idleTimer == 80){
			// Here I'm generating a 0 or an 1 to determine whether we'll take one step to the left or to the right
			let coinFlip = Math.floor(Math.random()+0.5);

			if(coinFlip == 1){
				// only add the new line if the dude isn't too far to the right of the screen.
				if(screen.line1.length < 25){
					screen.line1.unshift("&nbsp;");
					screen.line2.unshift("&nbsp;");
					screen.line3.unshift("&nbsp;");
					screen.line4.unshift("&nbsp;");
				}
			}
			else{
				// only add the new line if the dude isn't too far to the left of the screen.
				if(screen.line1.length != 1){
					screen.line1.shift();
					screen.line2.shift();
					screen.line3.shift();
					screen.line4.shift();
				}
			}

			// This needs to be optimized. It's just looping through and adding the contents of each array to the screen in sequence. Probably the best way to do this is with one multi-dimensional array, but I hate those, so I'm holding off for now
			let i = 0;
			// Wipe the screen first
			screen.viewport.innerHTML = "";
			for(i = 0; i < screen.line1.length; i++){
				screen.viewport.innerHTML += screen.line1[i];
			}
			for(i = 0; i < screen.line1.length; i++){
				screen.viewport.innerHTML += screen.line2[i];
			}
			for(i = 0; i < screen.line1.length; i++){
				screen.viewport.innerHTML += screen.line3[i];
			}
			for(i = 0; i < screen.line1.length; i++){
				screen.viewport.innerHTML += screen.line4[i];
			}

			// Reset the timer so it starts again
			screen.idleTimer = 0;
		}
	},

	setEating: function() {
		screen.viewport.innerHTML = "&nbsp;_________<br>" + "[Nom nom..]<br>" + "&nbsp;&nbsp;v<br>" + "&nbsp;&nbsp;0<br>" + "&nbsp;/|-@<br>" + "&nbsp;&nbsp;|<br>" + "&nbsp;/&nbsp;&bsol;";
	},

	setSleeping: function() {
		screen.viewport.innerHTML = "&nbsp;____<br>" + "[&nbsp;&nbsp;z&nbsp;]<br>" + "[&nbsp;Z&nbsp;&nbsp;]<br>" + "&nbsp;v&nbsp;_____<br>" + "0[|▒▒▒▒▒]<br>" + "&nbsp;&nbsp;i&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i";
	},

	setShower: function() {
		screen.viewport.innerHTML = "&nbsp;&nbsp;0]╮<br>" + "&nbsp;0&nbsp;&nbsp;|<br>" + "/|&bsol;&nbsp;|&nbsp;<br>" + "&nbsp;|&nbsp;&nbsp;|<br>" + "/&nbsp;&bsol;&nbsp;|<br>"
	},

	setDeath: function(){
		screen.viewport.innerHTML = "&nbsp;&nbsp;&nbsp;___<br>" + "&nbsp;||&nbsp;&nbsp;&nbsp;|<br>" + "||&nbsp;&nbsp;†&nbsp;&nbsp;|<br>" + "||&nbsp;DED&nbsp;|<br>" + "||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>" + "~~~~~~~~~";
		return;
	}
};

// This counts down our various stats
function decrementStat(stat, multiplier){
	stat.current = stat.current - (.05*gameSpeed) / multiplier;
	// Clamp the value to zero
	if(stat.current < 0)
		stat.current = 0;
}

// This counts down our various stats
function incrementStat(stat, multiplier){
	stat.current = stat.current + (.05*gameSpeed) / multiplier;
	// Clamp the value to 100
	if(stat.current > 100)
		stat.current = 100;
}

function ageUp() {
	age.current += .0001;
	document.getElementById("dudeAge").innerText = Math.floor(age.current);

	window.requestAnimationFrame(ageUp);
}
ageUp();

function feedMe(mealType) {
	// Check to see if we're sleeping or showering first
	if(showering == false && sleeping == false){
		eating = true;
		screen.setEating();
		let eatCounter = 0;
		initializeStatus(foodNoises);

		// I don't know how to count the number of times I've added to hunger.current, so eating is currently tied to framerate. This works for now, but may cause problems in the future
		function feed(){
			if(hunger.current >= 100 || eatCounter == 200){
				eating = false;
				screen.setDefault();
				initializeStatus(thoughts);
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
				incrementStat(hunger, hungerMultiplier/8);
			eatCounter++;
			window.requestAnimationFrame(feed);
		}
		feed();
	}
}

function playWithMe() {
	// This works really simply for now but should probably be added to in the future.
	health.current += 5;
	energy.current -= 4;
	physical.current +=2;
}

function cleanMe() {
	// Check to make sure we're not doing anything else first
	if(eating == false && sleeping == false){
		showering = true;
		screen.setShower();

		initializeStatus(showerThoughts);

		function shower() {
			if(hygiene.current >= 100){
				showering = false;
				screen.setDefault();
				initializeStatus(thoughts);
				return;
			}
			incrementStat(hygiene, hygieneMultiplier/5);
			window.requestAnimationFrame(shower);
		}
		shower();
	}
}

function putToBed(){
	let button = document.getElementById('sleepButton');
	let wake;

	// Check to see if the player has pressed the button while we're awake
	if(button.value == "🛏️ Sleep"){
		// Check to make sure we're not doing anything else first
		if(eating == false && showering == false){
			sleeping = true;
			initializeStatus(dreams);
			screen.setSleeping();

			// Change the button to read wake so that we can wake him up
			button.value = "⏰ Wake";

			function sleep() {
				// Only run this if the player hasn't clicked the "Wake" button
				if(energy.current >= 100 || button.value == "🛏️ Sleep"){
					initializeStatus(thoughts);
					sleeping = false;
					screen.setDefault();
					// Change button text back
					button.value = "🛏️ Sleep";
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
		sleeping = false;
		screen.setDefault();

		// Change button text back
		button.value = "🛏️ Sleep";
		cancelAnimationFrame(wake);
	}
}

function train(discipline) {
	console.log("Begin training");
	switch(discipline) {
			case "chess":
				incrementStat(logic, 0.1);
				break;
			case "speech":
				incrementStat(social, 0.1);
				break;
			case "exercise":
				incrementStat(health, 0.1);
				incrementStat(physical, 0.1);
				break;
			case "read":
				incrementStat(reading, 0.1);
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
	if(pauseGame == false){
		pauseGame = true;
		document.getElementById("pauseButton").value = "▶️ Resume";
		screen.viewport.innerHTML = "&nbsp;&nbsp;&nbsp;*~'* Paused *'~*<br><br><br>";
	}
	else{
		pauseGame = false;
		document.getElementById("pauseButton").value = "⏸️ Pause";
		if(hunger.current != 0)
			screen.setDefault();
		window.requestAnimationFrame(gameLoop);
	}
}

// This is supposed to display little messages from our dude about how he's feeling
function checkStatus() {
	let statusWin = document.getElementById('statusText');
	// Default text that shows up before the first thought is loaded
	let currentStatus = "I'm feeling pretty good";

	// Lower this number if you'd like the thoughts to cycle more quickly
	if(timedCounter >= 1000){
		// This condition checks to see if the dude is dreaming
		if(sleeping == true){
			let pickThought = Math.floor(Math.random() * dreams.length);

			statusWin.innerHTML = "&quot;" + dreams[pickThought] + "&quot;";
			timedCounter = 0;
		}
		else {
			let pickThought = Math.floor(Math.random() * thoughts.length);

			statusWin.innerHTML = "&quot;" + thoughts[pickThought] + "&quot;";
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
		screen.setDeath();
	}
	else if(energy.current == 0){
		let statusWin = document.getElementById('statusText');
		statusWin.innerText = "Your dude died of exhaustion";
		screen.setDeath();
		return;
	}

	// Run the gameLoop function constantly
	if(pauseGame == false)
		window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);