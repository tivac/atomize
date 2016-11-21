"use strict";

var postcss = require("postcss"),
    escape  = require("cssesc"),
    
    each = require("lodash.foreach");

module.exports = postcss.plugin("postcss-atomize", () =>
    (css, result) => {
        var decls = Object.create(null);
        
        css.walkDecls((decl) => {
            var key = escape(`${decl.prop}-${decl.value}`, { isIdentifier : true });

            if(!decls[key]) {
                decls[key] = [];
            }

            decls[key].push(decl);
        });

        each(decls, (nodes, key) => {
            if(nodes.length < 2) {
                return;
            }

            // Insert new rule
            css.prepend(postcss.rule({
                selector : `.${key}`,
                nodes    : [
                    nodes[0].clone()
                ]
            }));

            // Replace all instances of the declaration w/ a composes to the rule
            nodes.forEach((decl) => decl.replaceWith(postcss.decl({ prop : "composes", value : key })));
        });
    }
);
