// Set page title
app.head.title("Hello");

// Get page title
var title = app.head.title();

// Set meta
app.head.meta("author", "Samy Pessé");

// Get meta
var author = app.head.meta("author");

// Set description
app.head.description("My application");

// Get description
var description = app.head.description();

// Set link
app.head.link("icon", hr.Urls.static("images/favicon.png"));

// Get link
var favicon = app.head.link("icon");

// Crawling
app.head.setCrawling(false, false); // no index, no follow
app.head.setCrawling(false, true); // no index, follow
app.head.setCrawling(true, true); // index, follow