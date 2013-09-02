// Key and Value are strings
yapp.Cache.set("test", "mykey", "myvalue");

// Key is a number
yapp.Cache.set("test", 4, "myvalue");

// Value is a number
yapp.Cache.set("test", "mykey2", 55);

// Value is an object
yapp.Cache.set("test", "me", {
    "name": "John Doe",
    "location": "San Francisco, CA"
});

// Key is an object, Value is a Date
yapp.Cache.set("lastconnexion", {
    "name": "John Doe",
    "location": "San Francisco, CA"
}, new Date(), 3600);