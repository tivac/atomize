"use strict";

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

module.exports = (css) => {
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

    return decls;
};
