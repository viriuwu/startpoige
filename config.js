// placeholders for the prompt
const config_prompt_placeholders = ["search..."];

// separator between search engines and query
const config_search_char = ">"

// sorting function for search engines and bookmarks, default sorts alphabetically.
const config_sort = (x, y) => x.tag > y.tag ? 1 : -1;
// 0 disables sorting

// prefix for denoting engines in search queries, e.g "@" means "@abc"
// refers to whichever search engine is given the tag "abc".
const config_engine_prefix = "@";

// placeholder characters to replace with a query.
const config_url_replace = "{}";

// your chosen search engines! an array of objects, each object must have:
// a 'tag' by which you refer to it, a 'name' which will be displayed, and
// a 'url' to open, containing `config_url_replace` where the query is to be substituted.
// a default search engine must have an empty string as a tag.
const config_search_engines = [
    {
        name: "default",
        tag: "",
        url: "https://duckduckgo.com/?q={}"
    },
    {
        name: "github",
        tag: "gh",
        url: "https://github.com/search?q={}"
    },
    {
        name: "google",
        tag: "go",
        url: "https://www.google.co.uk/search?q={}"
    },
    {
        name: "wikipedia",
        tag: "wiki",
        url: "https://www.wikipedia.org/wiki/{}"
    },
    {
        name: "youtube",
        tag: "yt",
        url: "https://www.youtube.com/results?search_query={}"
    }
];

// same as for search engines, but for bookmarks
const config_bookmark_prefix = "#";

// your bookmarks! an array of objects, each object must have:
// a 'tag' by which you refer to it, a 'name' which will be displayed, and a 'url' to open.
const config_bookmarks = [
    {
        name: "weather",
        tag: "w",
        url: "https://wttr.in"
    },
    {
        name: "xkcd",
        tag: "xkcd",
        url: "https://xkcd.com"
    },
    {
        name: "git repo",
        tag: "repo",
        url: "https://github.com/poinwn/startpoige"
    }
];
