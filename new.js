const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

const html_escape = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const text_colour = (text, col) =>
      `<span style="color: var(--col-${col});">${text}</span>`;

const engines_format = (engine) =>
    engine.name ? `${text_colour(engine.name, "engine")}` : `${text_colour(engine.tag, "unknown")}?`;

const bookmarks_format = (bookmark) =>
      bookmark.name ? `${text_colour(bookmark.name, "bookmark")}` : `${text_colour(bookmark.tag, "unknown")}?`;

const engines_get = (tag) => {
    const s = config_search_engines.find((engine) => engine.tag == tag);
    return s ? s : { "tag": tag };
};

const bookmarks_get = (tag) => {
    const s = config_bookmarks.find((bookmark) => bookmark.tag == tag);
    return s ? s : { "tag": tag };
}

const input = () =>
      interpret_update(prompt.value);

const is_enter = () => {
    if (event.keyCode == 13) {
	search(prompt.value);
    }
};

const parse = (input) => {
    const i = input.trim();
    if (i[0] == config_bookmark_prefix) {
	return {
	    type: "bookmark",
	    bookmarks: i
		.split(" ")
		.filter(x => new RegExp(`^${config_bookmark_prefix}`).exec(x))
		.map(x => x.slice(config_bookmark_prefix.length))
	}
    } else {
	const s = i.split(" ");
	let idx;
	for (idx = 0; idx < s.length; idx++) {
	    if (!(new RegExp(`^${config_engine_prefix}`).exec(s[idx]))) {break;}
	}
	const e = [...new Set (
	    s
		.slice(0, idx)
		.map(x => x.slice(config_engine_prefix.length))
	)];
	return {
	    type: "engine",
	    engines: e.length ? e : [""],
	    query: s
		.slice(idx, s.length)
		.map(x => x.trim())
		.join(" ")
	}
    }
};

const search = (input) => {
    const parsed = parse(input.trim());
    if (parsed.type == "engine") {
	parsed
	    .engines
	    .map(engines_get)
	    .map(x => x.url)
	    .filter(x => x)
	    .map(x => (x.replace(config_url_replace, parsed.query)))
	    .map(x => window.open(x))
	    .map(() => window.close());
    } else if (parsed.type == "bookmark") {
	parsed
	    .bookmarks
	    .map(bookmarks_get)
	    .map(x => x.url)
	    .filter(x => x)
	    .map(x => window.open(x))
	    .map(() => window.close());
    }
};

const interpret_update = (input) => {
    const parsed = parse(html_escape(input.trim()));
    if (parsed.type == "engine") {
	    interpret.innerHTML = parsed
		.engines
		.map(engines_get)
		.map(engines_format)
		.join(", ")
		.concat(` ${config_search_char} ${text_colour(parsed.query, "query")}`);
    } else if (parsed.type == "bookmark") {
	interpret.innerHTML = parsed
	    .bookmarks
	    .map(bookmarks_get)
	    .map(bookmarks_format)
	    .join(", ");
    }
};

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", is_enter);
interpret_update("");

prompt.placeholder = config_prompt_placeholders[Math.floor(Math.random() * config_prompt_placeholders.length)];

term.innerHTML = config_search_engines
    .map(x => text_colour(`${config_engine_prefix}${x.tag}`, "engine").concat(text_colour(` (${x.name})`, "diminish")))
    .join(" ");
