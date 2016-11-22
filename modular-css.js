"use strict";

var postcss = require("postcss"),
    map     = require("./lib/map.js");

module.exports = postcss.plugin("postcss-atomize", () =>
    (css, result) => {
        var decls     = map(css),
            selectors = Object.create(null);
        
        // Build selector to file/export mapping
        Object.keys(result.opts.files).forEach((file) => {
            Object.keys(result.opts.files[file].exports).forEach((original) => {
                var exported = result.opts.files[file].exports[original];

                selectors[exported[exported.length - 1]] = {
                    file : file,
                    key  : original
                };
            });
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
                raws     : {
                    between : parent.raws.between
                }
            });

            // Inject rule into the stylesheet
            css.insertBefore(parent, rule);

            // Remove all declarations, inject into composition chain
            nodes.forEach((decl) => {
                // TODO: slicing off the first character is really dumb
                var current = decl.parent.selector.slice(1),
                    details = selectors[current],
                    exports, pos;

                if(!details) {
                    console.log(decl.parent.selector, current);

                    return;
                }

                exports = result.opts.files[details.file].exports[details.key];
                pos     = exports.indexOf(current);
                
                parent = decl.parent;

                exports.splice(pos === -1 ? Infinity : pos, 0, key);

                decl.remove();

                if(parent.nodes.length) {
                    return;
                }

                parent.remove();
                exports.splice(exports.length - 1, 1);
            });

            // move first decl into just-created rule
            nodes[0].moveTo(rule);
        });
    }
);
