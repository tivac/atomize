"use strict";

var assert = require("assert"),
    
    plugin = require("../index.js");

describe("postcss-atomize", () => {
    describe("basics", () => {
        it("should be a postcss plugin", () => {
            assert.equal(typeof plugin, "function");
        });
    });
});
