({
    name: "hr/hr",
    baseUrl: './',
    out: '../vendors/hr.js',
    include: ["hr/hr"],
    optimize: "none",
    paths: {
        'underscore':     '../vendors/underscore',
        'jquery':         '../vendors/jquery',
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
        'jquery': {
            exports: '$'
        }
    },
    wrap: {
        'start': "(function() {",
        'end': "}());"
    }
})