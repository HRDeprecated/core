var object = new hr.Class();

object.on("parent", function() {
    alert("event parent");
});
object.on("parent:child", function() {
    alert("event child");
});

// Trigger only "parent"
object.trigger("parent");

// Trigger "parent:child" and "parent"
object.trigger("parent:child");