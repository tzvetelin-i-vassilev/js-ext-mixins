# js-ext-mixins

### What the platform left out, put on the classes that should have had it

A set of extensions applied to the built-in classes at import time. `Array` gets a `remove`,
`DOMRect` gets a `union`, `ShadowRoot` gets a one-line way to adopt a stylesheet - the kind of thing
every project writes for itself as a folder of helpers, kept here instead and reached through the
objects it belongs to.

Nothing is replaced. An extension fills in what is missing and steps over what is already there, so
the day a runtime ships one of these under the same name, its own is what stays and nothing here has
to change. The few deliberate exceptions say so out loud, in `overrides`.

```shell
npm install --save js-ext-mixins
```

```js
import "js-ext-mixins"
```

That import is the whole of the setup: there is nothing to call and nothing to hold. A class the
runtime does not have is skipped rather than being an error, so the same import serves a page, a
worker and Node.

`JS_EXT_SCOPE` is how that is narrowed. It holds the names that will be extended, and the library
writes it only when nothing has - so a context that wants a few of these and not the rest says so
before the import, and gets what it asked for:

```js
globalThis.JS_EXT_SCOPE = ["Array", "Set"];

import "js-ext-mixins"
```

It is the list of what is to be applied rather than a record of what was: a name stays in it whether
the class behind it was there or not. A name with no extension behind it stops the import with an
error rather than being ignored, so a typo is not something to look for later.

What was really applied is `Extension.applied`, written as each one lands. The two differ wherever a
runtime had no such class - in Node that is most of the DOM - and they differ in the other direction
too, because `TypedArray` is not a class anything has: what it leaves in `applied` is `Int8Array`,
`Uint8Array` and the nine others.

## The extensions

**Object** - `equals(x, y)` compares by value rather than by reference, walking arrays; `clone(o)`
copies as deeply; `defineEnum(target, name, values)` puts a read-only enum on a context, reachable
by name and by value alike, each entry an `EnumValue` that knows its name, its value and its place.

**String** - the five notations and the way between any two of them: `toCamelCase`, `toPascalCase`,
`toSnakeCase`, `toKebabCase`, `toDotNotation`, each told which notation it is reading. Plus
`padStart(length, char)`, and `toCharArray` / `String.fromCharArray` for the round trip through
codes or bytes.

**Number** - `format(pattern)` and `compareTo(value)`, and the four bounds the language has no name
for: `Number.MAX_INT32`, `MAX_UINT32`, `MAX_INT64`, `MAX_UINT64` - the last two only where `BigInt`
is.

**Date** - `format(pattern)` on an instance, and `Date.format(pattern, timestamp)` for one you are
holding as a number.

**Function** - `createClass(name, parentClass, options)`, a class whose name is decided at run time.
Plus `body`, the source between the braces with the signature left off.

**Array** - `clear`, `clone` (deep), `unique` (by reference), `insert(item, index)`,
`indicesOf(item)`, `remove(...items)` (every occurrence), `removeAt(index, count)`,
`replace(item, with, exact)`, and `first` / `last` as properties rather than as arithmetic.
`Array.from` also takes a collection that holds a single value.

**Set** - `map` and `filter`, which return sets, so a set need not become an array and back to be
worked on.

**ArrayBuffer** - `toBase64()` and `ArrayBuffer.fromBase64(string)`, plus `ArrayBuffer.isTypedArray`
for the test that has no operator.

**SharedArrayBuffer** - `SharedArrayBuffer.fromArrayBuffer(buffer)`, the same bytes in shared memory.

**TypedArray** - `clone`, `concat(...others)` of the same kind, `toArray`, `TypedArray.from(array)`,
and `createSharedInstance(data)`, which is shared memory where it is allowed and an ordinary buffer
where it is not. There is no class of that name, so this one is applied to each of the eleven
concrete kinds - and each of them leaves the way back on `Array` itself: `toInt8Array`,
`toFloat32Array` and the nine others, which is `TypedArray.from` read from the other end.

**Promise** - `Promise.sleep(time)`, a pause that can be awaited. The default is 16ms, about a
frame.

**Location** - `query`, the search string already decoded into an object.

**Screen** - `size` and `resolution`, the second in device pixels, both as a `DOMSize`.

**Document** - `createElement(name, {is})` remembers what the element was asked to be. The platform
keeps that `is` inside the element and gives nothing to read it back, so one made in code cannot be
told from a plain one; here it becomes both a property and an attribute, which is what the parser
gives for `<button is="my-button">` anyway.

**HTMLCollection** - `HTMLCollection.fromHTML(markup)`, the top level elements of a piece of html
with no wrapper around them and nothing run - it is parsed through a template, where scripts stay
inert.

**HTMLElement** - `computedStyle` as a property; `toRect()` for the element's box in its offset
parent's coordinates; `getClientOffset(relative)` and `getOffsetRelativeTo(parent)` for where it
sits; `getTransformOrigin()` parsed rather than as the string CSS gives.

**HTMLImageElement** - `toDataURL(type)`, `toBlob(type)`, `toArrayBuffer(type)`: an image already in
the page, read back out as bytes.

**Image** - `Image.fromBytes(bytes, type)`, awaited, which is the other direction and the one the
platform makes into an event dance.

**FormData** - `toObject()`, for reading one in a debugger.

**CSSStyleSheet** - `findRule(selector)` and `findRules(selector)` instead of walking `cssRules`,
`toTextList()` and `toString()`.

**ShadowRoot** - `adoptStyleSheet(content)`, which takes a string or a sheet, adopts it and hands it
back. With `copy` it adopts a copy, so a sheet shared between elements is not edited by one of them.

**DOMPoint** - `transform(matrix, round)`, and a `toString` that can print in two dimensions.

**DOMQuad** - `transform(matrix)`, `contains(point)` (a convex test against all four edges), and a
readable `toString`.

**DOMRect** - `union`, `intersect`, `intersects`, `contains(point)`, `includes(rect)`,
`transform(matrix)` (the bounds of the transformed edges), `ceil` / `floor` which round a rect
outwards or inwards rather than each number on its own, and `DOMRect.ofEdges(left, top, right,
bottom)` for the rect one naturally has the edges of. As properties, `size`, `center` and `area`;
and `toPath()`, the four corners closed back onto the first, for what takes a path rather than a
rect.

**DOMMatrix** - the transform arithmetic a canvas or an editor keeps rewriting:

| | |
|---|---|
| `tx` `ty` `dx` `dy` | the translation, under the names the rest of the world uses for `e` and `f` |
| `translated` `rotated` `scaled` `skewed` | the matrix read back as what was done to it |
| `invert()` | `inverse()` under the name people reach for |
| `DOMMatrix.fromTranslate` `fromRotate` `fromScale` | a matrix from one operation, rotation and scale around a pivot |
| `DOMMatrix.fromPoints(from, to)` | the transform that takes three points to three points |
| `at(pivot)` | the same transform, applied around a point instead of around the origin |
| `DOMMatrix.toLocal(matrix, pivot)` | and the way back out of that point's space |
| `DOMMatrix.inSpace(matrix, space)` `toSpace` | the same transform as another space would perform it, and as that space would read it |
| `toString(textTable)` | one line, or laid out as a table to be looked at |

## Custom elements

This one is a wrapper rather than an extension: it adds no members anywhere, it widens what an
existing method accepts.

`customElements.define` takes a name and a class, and a component usually needs to say more than
that at the moment it is registered: where it was served from, so it can find its own icons; a
stylesheet meant for the document rather than for a shadow root; a font to declare. The platform's
third argument is the place for it, and the specification leaves exactly one key in it - `extends`.
The wrapper reads the rest below, and hands that one on as it found it.

```js
import "js-ext-mixins"
import "js-ext-mixins/custom-elements"

customElements.define("my-thing", MyThing, {clazzURL: import.meta.url, assets: true});
```

| | |
|---|---|
| `clazzURL` | the address of the module doing the registering - `import.meta.url` - from which the folder it was served from becomes `baseURL` on the class |
| `assets` | puts `icon(path)`, `image(path)` and `html()` on the class, each resolving under `baseURL` and under the element's own tag name; `true` in place of the tag name asks for the folder that belongs to no single element |
| `style` | a `CSSStyleSheet` to adopt into the document, named after the element |
| `font` | `{name, format}`, a `@font-face` built and adopted, its sources read from `baseURL/fonts/<tag>/<name>.<ext>` |
| `abstract` | do everything else and register nothing, which is what a base class needs |
| `extends` | the built-in element being customized, as the platform means it; the class also gets an `is` of its own |
| `define` | options to hand to the platform's own define instead of these |

It has an import of its own for two reasons, and both are about order. It has to be the outermost
patch of `define`, so the custom elements polyfill it stands on is imported beside it, where the
order cannot be got wrong - and that polyfill reads `self` as it loads, so a library carrying it
could not be imported in Node at all.

Being outside the main import also puts it outside `JS_EXT_SCOPE` and outside `Extension.applied`:
it is asked for by importing it, and nothing else. `CustomElementRegistry._ext` is how a page tells
whether the options above are understood - the mark the patch leaves, and what stops it being done
twice.

So it does not derive from `Extension`, and that is the kind of thing it is rather than an
oversight. An extension puts members on a class that is missing them; a wrapper stands in front of
a method that is already there and takes more than it used to. Nothing here is a polyfill either:
a polyfill fills a gap against a specification and becomes a no-op the day the runtime closes it,
and no runtime will ever ship these options, because nobody has specified them. The polyfill in
this entry point is the one underneath - `@ungap/custom-elements`, for the customized built-ins -
and it cannot be moved out to `polyfills/`, because the order between the two is the whole reason
the entry point exists.

## Add-ons

Two small classes the extensions hand back, rather than plain objects: **`DOMSize`** - a width and a
height, with `DOMSize.fromSize(value)` and a `toJSON`, so it survives being stored - and
**`EnumValue`**, one entry of an enum made by `Object.defineEnum`, which knows its name, its value
and its index.

## Polyfills

**CSSStyleSheet**, for constructable stylesheets where they are missing. It is a separate import
because a polyfill is a decision rather than a convenience:

```js
import "js-ext-mixins/polyfills/css-style-sheet"
```

## In the global scope

Two, and only two. `parseBool(value)` reads a boolean out of whatever it is given - the string
`"false"` and the number `0` are false, an empty string is false, `undefined` is false, an object is
true when it is not null - which is what an attribute or a query parameter needs and what `Boolean`
does not do. `JS_EXT_SCOPE` is the list of classes to extend, which is also how it is narrowed - see above.

## Writing one of your own

An extension is a class deriving from `Extension`, holding the members to be added.
`src/classes/TemplateExt.js` is the shape of one, with the three ways of adding something written
out: methods on the prototype, `properties` for accessors, `classProperties` for what goes on the
class itself. A method is documented with a block of its own; an accessor with a block on
its entry, carrying an `@name` - a class level `@property` does not survive `@hideconstructor`, which
every one of these classes has.

A member that already exists is skipped. To replace one on purpose, name it in `overrides` - which
is read for methods only: an accessor is never put over one the class already has, whatever the list
says. And if the replacement has to call the one it replaced, take it before the extension is
applied, which is what `DOMMatrixExt` does:

```js
let nativeFromMatrix;

class DOMMatrixExt extends Extension {
    static overrides = ["toString", "fromMatrix"];

    static extend() {
        if (typeof DOMMatrix === "undefined" || nativeFromMatrix)
            return false;

        nativeFromMatrix = DOMMatrix.fromMatrix;

        Extension.extend("DOMMatrix", this);
    }
}
```

`Extension.debug` prints what was defined, overridden and skipped, class by class, which is the
quickest way to find out why a method is not there. It is read while the extensions are applied,
which is the import itself, so it is set in `src/index.js` - the line is there, commented - and the
library run from source.

## Entry points

| | |
|---|---|
| `js-ext-mixins` | the built library, minified |
| `js-ext-mixins/src` | the same, unminified |
| `js-ext-mixins/dev` | the sources, for debugging through them |
| `js-ext-mixins/custom-elements` | the registry wrapper and the polyfill under it |
| `js-ext-mixins/polyfills/css-style-sheet` | the polyfill, on its own |

The custom elements entry has an unminified `/src` and a plain source `/dev` beside it, on the
pattern of the first three; the polyfill has a `/src` and nothing further.

A `/dev` entry is the source as it stands, so what it imports is resolved where it is read from. That
matters for one of them: `custom-elements/dev` imports `@ungap/custom-elements` by name, and the
polyfill is a dev dependency here rather than one this package installs - every built entry carries
its own copy of it. So that path is for debugging inside this repository, or through a link to it,
rather than from an install.

## Building

```
npm run build          rollup, the docs and the tests
npm run doc            jsdoc, into ./docs
npm test               mocha
```

The generated documentation is the reference this page is not: every method with its parameters and
what it gives back.

## License

The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).
