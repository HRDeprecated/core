var artist = new hr.Model({}, {
    firstName: "Wassily",
    lastName: "Kandinsky"
});

artist.set({birthday: "December 16, 1866"});

alert(JSON.stringify(artist));