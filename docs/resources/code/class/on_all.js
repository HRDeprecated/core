proxy.on("all", function(eventName) {
    object.trigger(eventName);
});