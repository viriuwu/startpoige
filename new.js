const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);

function input() {
    console.log(prompt.value);
    // todo
}

function is_enter() {
    if (event.keyCode == 13) {
	alert("awa");
	// todo
    }
}

const faces = ["nwn", "=w=", "~w~", "uwu", ">w<", ".w."];
prompt.placeholder = faces[Math.floor(Math.random() * faces.length)];
