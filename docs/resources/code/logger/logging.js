// log message visible only when configuration "logLevel": "log"
hr.Logger.logging.log("a log message");

// log message visible only when configuration "logLevel": "log" or "debug"
hr.Logger.logging.debug("a debug message");

// log message visible only when configuration "logLevel": "log" or "debug" or "warn"
hr.Logger.logging.warn("a warning message");

// log message visible only when configuration "logLevel": "log" or "debug" or "warn" or "error"
hr.Logger.logging.error("an error message");

// if "logLevel": "none" => no log message are outputed