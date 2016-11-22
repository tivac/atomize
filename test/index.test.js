"use strict";

var fs = require("fs"),
    
    plugin = require("../index.js");

function process(file) {
    return () => plugin.process(fs.readFileSync(`./test/specimens/${file}`)).then((result) =>
        expect(result.css).toEqual(fs.readFileSync(`./test/results/${file}`, "utf8"))
    );
}

describe("postcss-atomize", () => {
    describe("basics", () => {
        it("should be a postcss plugin", () => expect(typeof plugin).toEqual("function"));

        it("should extract repeated decls", process("simple.css"));
        it("should extract multiple repeated decls in a rule", process("multiple.css"));
        it("should come after existing composes decls", process("with-composes.css"));
        it("shouldn't extract values from @keyframe rules", process("keyframes.css"));
        it("shouldn't insert rules before @import", process("import.css"));
        it("shouldn't insert rules before @charset", process("charset.css"));
        it("should only allow safe CSS identifiers", process("characters.css"));
    });
});
