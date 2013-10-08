var hr = require("hr/hr");
var c = new hr.Collection();

c.reset([{a:1},{a:2},{a:3}])
console.log(c.toJSON());