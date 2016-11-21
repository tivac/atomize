postcss-atomize
===============

Break selectors down into their smallest components and re-form using composition

Take this:

```css
.one {
    color: red;
}

.two {
    color: red;
    margin-top: 10px;
}
```

and turn it into this

```css
.color-red {
    color: red;
}

.one {
    composes: color-red;
}

.two {
    composes: color-red;
    margin-top: 10px;
}
```

Which looks bigger but once [`modular-css`](https://github.com/tivac/modular-css) is done with it even this trivial example will be smaller. It's kind of like [Atomic CSS](http://acss.io/) but in reverse.
