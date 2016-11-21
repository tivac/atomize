"use strict";

var postcss = require("postcss");

function escape(ident) {
    return ident.toLowerCase()
        .replace(/[^a-z0-9_\-]/gi, "")
        .replace(/^(\d)|^(\-\d)/i, "a$1");
}

function hasParent(filter, node) {
    var curr = node,
        found;
    
    while(curr.parent && !found) {
        if(curr.name === filter) {
            found = true;
        }

        curr = curr.parent;
    }

    return found;
}

module.exports = postcss.plugin("postcss-atomize", () =>
    (css) => {
        var decls = Object.create(null);

        css.walkDecls((decl) => {
            var key;

            // Ignore existing composition and don't transform rules within keyframes
            if(decl.prop === "composes" || hasParent("keyframes", decl)) {
                return;
            }
            
            key = escape(`${decl.prop}-${decl.value}`);

            if(!decls[key]) {
                decls[key] = [];
            }

            decls[key].push(decl);
        });

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

                // TODO: why isn't this the default?
                raws : Object.assign(
                    Object.create(null),
                    parent.raws
                )
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
