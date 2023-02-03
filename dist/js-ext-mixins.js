(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsExt = {}));
})(this, (function (exports) { 'use strict';

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var version = "1.0.6";

  var Extension = /*#__PURE__*/function () {
    function Extension() {
      _classCallCheck(this, Extension);
    }
    _createClass(Extension, null, [{
      key: "extend",
      value: function extend(clazz) {
        var _this = this;
        var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        var name;
        if (typeof clazz == "string") {
          name = clazz;
          clazz = globalThis[name];
        } else name = clazz.name;
        if (!clazz) {
          if (this.debug) console.warn("============================================================ Class ".concat(name, " not found"));
          return false;
        }
        if (this.debug) console.log("============================================================ extend", clazz.name, extension.name);
        Object.getOwnPropertyNames(extension.prototype).filter(function (name) {
          return name != "constructor";
        }).forEach(function (name) {
          if (name in clazz.prototype && !extension.overrides.includes(name)) {
            if (_this.debug) console.log("%cexclude ".concat(name), "color: red");
            return;
          }
          if (_this.debug) {
            if (extension.overrides.includes(name)) console.log("%coverride ".concat(name), "color: chartreuse");else console.log("%cdefine ".concat(name), "color: green");
          }
          Object.defineProperty(clazz.prototype, name, {
            value: extension.prototype[name],
            configurable: true
          });
        });
        Object.getOwnPropertyNames(extension).forEach(function (name) {
          if (typeof extension[name] != "function" || name == "extend") return;
          if (name in clazz && !extension.overrides.includes(name)) {
            if (_this.debug) console.log("%cexclude static ".concat(name), "color: red");
            return;
          }
          if (_this.debug) {
            if (extension.overrides.includes(name)) console.log("%coverride static ".concat(name), "color: chartreuse");else console.log("%cdefine static ".concat(name), "color: orange");
          }
          clazz[name] = extension[name];
        });
        if (extension.properties) {
          Object.keys(extension.properties).forEach(function (name) {
            if (name in clazz.prototype) {
              if (_this.debug) console.log("%cexclude prop ".concat(name), "color: red");
              return;
            }
            if (extension.properties[name]) {
              if (_this.debug) console.log("%cdefine prop ".concat(name), "color: darkseagreen");
              Object.defineProperty(clazz.prototype, name, extension.properties[name]);
            }
          });
        }
        if (extension.classProperties) {
          Object.keys(extension.classProperties).forEach(function (name) {
            if (name in clazz) {
              if (_this.debug) console.log("%cexclude static prop ".concat(name), "color: red");
              return;
            }
            if (extension.classProperties[name]) {
              if (_this.debug) console.log("%cdefine static prop ".concat(name), "color: chocolate");
              Object.defineProperty(clazz, name, extension.classProperties[name]);
            }
          });
        }
        return true;
      }
    }]);
    return Extension;
  }();
  _defineProperty(Extension, "overrides", ["toString"]);

  var EnumValue = /*#__PURE__*/function () {
    function EnumValue(name, value, index) {
      _classCallCheck(this, EnumValue);
      Object.defineProperty(this, "type", {
        value: name,
        enumerable: true
      });
      Object.defineProperty(this, "name", {
        value: value,
        enumerable: true
      });
      Object.defineProperty(this, "value", {
        value: index,
        enumerable: true
      });
    }
    _createClass(EnumValue, [{
      key: "toString",
      value: function toString() {
        return this.name;
      }
    }]);
    return EnumValue;
  }();

  var ObjectExt = /*#__PURE__*/function (_Extension) {
    _inherits(ObjectExt, _Extension);
    var _super = _createSuper(ObjectExt);
    function ObjectExt() {
      _classCallCheck(this, ObjectExt);
      return _super.apply(this, arguments);
    }
    _createClass(ObjectExt, null, [{
      key: "equals",
      value: function equals(x, y) {
        if (x === y) return true;
        if (!(x instanceof Object && y instanceof Object)) return false;
        if (x.constructor !== y.constructor) return false;
        if (x instanceof Array || ArrayBuffer.isTypedArray(x)) {
          if (x.length != y.length) return false;
          return x.every(function (v, i) {
            return Object.equals(v, y[i]);
          });
        }
        for (var p in x) {
          if (!x.hasOwnProperty(p)) continue;
          if (!y.hasOwnProperty(p)) return false;
          if (x[p] === y[p]) continue;
          if (_typeof(x[p]) !== "object") return false;
          if (!Object.equals(x[p], y[p])) return false;
        }
        for (var _p in y) {
          if (y.hasOwnProperty(_p) && !x.hasOwnProperty(_p)) return false;
        }
        return true;
      }
    }, {
      key: "clone",
      value: function clone(oReferance) {
        var bDataOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var aReferances = new Array();
        function deepCopy(oSource) {
          if (oSource === null) return null;
          if (_typeof(oSource) !== "object" || oSource.immutable) return oSource;
          if (typeof oSource.clone === "function") return oSource.clone();
          for (var i = 0; i < aReferances.length; i++) {
            if (aReferances[i][0] === oSource) return aReferances[i][1];
          }
          var oCopy = Object.create(Object.getPrototypeOf(oSource));
          aReferances.push([oSource, oCopy]);
          for (var sPropertyName in oSource) {
            if (bDataOnly && typeof oSource[sPropertyName] === "function") continue;
            if (oSource.hasOwnProperty(sPropertyName)) oCopy[sPropertyName] = deepCopy(oSource[sPropertyName]);
          }
          return oCopy;
        }
        return deepCopy(oReferance);
      }
    }, {
      key: "defineEnum",
      value: function defineEnum(target, name, values) {
        if (target[name]) throw new Error("Already exist property: ".concat(name));
        var type = {
          name: name,
          values: values.map(function (value, index) {
            return new EnumValue(name, value, index);
          })
        };
        type.values.forEach(function (value) {
          Object.defineProperty(type, value.name, {
            value: value,
            enumerable: true
          });
          Object.defineProperty(type, value.value, {
            value: value,
            enumerable: true
          });
        });
        Object.defineProperty(target, name, {
          value: type,
          enumerable: true
        });
        return type;
      }
    }]);
    return ObjectExt;
  }(Extension);

  var StringExt = /*#__PURE__*/function (_Extension) {
    _inherits(StringExt, _Extension);
    var _super = _createSuper(StringExt);
    function StringExt() {
      _classCallCheck(this, StringExt);
      return _super.apply(this, arguments);
    }
    _createClass(StringExt, [{
      key: "padStart",
      value: function padStart(length) {
        var _char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "-";
        return this.length < length ? new Array(length - this.length + 1).join(_char) + this : this.toString();
      }
    }, {
      key: "toCharArray",
      value: function toCharArray() {
        var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var list = [];
        var byteList = true;
        for (var i = 0; i < this.length; i++) {
          var code = this.charCodeAt(i);
          if (code > 255) byteList = false;
          list[i] = code;
        }
        if (bytes) {
          if (!byteList) throw new Error("Current value is not byte string");
          list = new Uint8Array(list);
        }
        return list;
      }
    }], [{
      key: "fromCharArray",
      value: function fromCharArray(data) {
        var binary = "";
        try {
          binary = String.fromCharCode.apply(null, data);
        } catch (e) {
          for (var i = 0; i < data.length; i++) {
            binary += String.fromCharCode(data[i]);
          }
        }
        return binary;
      }
    }]);
    return StringExt;
  }(Extension);

  var NumberExt = /*#__PURE__*/function (_Extension) {
    _inherits(NumberExt, _Extension);
    var _super = _createSuper(NumberExt);
    function NumberExt() {
      _classCallCheck(this, NumberExt);
      return _super.apply(this, arguments);
    }
    _createClass(NumberExt, [{
      key: "format",
      value: function format(pattern) {
        if (!Number.isInteger(this) || this < 0) throw new Error("Underlying number ".concat(this, " should be positive integer"));
        if (this.toString().length < pattern.length) return pattern.substring(0, pattern.length - this.toString().length) + this;else return this.toString();
      }
    }]);
    return NumberExt;
  }(Extension);
  _defineProperty(NumberExt, "classProperties", {
    MAX_INT32: {
      value: 0x7FFFFFFF,
      enumerable: true
    },
    MAX_UINT32: {
      value: 0xFFFFFFFF,
      enumerable: true
    },
    MAX_INT64: typeof BigInt == "undefined" ? undefined : {
      value: 0x7FFFFFFFFFFFFFFFn,
      enumerable: true
    },
    MAX_UINT64: typeof BigInt == "undefined" ? undefined : {
      value: 0xFFFFFFFFFFFFFFFFn,
      enumerable: true
    }
  });

  var DateExt = /*#__PURE__*/function (_Extension) {
    _inherits(DateExt, _Extension);
    var _super = _createSuper(DateExt);
    function DateExt() {
      _classCallCheck(this, DateExt);
      return _super.apply(this, arguments);
    }
    _createClass(DateExt, [{
      key: "format",
      value: function format(pattern) {
        var result = pattern;
        function resolve(search, value) {
          var rs = RegExp("".concat(search, "+")).exec(result);
          if (rs) {
            var match = rs[0];
            var _pattern = match.replace(new RegExp(match.substring(0, 1), "g"), "0");
            if (search == "Y" && match == "YY") value = parseInt(value.toString().substring(2));
            result = result.replace(match, value.format(_pattern));
          }
        }
        resolve("Y", this.getFullYear());
        resolve("M", this.getMonth() + 1);
        resolve("D", this.getDate());
        resolve("h", this.getHours());
        resolve("m", this.getMinutes());
        resolve("s", this.getSeconds());
        resolve("S", this.getMilliseconds());
        if (result.match(/[a-zA-Z]/)) throw new Error("Invalid pattern found in ".concat(pattern, ": ").concat(result.match(/[a-zA-Z]+/)[0]));
        return result;
      }
    }], [{
      key: "format",
      value: function format(pattern) {
        var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
        return new Date(timestamp).format(pattern);
      }
    }]);
    return DateExt;
  }(Extension);

  var FunctionExt = /*#__PURE__*/function (_Extension) {
    _inherits(FunctionExt, _Extension);
    var _super = _createSuper(FunctionExt);
    function FunctionExt() {
      _classCallCheck(this, FunctionExt);
      return _super.apply(this, arguments);
    }
    _createClass(FunctionExt, null, [{
      key: "createClass",
      value: function createClass(name, parentClass) {
        var def = new Function(parentClass ? parentClass.name : undefined, "return class ".concat(name).concat(parentClass ? " extends ".concat(parentClass.name) : "", " {\n\t\t\tconstructor() {\n\t\t\t\t").concat(parentClass ? "super(...arguments);" : "", "\n\t\t\t}\n\t\t}"));
        return def(parentClass);
      }
    }]);
    return FunctionExt;
  }(Extension);
  _defineProperty(FunctionExt, "properties", {
    body: {
      get: function get() {
        var body = this.toString();
        body = body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"));
        return body;
      },
      configurable: true
    }
  });

  var ArrayExt = /*#__PURE__*/function (_Extension) {
    _inherits(ArrayExt, _Extension);
    var _super = _createSuper(ArrayExt);
    function ArrayExt() {
      _classCallCheck(this, ArrayExt);
      return _super.apply(this, arguments);
    }
    _createClass(ArrayExt, [{
      key: "clear",
      value: function clear() {
        this.length = 0;
      }
    }, {
      key: "clone",
      value: function clone() {
        if (!Object.clone) throw new Error("Object extension is required");
        return this.map(function (item) {
          return Object.clone(item);
        });
      }
    }, {
      key: "unique",
      value: function unique() {
        var _this = this;
        return this.filter(function (item, index) {
          return _this.indexOf(item) == index;
        });
      }
    }, {
      key: "insert",
      value: function insert(item) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        this.splice(index, 0, item);
      }
    }, {
      key: "indicesOf",
      value: function indicesOf(item) {
        var indices = [];
        var index = this.indexOf(item);
        if (index != -1) {
          indices.push(index);
          var lastIndex = this.lastIndexOf(item);
          while (lastIndex > index) {
            index = this.indexOf(item, index + 1);
            indices.push(index);
          }
        }
        return indices;
      }
    }, {
      key: "remove",
      value: function remove() {
        var _this2 = this;
        var group = function group(indices) {
          var groups = [];
          var lastIndex = -1;
          indices.forEach(function (index) {
            if (lastIndex - index != 1) groups.push([]);
            groups.last.push(index);
            lastIndex = index;
          });
          return groups;
        };
        for (var _len = arguments.length, itemN = new Array(_len), _key = 0; _key < _len; _key++) {
          itemN[_key] = arguments[_key];
        }
        var indices = itemN.map(function (element) {
          return _this2.indicesOf(element);
        }).flat().sort(function (a, b) {
          return b - a;
        });
        group(indices).forEach(function (group) {
          return _this2.removeAt(group.last, group.length);
        });
        return this;
      }
    }, {
      key: "removeAt",
      value: function removeAt(index) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        if (index > -1) this.splice(index, count);
        return this;
      }
    }, {
      key: "replace",
      value: function replace(item, replaceWith) {
        var exact = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var index = this.indexOf(item);
        if (index > -1) {
          if (!exact && replaceWith instanceof Array) this.splice.apply(this, [index, 1].concat(_toConsumableArray(replaceWith)));else this.splice(index, 1, replaceWith);
        }
        return this;
      }
    }], [{
      key: "from",
      value: function from(collection) {
        return Array.prototype.slice.call(collection);
      }
    }]);
    return ArrayExt;
  }(Extension);
  _defineProperty(ArrayExt, "properties", {
    first: {
      get: function get() {
        return this[0];
      },
      configurable: true
    },
    last: {
      get: function get() {
        return this[this.length - 1];
      },
      configurable: true
    }
  });

  var ArrayBufferExt = /*#__PURE__*/function (_Extension) {
    _inherits(ArrayBufferExt, _Extension);
    var _super = _createSuper(ArrayBufferExt);
    function ArrayBufferExt() {
      _classCallCheck(this, ArrayBufferExt);
      return _super.apply(this, arguments);
    }
    _createClass(ArrayBufferExt, [{
      key: "toBase64",
      value: function toBase64() {
        if (!String.fromCharArray) throw new Error("String extension is required");
        var bytes = new Uint8Array(this);
        return btoa(String.fromCharArray(bytes));
      }
    }], [{
      key: "fromBase64",
      value: function fromBase64(str) {
        if (!String.prototype.toCharArray) throw new Error("String extension is required");
        return atob(str).toCharArray(true).buffer;
      }
    }, {
      key: "isTypedArray",
      value: function isTypedArray(o) {
        return ArrayBuffer.isView(o) && !(o instanceof DataView);
      }
    }]);
    return ArrayBufferExt;
  }(Extension);

  var SharedArrayBufferExt = /*#__PURE__*/function (_Extension) {
    _inherits(SharedArrayBufferExt, _Extension);
    var _super = _createSuper(SharedArrayBufferExt);
    function SharedArrayBufferExt() {
      _classCallCheck(this, SharedArrayBufferExt);
      return _super.apply(this, arguments);
    }
    _createClass(SharedArrayBufferExt, null, [{
      key: "fromArrayBuffer",
      value: function fromArrayBuffer(buffer) {
        if (!(buffer instanceof ArrayBuffer)) throw new Error("ArrayBuffer is expected");
        var bytes = new Uint8Array(buffer);
        var sharedBuffer = new SharedArrayBuffer(buffer.byteLength);
        var sharedBytes = new Uint8Array(sharedBuffer);
        sharedBytes.set(bytes);
        return sharedBuffer;
      }
    }]);
    return SharedArrayBufferExt;
  }(Extension);

  var TYPES = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"];
  var TypedArrayExt = /*#__PURE__*/function (_Extension) {
    _inherits(TypedArrayExt, _Extension);
    var _super = _createSuper(TypedArrayExt);
    function TypedArrayExt() {
      _classCallCheck(this, TypedArrayExt);
      return _super.apply(this, arguments);
    }
    _createClass(TypedArrayExt, [{
      key: "clone",
      value: function clone() {
        if (typeof SharedArrayBuffer != "undefined" && this.buffer instanceof SharedArrayBuffer) {
          var buffer = new SharedArrayBuffer(this.byteLength);
          var instance = new this.constructor(buffer);
          instance.set(this, this.byteOffset);
          return instance;
        } else return new this.constructor(this, this.byteOffset, this.length);
      }
    }, {
      key: "concat",
      value: function concat() {
        var _this = this;
        var length = this.length;
        var offset = this.length;
        for (var _len = arguments.length, others = new Array(_len), _key = 0; _key < _len; _key++) {
          others[_key] = arguments[_key];
        }
        others.forEach(function (other) {
          if (_this.constructor != other.constructor) throw new Error("Concat array from wrong type detected - expected ".concat(_this.constructor.name, ", found ").concat(other.constructor.name));
          length += other.length;
        });
        var result;
        if (typeof SharedArrayBuffer != "undefined" && this.buffer instanceof SharedArrayBuffer) result = this.constructor.createSharedInstance(length);else result = new this.constructor(length);
        result.set(this);
        others.forEach(function (other) {
          result.set(other, offset);
          offset += other.length;
        });
        return result;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return Array.from(this);
      }
    }], [{
      key: "createSharedInstance",
      value: function createSharedInstance() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        if (data instanceof this) {
          if (typeof SharedArrayBuffer == "undefined" || data.buffer instanceof SharedArrayBuffer) return data;else return new this(SharedArrayBufferExt.fromArrayBuffer(data.buffer));
        }
        if (typeof data != "number" && !Array.isArray(data)) throw new Error("Expected data type is Array");
        var length = typeof data == "number" ? data : data.length;
        if (typeof SharedArrayBuffer == "undefined") return typeof data == "number" ? new this(length) : new this(data);else {
          var buffer = new SharedArrayBuffer(length * this.BYTES_PER_ELEMENT);
          if (typeof data == "number") return new this(buffer);else {
            var instance = new this(buffer);
            instance.set(data);
            return instance;
          }
        }
      }
    }, {
      key: "from",
      value: function from(array) {
        return new this(array);
      }
    }, {
      key: "extend",
      value: function extend() {
        var _this2 = this;
        TYPES.forEach(function (type) {
          var success = Extension.extend(type + "Array", _this2);
          if (success) {
            var TypedArray = globalThis[type + "Array"];
            Object.defineProperty(Array.prototype, "to" + type + "Array", {
              value: function value() {
                return TypedArray.from(this);
              },
              configurable: true
            });
          }
        });
      }
    }]);
    return TypedArrayExt;
  }(Extension);

  var SetExt = /*#__PURE__*/function (_Extension) {
    _inherits(SetExt, _Extension);
    var _super = _createSuper(SetExt);
    function SetExt() {
      _classCallCheck(this, SetExt);
      return _super.apply(this, arguments);
    }
    _createClass(SetExt, [{
      key: "map",
      value: function map(callback) {
        var set = new Set();
        var _iterator = _createForOfIteratorHelper(this),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var value = _step.value;
            value = callback(value);
            if (value) set.add(value);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return set;
      }
    }, {
      key: "filter",
      value: function filter(callback) {
        var set = new Set();
        var _iterator2 = _createForOfIteratorHelper(this),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var value = _step2.value;
            if (callback(value)) set.add(value);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return set;
      }
    }]);
    return SetExt;
  }(Extension);

  var DOMSize$1 = /*#__PURE__*/function () {
    function DOMSize(width, height) {
      _classCallCheck(this, DOMSize);
      this.width = width;
      this.height = height;
    }
    _createClass(DOMSize, [{
      key: "toJSON",
      value: function toJSON() {
        return {
          width: this.width,
          height: this.height
        };
      }
    }, {
      key: "toString",
      value: function toString() {
        return "size(".concat(this.width, ", ").concat(this.height, ")");
      }
    }], [{
      key: "fromSize",
      value: function fromSize(value) {
        if (value instanceof DOMSize) return value;
        if (typeof value == "string") {
          if (value.startsWith("size(")) {
            var arr = value.substring(value.indexOf("(") + 1, value.indexOf(")")).split(/,\s*/g);
            value = {
              width: parseFloat(arr[0]),
              height: parseFloat(arr[1])
            };
          } else throw new Error("Invalid value found. Expected template - size(width, height).");
        }
        if (isNaN(value.width)) throw new Error("Invalid width found, expected number");
        if (isNaN(value.height)) throw new Error("Invalid height found, expected number");
        return new DOMSize(value.width, value.height);
      }
    }]);
    return DOMSize;
  }();

  var ScreenExt = /*#__PURE__*/function (_Extension) {
    _inherits(ScreenExt, _Extension);
    var _super = _createSuper(ScreenExt);
    function ScreenExt() {
      _classCallCheck(this, ScreenExt);
      return _super.apply(this, arguments);
    }
    return _createClass(ScreenExt);
  }(Extension);
  _defineProperty(ScreenExt, "properties", {
    size: {
      get: function get() {
        return new DOMSize$1(Math.floor(screen.width), Math.floor(screen.height));
      },
      configurable: true
    },
    resolution: {
      get: function get() {
        return new DOMSize$1(Math.floor(screen.width * devicePixelRatio), Math.floor(screen.height * devicePixelRatio));
      },
      configurable: true
    }
  });

  var LocationExt = /*#__PURE__*/function (_Extension) {
    _inherits(LocationExt, _Extension);
    var _super = _createSuper(LocationExt);
    function LocationExt() {
      _classCallCheck(this, LocationExt);
      return _super.apply(this, arguments);
    }
    _createClass(LocationExt, null, [{
      key: "properties",
      get: function get() {
        return {
          query: {
            get: function get() {
              if (!this._query) {
                var value = Object.assign.apply(Object, [{}].concat(_toConsumableArray(this.search.substring(1).split("&").filter(function (pair) {
                  return pair;
                }).map(function (pair) {
                  return pair.split("=");
                }).map(function (pair) {
                  return _defineProperty({}, pair[0], decodeURIComponent(pair[1]));
                }))));
                Object.defineProperty(this, "_query", {
                  value: value
                });
              }
              return this._query;
            },
            configurable: true
          }
        };
      }
    }]);
    return LocationExt;
  }(Extension);

  var HTMLElementExt = /*#__PURE__*/function (_Extension) {
    _inherits(HTMLElementExt, _Extension);
    var _super = _createSuper(HTMLElementExt);
    function HTMLElementExt() {
      _classCallCheck(this, HTMLElementExt);
      return _super.apply(this, arguments);
    }
    _createClass(HTMLElementExt, [{
      key: "getClientOffset",
      value: function getClientOffset() {
        var relative = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var offsetParent = this;
        var offsetLeft = 0;
        var offsetTop = 0;
        do {
          offsetLeft += offsetParent.offsetLeft;
          offsetTop += offsetParent.offsetTop;
          offsetParent = offsetParent.offsetParent;
        } while (offsetParent);
        var scrollParent = this;
        var scrollLeft = 0;
        var scrollTop = 0;
        if (!relative) {
          do {
            var position = scrollParent.computedStyle.position;
            if (position == "absolute" || position == "fixed") {
              scrollLeft = 0;
              scrollTop = 0;
              break;
            }
            scrollLeft += scrollParent.scrollLeft;
            scrollTop += scrollParent.scrollTop;
            scrollParent = scrollParent.parentNode;
            if (scrollParent && scrollParent.host) scrollParent = scrollParent.host;
          } while (scrollParent != document);
        }
        return new DOMPoint(offsetLeft - scrollLeft, offsetTop - scrollTop);
      }
    }, {
      key: "toRect",
      value: function toRect() {
        var display = this.style.display;
        var visibility = this.style.visibility;
        if (display == "none") {
          this.style.visibility = "hidden";
          this.style.display = "";
        }
        var computedStyle = window.getComputedStyle(this);
        var margin = {
          left: parseFloat(computedStyle.marginLeft),
          top: parseFloat(computedStyle.marginTop),
          right: parseFloat(computedStyle.marginRight),
          bottom: parseFloat(computedStyle.marginBottom)
        };
        var outerWidth = this.offsetWidth + margin.left + margin.right;
        var outerHeight = this.offsetHeight + margin.top + margin.bottom;
        var result = new DOMRect(this.offsetLeft, this.offsetTop, this.offsetWidth, this.offsetHeight);
        result.outerSize = new DOMSize(outerWidth, outerHeight);
        if (display == "none") {
          this.style.visibility = visibility;
          this.style.display = "none";
        }
        return result;
      }
    }]);
    return HTMLElementExt;
  }(Extension);
  _defineProperty(HTMLElementExt, "properties", {
    computedStyle: {
      get: function get() {
        return window.getComputedStyle(this);
      },
      configurable: true
    }
  });

  var HTMLImageElementExt = /*#__PURE__*/function (_Extension) {
    _inherits(HTMLImageElementExt, _Extension);
    var _super = _createSuper(HTMLImageElementExt);
    function HTMLImageElementExt() {
      _classCallCheck(this, HTMLImageElementExt);
      return _super.apply(this, arguments);
    }
    _createClass(HTMLImageElementExt, [{
      key: "toDataURL",
      value: function toDataURL() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "png";
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext("2d").drawImage(this, 0, 0);
        return canvas.toDataURL("image/".concat(type));
      }
    }, {
      key: "toBlob",
      value: function toBlob() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "png";
        return new Blob([this.toArrayBuffer(type)], {
          type: "image/".concat(type)
        });
      }
    }, {
      key: "toArrayBuffer",
      value: function toArrayBuffer(type) {
        if (!ArrayBuffer.fromBase64) throw new Error("ArrayBuffer extension is required");
        var dataURL = this.toDataURL(type);
        var base64 = dataURL.split(",")[1];
        return ArrayBuffer.fromBase64(base64);
      }
    }]);
    return HTMLImageElementExt;
  }(Extension);

  var ImageExt = /*#__PURE__*/function (_Extension) {
    _inherits(ImageExt, _Extension);
    var _super = _createSuper(ImageExt);
    function ImageExt() {
      _classCallCheck(this, ImageExt);
      return _super.apply(this, arguments);
    }
    _createClass(ImageExt, null, [{
      key: "fromBytes",
      value: function fromBytes(bytes) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "png";
        var image = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Image();
        return new Promise(function (resolve, reject) {
          image.onload = function () {
            URL.revokeObjectURL(image.src);
            resolve(image);
          };
          image.onerror = reject;
          image.src = URL.createObjectURL(new Blob([bytes.buffer || bytes], {
            type: "image/".concat(type)
          }));
        });
      }
    }]);
    return ImageExt;
  }(Extension);

  var DOMPointExt = /*#__PURE__*/function (_Extension) {
    _inherits(DOMPointExt, _Extension);
    var _super = _createSuper(DOMPointExt);
    function DOMPointExt() {
      _classCallCheck(this, DOMPointExt);
      return _super.apply(this, arguments);
    }
    _createClass(DOMPointExt, [{
      key: "transform",
      value: function transform(matrix) {
        if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
        return this.matrixTransform(matrix);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "point(".concat(this.x, ", ").concat(this.y, ", ").concat(this.z, ")");
      }
    }]);
    return DOMPointExt;
  }(Extension);

  var DOMRectExt = /*#__PURE__*/function (_Extension) {
    _inherits(DOMRectExt, _Extension);
    var _super = _createSuper(DOMRectExt);
    function DOMRectExt() {
      _classCallCheck(this, DOMRectExt);
      return _super.apply(this, arguments);
    }
    _createClass(DOMRectExt, [{
      key: "union",
      value: function union(rect) {
        if (!rect) return this;
        return DOMRect.ofEdges(Math.min(this.left, rect.left), Math.min(this.top, rect.top), Math.max(this.right, rect.right), Math.max(this.bottom, rect.bottom));
      }
    }, {
      key: "intersect",
      value: function intersect(rect) {
        if (!rect) return;
        var result = DOMRect.ofEdges(Math.max(this.left, rect.left), Math.max(this.top, rect.top), Math.min(this.right, rect.right), Math.min(this.bottom, rect.bottom));
        return result.width > 0 && result.height > 0 ? result : undefined;
      }
    }, {
      key: "ceil",
      value: function ceil() {
        var even = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var left = Math.floor(this.left);
        var top = Math.floor(this.top);
        var right = Math.ceil(this.right);
        var bottom = Math.ceil(this.bottom);
        if (even) {
          var width = this.width;
          var height = this.height;
          width += width % 2;
          height += height % 2;
          right = left + width;
          bottom = top + height;
        }
        return DOMRect.ofEdges(left, top, right, bottom);
      }
    }, {
      key: "floor",
      value: function floor() {
        var even = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var left = Math.ceil(this.left);
        var top = Math.ceil(this.top);
        var right = Math.floor(this.right);
        var bottom = Math.floor(this.bottom);
        if (even) {
          var width = this.width;
          var height = this.height;
          width -= width % 2;
          height -= height % 2;
          right = left + width;
          bottom = top + height;
        }
        return DOMRect.ofEdges(left, top, right, bottom);
      }
    }, {
      key: "contains",
      value: function contains(point) {
        return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y;
      }
    }, {
      key: "transform",
      value: function transform(matrix) {
        if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
        var leftTop = DOMPoint.fromPoint({
          x: this.left,
          y: this.top
        }).transform(matrix);
        var rightTop = DOMPoint.fromPoint({
          x: this.right,
          y: this.top
        }).transform(matrix);
        var leftBottom = DOMPoint.fromPoint({
          x: this.left,
          y: this.bottom
        }).transform(matrix);
        var rightBottom = DOMPoint.fromPoint({
          x: this.right,
          y: this.bottom
        }).transform(matrix);
        var left = Math.min(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
        var top = Math.min(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);
        var right = Math.max(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
        var bottom = Math.max(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);
        return DOMRect.ofEdges(left, top, right, bottom);
      }
    }, {
      key: "toPath",
      value: function toPath() {
        var path = [];
        path.push(this.left, this.top);
        path.push(this.right, this.top);
        path.push(this.right, this.bottom);
        path.push(this.left, this.bottom);
        path.push(this.left, this.top);
        return path.toFloat32Array();
      }
    }, {
      key: "toString",
      value: function toString() {
        return "rect(".concat(this.x, ", ").concat(this.y, ", ").concat(this.width, ", ").concat(this.height, ")");
      }
    }], [{
      key: "ofEdges",
      value: function ofEdges(left, top, right, bottom) {
        return new DOMRect(left, top, right - left, bottom - top);
      }
    }, {
      key: "extend",
      value: function extend() {
        var success = Extension.extend("DOMRect", this);
        if (success) globalThis.DOMSize = DOMSize$1;
      }
    }]);
    return DOMRectExt;
  }(Extension);
  _defineProperty(DOMRectExt, "properties", {
    size: {
      get: function get() {
        return new DOMSize$1(this.width, this.height);
      },
      configurable: true
    },
    center: {
      get: function get() {
        return new DOMPoint((this.left + this.right) / 2, (this.top + this.bottom) / 2);
      },
      configurable: true
    }
  });

  var nativeFromMatrix;
  var nativeToString;
  var nativeMultiply;
  var nativeMultiplySelf;
  var DOMMatrixExt = /*#__PURE__*/function (_Extension) {
    _inherits(DOMMatrixExt, _Extension);
    var _super = _createSuper(DOMMatrixExt);
    function DOMMatrixExt() {
      _classCallCheck(this, DOMMatrixExt);
      return _super.apply(this, arguments);
    }
    _createClass(DOMMatrixExt, [{
      key: "preMultiply",
      value: function preMultiply(delta) {
        var result = delta.postMultiply(this);
        result.multiplicationType = this.multiplicationType;
        return result;
      }
    }, {
      key: "postMultiply",
      value: function postMultiply(delta) {
        return nativeMultiply.call(this, delta);
      }
    }, {
      key: "multiply",
      value: function multiply(delta) {
        if (!(delta instanceof DOMMatrix)) delta = DOMMatrix.fromMatrix(delta);
        if (this.multiplicationType == DOMMatrix.MultiplicationType.POST) return this.postMultiply(delta);else {
          var result = this.preMultiply(delta);
          result.multiplicationType = DOMMatrix.MultiplicationType.PRE;
          return result;
        }
      }
    }, {
      key: "postMultiplySelf",
      value: function postMultiplySelf(delta) {
        return nativeMultiplySelf.call(this, delta);
      }
    }, {
      key: "multiplySelf",
      value: function multiplySelf(delta) {
        if (!(delta instanceof DOMMatrix)) delta = DOMMatrix.fromMatrix(delta);
        if (this.multiplicationType == DOMMatrix.MultiplicationType.POST) return this.postMultiplySelf(delta);else return this.preMultiplySelf(delta);
      }
    }, {
      key: "transformPoint",
      value: function transformPoint(point) {
        return DOMPoint.fromPoint(point).matrixTransform(this);
      }
    }, {
      key: "invert",
      value: function invert() {
        return this.inverse();
      }
    }, {
      key: "decompose",
      value: function decompose() {
        return {
          translate: {
            x: this.tx,
            y: this.ty
          },
          rotate: {
            angle: Math.atan2(this.b, this.a)
          },
          skew: {
            angleX: Math.tan(this.c),
            angleY: Math.tan(this.b)
          },
          scale: {
            x: Math.sqrt(this.a * this.a + this.c * this.c),
            y: Math.sqrt(this.d * this.d + this.b * this.b)
          },
          matrix: this
        };
      }
    }, {
      key: "toString",
      value: function toString() {
        var textTable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!textTable) return nativeToString.call(this);
        var format = function format(n) {
          return ((n < 0 ? "" : " ") + n.toPrecision(6)).substring(0, 8);
        };
        return " Matrix 4x4" + "\n" + "-".repeat(39) + "\n".concat(format(this.m11), ", ").concat(format(this.m21), ", ").concat(format(this.m31), ", ").concat(format(this.m41)) + "\n".concat(format(this.m12), ", ").concat(format(this.m22), ", ").concat(format(this.m32), ", ").concat(format(this.m42)) + "\n".concat(format(this.m13), ", ").concat(format(this.m23), ", ").concat(format(this.m33), ", ").concat(format(this.m43)) + "\n".concat(format(this.m14), ", ").concat(format(this.m24), ", ").concat(format(this.m34), ", ").concat(format(this.m44));
      }
    }], [{
      key: "fromMatrix",
      value: function fromMatrix(data, multiplicationType) {
        var result;
        if (typeof data == "string") result = new DOMMatrix(data);else {
          if (!("e" in data)) data.e = data.tx || data.dx;
          if (!("f" in data)) data.f = data.ty || data.dy;
          result = nativeFromMatrix(data);
        }
        result.multiplicationType = multiplicationType || data.multiplicationType || DOMMatrix.MultiplicationType.POST;
        return result;
      }
    }, {
      key: "fromTranslate",
      value: function fromTranslate(offset) {
        var translate = isFinite(offset) ? {
          tx: offset,
          ty: offset
        } : {
          tx: offset.x,
          ty: offset.y
        };
        return DOMMatrix.fromMatrix(translate);
      }
    }, {
      key: "fromRotate",
      value: function fromRotate(alpha, origin) {
        var sin = Math.sin(alpha);
        var cos = Math.cos(alpha);
        var rotate = {
          a: cos,
          b: sin,
          c: -sin,
          d: cos
        };
        if (origin) {
          rotate.tx = origin.x - origin.x * cos + origin.y * sin;
          rotate.ty = origin.y - origin.x * sin - origin.y * cos;
        }
        return DOMMatrix.fromMatrix(rotate);
      }
    }, {
      key: "fromScale",
      value: function fromScale(factor, origin) {
        if (isFinite(factor)) factor = {
          x: factor,
          y: factor
        };
        var scale = {
          a: factor.x,
          d: factor.y
        };
        if (origin) {
          scale.tx = origin.x - origin.x * factor.x;
          scale.ty = origin.y - origin.y * factor.y;
        }
        return DOMMatrix.fromMatrix(scale);
      }
    }, {
      key: "fromPoints",
      value: function fromPoints(ps, pf) {
        var O = DOMMatrix.fromMatrix({
          m11: ps[0].x,
          m21: ps[1].x,
          m31: ps[2].x,
          m12: ps[0].y,
          m22: ps[1].y,
          m32: ps[2].y,
          m13: 1,
          m23: 1,
          m33: 1
        });
        var F = DOMMatrix.fromMatrix({
          m11: pf[0].x,
          m21: pf[1].x,
          m31: pf[2].x,
          m12: pf[0].y,
          m22: pf[1].y,
          m32: pf[2].y,
          m13: 1,
          m23: 1,
          m33: 1
        });
        var X = O.invert().preMultiply(F);
        return DOMMatrix.fromMatrix({
          a: X.m11,
          b: X.m12,
          c: X.m21,
          d: X.m22,
          tx: X.m31,
          ty: X.m32
        });
      }
    }, {
      key: "extend",
      value: function extend() {
        if (typeof DOMMatrix === "undefined" || nativeFromMatrix) return false;
        nativeFromMatrix = DOMMatrix.fromMatrix;
        nativeToString = DOMMatrix.prototype.toString;
        nativeMultiply = DOMMatrix.prototype.multiply;
        nativeMultiplySelf = DOMMatrix.prototype.multiplySelf;
        Extension.extend("DOMMatrix", this);
      }
    }]);
    return DOMMatrixExt;
  }(Extension);
  _defineProperty(DOMMatrixExt, "overrides", Extension.overrides.concat(["fromMatrix", "multiply", "multiplySelf", "transformPoint"]));
  _defineProperty(DOMMatrixExt, "properties", {
    tx: {
      get: function get() {
        return this.e;
      },
      set: function set(value) {
        this.e = value;
      },
      enumerable: true
    },
    ty: {
      get: function get() {
        return this.f;
      },
      set: function set(value) {
        this.f = value;
      },
      enumerable: true
    },
    dx: {
      get: function get() {
        return this.e;
      },
      set: function set(value) {
        this.e = value;
      },
      enumerable: true
    },
    dy: {
      get: function get() {
        return this.f;
      },
      set: function set(value) {
        this.f = value;
      },
      enumerable: true
    },
    multiplicationType: {
      value: "POST",
      enumerable: true,
      writable: true
    }
  });
  _defineProperty(DOMMatrixExt, "classProperties", {
    MultiplicationType: {
      value: {
        PRE: "PRE",
        POST: "POST"
      },
      enumerable: true
    }
  });

  var CSSStyleSheetExt = /*#__PURE__*/function (_Extension) {
    _inherits(CSSStyleSheetExt, _Extension);
    var _super = _createSuper(CSSStyleSheetExt);
    function CSSStyleSheetExt() {
      _classCallCheck(this, CSSStyleSheetExt);
      return _super.apply(this, arguments);
    }
    _createClass(CSSStyleSheetExt, [{
      key: "findRule",
      value: function findRule(selectorText) {
        var result;
        var rules = this.cssRules;
        var _iterator = _createForOfIteratorHelper(rules),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rule = _step.value;
            if (rule.selectorText == selectorText) {
              result = rule;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return result;
      }
    }, {
      key: "findRules",
      value: function findRules(selectorText) {
        return Array.from(this.cssRules).filter(function (rule) {
          return rule.selectorText == selectorText;
        });
      }
    }, {
      key: "toTextList",
      value: function toTextList() {
        return Array.from(this.cssRules).map(function (rule) {
          return rule.cssText;
        });
      }
    }, {
      key: "toString",
      value: function toString() {
        return Array.from(this.cssRules).map(function (rule) {
          return rule.cssText;
        }).join("\n");
      }
    }]);
    return CSSStyleSheetExt;
  }(Extension);

  var ShadowRootExt = /*#__PURE__*/function (_Extension) {
    _inherits(ShadowRootExt, _Extension);
    var _super = _createSuper(ShadowRootExt);
    function ShadowRootExt() {
      _classCallCheck(this, ShadowRootExt);
      return _super.apply(this, arguments);
    }
    _createClass(ShadowRootExt, [{
      key: "adoptStyleSheet",
      value: function adoptStyleSheet(text) {
        var sheet;
        if (this.adoptedStyleSheets) {
          sheet = new CSSStyleSheet();
          sheet.replaceSync(text);
          this.adoptedStyleSheets.push(sheet);
        } else {
          var style = document.createElement("style");
          style.innerHTML = text;
          this.appendChild(style);
          sheet = style.sheet;
        }
        return sheet;
      }
    }]);
    return ShadowRootExt;
  }(Extension);

  var HTMLDocumentExt = /*#__PURE__*/function (_Extension) {
    _inherits(HTMLDocumentExt, _Extension);
    var _super = _createSuper(HTMLDocumentExt);
    function HTMLDocumentExt() {
      _classCallCheck(this, HTMLDocumentExt);
      return _super.apply(this, arguments);
    }
    _createClass(HTMLDocumentExt, [{
      key: "adoptStyleSheet",
      value: function () {
        var _adoptStyleSheet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(src, name) {
          var sheet, Module, respone, text, style;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!this.adoptedStyleSheets) {
                    _context.next = 9;
                    break;
                  }
                  _context.next = 3;
                  return import(src);
                case 3:
                  Module = _context.sent;
                  sheet = Module["default"];
                  sheet.remove = function () {
                    document.adoptedStyleSheets.remove(this);
                  };
                  this.adoptedStyleSheets.push(sheet);
                  _context.next = 21;
                  break;
                case 9:
                  _context.next = 11;
                  return fetch(src);
                case 11:
                  respone = _context.sent;
                  _context.next = 14;
                  return respone.text();
                case 14:
                  text = _context.sent;
                  style = document.createElement("style");
                  style.innerHTML = text;
                  if (name) style.setAttribute("name", name);
                  this.head.appendChild(style);
                  sheet = style.sheet;
                  sheet.remove = function () {
                    style.remove();
                  };
                case 21:
                  if (name) sheet.name = name;
                  return _context.abrupt("return", sheet);
                case 23:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
        function adoptStyleSheet(_x, _x2) {
          return _adoptStyleSheet.apply(this, arguments);
        }
        return adoptStyleSheet;
      }()
    }]);
    return HTMLDocumentExt;
  }(Extension);

  var extensions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArrayBufferExt: ArrayBufferExt,
    ArrayExt: ArrayExt,
    CSSStyleSheetExt: CSSStyleSheetExt,
    DOMMatrixExt: DOMMatrixExt,
    DOMPointExt: DOMPointExt,
    DOMRectExt: DOMRectExt,
    DateExt: DateExt,
    FunctionExt: FunctionExt,
    HTMLDocumentExt: HTMLDocumentExt,
    HTMLElementExt: HTMLElementExt,
    HTMLImageElementExt: HTMLImageElementExt,
    ImageExt: ImageExt,
    LocationExt: LocationExt,
    NumberExt: NumberExt,
    ObjectExt: ObjectExt,
    ScreenExt: ScreenExt,
    SetExt: SetExt,
    ShadowRootExt: ShadowRootExt,
    SharedArrayBufferExt: SharedArrayBufferExt,
    StringExt: StringExt,
    TypedArrayExt: TypedArrayExt
  });

  if (typeof globalThis == "undefined") {
    if (typeof window !== "undefined") window.globalThis = window;else if (typeof self !== "undefined") self.globalThis = self;else if (typeof global !== "undefined") global.globalThis = global;
  }
  if (!globalThis["JS_EXT_SCOPE"]) {
    var scope = Object.keys(extensions).map(function (name) {
      return name.substring(0, name.length - 3);
    });
    Object.defineProperty(globalThis, "JS_EXT_SCOPE", {
      value: scope,
      enumerable: true,
      configurable: true
    });
  }
  var extend = new Function("Extension", "name", "Extension.extend(name)");
  var _iterator = _createForOfIteratorHelper(globalThis["JS_EXT_SCOPE"]),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var name = _step.value;
      var _Extension = extensions["".concat(name, "Ext")];
      if (!_Extension) throw new Error("Extension ".concat(name, " not found"));
      extend(_Extension, name);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  exports.Extension = Extension;
  exports.version = version;

}));
