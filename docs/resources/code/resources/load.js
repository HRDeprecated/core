hr.Resources.load("codes", "urls/base.js").then(function(code) {
    alert("Code loaded : "+code);
}, function() {
    alert("error when loading code !");
})