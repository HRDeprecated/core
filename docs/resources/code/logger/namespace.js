// Namespace for a model : into navigator console
var log_user = hr.Logger.addNamespace("users");

log_user.error("Invalid user (don't have 'name') :", {
    username: "Samy" 
});

// Namespace for urgent logs
var log_urgent = hr.Logger.addNamespace("urgent", function() {
    var args = Array.prototype.slice.call(arguments);
    alert(args.join(" "));
});

log_urgent.warn("Error in rendering view 'user'");

