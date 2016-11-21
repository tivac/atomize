"use strict";

var fs     = require("fs"),
    assert = require("assert"),
    
    plugin = require("../index.js");

describe("postcss-atomize", () => {
    describe("basics", () => {
        it("should be a postcss plugin", () => {
            assert.equal(typeof plugin, "function");
        });

        it("should extract repeated rules", () =>
            plugin.process(fs.readFileSync("./test/specimens/simple.css")).then((result) =>
                expect(result.css).toEqual(fs.readFileSync("./test/results/simple.css", "utf8"))
            )
        );
    });
});
