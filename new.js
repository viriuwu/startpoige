const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

const CH_ENGINE = '@';

const input = () => {
    interpret_update(prompt.value);
    console.log(parse(prompt.value));
};

const is_enter = () => {
    if (event.keyCode == 13) {
	alert("awa");
	// todo
    }
};

const interpret_update = (input) => {
    if (input !== "") {
	interpret.innerHTML = input;
    } else {
	interpret.innerHTML = "&nbsp;";
    }
};

const parse = (input) => {
    const match = (new RegExp(`^ *((?:${CH_ENGINE}.*? +)+)(.*?) *$`)).exec(input);
    if (match) {
	return { engines: parse_engines(match[1]), query: match[2] };
    } else {
	return { engines: [""], query: input };
    }
};

const parse_engines = (match) =>
      [...new Set(
	match
	    .split(" ")
	    .filter(x => x)
	    .map(x => x.substr(CH_ENGINE.length))
      )]; 

const faces = ["nwn", "=w=", "~w~", "uwu", ">w<", ".w."];
prompt.placeholder = faces[Math.floor(Math.random() * faces.length)];

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);

interpret_update("");
