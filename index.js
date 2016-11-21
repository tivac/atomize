"use strict";

var postcss = require("postcss"),
    escape  = require("cssesc"),
    
    each = require("lodash.foreach");

module.exports = postcss.plugin("postcss-atomize", () =>
    (css, result) => {
        var decls = Object.create(null);
        
        css.walkDecls((decl) => {
            var key;
            
            if(decl.prop === "composes") {
                return;
            }
            
            key = escape(`${decl.prop}-${decl.value}`, { isIdentifier : true });

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

            // Remove all instances of the declaration, add a composes rule to their parent
            nodes.forEach((decl) => {
                var parent = decl.parent;
                
                parent.insertBefore(
                    parent.nodes.find((node) => node.prop !== "composes"),
                    decl.clone({
                        prop  : "composes",
                        value : key
                    })
                );

                decl.remove();
            });
        });
    }
);
