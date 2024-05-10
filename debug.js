"use strict"

let debugScreen = document.querySelector("#debug");
let debugStrings = "";

function updateDebug() {
	debugStrings = "<h2>Debug info</h2>";
	debugStrings += "<b>Hunger multiplier:</b> " + hungerMultiplier + "<br>";
	debugStrings += "<b>Energy multiplier:</b> " + energyMultiplier + "<br>";
	debugStrings += "<b>Hygiene multiplier:</b> " + hygieneMultiplier + "<br>";
	debugStrings += "<b>Full age:</b> " + age.current + "<br>";

	debugStrings += "<h3>Other</h3>";
	// Note: currently this input doesn't function because the code is updating every frame, taking focus off of the field. It reset itself before you have the chance to type anything in, so I'll need to come up with a way to fix this. Maybe I could pull it out of the function, since it only needs to update when the thought index does
	debugStrings += "<b>Thoughts array:</b> " + debugObject.arrayName + "<br>";
	debugStrings += "<b>Thoughts index:</b> <input id='changeThought' value='" + debugObject.statusArray + "' type='number'> <input type='button' id='changeThought_button' value='change' onclick='changeThoughtFn()'><br>";

	debugStrings += "<input type='button' value='Trigger idle' onClick='screen.setIdle()'>";

	debugScreen.innerHTML = debugStrings;
	window.requestAnimationFrame(updateDebug);
}
function changeThoughtFn() {
	let thought = document.getElementById("changeThought");
	statusWin.innerHTML = "&quot;" + statusArray[thought] + "&quot;";
}

updateDebug();
