var router = new hr.Router();
router.route("test/home", "home", function() {
    alert("home !");
});
router.route(/^test\/(.*?)\/edit$/, "edit", function(file) {
    alert("Edit file "+file);
});
router.start();

router.navigate("test/directory/test.txt/edit");