define([
    'tests',
    'hr/hr',
    'underscore'
], function(tests, hr, _) {

    var Model = hr.Model.extend({
        defaults: {
            test: "hello"
        }
    });

    tests.add("model.defaults", function(test) {
        var m = new Model();
        test.assert(m.get("test") == "hello");
    });

    tests.add("model.get", function(test) {
        var m = new Model({}, {
            a: {
                b: 1
            }
        });
            
        var a = m.get("a");
        a.b = 2;
        test.assert(m.get("a.b") == 1);
    });

    tests.add("model.set", function(test) {
        var m = new Model();
        m.set("test", "world")
        test.assert(m.get("test") == "world");
    });

    tests.add("model.set.deep", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.set("deep.deep2", [1, 2, 3]);
        test.assert(m.get("deep.deep2").length == 3 && m.get("test") == "hello");
    });

    tests.add("model.set.deep.2", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: "hello"
            }
        });

        m.set("deep.deep2", {
            hello: "world"
        });

        test.assert(m.get("deep.deep2.hello") == "world");
    });

    tests.add("model.toJSON()", function(test) {
        var m = new Model();
        test.assert(m.toJSON().test == "hello");
    });

    tests.add("model.event.change", function(test) {
        var m = new Model({});
        m.on("change", function() {
            test.done();
        });
        m.set("test", "world");
        test.fail();
    });

    tests.add("model.event.set.valid", function(test) {
        var data = {
            'a': {
                'b': 1
            }
        };
        var m = new hr.Model({}, data);
        m.on("set", function() {
            test.fail();
        });
        m.set({
            'a': {
                'b': 1
            }
        });
        test.done();
    });

    tests.add("model.event.change.valid", function(test) {
        var data = {
            'a': {
                'b': 1
            }
        };
        var m = new hr.Model({}, data);
        m.on("change:a", function() {
            test.fail();
        });
        m.set({
            'a': {
                'b': 1
            }
        });
        test.done();
    });

    tests.add("model.event.change.deep.1", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: 2
            }
        });

        m.on("change:deep.deep2", function() {
            test.done();
        });

        m.set("deep.deep2", 3);
        test.fail();
    });

    tests.add("model.event.change.deep.2", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.on("change:deep.deep2", function() {
            test.done();
        });

        m.set("deep.deep2", [1, 2, 3]);
        test.fail();
    });

    tests.add("model.event.change.deep.3", function(test) {
        var m = new Model({}, {
            deep: {
                deep2: [1,2]
            }
        });

        m.on("change:deep.deep3", function() {
            test.done();
        });

        m.set("deep.deep3", [1, 2, 3]);
        test.fail();
    });

    tests.add("model.event.change.deep.4", function(test) {
        var o1 = {"name":"samypesse@gmail.com","userId":"samypesse@gmail.com","email":"samypesse@gmail.com","settings":{"search":{"commands":true,"files":true,"tags":true,"doks":true,"stackoverflow":true},"files":{"ace":true,"imageviewer":true,"markdownviewer":true},"themes":{"theme":"dark"},"editor":{"keyboard":"textinput","fontsize":"12","printmargincolumn":"80","wraplimitrange":"80","autocollaboration":true,"showprintmargin":false,"highlightactiveline":false,"enablesoftwrap":false,"enablesofttabs":true,"tabsize":"4","theme":"github"},"manager":{"registry":"https://api.codebox.io"},"offline":{"enabled":false,"syncInterval":"10","syncIgnore":""},"terminal":{"font":"monospace","size":"13","line-height":"1.3","theme":"monokai_soda"},"heroku":{"key":""},"videochat":{"state":"online","position":"right-bottom","size":"normal"},"files-panel":{"openfiles":true,"hiddenfiles":true,"gitfolder":false},"deploymentSolutions":{"solutions":{"3115fb34dfcb5ba8aa049707c596b733":{"name":"heroku","type":"heroku","settings":{"name":"test","key":"lol"}}}}},"token":"t628i79zfr","mtime":1392504749};
        var o2 = {"name":"samypesse@gmail.com","userId":"samypesse@gmail.com","email":"samypesse@gmail.com","settings":{"search":{"commands":true,"files":true,"tags":true,"doks":true,"stackoverflow":true},"files":{"ace":true,"imageviewer":true,"markdownviewer":true},"themes":{"theme":"dark"},"editor":{"keyboard":"textinput","fontsize":"12","printmargincolumn":"80","wraplimitrange":"80","autocollaboration":true,"showprintmargin":false,"highlightactiveline":false,"enablesoftwrap":false,"enablesofttabs":true,"tabsize":"4","theme":"github"},"manager":{"registry":"https://api.codebox.io"},"offline":{"enabled":false,"syncInterval":"10","syncIgnore":""},"terminal":{"font":"monospace","size":"13","line-height":"1.3","theme":"monokai_soda"},"heroku":{"key":""},"videochat":{"state":"online","position":"right-bottom","size":"normal"},"files-panel":{"openfiles":true,"hiddenfiles":true,"gitfolder":false},"deploymentSolutions":{"solutions":{"3115fb34dfcb5ba8aa049707c596b733":{"name":"heroku","type":"heroku","settings":{"name":"test","key":"test"}}}}},"token":"t628i79zfr","mtime":1392504749};
    
        var m = new hr.Model({}, o1);
        m.on("set", function() {
            console.log(arguments);
        })
        m.on("change:settings.deploymentSolutions", function() {
            test.done();
        });
        m.set("settings.deploymentSolutions.solutions", {"3115fb34dfcb5ba8aa049707c596b733":{"name":"heroku","type":"heroku","settings":{"name":"test","key":"test"}}});
        test.fail();
    });
})