"use strict";

var postcss = require("postcss");

module.exports = postcss.plugin("postcss-atomize", () =>
    (css, result) => {
        css.walkDecls((decl) => {
            console.log(decl.toString());
        });
    }
);
