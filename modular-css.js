"use strict";

var parser = require("postcss-selector-parser"),
    map    = require("./lib/map.js");

module.exports = (css, result) => {
    var decls     = map(css),
        selectors = Object.create(null);
    
    // Build selector to file/export mapping
    Object.keys(result.opts.files).forEach((file) =>
        Object.keys(result.opts.files[file].exports).forEach((original) => {
            var exported = result.opts.files[file].exports[original];

            selectors[exported[exported.length - 1]] = exported;
        })
    );

    Object.keys(decls).forEach((key) => {
        var nodes = decls[key],
            parent, atom;
        
        // TODO: configurable?
        if(nodes.length < 2) {
            return;
        }

        // Store parent ref of the first decl
        parent = nodes[0].parent;

        // Create new rule
        atom = parent.clone({
            selector : `.${key}`,
            nodes    : [],
            raws     : {
                between : parent.raws.between
            }
        });

        // Inject rule into the stylesheet
        css.insertBefore(parent, atom);

        // Remove all declarations, inject into composition chain
        nodes.forEach((decl) => {
            var keys   = [],
                rule = decl.parent;
            
            // Fill keys object w/ the values that need their compositions updated
            parser((contents) => {
                contents.walkClasses((node) => keys.push(node.value));
                contents.walkIds((node) => keys.push(node.value));
            }).process(rule.selector);
            
            decl.remove();

            keys.forEach((selector) => {
                var exports = selectors[selector],
                    pos;
                
                // Not a known selector, so ignore it
                if(!exports) {
                    return;
                }
                
                // splice newly-created rule into composition chain
                pos = exports.indexOf(selector);
                exports.splice(pos === -1 ? Infinity : pos, 0, key);

                if(rule.nodes.length) {
                    return;
                }

                // Clean up now-empty rules
                rule.remove();
                
                exports.splice(exports.length - 1, 1);
            });
        });

        // move first decl into just-created rule
        nodes[0].moveTo(atom);
    });
};

module.exports.postcssPlugin = "postcss-atomize";
