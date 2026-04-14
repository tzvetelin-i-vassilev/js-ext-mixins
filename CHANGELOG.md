# js-ext-mixins ChangeLog

## 2.0.0

_2026-04-14_

### Breaking Changes
- _DOMMatrixExt_ - MultiplicationType discarded, removed methods preMultiply, postMultiply, postMultiplySelf
- _DOMMatrixExt_ - decompose method deprecated in favour of props - translated, rotated, scaled, skewed

### Updates
- _DOMMatrixExt_ - new method impl - at
- _DOMMatrixExt_ - new static methods impl - toLocal, inSpace, toSpace
- _DOMPointExt_ - transform method, round arg included

## 1.0.15

_2026-03-31_

### Updates
- _StringExt_ - dot notation conversion included

## 1.0.14

_2026-03-09_

### Updates
- _StringExt_ - conversion bewtween notations - camel, pascal, snake, kebab

## 1.0.13

_2025-08-28_

### Updates
- _HTMLElementExt_ - getTransformOrigin, getOffsetRelativeTo methods impl
- _DOMRectExt_ - center and area properties added

## 1.0.12

_2025-06-18_

### Updates
- _NumberExt_ - compareTo method impl

## 1.0.11

_2025-03-12_

### Updates
- DOMQuadExt extension added

## 1.0.10

_2024-09-17_

### Updates
- PromiseExt - extension added, static sleep method impl

## 1.0.9

_2024-06-20_

### Updates
- _ObjectExt_ - defineEnum redefine enum update

## 1.0.8

_2023-10-01_

### Updates
- HTMLElementExt - getClientOffset bug-fix when scroll and position absolute

## 1.0.7

_2023-07-01_

### Updates
- _DOMRectExt_ - methods intersects and includes impl
- _ImageExt_ - method fromBytes as promise

## 1.0.6

_2022-02-01_

### Updates
- Polyfill CSSStyleSheet to resolve Safari missing constructable style sheets
- HTMLDocument, ShadowRoot extensions added to resolve style sheets adoption
- unit tests included
- bug-fixing and improvments
- convert .js to .mjs

## 1.0.5

_2022-12-01_

- published in npm registry

## 1.0.4

_2022-08-01_

### Updates
- CSSStyleSheet extension added
- HTMLElement extension extended with getBoundingClientPos

## 1.0.3

_2022-04-01_

### Updates
- Date extension added
- SharedArrayBuffer extension added

## 1.0.2

_2021-10-01_

### Updates
- TypedArray extened with createSharedIntsance - instance with SharedArrayBuffer, various updates across TypedArray related with shared memory

## 1.0.1

_2021-06-01_

### Updates
- Function Set, Location extension implemented
- Number MAX_$Type constatnts implemented

## 1.0.0

_2020-07-01_

- First release
