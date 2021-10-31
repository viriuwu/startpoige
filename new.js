const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

const unit_font = parseInt(window.getComputedStyle(prompt).fontSize.slice(0, -2));

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

const window_resize = () => {
    const h = window.innerHeight;
    const lines = Math.floor(config_terminal_height * h / unit_font) - 2;
    if (lines > 0) {
	term.style.height = (lines * unit_font) + "px";
	term.style.display = "initial";
	interpret.style.display = "initial";
	prompt.style.display = "initial";
    } else {
	term.style.display = "none";
	interpret.style.display = "initial";
	prompt.style.display = "initial";
	if (lines <= -1) {
	    interpret.style.display = "none";
	    prompt.style.display = "initial";
	    if (lines <= -2) {
		prompt.style.display = "none";
	    }
	}
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
    const match = (new RegExp(`^ *((?:${config_engine_prefix}.*? +)+)(.*?) *$`)).exec(input);
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
	    .map(x => x.substr(config_engine_prefix.length))
    )]; 

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);
window.onresize = window_resize;

window_resize();
interpret_update("");

// silly
const faces = ["nwn", "=w=", "~w~", "uwu", ">w<", ".w."];
prompt.placeholder = faces[Math.floor(Math.random() * faces.length)];
term.innerHTML = "1 | this is example text<br> 2 | this is more text...<br> 3 | yup... <br> 4 | um .w. <br> 5 | ... <br> 6 | ... <br> 7 | w";
