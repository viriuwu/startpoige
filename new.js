const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

const html_escape = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const text_colour = (text, col) =>
      `<span style="color: var(--col-${col});">${text}</span>`;

const engines_format = (engine) =>
    engine.name ? `${text_colour(engine.name, "engine")}` : `${text_colour(engine.tag, "unknown")}?`;

const input = () =>
      interpret_update(prompt.value);

const is_enter = () => {
    if (event.keyCode == 13) {
	search(prompt.value);
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

const search = (input) => {
    const parsed = parse(html_escape(input.trim()));
    parsed
	.engines
	.map(engines_get)
	.map(x => x.url)
	.filter(x => x)
	.map(x => x.replace(config_url_replace, parsed.query))
	.map(x => window.open(x))
	.map(() => window.close());
};

const interpret_update = (input) => {
    const parsed = parse(html_escape(input.trim()));
    if (parsed.query != "") {
	interpret.innerHTML = parsed
	    .engines
	    .map(engines_get)
	    .map(engines_format)
	    .join(", ")
	    .concat(` ${config_search_char} ${text_colour(parsed.query, "query")}`);
    } else {
	interpret.innerHTML = "&nbsp;";
    }
};

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);
interpret_update("");

// silly
const faces = ["nwn", "=w=", "~w~", "uwu", ">w<", ".w."];
prompt.placeholder = faces[Math.floor(Math.random() * faces.length)];
term.innerHTML = "1 | this is example text<br> 2 | this is more text...<br> 3 | yup... <br> 4 | um .w. <br> 5 | ... <br> 6 | ... <br> 7 | w";
