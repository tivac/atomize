"use strict";

var postcss = require("postcss"),
    map     = require("./lib/map.js");

module.exports = postcss.plugin("postcss-atomize", () =>
    (css) => {
        var decls = map(css);

        Object.keys(decls).forEach((key) => {
            var nodes = decls[key],
                parent, rule;
            
            // TODO: configurable?
            if(nodes.length < 2) {
                return;
            }

            // Store parent ref of the first decl
            parent = nodes[0].parent;

            // Create new rule
            rule = parent.clone({
                selector : `.${key}`,
                nodes    : [],
                raws     : {
                    between : parent.raws.between
                }
            });

            // Inject rule into the stylesheet
            css.insertBefore(parent, rule);

            // Remove all declarations, add a composes rule to their parent
            nodes.forEach((decl) => {
                decl.parent.insertBefore(
                    decl.parent.nodes.find((node) => node.prop !== "composes"),
                    decl.clone({
                        prop  : "composes",
                        value : key
                    })
                );

                decl.remove();
            });

            // move first decl into just-created rule
            nodes[0].moveTo(rule);
        });
    }
);
