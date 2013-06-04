({
    name: "yapp/yapp",
    baseUrl: './',
    out: '../vendors/yapp.js',
    include: ["yapp/yapp"],
    optimize: "none",
    paths: {
        'Underscore':     '../vendors/underscore',
        'jQuery':         '../vendors/jquery',
        'text':           '../vendors/require-text',
        'yapp': './',
    },
    shim: {
        'Underscore': {
            exports: '_'
        },
        'jQuery': {
            exports: '$'
        }
    }
})