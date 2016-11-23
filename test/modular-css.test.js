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
                .then((result) => {
                    // console.log(result.compositions)
                    expect(result.css + "\n").toBe(fs.readFileSync("./test/results/modular-css.css", "utf8"));
                    expect(result.compositions).toEqual({
                        "test/specimens/charset.css" : {
                            one : "color-red",
                            two : "color-red"
                        },
                        "test/specimens/modular-css.css" : {
                            one   : "color-red",
                            three : "mc3c36a5cf_one background-blue",
                            two   : "mc08e91a5b_one background-blue"
                        },
                        "test/specimens/simple.css" : {
                            one : "color-red",
                            two : "color-red mc08e91a5b_two"
                        }
                    });
                });
        });
    });
});
