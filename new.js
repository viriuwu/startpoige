const term = document.getElementById("term");
const interpret = document.getElementById("interpret");
const prompt = document.getElementById("prompt");

config_search_engines.forEach(x => x.tag = x.tag.replace(/ /g, "-"));
config_bookmarks.forEach(x => x.tag = x.tag.replace(/ /g, "-"));

// helper functions

const html_escape = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const span_class = (text, c) =>
      `<span class="${c}">${text}</span>`;

const engines_format = (engine) =>
    engine.name ? `${span_class(engine.name, "engine")}` : `${span_class(engine.tag, "unknown")}?`;

const bookmarks_format = (bookmark) =>
      bookmark.name ? `${span_class(bookmark.name, "bookmark")}` : `${span_class(bookmark.tag, "unknown")}?`;

const engines_get = (tag) => {
    const s = config_search_engines.find((engine) => engine.tag == tag);
    return s ? s : { "tag": tag };
};

const bookmarks_get = (tag) => {
    const s = config_bookmarks.find((bookmark) => bookmark.tag == tag);
    return s ? s : { "tag": tag };
}

// input functions

const input = () => interpret_update(prompt.value);

const keydown = () => {
    if (event.keyCode == 13) {
        // enter
        search(prompt.value);
    } else if (event.keyCode == 9) {
        // tab
        event.preventDefault();
        tab_complete();
        input();
    }
};

// parsing and updating functions

const parse = (input) => {
    const i = input.trim();
    if (i[0] == config_bookmark_prefix) {
        return {
            type: "bookmark",
            bookmarks: i
                .split(" ")
                .filter(x => new RegExp(`^${config_bookmark_prefix}`).exec(x))
                .map(x => x.slice(config_bookmark_prefix.length))
        };
    } else {
        const s = i.split(" ");
        let idx;
        for (idx = 0; idx < s.length; idx++) {
            if (!(new RegExp(`^${config_engine_prefix}`).exec(s[idx]))) break;
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
        };
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
            .concat(` ${config_search_char} ${span_class(parsed.query, "query")}`);
    } else if (parsed.type == "bookmark") {
        interpret.innerHTML = parsed
            .bookmarks
            .map(bookmarks_get)
            .map(bookmarks_format)
            .join(", ");
    }
};

// search

const search = (input) => {
    const parsed = parse(input.trim());
    if (parsed.type == "engine") {
        parsed
            .engines
            .map(engines_get)
            .map(x => x.url)
            .filter(x => x)
            .map(x => (x.replace(config_url_replace, encodeURIComponent(parsed.query))))
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

// tab completion

const greatest_common_prefix =
      a => [...Array(a[0].length + 1)]
          .map((_, i) => a[0].slice(0, i))
          .reverse()
          .filter((s) =>
              a.reduce((acc, el) =>
                  acc && el.startsWith(s), true))[0];

const tab_complete = () => {
    const ep = config_engine_prefix;
    const bp = config_bookmark_prefix;

    // find the index of the selected word
    const w = prompt.value.split(" ");
    const idx = Math.max(0, w.length - [...Array(w.length + 1)]
          .map((_, i) => w.slice(0, i).join(" ").length)
                         .filter(x => x >= prompt.selectionStart).length);

    // if not prefixed, this is a regular word
    if (w[idx].startsWith(ep) || w[idx].startsWith(bp)) {
        let s, p, space;
        // get word without the prefix, as well as what to search (engines or bookmarks)
        if (w[idx].startsWith(ep)) {
            s = w[idx].slice(ep.length);
            p = ep;
            space = config_search_engines;
        } else {
            s = w[idx].slice(bp.length);
            p = bp;
            space = config_bookmarks;
        }

        // get the possible options
        const options = space
              .map(x => x.tag)
              .filter(x => x.startsWith(s));

        if (options.length >= 1) {
            w[idx] = p
                .concat(greatest_common_prefix(options));

            prompt.value = w.join(" ");
            const pos = w.slice(0, idx + 1).join(" ").length;
            prompt.setSelectionRange(pos, pos);

        } else {
            // if nothing is found, select the unknown for easy replacement
            const pos = w.slice(0, idx + 1).join(" ").length;
            prompt.setSelectionRange(pos - s.length, pos);
        }
    }
}

// putting it all together + displayed text

prompt.addEventListener("input", input);
prompt.addEventListener("keydown", keydown);

const bookmarks_text = config_bookmarks
      .sort(config_sort)
      .map(x => span_class(`${config_bookmark_prefix}${x.tag}`, "bookmark")
           .concat(span_class(`(${x.name})`, "diminish")))
      .join(" ");

const engines_text = config_search_engines
      .sort(config_sort)
      .map(x => span_class(`${config_engine_prefix}${x.tag}`, "engine")
           .concat(span_class(`(${x.name})`, "diminish")))
      .join(" ");

term.innerHTML = engines_text.concat("<br><br>").concat(bookmarks_text);

prompt.placeholder = config_prompt_placeholders[Math.floor(Math.random() * config_prompt_placeholders.length)];
interpret_update("");
