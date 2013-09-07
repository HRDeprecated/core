var Person = hr.Class.extend({
    defaults: {
        firstname: "",
        lastname: ""
    },

    get_fullname: function() {
        return this.options.firstname + " " + this.options.lastname;
    }
});

var samy = new Person({
    firstname: "Samy",
    lastname: "Pesse"
});
alert(samy.get_fullname());