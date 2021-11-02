const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

const unit_font = parseInt(window.getComputedStyle(prompt).fontSize.slice(0, -2));

const html_escape = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const text_colour = (text, col) =>
      `<span style="color: var(--col-${col});">${text}</span>`;

const engines_format = (engine) =>
    engine.name ? `${text_colour(engine.name, "engine")}` : `${text_colour(engine.tag, "unknown")}?`;

const input = () => {
    interpret_update(prompt.value);
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

const parse = (input) => {
    const match = (new RegExp(`^ *((?:${config_engine_prefix}.*? +)+)(.*?) *$`)).exec(input);
    if (match) {
	return { engines: engines_parse(match[1]), query: match[2] };
    } else {
	return { engines: [""], query: input };
    }
};

const engines_parse = (match) =>
    [...new Set(
	match
	    .split(" ")
	    .filter(x => x)
	    .map(x => x.substr(config_engine_prefix.length))
    )]; 

const engines_get = (tag) => {
    const s = config_search_engines.find((engine) => engine.tag == tag);
    return s ? s : { "tag": tag };
};

const interpret_update = (input) => {
    const i = html_escape(input.trim());
    const p = parse(i);
    if (i != "") {
	interpret.innerHTML = p
	    .engines
	    .map(engines_get)
	    .map(engines_format)
	    .join(", ")
	    .concat(` ${config_search_char} ${text_colour(p.query, "query")}`);
    } else {
	interpret.innerHTML = "&nbsp;";
    }
};

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);
window.onresize = window_resize;

window_resize();
interpret_update("");

// silly
const faces = ["nwn", "=w=", "~w~", "uwu", ">w<", ".w."];
prompt.placeholder = faces[Math.floor(Math.random() * faces.length)];
term.innerHTML = "1 | this is example text<br> 2 | this is more text...<br> 3 | yup... <br> 4 | um .w. <br> 5 | ... <br> 6 | ... <br> 7 | w";
