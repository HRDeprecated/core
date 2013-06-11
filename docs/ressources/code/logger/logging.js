// log message visible only when configuration "logLevel": "log"
yapp.Logger.logging.log("a log message");

// log message visible only when configuration "logLevel": "log" or "debug"
yapp.Logger.logging.debug("a debug message");

// log message visible only when configuration "logLevel": "log" or "debug" or "warn"
yapp.Logger.logging.warn("a warning message");

// log message visible only when configuration "logLevel": "log" or "debug" or "warn" or "error"
yapp.Logger.logging.error("an error message");

// if "logLevel": "none" => no log message are outputed