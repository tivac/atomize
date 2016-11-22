"use strict";

var fs = require("fs"),
    
    Processor = require("modular-css"),

    plugin = require("../modular-css.js");

describe("postcss-atomize", () => {
    describe("modular-css plugin", () => {
        it("should be a postcss plugin", () => expect(typeof plugin).toBe("function"));
        
        it("should work", () => {
            var p = new Processor({
                    done : [
                        plugin
                    ]
                });
            
            return p.file("./test/specimens/modular-css.css")
                .then(() => p.output())
                .then((result) =>
                    expect(result.css + "\n").toBe(fs.readFileSync("./test/results/modular-css.css", "utf8"))
                );
        });
    });
});
