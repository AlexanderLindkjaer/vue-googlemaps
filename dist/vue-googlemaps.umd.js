(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['vue-googlemaps'] = {})));
}(this, (function (exports) { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};











var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var loader = {
	loaded: false,
	readyPromises: [],

	/**
  * @param apiKey    API Key, or object with the URL parameters. For example
  *                  to use Google Maps Premium API, pass
  *                    `{ client: <YOUR-CLIENT-ID> }`.
  *                  You may pass the libraries and/or version (as `v`) parameter into
  *                  this parameter and skip the next two parameters
  * @param version   Google for Maps version
  * @param libraries Libraries to load (@see
  *                  https://developers.google.com/maps/documentation/javascript/libraries)
  * @param loadCn    Boolean. If set to true, the map will be loaded form goole maps China
  *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
  */
	load: function load(_ref) {
		var apiKey = _ref.apiKey,
		    version = _ref.version,
		    libraries = _ref.libraries,
		    loadCn = _ref.loadCn,
		    _ref$useNewFeatures = _ref.useNewFeatures,
		    useNewFeatures = _ref$useNewFeatures === undefined ? true : _ref$useNewFeatures;

		if (typeof window === 'undefined') {
			// Do nothing if run from server-side
			return Promise.resolve();
		}
		if (!this.loaded && (!window.google || !window.google.maps)) {
			var googleMapScript = document.createElement('SCRIPT');

			// Allow apiKey to be an object.
			// This is to support more esoteric means of loading Google Maps,
			// such as Google for business
			// https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
			var options = {};
			if (typeof apiKey === 'string') {
				options.key = apiKey;
			} else if ((typeof apiKey === 'undefined' ? 'undefined' : _typeof(apiKey)) === 'object') {
				for (var k in apiKey) {
					// transfer values in apiKey to options
					options[k] = apiKey[k];
				}
			} else {
				throw new Error('`apiKey` should either be a string or an object');
			}

			// libraries
			var librariesPath = '';
			if (libraries && libraries.length > 0) {
				librariesPath = libraries.join(',');
				options['libraries'] = librariesPath;
			} else if (Array.prototype.isPrototypeOf(options.libraries)) {
				options.libraries = options.libraries.join(',');
			}
			options['callback'] = 'VueGoogleMapsLoaded';

			var baseUrl = typeof loadCn === 'boolean' && loadCn === true ? 'http://maps.google.cn' : 'https://maps.googleapis.com';

			var urlParams = Object.keys(options).map(function (key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
			}).join('&');

			var url = baseUrl + '/maps/api/js?' + urlParams;

			// Override version if they do not want to use the new renderer/base map
			if (!useNewFeatures) {
				version = '3.31';
			}

			if (version) {
				url = url + '&v=' + version;
			}

			googleMapScript.setAttribute('src', url);
			googleMapScript.setAttribute('async', '');
			googleMapScript.setAttribute('defer', '');
			document.body.appendChild(googleMapScript);

			window.VueGoogleMapsLoaded = this._setLoaded.bind(this);
		} else {
			console.warn('The Google Maps library is already loaded');
			this._setLoaded();
		}
	},
	ensureReady: function ensureReady() {
		var _this = this;

		if (this.loaded) {
			return Promise.resolve();
		} else {
			var promise = new Promise(function (resolve) {
				_this.readyPromises.push(resolve);
			});
			return promise;
		}
	},
	_setLoaded: function _setLoaded() {
		this.loaded = true;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.readyPromises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var resolve = _step.value;

				resolve();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		this.readyPromises = [];
	}
};

function optionMergeStrategies(Vue) {
	var strats = Vue.config.optionMergeStrategies;

	strats.googleMapsReady = strats.created;
	strats.googleMapsPrepare = strats.created;
}

var config = void 0;

function initErrorHandling(Vue) {
	config = Vue.config;
}

function handleError(e, vm, info) {
	if (config.errorHandler) {
		config.errorHandler(e, vm, info);
	} else {
		if (typeof console !== 'undefined') {
			console.error(e);
		} else {
			throw e;
		}
	}
}

function autoCall(value) {
	return typeof value === 'function' ? value() : value;
}

function capitalize(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function bindProp(_ref) {
	var vm = _ref.vm,
	    name = _ref.name,
	    targetPropName = _ref.targetPropName,
	    target = _ref.target,
	    watcher = _ref.watcher,
	    identity = _ref.identity,
	    applier = _ref.applier,
	    retriever = _ref.retriever,
	    readOnly = _ref.readOnly,
	    event = _ref.event,
	    changeEvent = _ref.changeEvent;

	if (!targetPropName) {
		targetPropName = name;
	}
	if (!changeEvent) {
		changeEvent = targetPropName.toLowerCase() + '_changed';
	}

	var setValue = void 0;
	var capitalizedName = capitalize(name);
	var getter = function getter() {
		return target && target['get' + capitalizedName]();
	};
	var setter = function setter(value) {
		setValue = value;
		target && target['set' + capitalizedName](value);
	};

	if (!watcher) {
		watcher = function watcher(value) {
			return value;
		};
	}
	if (!identity) {
		identity = function identity(a, b) {
			return a === b;
		};
	}
	if (!applier) {
		applier = function applier(value, oldValue, set) {
			if (!identity(value, oldValue)) {
				set(value);
			}
		};
	}
	if (!retriever) {
		retriever = function retriever(value) {
			return value;
		};
	}
	if (!event) {
		event = 'update:' + name;
	}

	vm.$watch(function () {
		return watcher(vm[name]);
	}, function (value, oldValue) {
		if (!identity(value, setValue)) {
			applier(value, oldValue, setter);
		}
		setValue = value;
	});

	var listener = target.addListener(changeEvent, function () {
		var value = retriever(getter());
		if (!identity(value, setValue)) {
			vm.$emit(event, value);
			setValue = value;
		}
	});

	return function () {
		listener.remove();
	};
}

var BoundProps = {
	beforeDestroy: function beforeDestroy() {
		this.unbindProps();
	},


	methods: {
		bindProps: function bindProps(target, props) {
			this.unbindProps();
			this.$_boundsProps = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prop = _step.value;

					var options = {
						vm: this,
						target: target
					};
					if (typeof prop === 'string') {
						options.name = prop;
					} else {
						Object.assign(options, prop);
					}
					this.$_boundsProps.push(bindProp(options));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		},
		unbindProps: function unbindProps() {
			if (this.$_boundsProps) {
				this.$_boundsProps.forEach(function (unbind) {
					return unbind();
				});
			}
		}
	}
};

var Events = {
	beforeCreate: function beforeCreate() {
		this.$_googleListeners = [];
	},
	beforeDestroy: function beforeDestroy() {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.$_googleListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var listener = _step.value;

				listener.remove();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	},


	methods: {
		listen: function listen(target, event, handler) {
			this.$_googleListeners.push(target.addListener(event, handler));
		},
		redirectEvents: function redirectEvents(target, events) {
			var _this = this;

			var _loop = function _loop(e) {
				_this.listen(target, e, function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					_this.$emit.apply(_this, [e].concat(args));
				});
			};

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var e = _step2.value;

					_loop(e);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}
};

var Ready = {
	data: function data() {
		return {
			googleMapsReady: false
		};
	},
	mounted: function mounted() {
		var _this = this;

		return asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
			var handlers, promises, i, result, _handlers, _i;

			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return loader.ensureReady();

						case 2:
							handlers = _this.$options.googleMapsPrepare;

							if (!handlers) {
								_context.next = 8;
								break;
							}

							promises = [];

							for (i = 0; i < handlers.length; i++) {
								try {
									result = handlers[i].call(_this);

									if (typeof result.then === 'function') {
										promises.push(result);
									}
								} catch (e) {
									handleError(e, _this, 'googleMapsPrepare hook');
								}
							}
							_context.next = 8;
							return Promise.all(promises);

						case 8:

							// Ready
							_this.googleMapsReady = true;
							_handlers = _this.$options.googleMapsReady;

							if (_handlers) {
								for (_i = 0; _i < _handlers.length; _i++) {
									try {
										_handlers[_i].call(_this);
									} catch (e) {
										handleError(e, _this, 'googleMapsReady hook');
									}
								}
							}

							_this.$emit('ready');

						case 12:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}))();
	}
};

var FindAncestor = {
	methods: {
		$_findAncestor: function $_findAncestor(condition) {
			var search = this.$parent;

			while (search) {
				if (condition(search)) {
					return search;
				}
				search = search.$parent;
			}

			return null;
		}
	}
};

var MapElement = {
	mixins: [BoundProps, Events, FindAncestor, Ready],

	created: function created() {
		var mapAncestor = this.$_findAncestor(function (a) {
			return a.$options.name === 'GoogleMapsMap';
		});

		if (!mapAncestor) {
			throw new Error(this.constructor.name + ' component must be used within a <google-map> component.');
		}

		this.$_mapAncestor = mapAncestor;
	},
	googleMapsPrepare: function googleMapsPrepare() {
		var _this = this;

		return asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
			var mapComp;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							mapComp = _this.$_mapAncestor;
							_context.next = 3;
							return mapComp.$_getMap();

						case 3:
							_this.$_map = _context.sent;

						case 4:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}))();
	}
};

var boundProps = ['center', 'draggable', 'editable', 'radius', 'visible', 'options'];

var redirectedEvents = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var Circle = {
	name: 'GoogleMapsCircle',

	mixins: [MapElement],

	props: {
		center: {
			type: Object,
			required: true
		},
		clickable: {
			type: Boolean,
			default: true
		},
		draggable: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		radius: {
			type: Number,
			required: true
		},
		visible: {
			default: true
		},
		zIndex: {
			type: Number
		}
	},

	watch: {
		options: 'updateOptions',
		clickable: 'updateOptions',
		zIndex: 'updateOptions'
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_circle && this.$_circle.setOptions(options || this.$props);
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_circle = new window.google.maps.Circle(options);
		this.bindProps(this.$_circle, boundProps);
		this.redirectEvents(this.$_circle, redirectedEvents);
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_circle) {
			this.$_circle.setMap(null);
		}
	}
};

var Service = {
	mixins: [Ready],

	props: {
		filter: {
			type: Function,
			default: null
		},
		request: {
			type: Object,
			default: null
		},
		tag: {
			type: String,
			default: 'div'
		}
	},

	data: function data() {
		return {
			loading: false,
			results: null,
			status: null
		};
	},


	computed: {
		filteredResults: function filteredResults() {
			if (this.results && this.filter) {
				return this.results.filter(this.filter);
			} else {
				return this.results;
			}
		},
		finalResults: function finalResults() {
			var results = this.filteredResults;
			return results && (!Array.isArray(results) || results.length) ? results : null;
		}
	},

	watch: {
		request: {
			handler: function handler(value) {
				value && this.update();
			},

			deep: true
		},
		finalResults: function finalResults(value) {
			this.$emit('results', value);
		}
	},

	methods: {
		createServices: function createServices() {
			// Override this in components
		},
		getScope: function getScope() {
			// Override this in components
			return {
				loading: this.loading,
				results: this.finalResults,
				status: this.status
			};
		},
		setResults: function setResults(results, status) {
			this.results = results;
			this.status = status;
		},
		update: function update() {
			// Override this in components
		}
	},

	googleMapsReady: function googleMapsReady() {
		this.createServices();
		this.request && this.update();
	},
	render: function render(h) {
		return h(this.tag, [this.$scopedSlots.default && this.$scopedSlots.default(this.getScope()), h('span', {
			ref: 'attributions'
		})]);
	}
};

var Geocoder = {
	name: 'GoogleMapsGeocoder',

	mixins: [Service],

	props: {
		disablePlaceDetails: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		createServices: function createServices() {
			this.$_geocoder = new window.google.maps.Geocoder();
			this.$_placeService = new window.google.maps.places.PlacesService(this.$refs.attributions);
		},
		getPlaceDetails: function getPlaceDetails(result) {
			result.placeDetails = {};
			if (result.place_id) {
				result.placeDetails.loading = true;
				this.$_placeService.getDetails({
					placeId: result.place_id
				}, function (details, status) {
					result.placeDetails = details;
				});
			}
		},
		update: function update() {
			var _this = this;

			if (this.googleMapsReady) {
				this.loading = true;
				this.$_geocoder.geocode(this.request, function (results, status) {
					if (results) {
						!_this.disablePlaceDetails && results.forEach(_this.getPlaceDetails);
					}
					_this.setResults(results, status);
					_this.loading = false;
				});
			}
		}
	}
};

var GeocoderEvent = {
	name: 'GoogleMapsGeocoder',

	mixins: [Service],

	props: {
		disablePlaceDetails: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		createServices: function createServices() {
			this.$_geocoder = new window.google.maps.Geocoder();
		},
		update: function update() {
			var _this = this;

			if (this.googleMapsReady) {
				this.loading = true;
				this.$_geocoder.geocode(this.request, function (results, status) {
					_this.$emit('geocode', results);
					_this.setResults(results, status);
					_this.loading = false;
				});
			}
		}
	}
};

function getInternetExplorerVersion() {
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return -1;
}

var isIE = void 0;

function initCompat() {
	if (!initCompat.init) {
		initCompat.init = true;
		isIE = getInternetExplorerVersion() !== -1;
	}
}

var ResizeObserver = { render: function render() {
		var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "resize-observer", attrs: { "tabindex": "-1" } });
	}, staticRenderFns: [], _scopeId: 'data-v-b329ee4c',
	name: 'resize-observer',

	methods: {
		compareAndNotify: function compareAndNotify() {
			if (this._w !== this.$el.offsetWidth || this._h !== this.$el.offsetHeight) {
				this._w = this.$el.offsetWidth;
				this._h = this.$el.offsetHeight;
				this.$emit('notify');
			}
		},
		addResizeHandlers: function addResizeHandlers() {
			this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.compareAndNotify);
			this.compareAndNotify();
		},
		removeResizeHandlers: function removeResizeHandlers() {
			if (this._resizeObject && this._resizeObject.onload) {
				if (!isIE && this._resizeObject.contentDocument) {
					this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.compareAndNotify);
				}
				delete this._resizeObject.onload;
			}
		}
	},

	mounted: function mounted() {
		var _this = this;

		initCompat();
		this.$nextTick(function () {
			_this._w = _this.$el.offsetWidth;
			_this._h = _this.$el.offsetHeight;
		});
		var object = document.createElement('object');
		this._resizeObject = object;
		object.setAttribute('aria-hidden', 'true');
		object.setAttribute('tabindex', -1);
		object.onload = this.addResizeHandlers;
		object.type = 'text/html';
		if (isIE) {
			this.$el.appendChild(object);
		}
		object.data = 'about:blank';
		if (!isIE) {
			this.$el.appendChild(object);
		}
	},
	beforeDestroy: function beforeDestroy() {
		this.removeResizeHandlers();
	}
};

// Install the components
function install(Vue) {
	Vue.component('resize-observer', ResizeObserver);
	Vue.component('ResizeObserver', ResizeObserver);
}

// Plugin
var plugin$2 = {
	// eslint-disable-next-line no-undef
	version: "0.4.5",
	install: install
};

// Auto-install
var GlobalVue$1 = null;
if (typeof window !== 'undefined') {
	GlobalVue$1 = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue$1 = global.Vue;
}
if (GlobalVue$1) {
	GlobalVue$1.use(plugin$2);
}

function throwValueError(value) {
	if (value !== null && typeof value !== 'function') {
		throw new Error('observe-visibility directive expects a function as the value');
	}
}

var ObserveVisibility = {
	bind: function bind(el, _ref, vnode) {
		var value = _ref.value;

		if (typeof IntersectionObserver === 'undefined') {
			console.warn('[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill');
		} else {
			throwValueError(value);
			el._vue_visibilityCallback = value;
			var observer = el._vue_intersectionObserver = new IntersectionObserver(function (entries) {
				var entry = entries[0];
				if (el._vue_visibilityCallback) {
					el._vue_visibilityCallback.call(null, entry.intersectionRatio > 0, entry);
				}
			});
			// Wait for the element to be in document
			vnode.context.$nextTick(function () {
				observer.observe(el);
			});
		}
	},
	update: function update(el, _ref2) {
		var value = _ref2.value;

		throwValueError(value);
		el._vue_visibilityCallback = value;
	},
	unbind: function unbind(el) {
		if (el._vue_intersectionObserver) {
			el._vue_intersectionObserver.disconnect();
			delete el._vue_intersectionObserver;
			delete el._vue_visibilityCallback;
		}
	}
};

// Install the components
function install$1(Vue) {
	Vue.directive('observe-visibility', ObserveVisibility);
	/* -- Add more components here -- */
}

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
var plugin$4 = {
	// eslint-disable-next-line no-undef
	version: "0.3.1",
	install: install$1
};

// Auto-install
var GlobalVue$2 = null;
if (typeof window !== 'undefined') {
	GlobalVue$2 = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue$2 = global.Vue;
}
if (GlobalVue$2) {
	GlobalVue$2.use(plugin$4);
}

function redirectMethods(_ref) {
	var target = _ref.target,
	    names = _ref.names;

	return names.reduce(function (obj, name) {
		obj[name] = function () {
			var t = target.call(this);
			if (t) {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				return t[name].apply(t, args);
			}
		};
		return obj;
	}, {});
}

//
//
//
//
//
//
//
//
//
//
//

var boundProps$1 = [{
	name: 'center',
	watcher: function watcher(value) {
		return {
			lat: autoCall(value.lat),
			lng: autoCall(value.lng)
		};
	},
	identity: function identity(a, b) {
		if (a && b) {
			if (typeof a.equals !== 'function') {
				a = new window.google.maps.LatLng(a);
			}
			if (typeof b.equals !== 'function') {
				b = new window.google.maps.LatLng(b);
			}
			return a.equals(b);
		}
	},
	retriever: function retriever(value) {
		return {
			lat: value.lat(),
			lng: value.lng()
		};
	}
}, 'heading', 'mapTypeId', 'tilt', 'zoom', 'options'];

var redirectedMethods = ['panBy', 'panTo', 'panToBounds', 'fitBounds', 'getBounds'];

var redirectedEvents$1 = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseup', 'mousemove', 'mouseout', 'mouseover', 'resize', 'rightclick', 'tilesloaded'];

var script = {
	name: 'GoogleMapsMap',

	mixins: [Ready, BoundProps, Events],

	components: {
		ResizeObserver: ResizeObserver
	},

	directives: {
		ObserveVisibility: ObserveVisibility
	},

	props: {
		center: {
			required: true,
			type: Object
		},
		heading: {
			type: Number
		},
		mapTypeId: {
			type: String
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		tilt: {
			type: Number
		},
		zoom: {
			required: true,
			type: Number
		}
	},

	beforeCreate: function beforeCreate() {
		this.$_mapPromises = [];
	},
	googleMapsReady: function googleMapsReady() {
		var _this = this;

		var element = this.$refs.map;

		var options = _extends({
			center: this.center,
			heading: this.heading,
			mapTypeId: this.mapTypeId,
			tilt: this.tilt,
			zoom: this.zoom
		}, this.options);

		this.$_map = new window.google.maps.Map(element, options);

		this.bindProps(this.$_map, boundProps$1);

		this.listen(this.$_map, 'bounds_changed', function () {
			_this.$emit('update:bounds', _this.$_map.getBounds());
		});

		this.listen(this.$_map, 'idle', function () {
			_this.$emit('idle', _this);
			_this.lastCenter = _this.$_map.getCenter();
		});

		this.lastCenter = this.$_map.getCenter();

		this.redirectEvents(this.$_map, redirectedEvents$1);

		// Code that awaits `$_getMap()`
		this.$_mapPromises.forEach(function (resolve) {
			return resolve(_this.$_map);
		});
	},


	watch: {
		options: {
			handler: 'updateOptions',
			deep: true
		}
	},

	methods: _extends({}, redirectMethods({
		target: function target() {
			return this.$_map;
		},

		names: redirectedMethods
	}), {
		resize: function resize() {
			var preserveCenter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (this.$_map) {
				// let center
				// preserveCenter && (center = this.$_map.getCenter())
				window.google.maps.event.trigger(this.$_map, 'resize');
				preserveCenter && this.$_map.setCenter(this.lastCenter);
			}
		},
		visibilityChanged: function visibilityChanged(isVisible) {
			if (isVisible) {
				this.$nextTick(this.resize);
			}
		},
		$_getMap: function $_getMap() {
			var _this2 = this;

			if (this.$_map) {
				return Promise.resolve(this.$_map);
			} else {
				return new Promise(function (resolve) {
					_this2.$_mapPromises.push(resolve);
				});
			}
		},
		updateOptions: function updateOptions(options) {
			this.$_map && this.$_map.setOptions(options || this.$props);
		}
	})
};

'use strict';

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

'use strict';

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    directives: [{
      name: "observe-visibility",
      rawName: "v-observe-visibility",
      value: _vm.visibilityChanged,
      expression: "visibilityChanged"
    }],
    staticClass: "vue-google-map"
  }, [_c("div", { ref: "map", staticClass: "map-view" }), _vm._v(" "), _c("div", { staticClass: "hidden-content" }, [_vm._t("default")], 2), _vm._v(" "), _vm._t("visible"), _vm._v(" "), _c("resize-observer", { on: { notify: _vm.resize } })], 2);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-24c407d0_0", { source: "@import '../../node_modules/vue-resize/dist/vue-resize.css';\n", map: { "version": 3, "sources": ["/Users/alexanderlindkjaer/Wecode/vue-googlemaps/src/components/Map.vue"], "names": [], "mappings": "AAwMA,2DAAA", "file": "Map.vue", "sourcesContent": ["<template>\n\t<div class=\"vue-google-map\" v-observe-visibility=\"visibilityChanged\">\n\t\t<div ref=\"map\" class=\"map-view\"></div>\n\t\t<div class=\"hidden-content\">\n\t\t\t<slot></slot>\n\t\t</div>\n\t\t<slot name=\"visible\"></slot>\n\t\t<resize-observer @notify=\"resize\" />\n\t</div>\n</template>\n\n<script>\nimport { ResizeObserver } from 'vue-resize'\nimport { ObserveVisibility } from 'vue-observe-visibility'\nimport Ready from '../mixins/Ready'\nimport BoundProps from '../mixins/BoundProps'\nimport Events from '../mixins/Events'\nimport { autoCall } from '../utils/misc'\nimport { redirectMethods } from '../utils/redirect-methods'\n\nconst boundProps = [\n\t{\n\t\tname: 'center',\n\t\twatcher: value => ({\n\t\t\tlat: autoCall(value.lat),\n\t\t\tlng: autoCall(value.lng),\n\t\t}),\n\t\tidentity: (a, b) => {\n\t\t\tif (a && b) {\n\t\t\t\tif (typeof a.equals !== 'function') {\n\t\t\t\t\ta = new window.google.maps.LatLng(a)\n\t\t\t\t}\n\t\t\t\tif (typeof b.equals !== 'function') {\n\t\t\t\t\tb = new window.google.maps.LatLng(b)\n\t\t\t\t}\n\t\t\t\treturn a.equals(b)\n\t\t\t}\n\t\t},\n\t\tretriever: (value) => ({\n\t\t\tlat: value.lat(),\n\t\t\tlng: value.lng(),\n\t\t}),\n\t},\n\t'heading',\n\t'mapTypeId',\n\t'tilt',\n\t'zoom',\n\t'options',\n]\n\nconst redirectedMethods = [\n\t'panBy',\n\t'panTo',\n\t'panToBounds',\n\t'fitBounds',\n\t'getBounds',\n]\n\nconst redirectedEvents = [\n\t'click',\n\t'dblclick',\n\t'drag',\n\t'dragend',\n\t'dragstart',\n\t'mousedown',\n\t'mouseup',\n\t'mousemove',\n\t'mouseout',\n\t'mouseover',\n\t'resize',\n\t'rightclick',\n\t'tilesloaded',\n]\n\nexport default {\n\tname: 'GoogleMapsMap',\n\n\tmixins: [\n\t\tReady,\n\t\tBoundProps,\n\t\tEvents,\n\t],\n\n\tcomponents: {\n\t\tResizeObserver,\n\t},\n\n\tdirectives: {\n\t\tObserveVisibility,\n\t},\n\n\tprops: {\n\t\tcenter: {\n\t\t\trequired: true,\n\t\t\ttype: Object,\n\t\t},\n\t\theading: {\n\t\t\ttype: Number,\n\t\t},\n\t\tmapTypeId: {\n\t\t\ttype: String,\n\t\t},\n\t\toptions: {\n\t\t\ttype: Object,\n\t\t\tdefault: () => ({}),\n\t\t},\n\t\ttilt: {\n\t\t\ttype: Number,\n\t\t},\n\t\tzoom: {\n\t\t\trequired: true,\n\t\t\ttype: Number,\n\t\t},\n\t},\n\n\tbeforeCreate () {\n\t\tthis.$_mapPromises = []\n\t},\n\n\tgoogleMapsReady () {\n\t\tconst element = this.$refs.map\n\n\t\tconst options = {\n\t\t\tcenter: this.center,\n\t\t\theading: this.heading,\n\t\t\tmapTypeId: this.mapTypeId,\n\t\t\ttilt: this.tilt,\n\t\t\tzoom: this.zoom,\n\t\t\t...this.options,\n\t\t}\n\n\t\tthis.$_map = new window.google.maps.Map(element, options)\n\n\t\tthis.bindProps(this.$_map, boundProps)\n\n\t\tthis.listen(this.$_map, 'bounds_changed', () => {\n\t\t\tthis.$emit('update:bounds', this.$_map.getBounds())\n\t\t})\n\n\t\tthis.listen(this.$_map, 'idle', () => {\n\t\t\tthis.$emit('idle', this)\n\t\t\tthis.lastCenter = this.$_map.getCenter()\n\t\t})\n\n\t\tthis.lastCenter = this.$_map.getCenter()\n\n\t\tthis.redirectEvents(this.$_map, redirectedEvents)\n\n\t\t// Code that awaits `$_getMap()`\n\t\tthis.$_mapPromises.forEach(resolve => resolve(this.$_map))\n\t},\n\n\twatch: {\n\t\toptions: {\n\t\t\thandler: 'updateOptions',\n\t\t\tdeep: true,\n\t\t},\n\t},\n\n\tmethods: {\n\t\t...redirectMethods({\n\t\t\ttarget () {\n\t\t\t\treturn this.$_map\n\t\t\t},\n\t\t\tnames: redirectedMethods,\n\t\t}),\n\n\t\tresize (preserveCenter = true) {\n\t\t\tif (this.$_map) {\n\t\t\t\t// let center\n\t\t\t\t// preserveCenter && (center = this.$_map.getCenter())\n\t\t\t\twindow.google.maps.event.trigger(this.$_map, 'resize')\n\t\t\t\tpreserveCenter && this.$_map.setCenter(this.lastCenter)\n\t\t\t}\n\t\t},\n\n\t\tvisibilityChanged (isVisible) {\n\t\t\tif (isVisible) {\n\t\t\t\tthis.$nextTick(this.resize)\n\t\t\t}\n\t\t},\n\n\t\t$_getMap () {\n\t\t\tif (this.$_map) {\n\t\t\t\treturn Promise.resolve(this.$_map)\n\t\t\t} else {\n\t\t\t\treturn new Promise(resolve => {\n\t\t\t\t\tthis.$_mapPromises.push(resolve)\n\t\t\t\t})\n\t\t\t}\n\t\t},\n\n\t\tupdateOptions (options) {\n\t\t\tthis.$_map && this.$_map.setOptions(options || this.$props)\n\t\t},\n\t},\n}\n</script>\n\n<style lang=\"stylus\">\n@import '../../node_modules/vue-resize/dist/vue-resize.css';\n</style>\n\n<style lang=\"stylus\" scoped>\n.vue-google-map {\n\tposition: relative;\n\n\t.map-view {\n\t\tleft: 0;\n\t\tright: 0;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tposition: absolute;\n\t}\n\n\t.hidden-content {\n\t\tdisplay: none;\n\t}\n}\n</style>\n"] }, media: undefined }), inject("data-v-24c407d0_1", { source: ".vue-google-map[data-v-24c407d0] {\n  position: relative;\n}\n.vue-google-map .map-view[data-v-24c407d0] {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n}\n.vue-google-map .hidden-content[data-v-24c407d0] {\n  display: none;\n}\n", map: { "version": 3, "sources": ["/Users/alexanderlindkjaer/Wecode/vue-googlemaps/src/components/Map.vue", "Map.vue"], "names": [], "mappings": "AA4MA;EACA,kBAAA;AC3MA;AD6MA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,SAAA;EACA,kBAAA;AC3MA;AD8MA;EACA,aAAA;AC5MA", "file": "Map.vue", "sourcesContent": ["<template>\n\t<div class=\"vue-google-map\" v-observe-visibility=\"visibilityChanged\">\n\t\t<div ref=\"map\" class=\"map-view\"></div>\n\t\t<div class=\"hidden-content\">\n\t\t\t<slot></slot>\n\t\t</div>\n\t\t<slot name=\"visible\"></slot>\n\t\t<resize-observer @notify=\"resize\" />\n\t</div>\n</template>\n\n<script>\nimport { ResizeObserver } from 'vue-resize'\nimport { ObserveVisibility } from 'vue-observe-visibility'\nimport Ready from '../mixins/Ready'\nimport BoundProps from '../mixins/BoundProps'\nimport Events from '../mixins/Events'\nimport { autoCall } from '../utils/misc'\nimport { redirectMethods } from '../utils/redirect-methods'\n\nconst boundProps = [\n\t{\n\t\tname: 'center',\n\t\twatcher: value => ({\n\t\t\tlat: autoCall(value.lat),\n\t\t\tlng: autoCall(value.lng),\n\t\t}),\n\t\tidentity: (a, b) => {\n\t\t\tif (a && b) {\n\t\t\t\tif (typeof a.equals !== 'function') {\n\t\t\t\t\ta = new window.google.maps.LatLng(a)\n\t\t\t\t}\n\t\t\t\tif (typeof b.equals !== 'function') {\n\t\t\t\t\tb = new window.google.maps.LatLng(b)\n\t\t\t\t}\n\t\t\t\treturn a.equals(b)\n\t\t\t}\n\t\t},\n\t\tretriever: (value) => ({\n\t\t\tlat: value.lat(),\n\t\t\tlng: value.lng(),\n\t\t}),\n\t},\n\t'heading',\n\t'mapTypeId',\n\t'tilt',\n\t'zoom',\n\t'options',\n]\n\nconst redirectedMethods = [\n\t'panBy',\n\t'panTo',\n\t'panToBounds',\n\t'fitBounds',\n\t'getBounds',\n]\n\nconst redirectedEvents = [\n\t'click',\n\t'dblclick',\n\t'drag',\n\t'dragend',\n\t'dragstart',\n\t'mousedown',\n\t'mouseup',\n\t'mousemove',\n\t'mouseout',\n\t'mouseover',\n\t'resize',\n\t'rightclick',\n\t'tilesloaded',\n]\n\nexport default {\n\tname: 'GoogleMapsMap',\n\n\tmixins: [\n\t\tReady,\n\t\tBoundProps,\n\t\tEvents,\n\t],\n\n\tcomponents: {\n\t\tResizeObserver,\n\t},\n\n\tdirectives: {\n\t\tObserveVisibility,\n\t},\n\n\tprops: {\n\t\tcenter: {\n\t\t\trequired: true,\n\t\t\ttype: Object,\n\t\t},\n\t\theading: {\n\t\t\ttype: Number,\n\t\t},\n\t\tmapTypeId: {\n\t\t\ttype: String,\n\t\t},\n\t\toptions: {\n\t\t\ttype: Object,\n\t\t\tdefault: () => ({}),\n\t\t},\n\t\ttilt: {\n\t\t\ttype: Number,\n\t\t},\n\t\tzoom: {\n\t\t\trequired: true,\n\t\t\ttype: Number,\n\t\t},\n\t},\n\n\tbeforeCreate () {\n\t\tthis.$_mapPromises = []\n\t},\n\n\tgoogleMapsReady () {\n\t\tconst element = this.$refs.map\n\n\t\tconst options = {\n\t\t\tcenter: this.center,\n\t\t\theading: this.heading,\n\t\t\tmapTypeId: this.mapTypeId,\n\t\t\ttilt: this.tilt,\n\t\t\tzoom: this.zoom,\n\t\t\t...this.options,\n\t\t}\n\n\t\tthis.$_map = new window.google.maps.Map(element, options)\n\n\t\tthis.bindProps(this.$_map, boundProps)\n\n\t\tthis.listen(this.$_map, 'bounds_changed', () => {\n\t\t\tthis.$emit('update:bounds', this.$_map.getBounds())\n\t\t})\n\n\t\tthis.listen(this.$_map, 'idle', () => {\n\t\t\tthis.$emit('idle', this)\n\t\t\tthis.lastCenter = this.$_map.getCenter()\n\t\t})\n\n\t\tthis.lastCenter = this.$_map.getCenter()\n\n\t\tthis.redirectEvents(this.$_map, redirectedEvents)\n\n\t\t// Code that awaits `$_getMap()`\n\t\tthis.$_mapPromises.forEach(resolve => resolve(this.$_map))\n\t},\n\n\twatch: {\n\t\toptions: {\n\t\t\thandler: 'updateOptions',\n\t\t\tdeep: true,\n\t\t},\n\t},\n\n\tmethods: {\n\t\t...redirectMethods({\n\t\t\ttarget () {\n\t\t\t\treturn this.$_map\n\t\t\t},\n\t\t\tnames: redirectedMethods,\n\t\t}),\n\n\t\tresize (preserveCenter = true) {\n\t\t\tif (this.$_map) {\n\t\t\t\t// let center\n\t\t\t\t// preserveCenter && (center = this.$_map.getCenter())\n\t\t\t\twindow.google.maps.event.trigger(this.$_map, 'resize')\n\t\t\t\tpreserveCenter && this.$_map.setCenter(this.lastCenter)\n\t\t\t}\n\t\t},\n\n\t\tvisibilityChanged (isVisible) {\n\t\t\tif (isVisible) {\n\t\t\t\tthis.$nextTick(this.resize)\n\t\t\t}\n\t\t},\n\n\t\t$_getMap () {\n\t\t\tif (this.$_map) {\n\t\t\t\treturn Promise.resolve(this.$_map)\n\t\t\t} else {\n\t\t\t\treturn new Promise(resolve => {\n\t\t\t\t\tthis.$_mapPromises.push(resolve)\n\t\t\t\t})\n\t\t\t}\n\t\t},\n\n\t\tupdateOptions (options) {\n\t\t\tthis.$_map && this.$_map.setOptions(options || this.$props)\n\t\t},\n\t},\n}\n</script>\n\n<style lang=\"stylus\">\n@import '../../node_modules/vue-resize/dist/vue-resize.css';\n</style>\n\n<style lang=\"stylus\" scoped>\n.vue-google-map {\n\tposition: relative;\n\n\t.map-view {\n\t\tleft: 0;\n\t\tright: 0;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tposition: absolute;\n\t}\n\n\t.hidden-content {\n\t\tdisplay: none;\n\t}\n}\n</style>\n", ".vue-google-map {\n  position: relative;\n}\n.vue-google-map .map-view {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n}\n.vue-google-map .hidden-content {\n  display: none;\n}\n"] }, media: undefined });
};
/* scoped */
var __vue_scope_id__ = "data-v-24c407d0";
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* component normalizer */
/* style inject */
/* style inject SSR */

var Map = normalizeComponent_1({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var boundProps$2 = ['animation', 'clickable', 'cursor', 'draggable', 'icon', 'label', 'opacity', 'place', 'position', 'shape', 'title', 'visible', 'zIndex'];

var redirectedEvents$2 = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var Marker = {
	name: 'GoogleMapsMarker',

	mixins: [MapElement],

	props: {
		animation: {
			type: Number
		},
		clickable: {
			type: Boolean,
			default: true
		},
		cursor: {
			type: String
		},
		draggable: {
			type: Boolean,
			default: false
		},
		icon: {},
		label: {},
		opacity: {
			type: Number,
			default: 1
		},
		place: {
			type: Object
		},
		position: {
			type: Object
		},
		shape: {
			type: Object
		},
		title: {
			type: String
		},
		visible: {
			default: true
		},
		zIndex: {
			type: Number
		}
	},

	render: function render(h) {
		if (!this.$slots.default || this.$slots.default.length === 0) {
			return '';
		} else if (this.$slots.default.length === 1) {
			// So that infowindows can have a marker parent
			return this.$slots.default[0];
		} else {
			return h('div', this.$slots.default);
		}
	},
	googleMapsReady: function googleMapsReady() {
		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_marker = new window.google.maps.Marker(options);
		this.bindProps(this.$_marker, boundProps$2);
		this.redirectEvents(this.$_marker, redirectedEvents$2);
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_marker) {
			this.$_marker.setMap(null);
		}
	}
};

var NearbyPlaces = {
	name: 'GoogleMapsNearbyPlaces',

	mixins: [Service],

	methods: {
		createServices: function createServices() {
			this.$_placeService = new window.google.maps.places.PlacesService(this.$refs.attributions);
		},
		update: function update() {
			var _this = this;

			this.loading = true;
			this.$_placeService.nearbySearch(this.request, function (results, status) {
				_this.setResults(results, status);
				_this.loading = false;
			});
		}
	}
};

var PlaceDetails = {
	name: 'GoogleMapsPlaceDetails',

	mixins: [Service],

	methods: {
		createServices: function createServices() {
			this.$_placeService = new window.google.maps.places.PlacesService(this.$refs.attributions);
		},
		update: function update() {
			var _this = this;

			this.loading = true;
			this.$_placeService.getDetails(this.request, function (results, status) {
				_this.setResults(results, status);
				_this.loading = false;
			});
		}
	}
};

var defaultPositionStyle = void 0;
var defaultAccuracyStyle = {
	strokeColor: '#4285F4',
	strokeOpacity: 0.25,
	fillColor: '#4285F4',
	fillOpacity: 0.2,
	strokeWeight: 1
};

var UserPosition = {
	name: 'GoogleMapsUserPosition',

	mixins: [Ready],

	props: {
		accuracy: {
			default: 0
		},
		accuracyStyle: {
			type: Object,
			default: null
		},
		disableWatch: {
			type: Boolean,
			default: false
		},
		hideAccuracy: {
			type: Boolean,
			default: false
		},
		minimumAccuracy: {
			default: 1000
		},
		position: {
			type: Object
		},
		positionStyle: {
			type: Object,
			default: null
		},
		positionOptions: {
			type: Object,
			default: function _default() {
				return {
					enableHighAccuracy: true,
					maximumAge: 1000
				};
			}
		}
	},

	data: function data() {
		return {
			currentPosition: null,
			currentAccuracy: null
		};
	},


	watch: {
		position: function position(value) {
			this.currentPosition = value;
		},
		accuracy: function accuracy(value) {
			this.currentAccuracy = value;
		},
		disableWatch: function disableWatch(value, oldValue) {
			if (value !== oldValue) {
				if (value) {
					this.stopWatch();
				} else {
					this.startWatch();
				}
			}
		},
		positionOptions: function positionOptions(value) {
			if (!this.disableWatch) {
				this.stopWatch();
				this.startWatch();
			}
		}
	},

	methods: {
		startWatch: function startWatch() {
			if (navigator.geolocation) {
				this.$_watchId = navigator.geolocation.watchPosition(this.updatePosition, this.onWatchError, this.positionOptions);
			} else {
				console.warn('GoogleMapsUserPosition: navigator.geolocation not supported');
				this.$emit('error', new Error('unsupported'));
			}
		},
		stopWatch: function stopWatch() {
			if (navigator.geolocation) {
				navigator.geolocation.clearWatch(this.$_watchId);
			}
		},
		updatePosition: function updatePosition(position) {
			this.currentPosition = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			this.$emit('update:position', this.currentPosition);
			this.currentAccuracy = position.coords.accuracy;
			this.$emit('update:accuracy', this.currentAccuracy);
		},
		onWatchError: function onWatchError(e) {
			this.$emit('error', e);
		}
	},

	render: function render(h) {
		var markers = [];
		if (this.googleMapsReady && this.currentPosition && (this.minimumAccuracy === null || this.currentAccuracy <= this.minimumAccuracy)) {
			markers.push(h(Marker, {
				props: {
					clickable: false,
					icon: this.positionStyle || defaultPositionStyle,
					optimized: false,
					position: this.currentPosition,
					zIndex: 3
				}
			}));
			if (!this.hideAccuracy) {
				markers.push(h(Circle, {
					props: {
						clickable: false,
						radius: this.currentAccuracy,
						options: this.accuracyStyle || defaultAccuracyStyle,
						center: this.currentPosition,
						zIndex: 1
					}
				}));
			}
		}

		return h('div', markers);
	},
	googleMapsReady: function googleMapsReady() {
		defaultPositionStyle = {
			path: window.google.maps.SymbolPath.CIRCLE,
			fillColor: '#4285F4',
			fillOpacity: 1,
			scale: 6,
			strokeColor: 'white',
			strokeWeight: 2
		};

		if (!this.disableWatch) {
			this.startWatch();
		}
	},
	beforeDestroy: function beforeDestroy() {
		this.stopWatch();
	}
};

var boundProps$3 = ['draggable', 'editable', 'options', 'path'];

var redirectedEvents$3 = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var Polyline = {
	name: 'GoogleMapsPolyline',

	mixins: [MapElement],

	props: {
		editable: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		path: {
			type: Array
		}
	},

	watch: {
		options: 'updateOptions'
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_polyline && this.$_polyline.setOptions(options || this.$props);
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var _this = this;

		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_polyline = new window.google.maps.Polyline(options);
		this.bindProps(this.$_polyline, boundProps$3);
		this.redirectEvents(this.$_polyline, redirectedEvents$3);
		this.listen(this.$_polyline, 'drag', function () {
			_this.$emit('path_changed', _this.$_polyline.getPath());
		});
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_polyline) {
			this.$_polyline.setMap(null);
		}
	}
};

var boundProps$4 = ['bounds', 'draggable', 'editable', 'visible', 'options'];

var redirectedEvents$4 = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var Rectangle = {
	name: 'GoogleMapsRectangle',

	mixins: [MapElement],

	props: {
		bounds: {
			type: Object,
			required: true
		},
		clickable: {
			type: Boolean,
			default: true
		},
		draggable: {
			type: Boolean,
			default: false
		},
		editable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		visible: {
			default: true
		},
		zIndex: {
			type: Number
		}
	},

	watch: {
		bounds: 'updateBounds',
		options: 'updateOptions',
		clickable: 'updateOptions',
		zIndex: 'updateOptions'
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_rectangle && this.$_rectangle.setOptions(options || this.$props);
		},
		updateBounds: function updateBounds(bounds) {
			this.$_rectangle && this.$_rectangle.setBounds(bounds);
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_rectangle = new window.google.maps.Rectangle(options);
		this.bindProps(this.$_rectangle, boundProps$4);
		this.redirectEvents(this.$_rectangle, redirectedEvents$4);
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_rectangle) {
			this.$_rectangle.setMap(null);
		}
	}
};

var boundProps$5 = ['draggable', 'editable', 'options', 'paths'];

var redirectedEvents$5 = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var Polygon = {
	name: 'GoogleMapsPolygon',

	mixins: [MapElement],

	props: {
		editable: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		paths: {
			type: Array
		}
	},

	watch: {
		paths: 'updateOptions',
		options: 'updateOptions'
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_polygon && this.$_polygon.setOptions(options || this.$props);
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var _this = this;

		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_polygon = new window.google.maps.Polygon(options);
		this.bindProps(this.$_polygon, boundProps$5);
		this.redirectEvents(this.$_polygon, redirectedEvents$5);
		this.listen(this.$_polygon, 'drag', function () {
			_this.$emit('path_changed', _this.$_polygon.getPath());
		});
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_polygon) {
			this.$_polygon.setMap(null);
		}
	}
};

var Direction = {
	name: 'GoogleMapsDirections',

	mixins: [Service],

	props: {
		origin: {
			type: String
		},
		destination: {
			type: String
		},
		travelMode: {
			type: String,
			default: 'DRIVING'
		},
		waypoints: {
			type: Array
		},
		optimizeWaypoints: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		createServices: function createServices() {
			this.$_directionService = new window.google.maps.DirectionsService();
		},
		update: function update() {
			var _this = this;

			this.loading = true;

			if (!this.request || !this.$_directionService) return;

			this.$_directionService.route(this.request, function (results, status) {
				_this.setResults(results, status);
				_this.$emit('directionResult', results);
				_this.loading = false;
			});
		}
	}
};

var DrawDirection = {
	name: 'GoogleMapsPolygon',

	mixins: [MapElement],

	props: {
		draggable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		suppressMarkers: {
			type: Boolean,
			default: false
		},
		directionResult: {
			type: Object,
			required: true
		},
		drawDistanceWindow: {
			type: Boolean,
			default: true
		}
	},

	watch: {
		paths: 'updateOptions',
		options: 'updateOptions',
		directionResult: {
			handler: function handler(value) {
				value && this.rerender();
			},

			deep: true
		}
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_direction && this.$_direction.setOptions(options || this.$props);
		},
		calcTravelInfo: function calcTravelInfo() {
			var time = 0;
			var distance = 0;
			this.directionResult.routes[0].legs.forEach(function (leg) {
				distance += leg.distance.value;
				time += leg.duration.value;
			});

			var km = distance / 1000;

			return {
				time: this.secondsToHms(time),
				distance: km.toFixed(1)
			};
		},
		setInfoWindow: function setInfoWindow() {
			var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			var step = 1;
			var response = this.directionResult;
			var travelInfo = this.calcTravelInfo();

			if (!update) {
				this.$_infoWindow = new window.google.maps.InfoWindow();
			}

			this.$_infoWindow.setContent('<b>' + travelInfo.distance + '</b> km <br><b>' + travelInfo.time + '</b>');
			// this.$_infoWindow.setPosition(response.routes[0].legs[0].steps[step].end_location)
			this.$_infoWindow.setPosition(response.routes[0].legs[this.maxLegDistance()].steps[step].end_location);
			this.$_infoWindow.open(this.$_map);
		},
		maxLegDistance: function maxLegDistance() {
			var legIndex = 0;
			var distance = 0;

			this.directionResult.routes[0].legs.forEach(function (leg, index) {
				var legDistance = leg.distance.value;
				if (legDistance > distance) {
					legIndex = index;
					distance = legDistance;
				}
			});

			return legIndex;
		},
		secondsToHms: function secondsToHms(d) {
			d = Number(d);
			var h = Math.floor(d / 3600);
			var m = Math.floor(d % 3600 / 60);
			var hDisplay = h > 0 ? h + (h == 1 ? ' time, ' : ' timer, ') : '';
			var mDisplay = m > 0 ? m + (m == 1 ? ' minut' : ' minutter') : '';
			// var sDisplay = s > 0 ? s + (s == 1 ? ' sekund' : ' sekunder') : ''

			// put sDisplay on to display seconds - and a comma to minutes word
			return hDisplay + mDisplay;
		},
		rerender: function rerender() {
			var options = Object.assign({}, this.$props);
			options.map = this.$_map;

			// draw directions
			this.$_direction = this.$_direction_render.setDirections(this.directionResult);

			// draw distance
			if (this.drawDistanceWindow) {
				this.setInfoWindow(true);
			}
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		// draw directions
		this.$_direction_render = new window.google.maps.DirectionsRenderer(options);
		this.$_direction = this.$_direction_render.setDirections(this.directionResult);

		// draw distance
		if (this.drawDistanceWindow) {
			this.setInfoWindow();
		}
	},
	beforeDestroy: function beforeDestroy() {
		if (this.$_direction) {
			this.$_direction.setMap(null);
		}
		if (this.$_direction_render) {
			this.$_direction_render.setMap(null);
		}
		if (this.$_infoWindow) {
			this.$_infoWindow.setMap(null);
		}
	}
};

var StreetViewRender = {
	name: 'GoogleMapsStreetViewRender',

	mixins: [MapElement],

	props: {
		draggable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			default: function _default() {
				return {};
			}
		},
		address: {
			type: String,
			required: false
		}
	},

	watch: {
		paths: 'updateOptions',
		options: 'updateOptions',
		address: {
			handler: function handler(value) {
				value && this.openStreetView();
			},

			deep: true
		}
	},

	methods: {
		updateOptions: function updateOptions(options) {
			this.$_direction && this.$_direction.setOptions(options || this.$props);
		},
		openStreetView: function openStreetView() {
			var _this = this;

			if (!this.address || this.address == '') {
				return;
			}

			this.$_geocoder.geocode({ address: this.address }, function (results, status) {
				if (status === 'OK') {
					_this.$_geo_address = results[0].geometry.location;

					_this.$_panorama.setPosition(_this.$_geo_address);

					_this.$_panorama.setPov( /** @type {google.maps.StreetViewPov} */{
						heading: 265,
						pitch: 0
					});
					_this.$_panorama.setVisible(true);

					setTimeout(function () {
						var status = _this.$_panorama.getStatus();

						if (status != 'OK') {
							_this.$emit('notAvailable');
						}
					}, 1000);
				} else {
					console.log(status);
				}
			});
		}
	},

	render: function render(h) {
		return '';
	},
	googleMapsReady: function googleMapsReady() {
		var options = Object.assign({}, this.$props);
		options.map = this.$_map;

		this.$_geocoder = new window.google.maps.Geocoder();
		this.$_panorama = this.$_map.getStreetView();

		this.openStreetView();
	},
	beforeDestroy: function beforeDestroy() {
		// if (this.$_panorama) {
		// 	this.$_panorama.setMap(null)
		// }
	}
};

function registerComponents(Vue, prefix) {
	Vue.component(prefix + 'circle', Circle);
	Vue.component(prefix + 'rectangle', Rectangle);
	Vue.component(prefix + 'geocoder', Geocoder);
	Vue.component(prefix + 'geocoder-event', GeocoderEvent);
	Vue.component(prefix + 'map', Map);
	Vue.component(prefix + 'marker', Marker);
	Vue.component(prefix + 'nearby-places', NearbyPlaces);
	Vue.component(prefix + 'place-details', PlaceDetails);
	Vue.component(prefix + 'user-position', UserPosition);
	Vue.component(prefix + 'polyline', Polyline);
	Vue.component(prefix + 'polygon', Polygon);
	Vue.component(prefix + 'direction', Direction);
	Vue.component(prefix + 'direction-draw', DrawDirection);
	Vue.component(prefix + 'streetview-render', StreetViewRender);
}

var plugin = {
	// eslint-disable-next-line no-undef
	version: "0.1.3",
	install: function install(Vue, options) {
		var finalOptions = Object.assign({}, {
			installComponents: true,
			componentsPrefix: 'googlemaps-'
		}, options);

		optionMergeStrategies(Vue);
		initErrorHandling(Vue);

		if (finalOptions.installComponents) {
			registerComponents(Vue, finalOptions.componentsPrefix);
		}

		if (finalOptions.load) {
			loader.load(finalOptions.load);
		}
	}
};

// Auto-install
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

exports.Circle = Circle;
exports.Rectangle = Rectangle;
exports.Geocoder = Geocoder;
exports.GeocoderEvent = GeocoderEvent;
exports.Map = Map;
exports.Marker = Marker;
exports.NearbyPlaces = NearbyPlaces;
exports.PlaceDetails = PlaceDetails;
exports.UserPosition = UserPosition;
exports.MapElement = MapElement;
exports.Polyline = Polyline;
exports.Polygon = Polygon;
exports.Direction = Direction;
exports.DrawDirection = DrawDirection;
exports.StreetViewRender = StreetViewRender;
exports['default'] = plugin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
