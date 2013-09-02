book.on({
    "change:title": titleView.update,
    "change:author": authorPane.update,
    "destroy": bookView.remove
});