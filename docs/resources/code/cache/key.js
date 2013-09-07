// Key and Value are strings
hr.Cache.set("test", "mykey", "myvalue");

// Key is a number
hr.Cache.set("test", 4, "myvalue");

// Value is a number
hr.Cache.set("test", "mykey2", 55);

// Value is an object
hr.Cache.set("test", "me", {
    "name": "John Doe",
    "location": "San Francisco, CA"
});

// Key is an object, Value is a Date
hr.Cache.set("lastconnexion", {
    "name": "John Doe",
    "location": "San Francisco, CA"
}, new Date(), 3600);