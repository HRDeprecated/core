({
    name: "hr/hr",
    baseUrl: './',
    out: '../vendors/hr.js',
    include: ["hr/hr"],
    optimize: "none",
    paths: {
        'underscore':     '../vendors/underscore',
        'jQuery':         '../vendors/jquery',
        'q':              '../vendors/q',
        'text':           '../vendors/require-text',
        'hr': './',
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'q': {
            exports: 'Q'
        },
        'jQuery': {
            exports: '$'
        }
    },
    wrap: {
        'start': "(function() {",
        'end': "}());"
    }
})