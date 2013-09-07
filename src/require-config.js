({
    name: "hr/hr",
    baseUrl: './',
    out: '../vendors/hr.js',
    include: ["hr/hr"],
    optimize: "none",
    paths: {
        'Underscore':     '../vendors/underscore',
        'jQuery':         '../vendors/jquery',
        'text':           '../vendors/require-text',
        'hr': './',
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