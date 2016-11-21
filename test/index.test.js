"use strict";

var fs     = require("fs"),
    assert = require("assert"),
    
    plugin = require("../index.js");

describe("postcss-atomize", () => {
    describe("basics", () => {
        it("should be a postcss plugin", () => {
            assert.equal(typeof plugin, "function");
        });

        it("should extract repeated decls", () =>
            plugin.process(fs.readFileSync("./test/specimens/simple.css")).then((result) =>
                expect(result.css).toEqual(fs.readFileSync("./test/results/simple.css", "utf8"))
            )
        );

        it("should extract multiple repeated decls in a rule", () =>
            plugin.process(fs.readFileSync("./test/specimens/multiple.css")).then((result) =>
                expect(result.css).toEqual(fs.readFileSync("./test/results/multiple.css", "utf8"))
            )
        );

        it("should come after existing composes decls", () =>
            plugin.process(fs.readFileSync("./test/specimens/with-composes.css")).then((result) =>
                expect(result.css).toEqual(fs.readFileSync("./test/results/with-composes.css", "utf8"))
            )
        );
    });
});
