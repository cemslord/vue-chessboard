// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
var define;
var global = arguments[3];
/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
})

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    // reset _rendered flag on slots for duplicate slot check
    {
      for (var key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false;
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
}

var builtInComponents = {
  KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.16';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
}

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
}

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
]

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
}

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
}

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = {
    value: value.trim()
  };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
}

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {}

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
}

var platformDirectives = {
  model: directive,
  show: show
}

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
}

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
}

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
}

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        "development" !== 'production' &&
        "development" !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if ("development" !== 'production' &&
      "development" !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
}

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
}

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
}

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else {
      warn$2(
        ("Invalid v-for expression: " + exp)
      );
    }
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '');
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$2 = {
  preTransformNode: preTransformNode
}

var modules$1 = [
  klass$1,
  style$1,
  model$2
]

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
}

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  'delete': ['Backspace', 'Delete']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : handler.value;
    /* istanbul ignore if */
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
}

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

return Vue;

})));

},{}],13:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var chessSets = {
  alt1: {
    size: 95,
    b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMSSURBVHja7FjtkaowFIWd919KsAQ6ECtY7IAS3A7oAK0ArUA7UCuQDtAKwArycjLczCXLIhBY/bF3JoPEEA736xxwhRDOO9uH8+42kgdDOXJsV428mrPHNgLAiAEzR/hqgJ4cBfYKgkAcDgeRpqnwPI978qUAA+wzn88FDACLolAgmRcDG4CjFIkEqI6r1crZbreO7/tvU8VlY9w97+ma36xiHeIwDFWI4zim8BZVnr4sB1PKNRhyD8aKBOM6FKQtQA1uvV4LMqpimYfWIG0AKnAAQl5DBcMQ7iRJ9BzzZm+QQwEm5Jnr9apyDrkHMKfTSc1Tq8ERawyQkwIMCBy8BAAIJQDAoihSDZs8if+wBuBZuOMpAebEGgQI5zhScaCC4TUCRGtx7FvZfQFqzuXhxEA46RxHg0nUHF/f1Yt9meRTS5cwdPb7vf4DzHG5XHSTvt/vtQvBLtKDvIF/TtGoayHjvY6aNP1m4aytMeZH9aDPvXW73ZyyrDOYeW5almXKi0bBjcbFHudZAOxN2uUwSv43luqQRTCJ4u8KsGxRK85yuaydn8/n7zkiU4MXlrTb2EWilDOaLzXiFqlfG7xP9lHaffugFgd5npvs8OMAKKw3emM8BcDAbDVQMc8AEiczj0/GJDWhQIrFkFWNoaUe2fdNbwhAr1IkNTVjCFRBuYr/8CBsPv0NuaVBAljDW5zmXy4a+kotW8EatFSornQj/L4NQGEzTJ6lIhphX0112eA394pfOf0RrRnc29cyziQZhQCbdt14Nps5MsTO8XhU51KsquNms3F2u52iP/x+PB6d9gMDMRZSAF240XXdddVC1KagJaiPLgYdCIC4jjwHKgT9QTcuFotucqm6J6PNL4ltQznoU9xNyf5sUDuha1As1H7aeqQ5wDbshV8VlXJe5UEqFBVeeKOJ8H96cuQfnpx7EHvgm03XSOC+2IPd1zUBnkhESgr7pljahCjloLQj+6Cp8pM+LHXRi8hXSkeIJLMPJpZtgbPEyXKvpKlRRwM3KxrUiWcJMiKA7t9Xfkv7L8AA3CK74jqmCikAAAAASUVORK5CYII=",
    B: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJqSURBVHja7JjtkYIwEIbxxgLoQDuQDqQErgPswBLoADsIHTBWAB0AFaAVYAdcliHMJgTMB4g/bmcycwcSHvfr3bhr29b5Zvtxvt0W8mBAVw3b9avur9mzLQAYIjBxBVsDunQ1M4D11oA+g/E8r63ruiWEiJD+VwBGUdQyWxLQtopf0ri77tvPfLKKO0/5vt95Twhx0+fpZiEmIuDxeBRDXJhC2gISDHK9XmUFYgVpA8jBhWHYeQ+8iKvaFtIUMMYvjuO4g4MWw67RIpHlI4NcFdDHL8StBUIsenQCMloTsBaLghkOaZqm3L0gCIwqWxeQ09wsywaApmk4L8H/2HD4dbyoC5jiAsAGHsMAMhOKplAF1FGSYTKh4eVuVFXlTN0bHg64wcZbemDlNjydTtp9SfKMvyQgl9RULfTnMtdM8fZLjNOHw2EILc21TUZ+DxeB2EZUDBq6UMnHpau4kTViVROquF6jzXD6C71N1cQ2tFYf5GROVJIpg6YN2vwJJRkNCqC/7wxPOLonPRNAt1eB4YUwDEwZDBMCHPnEuMVBQvhk+QhabTNq2Q6s/rtQCxNMqyNvGHCPDj7GVpbl+Lj3Gh3mCoOtd0zqShtAmfSZShv+3lhJyMzPF7MLcrAoilGIIS8lJzydRXCIK64jE6I8EID2greSJHEul0v3N5U1h6qNQyGdPM+V9nk8Ht3zeIrDHrTSWtlxc679KKqNhz3I5eD9flfOIfjs7XYbXQdvPJ9P53w+K+8zl4NgmUW+sJXio4HFymQjf2lZdQldv/3KF6lgwYOh4bdtJNOJaxmRkLHt/n/lt7Q/AQYAFfZSex/XNLsAAAAASUVORK5CYII=",
    k: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAN6SURBVHja7FjtkaJAEB2v9r9kIEYgGchGoEYgF4EagVwEnhGgEehGoEaARqBGgEbAzZua4do+PoYVq/xxXdWri0PPo/v1x9BK01S8s/wQ7y7woNFviiM1gimiiybwKEwNAOTgjE7fBaACNBwO0zAMU8dxDMDdWwHc7XYpxPf9RgE2kSR7/Lndbvz617skCbiWTqdT5UHCQfddQgwgqeu6KswaXNxUFrcosFarlbe5rz8vWvc5dsE33/M8cTwe8f9PqSu2xtN2PEINLL5xgDYhdnQtyysfidRQrzESsN/5b+cCW6kuU06dEDs6RGmFnok3hAZGizTsbCzsGFuObYhhdKji67oiCALR7/dV6E6nk9hutzRj8eVThwpenUvtairE5gFkbVR2er2esnk4HMTlchGr1YpXg08eYl5mfAMOfIrjWHQ6HbFcLsX9fheDwUCcz2e1GWtz+Pwt9ZcGtzDgZHare/CQ1+tV2YKMx2N1HfuQvYOqMhPRwovOwMOBQiwNp1EUFfVe31zHmiRJaPF+UJQm6QR6bVPFwcSUDBgmbetBcR0g2QMYVyj+Si8rG9JDpfyDHbImqQKYeYnUtFyFUdbaYs1D9QBlnqOKfei6xlodkmY2mwkZRpUE2oNIErFYLFQy7ff7xltd5h243qZEwAMS0ANHy+jBFRws8yAHmBVUG/5QvoJzhpsgvw04cy8t8lUAs+6BBNhsNlYbGY9DqDerFPZZokVVAF2aqXg6DKK2G9ZR2M2hgmvT6iJuxCbUdRT2ch4+rNOLMy4iZCCyLemrFHZgj1EhrjsPeqT5q0y15aMN75itpO40Q0E+dA5k6jPgcD/ssGh4z0zUAe/BzwDE/ay7hM9O1Nm0rJqsnG7W67XqIphCdAcpP1HpboK16DDdbtf8dNGjmSibqD8sms3aAMRmk8lEzXJQjE9l0m63xXw+F2Z808cBI9umTnXTV9RBXc6ePjQFRYYkl/6erOSUDM3GbDlxU2+VDA0rfcAqDHEZQFfXwwwQpmBZXBWfAMCM/vjEccAIpnADGGsRXlACQMFhBnhEw217qnvoKGb4RN/8bldB9qI4w05Rka5bZhJTAyFNtbuCYdYtAvhR8d5PhQchRIloSmAPlCGhNi8G/pEigD6dnEejUeMvTsFJxvdaZcZ/UWkp0vCVr99eKq3/b/mflD8CDADAOIyuhZwLaQAAAABJRU5ErkJggg==",
    K: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKhSURBVHja7FjhzZswEIWq/+MR3A08Atkg3YBuwAhswAh0A9oJSCYgG0AmIBu4PmqjwzliGxyJSn3SfZESc7zPd/fu7FRKmRwZX5KjA3bQ2EYwZTW4QlbF4DNxikDQJmesOArBiRBjTAohMMH2UATLspTyr5OoBGMUyRX+DMOQPJ9P/P3voxQJ5JrknMumafAO8qOEmBtSWZYZcl2sKk4xsTRNqZdn+nPQdiX8tnqdwQ9lP601QvsRKDXuyp42QZ8QM61llHyMykq9xiC3frd/61d8SS1TLCTETIdIOqxHu5FoYlikwU/j4cf4Yr4EfZ2a3TIkS6s4ugA/syy5CGb4IRDetm0nfRvHUdZ1jQsBFwTTVmpyi/SAZ6DCDYwvqHzLV+4iWOPO0Pe9pACi/Kb3Lv5JI+AUgCi8B61vXARNHsk8z+U7VFVlkxR2aIuikC7AGpwyLoLzYhySNVwuFzvUJU4PH0AK4fd6EzS59w5EiGbrui4KwdVefLvd3IMgY4lK9tfeVxSJ2kGvzuF8j7WDfWiI7DyCHYWd9YU1ojlzsAoNMy4ayEnf0FLhBRVxEeT4AdCpkN0IhbV7k8j7dJLFCO+Sm60Avxa5MqQXL5o7qH5MgD+iGwXNgwKLdohsuAB+iH7OtgysInY+wvNE/xV7Jurct6/6VjqVd3sm6sW0DMKsdmH+AQ5J9/ud1FcQaliPcT6fk+t1HshhOv9GEQw9NOX26LTW3tYM5IR4rop1aCoCB09fq2MQzD9EbpVkSA5yrYcLqFDN+XU6nd4OBXCYfzwe0yfk6kq+flf2a0sOvnSUvTIDEzrRQbqtIR5xYcQEcWTgawS/Ou79ZslA8rAbkBrEBcEQcjeTfbg4Xk5zn7zdigH+z95Rp/9v+XfijwADAOtbXobnSuXhAAAAAElFTkSuQmCC",
    n: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANISURBVHja7JjtkaJAEIaHq/0vGUgGEoIXwbkRyGaAEUgGaARcBmoEaARoBGoEaATcvLM01fYNLghueVXXVV27CMw89Dc4RVGoV5Yf6tUFFpTaQlKtuVb/WTxdAAFVlNobpGTp4mIO5GpdlX9fJgZH4tgrXe6+Qgz6pVuLLMuKPM8L3/fJ3VkXd/cRgxOCAxSEIF3XLVhcHrUm5fXfBhgTAOAAlaapAQMkdDweS1CCDZ4NGNGGgAAcgAgGwMfjsSDBuSAIJOiX7u8CiAQoPM8zAKvVymap6gGSJDHXARrHoiQFzwA0cRfHsdnUBiYVD4MHgURRJM8HfQKGtDDgANkEkDQMQwMJq4pz4z4APbIeYgoCy7QB5PcCViSP2wXQLQO7sp7FCq0tKWIy6gKY0EKIoTrrIVkAjsyG4v86K6MsIcOFFR8CDHlW1gR6tSnA4EaopbvcJA5kMpnw3ydtAau4g3WoINvgyLIchgp3XbYjs6E2NzcFTLh1sJGseTimmBKBf2MpS7GuEob9lrYFvOm1PKixOKBJRMnxeTvEdbawoHXFgNFqHjSpr8HU6XRS2+1W6cWUdpvSCaAul4t6f39XjuOo2WxG93xo3Tfpt/v952XaC7bZstG4dZMcsBr1Xkt2ZizIfR4CdS7+3PavctPexeQmav4sDtOyVXm2bgOlslPXr7sCJncKbmwZXlMJd896lEAMMGsLeNNB7rwcRTI7kfFUE+sekkKnSxYTZFjenJb/e+xcZTUUXZoF73URXjtFjYzrAB3b9ILs/ELiElhpGKU3Mz8i46F1gnPn81lNp1O1Xq9lBfhNgFzeHny3CSsz61KBMoTSczgc7r8GjkbmgQC6XC75qXVfb3VB2dyLnrUXFydyCkbxhsIqJMPhUJHrSXa7XeViWLsmDODiD8nTFBDZOqeN5/O50olh3AvXUmegLnG9XqvjwWBgHoI6E12z2WzUYrEw9zP5qXm2bV3sUuFGtqKEIAMxIDwyWaP/on/T7CiK9eqRkb/qEDSM9hF3fMhl3SaXLE2y+Be5By6Fu3T76+WzC9ajNRGbtu86TWIwpxt1gX3KN0oei5rHaQv4rd+IJeDLfwJ+qyve3KD/P6L/y4B/BBgADGc0k/blP/MAAAAASUVORK5CYII=",
    N: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ6SURBVHja7JiLbYMwEIah6gDuBmwQRkgnKCMwAhuEDegGZAOygZsJSCcgG5ANXJ9rKvdydjB2Iir1pFMSJYHP99/DJhVCJGu2p2TtBhHE7mFc+ig9vxdPCCBACe3RIDFLiMQmEJPe6dfV5OAGfc605GwNOZhrWZXEjDFhyN2HyB0jBwsTrigK0fc9hgQfpLf69w8DbEwIgAI4sK7rMCCGLe8NWNvgJgPIuq7Fdru1gd6UPwSQTzfK81yM4yhcBt8DLCH96IpmCOBP3kGk5towDGpBRDTLmICVKe0SK8uSgtzGAMzM6MGNlhoBOeC+6QvIdGL/XBQkCzFC7joEsDUvBknvKoqmaZS7FgGVT0RxEWBlXghW7roprta2bX2kLnwBMzzKbFGByGVZRvY9W7XDtWwyzwVs59zIUZ3KAdxmaFHcF9BZtSBpVVVUwud4HM5cWO8LSOYS59w1xkpqXtsMCg79fxngFEEAdczXgthlOyUOBRzNPxNR4zpiGTVt5lRyKGDr2Do1xOaV49/dmjihOXg1QSyHoxr/BlqSq6FPhlThSxo107Jx7ZUhKbNFbe4otKmCWZ4de8eL9Hft2HbmTkS2m0SOOPX+fD4rp0wWjfL9fo+/+rRBpNT2Kk3TmzvzyKfLFx2Qq92U77GzxMM9ku1iHDtdlR3DW4pnrsQ1XiXkkqzEZLPZqBw081FVEfveh14ul+R0Oqn38Ho8HpPD4WALwqvk+fCNIDMbN0wHnzOJbQcETZw4UHVLtvy/ziO3TnO+oAhy9Gkzk72Z8k1yxTJIE0NytqTNjPd4auUo2tQX8KHPiDHg6h8BP9t6oxnQ/4fofxnwS4ABAGjNtH1kWDguAAAAAElFTkSuQmCC",
    p: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAESSURBVHja7JhREYMwDIbJFExCJdTBcEAdDCk4wMpQgAQkIIE56GBHd4yD0S4JZbfk7n+hof2uTUIoWGuTI9spObgJoABGtyGLP8nD0l71MNVE9fgctfZzfSRgPgObK48JmG7AOaWxABtPwAYDCFvHCACr8weEOqwB/nWZuRP7kQPeiP3I66DyTBIVsw6WG3Altg5ik6RCjrNn8RU5zhqDhWcMFjFi0HjCOZm9YzAL9L/sHYMq0F9Lwzqxc68uMAa78T32JNEBbdZS26U5AfUXO7e0k5oDcDieFgnn1LrjpgQsieDevtFUgIoY7tXlUBVqw1RADFUdzJgAveb1+WmyjDUY5G6G20BuWAVQAH8c8CHAAJ5nk7RIFGLbAAAAAElFTkSuQmCC",
    P: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGZSURBVHja7JiNjYMgFIDlcgO4gdwGHcEN2g3OERjhNvA2cATbCdQJHEE3aDegPiMNvFjAA0sv4SXkAQb44vvhBcI5T95ZPpI3lwgYAYMLRLGuWUg+tQa2klqzzDudPZ/vCFggMNyKkIC5AU60PBRgL4Mwxnhd17NGgH0oQAVOlhXIsIBN0yiAMPYF6JJmbqIzjqPyAY1vofLgWXS6rlM+oPE5VB6kshmHYZjNCxqZl4bMg6UAKYpiBgQtwZWuedD1qrtgv0P+dwl9F3+LTpqmisbfQ/jgjzDlBMX7vp9NDBrGNmbe0wdPa3BCViBPrwZ8BEdVVXxNYN70F/cEfJRXOkHl1+ujmFKqLxTz3DlGiCnXEULwFITpsGhtIElr4br7wteeTUG89Q8eFnOlG9ely7rDnmkGNr/qyiwsK2XXVYb0GSTCrNwUvYZo5tg9fAGWurxnkmfJ2xegUrVshZMhcZXjC5DZ+pxJkE8yG8BPizg6ik6WZUnbtn/OabAe7fvrIw/u9j43nU3i28zeQuILawSMgP8c8C7AAEUmjrvqNJIEAAAAAElFTkSuQmCC",
    q: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANcSURBVHja7FjtkdowEJUz+Q9XAU4FcSrA6cB04A6ACkIHHiowVEA6ACowVGA6MFSg6Gm8nkUnyR9wN0zmNLNzPrxavd19u5IVSCnFK49v4sXHF8CHBzjYg4eRkhLTasFz4tFfKKmY/r620R1XD4ChsRiX2AHOpgsb448AmDsWpMiYo/ToL7oC7MPB0PMu7qk//ogiuXjenSy/XZ9dJPAqY2koDELHnpSlFtOZh4OhUXgFe5e5OJh1MJZaCmXn8b+w2Es6FF5mA+iKzspYdNWxKkOLraTFViNDioTGTx3uLBNRFBE1bFX5R/MijsVqteLpHMzBqiO/yjAM4aHc7/euKAKIHI/HsixLreugg7NX2lKcduhZACGTJJE08Ey8YXroi1JFTlZVpfXgVN0bu/TW1NWoY0expLySsXBRFHK32+kIMb2QdBA9gIMuhko16fjA5dRT23aSwgFSkxrAIJTqxWLBF9A7SJ7nGjyAwhkAZduiDVzZZ6vTQAAAQLAI6413C1IamY5UxaOBp2kquUMMiNbB3Dr1JkVaAUacawDEAXDu8VTSexQP5tD/RAnuAHETz/XvUd/DgvaUDBFIig4zrFNMhQCuGZxrHDXBMdDlkNOMLhbV77QxGIVBpI21jUbAN+Idaz/vUk52DO5mQwBGxEMM3jJ4uswosZZi7gzNXHKS6UVDz4MlcQrRofQwwt8JfkfEbe8AjGgCWyzK5SMHVt0OyGMYJ/Hs3V7BXF7htvT2AZjwSmWcGSzcWVd6+x75K954HwVo6YneM8L3DueJv9hF1uu1UN4LFUWhvBeTyUQokrdOPp1O4na7icvlIq7Xq1DFJGazGbftHQFFLwgCX5r1KUQRWx+fDoeDfnE8Hr3GR6MRHcn0PP0doEC+vb2Rym8lB1cEu34XR4+mlReIUWBxW4rbIhjVR6e7EzOigvRSdFzppvTiL6KO6FnGL9tHV4OrBWBJ3yQAMJ/PNQ/BQQxKNRY+n8/vJk+n07v0Auh2uxWbzYaDxdfijyEpTs3NHVWMVsP34a6CnQadAHYgho10SJvJ+T6Lzv9Ig+Y8xI5itKzdkDbTkArpRUpU/3rapZXBWedNQyeAy+Wy4d2zBrjYcnXSWiSffTcc2Irk5S8wg69L9P8d4D8BBgBvjaq/CX23UAAAAABJRU5ErkJggg==",
    Q: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALySURBVHja7FiBjeowDKVfN0BH6N8gG9AROkJHYIRukBEqJuhtAExQNigb0A36+wLuGZ8TUgon9HWWjCqS2i+Jn+00GYZh9c7yZ/Xm8gtwsSAGZ8ShGbXDa1fFcxGYvxn1zObvrjbicc0AmAlnXHMPOG0ubKSvAFjjvTRNh7quh6Zp3DPbGSlup40xw263G6y1HOTmFQABYsjzfCCpqoo7/eYDioWQ4N3r/1UswDkk6fFzOp1Wfd873e/3NHb0zd9ut5cJx6PTJSRBXFi2I60I6NwTU9BSMW0DMZgJ4rVszPqO2EYYKxWiNIH1t4q9IoJ4VgPoBkGArutccHvipYpkZaY4LjRb8AWfnEhegCSbzcYHsFEcVz7W35nnAIJsJCGAbquLonAvsBRSaukjy7LQLhoagx12Go2WKzEHPuGb7GkAS09Q85yV0v8wWJblTdzIlETzmOMuYpfdpvjyYO4hSymZjPyGuBHzMj4HuxzIlxq4mqrSvUTdekBOBGnbVnNe81oNwkGwGFEWNXDdnEpSeba+lWQ6n888XiflFQeLEUA023YOQMOPSRpD0HMRddYp6i8XOY5FCdtmbi3ueHPAjYMcUrgzkEIKY7KziQX4jje2Fn+6gtr3l4iu668MnGXf65q16vN0JOayQSO41QjO1XTpa27DamQ80U7K4+PdChK8JpRbiVx8R7UmNrbdmgIaKYVA0rMUOAdpfGMETqSnbkk/WPOE+ywRpLJLABYy6T5DQux9pKM+a93xo6LkxCA3PiJ62k8qdeiOxxSyos5aMFG/Bo7sBXNJqMO+y94Z185CJulAZ+1VHCtYLqpO/oxLk3kEUKQuBmgCd+FnaZAkCYFLksSXB2/KBuJpPCoXW+v1evqPKgUXuvUdDgf3zG6BXBDIfzWA92KwlMWd2qdHBUlcdOveW2HMEd/0bFQFniEi1ag3w5g0k/FUIS7qiwU22UU+fSTNdC8mh9TZJPnpb8OJRpK3/4CZ/H5E/98B/hNgAEg5APunwmnIAAAAAElFTkSuQmCC",
    r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMJSURBVHja7Fj/saIwEA4373/p4LgKxArkOrAD6UCt4LQCtQK0gtMK1ArQCtAK0Aq4fBmWWXOgAeK7dzPuzCqaZPNlfwcnyzLxlemb+OL0Btia4INVXEEBY6IBRJXwnM3xStY9xWEKMJS80zbfsfFpBUA+J9bG4lyuFYBZBYe5RuKK8SQfDx/I8NoCDEiY53lZFEXZbrfLgiC42wj/cYrjWM2n8cFgoObM5/PMdV2+NrAGcDqdZmmaqs2xGf0fhqECBRAADk6SRIGhOfiNdVgPOaYAP+oG1fF4FLPZTEiAQgIT5/NZDIdDsdlsFBPhWQIW2+1WSE0q7vV6QoK2HsV3GoQm8AxtcNJNDvNCW0SkcazXNNg6SFwSBhAg7lt1GL5XchgrUZxwX0KgNAE4Ho8VQBYkv58BNPXBteRfeFgul8qPrter8iu5mfB9X32XEXwUDN+Fzy4WC7U2p+2zjZ1H3YzjONzMMeUs6UOi3++rjS+XSwGijAg85gPkZDKhob3kn1yDbUudLzltYtoSTumwtkysMkzOKm/BvDAZNKNUnJu6UM9+X6QlaBlph2kZcs4mm5qamAi1NQAQmWbUhgACAPArgNHB4gBkZuTBfA4+eroGbXQzd+mmjlmp0ujp5RmOOv2gyx2fRaJxBeIuwOXZalgL6TAXmdOUcKBOp1MqzxbA4sTdbre2Bg+Hg65B76UaPJ1Otbt3RP4rAX5v44OIdg1g1zZAr40PlmjRKEg+6gIkP0IPKNNNkagfEZVEApgnbP8lACkiqQmFJm+328OFCCrMxTrmGkYaNE3UkaUaXHbrcx/hMCl16NHHf12OpXn1+kuljdIKNzGCpKLjWUieVOF4BtDLm9UiekejkbprUP9HTQGvGDA5zEpzqBYD4Hq9FqvVSgf7Q+I4NzFxpN/ccLfAc922X4JUtzx05LirQAZ/A9G05U/oLgGhTVt9/V4COZDHWv+4aT/ocRPhG9fNtgRZJC93Eb9pP5jx5tQ2cV+UOJzGAD/pLZvzX74fdN7vqN8A/zH9EWAAwHuV+iztsj4AAAAASUVORK5CYII=",
    R: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJXSURBVHja7FjtkYIwEIUb/0sH5Co4OpCrQEqgBK1ArIASmKsAr4JoBdABWAFaQS6bIU5cPgO5O3/wZjKALPGxm919wWaMWa+MN+vFsRCcDViDXaMDvjIkApiqZcSKDWl5bpDHWIIhHxT9OVXuRx0EVZsM3cvqeY0QZB0jrD2Sddwv6vthzxykj6DdV2Zs25YhpWOWi+d5luM44vx8Po9dZZ9g3sljhAd99Y2TJGFFUTQ8EYYhUwF22Aaei+MY/+7PDfETQUqpIBAEQePPVVRVxbg3Gy8Az+sQXOlm/e12E8fD4SBCCliv1xYh5MkOQs29ZV2vV3G93W7FsSxLPOV5bplx+kKpi91uhz1oJIsLOSGEDcI3FdzTKrl0iODYEH9BVGWI9/u9xZPAyvNcXMPxfr+3Pui6rgg/LIfj8YhD/G2qkziqFw0NarKTiDLHR2WIXCULtKkQA/J6tPZSyFqZ1TLsA3OVvyEWHv2Yk2FpmjbqHwbUPSjOYI/6sGU6xE89OYoirewF+7byMkRQRw86ODt1sNlseuczIVg99QJ3jgnwTBN05hD0/UZukVf3oHGC7lxyyIsfpgmSuQSlmNVJktVcgmOUM9jLfnw6nbSSRKcOMlXRGGp5xupg0iZaDYAOhnqEB2PDKqZ17zx1V0dqmdVYU5CRcMQdQu7spFYUyoCfXy4Xdf1hvHMe5RQPJurbQsOXm6apgN0eUtXCi1PFwkOkwqRzpD7e8SGS2VQ9SNQiO6Dx9BoxXwqK/O8sOUNr8M++bnIe9vJ98DdgL9+oF4L/jB8BBgBW3C1aKpC9LwAAAABJRU5ErkJggg=="
  },
  default: {
    size: 100,
    b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAC0klEQVR42u2YTagSURSAn+YPlBWvxCRMLZ6JpCCuyorIihCjFkqvWkQSrjIQRdxEENKjhVG81UNBxU3YSohcBRUhuGgjamTRoujnESbRD0WvOp07XGEYHEfFmWbhgQ9R9N6PM/fce65zc7OYxcixC7mN3EEuyE3OhLxFgMUVOQle4sgRXiMauQieHyDYQVRyEVyHFFlyH5ADcnrEm5AVluAb5LBc5A4izwc8YsJNmt3/FnHkN49cnyfITqnFlEhOQIzNe2S/lIJ3x5Dr85UuB9HjFp+E0WgEh8MBWq2WT/ITYhVT7viwLBWLRSCxsLAwLJMPxNzrng6aVK/Xg8vlgmq1ygiGQiGw2WygVCr5JE+KIbiXLyupVAq40ev1QKfT8QneE0MwySfo9XohnU5Ds9lk5HK5HMTjcdBoNHyC75AN0xZcEqrUfD7PCFosFqGK/oLopy0YERKsVCqMoNvtFhJ8IUanQ3q+b8MmjkQiUCgUwGQyCQlmxKrkpQk2aC49ZLtYguuRFntCg8EAPp8PwuEwJBIJpqKj0SgEg0FwOp2gUqm4gmGxT5I9yGcycX/NDYtutwuBQKAvtyLVWexXKBQ/Y7EYZLNZZmP2eDxgtVrBbDaD3W5nsppMJqFcLjOf4W+qtMmQJDaSLI659q5K3aRCJpOBTqcDrVZrIO12GxqNBtNA4PfvSym4rFaroVQqQa1WG0q9Xge/308Ev4tZvewwIh9xDa7h6w86Md9j/UP7wF/0/TWpMkgysRXZgTweIrhGr6RbkG3I/LRFHMhp5AyySAkhJ5Bz9Kr5lyPEPW1eIZeRU7TNWmRxFjk2ybFHtoNlOuE4ldpG0hOcLs+QfeMI3pjwGLuIqJGXE/yWXAcso8gZhJoCHtKcpdGZYIzrowgeGmNAUsWP6F2FG/P04r46xngPRxEkFXcU8Y3A7hHG20zX1xGBsUixeGZ/s85CbvEPlohjwQUcDyQAAAAASUVORK5CYII=",
    B: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEUklEQVR42u2YWUicVxTH41L3WsdUU6piDSK4gRSElFpKtVKVWhfEVB9CtUQfal4iioIIZWjsQ4syiAwWpIpS9cEFaRGt1JInF9xw6VgXXOJSMEpNVVr15Pwv9xscZ4ZMg99kHjzw45s7c7/v/ufce84997tx49quzWa7zdQxPzFfOJq4YGYzMDCQYmJiyMnJibhd5UgCv3J1daWFhQWC5efnQ+Aa4+YoAu+5uLjQ8PAwHR4eUmpqKgQaGFdHEejC/Ojm5kYBAQEQt80kONIU+zJ6hvz8/CBwnfnIUcR9wPwREhJC/f39tLe3RwUFBRAJvpfefWX2kDlNT0+n7e1tumgtLS3k4+MDkY+ZMHsLc2Z+gJeqqqrImk1NTVFERAREbjHv21NgJ8Q1NjbSi2x3d5fi4+Mh8lAuB9WtFuKamprMxKyvr9Ps7CwdHR2ZfL+/v09xcXEQuce8o6a4TyCusrLSordycnJEcMzNzVkUL1PQr2rmuvHY2Fg6OzszGRwBMjo6SomJiUJgc3MzzczM0OnpqUm/1tZWJbo/U0PgHTy8ra3NzDvV1dXKwEY8PDzo4ODApN/5+TlFRUXh9z41BJZh0K2tLTOBQ0NDVFpaqkSs2Iu1Wi0dHx+b9S0pKUGfJ4z3VQt85OvrKxKxNcvLyxMCDQaD1T4VFRXo8zfz5lULvI/Bx8bGrA4uiwQaGRmx2ictLQ19FtWodFDzPSsqKrI6eF1dHeXm5tLKyorF35eXl8nT0xMCv1Mrkh+h7kPEvoxlZGRA3FPmbbUEejGzYWFhYoeAYU1iSnt6ekSEg46ODhocHKSlpSWjuJqaGiXCC9TeSaKZA5T2SUlJZunlMsHBwZSVlaW09fbai1OZE41GQ2VlZdTZ2Sm8iJIfEYwkPTAwQPX19ZSSkqKI+0UWGXax1+HFhoYGm9ZeaGgoBFbbtUjFyW18fNwmgcnJyRD4sz0F6ry8vERF09vbKwKkq6tLXNHG5+7ubtHu6+ujzMxMCPxHzei9aG8xf7EH/+PrsRzYWpCcyTrwX9n+2l4ehCduMiHM74jU6elpZa2RTqej2tpafMafuMf4M7cYzVULiWRymc+Zu5Ic5lMmH0dN5ry9vZ1OTk6Ipx2CnpWXl4u1FxkZCZHLzAMmQ5ZZdy+QxyS/zLaHdKCDB7BzuLu7G8HZF1d/f3+Kjo4mvV4vxBQXF0PMHKNFUbG2tiaSeHZ2NgUFBZG3t7fxXgVUR3Lq55n3/o/Ab7FnYqpWV1dpY2NDVMQKaOMNgmLIhXKgL5nXmD/Dw8NpcnLS2GdnZ8fkGWBzc1NkgoSEBOU4EGqLuEBME7I/Nnck3/n5eRPw3cTEBCEPwotSnPbS0jDgdUhhYaFI2rjH0rMWFxdF5Msi4htbBH6IATEFzs7OFqNTvr0iGcXD8qxy2TTy4L5z6R4zMPVyrN9sEYiI+5hJtIEIG573hlxfSS94FoLl3evXrNfmaPYcziuFechUn/0AAAAASUVORK5CYII=",
    k: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAFC0lEQVR42u1YWUhtVRi+zjnhPJZppWiKZYqCiIIVqShiPiqiIPgQ6oMT4ohDzhM4pC8Ol1SUQHG65MNFxCm8KggJqTlGimOamTj9rW+xtxztnsF7D3QIf/g4Z501ffuf93n27Eme5P8leQz9DJaqRkyDQYthmoEY3Bk0VYngc4bfGM4Fgr8zrDF8oCoEuxl2GC4EgvsC4Q9VheA7DPoMLwWCnzHoMaipmi+OCATt/ovLjQSTWclYMyUQ9JQyry+cYaNMYoEMPzBsCUEA//qRIfwB+UGBHAlrv5SYd2JoYvhVOOOQ4SeGZAadNyWGtPEdLnRzc6OCggLq6emhiooK8vb2Fokget+HabW0tKi/v5/W1tbI09MTc38xfMIQw3BmYWFBycnJ1NnZSY2NjRQSEiKe8YrB7bHktEV/KisrI1EuLy/vvjc1NZGOjg4uONDX16eRkREaHR2l7Oxs2tvbIy8vL8z9gTOioqLo+PiY77u5ubk7Y2JigpycnLDuiMHrMQQbNTQ0qK+vjx80MDBAPj4+ZGpqSh4eHlyTkLGxMU7S1dWVj11cXLhWtre3qaGhgX9PS0vjc1tbWxQZGUmWlpbk6OhIubm5/PejoyNyd3fH2g0GU0XIwSyUl5fHDxAveghRs11dXXzc1tZGvb29FBERQbu7u6Snp0fBwcF8zcLCAif28IygoCA+v7y8LFqjWBGC3xobG9P5+TktLi6+lpwIkIOEhoaSoaEh7e/v833x8fGkpqbGx4eHh2Rrayv1DLgEBG7Axr8I7iU7lwUGBvJNKSkpMgmamJjQyckJrays8HFrayv3MUnTxsXFyTzDzs6Obm9vqaOjA+O/Fak+L2EmiaeSifz8fL42ICCA/P39qbm5mf9+cHBAq6urpK6uLnO/kZERXV1d0dDQEMY3DB/LI/g9AgJSWFgol6CNjQ1dX1/T4OAgNyvMGRYWxvcnJibK3Y/AkvD1Q0VatW/gsNAATCdPAwCiHVowMzPjY5BFShLHspCTk8MJCnlxUpEgeQ/ZPjMzk29MSEiQe0l4eDhfizQCLV5cXPCkLW+flZUVnZ6eclfQ1NQkobIoJM1IvqgKuMzZ2VnmRciP0Fh9fT3Pk5CYmBi5BIeHh/lapCOhXTNSlCD84MDX15cfAFODhKzL5ufnaXp6+s5k8h4KJRNSV1cn/hb72HL3NTYip0GmpqZ4xEm7ECZFOUO5Q9DY29tLXZuVlcXPxFrBx3ve5iXoLplCQ9bW1uTg4EDR0dHcpOPj41zDoiBRQ1CP5+bmqLu7mzcJyAxwG1HDMzMzZGBgAHKzQhv2xlIHkmLtPDs7I0nBGBUHkdve3k4tLS285EHjOzs799aiqojWEFzmZwZbZfSE5UiiSUlJvHyhWYiNjeVNgq6urlRTIjLFvFhZWckbBjyIoLk5ZTeufbKcHrW4pKSE+6LY1cjAnwzvKrvlf4FyBn96qDVUk6WlpXvmRE6UXIP2zc/Pj1JTUzG+ZvhI2W9tG6Wlpfzy9PT0e5dra2vz1ml2dpYnXiR5c3Pze2uQHxHdmAdZIUsoTfACfoUO5aFmHgKRKm0O0V9VVSX2hlnKJBiMfJWRkUFFRUVUXV1NtbW1/wICAVp+3VxNTQ0VFxdTeXm5mMSfK5NgKoJgcnKSNjY2aH19/Y2xubkpNgavlPrfC5oAaBGfbwOcIVSP88fUXnnyKcNXDJ8rCV8I79u6T/9YPomqyz+Q/sFvovNp2gAAAABJRU5ErkJggg==",
    K: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEQklEQVR42u1YbSjlaRQfb2MZuvLBtMwqRDaZ8RKJEuslUst8kCL5JDVliiU14tMO+SBSM1ZeylqNKezW1GykS8oMZry3IYbbtFFmjLdd1NDZ83t6/nLNZf5/86+9TU79ui/Pc8753eec/znnudeuXcmVfF1SyfiD4WFtxOwYDoyXDGIEM+ytieCvjL8Z+5LgGmOF4WMtBJ8w1hmHkuA7SdjXWgh+w7jBMEqCoQxnho215eJzSfC7/8O5QYbs5gV7XkiCYees35A2vtWTWDyjm/FWPgTIrz7Gj2fIP5PkSO5NPLXuz3jMeCNtbDLGGPcZjpclhrLRCIdBQUFUWVlJ7e3tVFVVRZGRkQoRPL3eCK2DgwN1dHTQ1NQUhYSEYO1fxm1GLuMfDw8PKiwspLa2Nqqvr6fU1FTFxmtGkFZy15V8qq6upqOjIzorjY2N5OjoCAfvnZ2dqbe392Rtc3OTQkNDsbYNGzk5ObS+vv6JjaGhIfL398e+D4xwLQQf2dnZmTm1JIODg4JkYGDgJ2v4YSBXWlp6oY2NjQ0KDg7GXhPDXQ05hEWEVI10dnYKInV1dSffmUwmcnJyopSUFFU25ufnlWj8rIbgQzc3N9ra2iK1kpSURC4uLrSzsyM+5+bmCtIgqlays7OhsyjT6+JaFh8fT1pkdnZWEGpubqaDgwPxvqioSJON1tZW6B2o6T7GjIwM0ip4smNjY6mpqUkQXFlZ0aTf09MDvWPG958j+FtERIRmgiBmY2NDXl5eFBUVpVkfOSzr42dHtXtI2NXVVU0OFhcXCbUQp1dTU6OZYHJyMnRH1Dwkt1DtS0pKNDk4Pj4mX19fQdBoNGrSnZmZIZQ12VlUyS8oEwsLC5ocJSYmCoLLy8ua9BISEkiOawa1BJEH75FLlrrIeZKXl0f29va0vb2tWqe2tlZpeXla291dKBYUFKh2VlxcLOqhWunr61NC+/RLLkEWuwrC2N3dLdYyMzMpOjqa0JOxPywsTAwDGA5QG8fGxujw8NBMf3R0lFxdXbH/lRzDLi31cFpeXi4KckVFBQUEBChhESfg5+cnCKanp1NWVhah0KO/GgyGk30gg6FhYGCA+vv7Cd2Kv/+L4anHTFgji6hwhtbW0NBAExMTtLu7e24IcWoo2F1dXZSfn0/u7u50amac0Htw/d3Hx4f29vYskkHvRg7GxcXR+Pj4hXnKtvYYXnqP/H8iZJgDz57a0tISeXp6nj4damlpMduDajAyMkIxMTFYP2L46X1rMynOy8rKzJxjQMDsiLkQXQgPztramtme4eFhsx8gq4Ruggv4R29vbzF17O/vWwwf6h9O05LgBBH6tLQ00bPZ3gM9CabY2trS9PQ06SHh4eHKfUY3+QllAiUCl6LJyclLY25uTkza8rKk338vCAtOEa9fAtgA5PXToBfBO4xkxg86IUHet52u/rG8EmuX/wAA3De94co77gAAAABJRU5ErkJggg==",
    n: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADJ0lEQVR42u2YXUiTURiA3Z+usbYYy2V/ktBsm1MINi8aGBEhkml3IrsdiHQ3RIggyBoIXnUTK1YQCF3MpGgSBGI0BkU2qDGSIsOEmSv6WTX6sbf3fJwTHx/T3PlOYxc78KDnZZzv2Xfec96X1dXVRm1wD201y11DTlarXBABJFGNcp1IgQr+RA5UU76NIt+oHONqNcgdRB4oxOTcpp+p+NAjF5DfG8hBU1MTmEymNfz/PKKplJwNSW4kxnA4HBAOh6G7u5vM7yN7KiE3I5cYGBiAVCoFra2tJSVtNhskEgkYGxsj85eI83/JHUdesAdrNBoIhULARjqdhvr6+pKSFosF8vk8jI+PM0m7SLFtyGXlQ3U6nbR1vb290NfXB/39/dDQ0LDudgcCAemL0O2+I0ruBLK4mXzbDMlkErLZLJurqjZkC6ICpL7LTzpLCZqvKV45I5IlC5rNZnC73aDX63kFI8gHNvf7/ZLg0NAQmf9CPDyCFuQLWTASiUgLulwuHrlFKsDKHzQ3N0vrxWIx9plTvG9wiSzQ1tYGPT090onlEDxN6/HfmNVqhUKhAHNzcyw2yVslnqvMvbe0cpyVxw0GA+RyOchkMiz2kDcPX9MEv4J8KlMuj3iRvchH5dW0vLwMCwsLLPYKMZUrZ0AuIR10uzPriBSRHM2xH/Stn0OsiLvU9WQ0GmF1dRXm5+dZ7B2ynbdd71zn7T1BBpF9iBnZQcuXA3HRk1ss9aXsdjsUi0WYnZ1lsc/ITt5t3k8ryJrsIZM0R+Unfhp5jLz51/a3tLRIpzgej7MYefu71FaTDtrCP0J0svhh5Fk5+en1eiXBaDTKYu+RRlFlbyv9uwW5yXO6fT6fJEjuVxpborsgtFG9y3v9sIaB9Ig09lSxK6rHRTX3Y1dXlyQYDAZZ7J5IuUNqmwcmSFsuwg2RgtNqBdvb25WC10XJNSqrAg/kol5ZWYHh4WEWuyVK8IiopnVkZASmpqbYPC3qd5yQKEGtVgsTExPgdDrJ/CuyW4TgqChB1gh7PB42HxQheEakoIIZEYKkdTpGc1EkR5FAJX91qI3aKGf8ATh4ueed9+0FAAAAAElFTkSuQmCC",
    N: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADp0lEQVR42u2YX0hTYRTAdX9kTdQcbWr/ILEIU4ReQtZTDEHIsLeIEFR6EJdvIkKCQlMEFdlLrkFhGIQPZXNKkCDSmBb4b2YEmzWHkmCTba501HY653K/mKXi7m5jDzvwe7l3++7vnu9833e2tLRUpEJwSJJZ7glyM1nl7iCAjCWj3BVkOy8vjwR/IheTqd5akB/FxcWwtLQE+fn5JPk4GeQuI29pWuvq6mBzcxMoWltbgZ9qC/+ZhIcMMSCRkpISmJiYgOgIhULQ29sLBQUFJBlGHiDpiZJTITbKEGXqsNjY2IDa2lqWzSnkTCLkxhUKBVitVk5iYGAAqPbsdvuBokajkUm6kAv/S+464pTL5TA8PMw9uL29nT0YioqKIBgMHijZ3d0dLXlCTLHjyCMaXKvVwtzc3J86m5mZgcXFRVhYWIDp6WnY3d09dMorKyuZpFUsuRvIF6VSCZ2dnRAOhyGeWFlZgczMTCYZ12lDU2CigSoqKrgsCYlAIACRSGTPtebmZiZoFyqnQD7m5ORwW4Xb7RacMapRv9+/59ra2hrL4i/kkhDBbCTY398PTqcT0tPTufoSMp20R+7s7Pxzr6qqimVRLzSDHsoeLQKLxSKo9urr60Gn0+17r6uriwk+E3pKfCosLITc3Fzo6emJWW5oaIgTmJyc3Pf+6OgoE3wntA7dSAgxI35awazY19fXYWRkhFvVjY2N0NTUBGNjY2Cz2UCv10N5eTn38La2tgNfgBoKXvAzooxVTo48RMr46f6gUqm4RoCmJjs7mw2+g3xFvGyzLi0thZqaGhgfHz80w6urq0AbPn7nG6IW2q5Tf+eXyWRcHTY0NDCxOeQ2cg7JQu7R9erq6iOXgMfjgYyMDBorgJwUOs3n6QSRSCRhtVodXdSyqM8co6OL7m9tbR1Z0OVygVQqpfG2kVPxniZlfAv/HpFGXb/KFzmYzeaYFpHD4WAvTOWhEevYy4rK2gt6gEajgb6+vphXOa1uXtDD77uiNqqvaXBaxV6vV9AJQ90QL+j4a1biDiMNTP1dPGEymZjgGzHltDQonRDxBm3+vOBzMQVf0m8Mn88Xt6DBYGCCT8WSo5Xm6+joADEiqrt+JZbgNRpwfn5eFMHBwcHoTV+UX3t3qXHYr3USEsvLy1wbh+N+R06LIdhCp8XU1BSXxdnZWcHQbxoahxpiPou3xBC8T4PRW/NvLhj6Ph6fHGL+0XQWqeBrUUx0/JGZsH8dUpGKWOI32DG/8ZSL6t8AAAAASUVORK5CYII=",
    p: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABYElEQVR42mNgGAWjYBSMgiEBRIA4D4iXA/EyIM4CYv7B4jhzIH4AxP/R8HUg1h5ox4kD8UssjoPhu0AsMJAObMDjOBjOH0gH7iLCgasG0oF7iXDguoF0YB8RDqwbSAeqAvEbPI57CsQyA52TS/E4MGWgHecNxA/xOPA2EDsMlONANcc/ItLgTyBOoqfDWIB4KhEOQ8ed9HCcKBBvgloICr3fQPwLR0j+g8r9RpJfTuuaRRiILYFYC4rVgTgQhwNBDnMFYg2oWm2oXro3IkLxRKvLYGjNzMPjwO6Bdhw7ED/B48BrQMw4kA70IyL32o62ZnAAXyLLv38DEYpyQPyChEL6HrT1TRegCMRXyahJTgOxJK0dFwDEz8hwHAzfB2K3gWhWkYrT6FlbkIupWsucpoEDd1LLcaxA/JYGDrxHrVqGDYg/08CBoCqSiRoOZIQWtKA040Ql7AJteo2CUTDoAQD3o0UpmCZENQAAAABJRU5ErkJggg==",
    P: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACvUlEQVR42u2XT2iScRjHp6TpPNSWIW0RxpDCgQwRQ1DWcoYQZh0SEbzo7OBgsUN4i64RdutoeGosRoduJV29DEX8k4hYtpUzqIOEDJW9T88j7ztoIg189WfgFz4gr+/7+uH3vs/veZyammSSSSb5L6JGNpAt5DUSRs6Ni9wNpCqXy8FisYDZbAapVAp4rIgsspbTID9MJhMUCgUQkkqlQK/Xk2QFOc9S8OnMzAwcHBzAyZTLZVCpVCT5iKXgB5fLBf2yvLxMgm9YCn70eDx9BZ1OJwm+ZSn4QqvVAsdxPXKHh4eg0WhI8AlLQR3yMxgMQq1W64oS+/v74PV6Se47cpl1JT9GwO12Q7vdhmazCSsrKyRHrLGWu4N8Jbl6vX78ePf29sBut5NgGbnJSm4DN2QuEon0LZL19XWSbCGBUYqdQV5StwiFQlCpVKBUKkEul4NsNtuFPtMx2gt9Pp/wuJ+NQu4i8o5+UCKRcLOzsx2FQtGWyWQctTqlUtmFPtMx+o7OwfM5XnJr2J3lAmJB9DzXkPsksL293V05Ih6PkwyJOZDr/LmL/LUjHyIe4CpBo9E4fvdoy5menibJ1XGYZl4ZDIa/iqPT6cDCwgIJPmctdxb5Fg6HeyqYL45PiISl4F16+ROJRI/gzs6OUL02ptOMTqfrPtKToY4yNzfHdJpx0QrFYrG+G3U0GgV+ixn5Kl5B6jabDY6OjvoKtlotWFpaIsnP/PQ9klxFCvPz81CtVuFfKRaLQNsQXrOLXBq23D2kRnKZTAZOm2QyCWq1miS/ILeHOlY5HI5TrdzJUG+2Wq1CZT8UvVvQjTc3N2HQBAIBQVLULrNLQ6hYMRqNJPheLDkZ8ou6RT6fh3Q6PRD0/9nv9wuVLUqXkSO/af4jcMwaCOE+1CIRqRiCEn6jpXfmlkis8qPXJJOMff4AhKhv/Cht2GwAAAAASUVORK5CYII=",
    q: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADfklEQVR42u2YX0hTURzH3dwG1WZjDSywCaIEPcjKaIRp0XL0kCIJhogkPoh76UkW4jCZoQ4jIinKIu0fJuvBUDEb9WDLiILUrSAK0wmF9WIR4XLz1znj3nF2Ovfa3L2jh/3gA17O957f957zO39mRkY60pEO2WJLAlptKo1pEH2IJcRLxAER7R6ED/ENcTvBj9pwuBBA8BmhZ+g2Iz5Q2gupMPiGSoqxMHS7GbqPqTB4hUr6CWEQqLt3lPZOKgzi6fQSSc+IaJsIHa7FbalaKOeJxHihKAV0TwjdjVSu5BfU1J1gaI5SmrcIhRTJ93F15kaYGO243n5QyV8zdE8pzW/EToYuG3EOcQ1xcD1zexG/iE7nENspTSljdWKOE5pD/6Dh6zlAfUSpmMHLjE5PUZrTAsmfE5pHAhon1VclQ3MvkU14jfFFtwSSY/Yjdom0P6T6MiPClOaSmEEj4hUhjiDOUhq/iIExxAORdlwyaqKvZm5a+Xa/QJ3GxSaEFeEhXnzMvYjP0p8iBtYjxNV0Njea5IfZELpEVvNW7kJAnrl9SZgj98M54nkZsWOjW46dkWBNApMkjmT2RFwv7yU2RBLkbj1JRZOMBpulOFlw4X6Vwdwyt2tIEldlMHhXyssBffCDwWAAq9UKDocDBgcHwefzgd/vh0AgAFNTUzA0NAQtLS1QVlYGRqORZbBSSoP48rmUlZUFdXV1MD4+DqFQCPiIRCKwuLgIs7OzMDMzA8FgEMLhcKx9dXUVvF4vNDQ0RD8M9fVdyunlY6KioiKWcGRkBOx2OxQVFYFOpwOlUhkbHfy3VqsFs9kMjY2NMDw8DCsrK9F3a2tr6XNbsriem5sL2KRer2fWlcVigeLiYmYbHv3y8nLIy8vDz/flMHgRG6yurgaNRhOXPCcnBwYGBmJT2t/fDyaTKU6TmZkJVVVVUFBQgJ9vyjKCeHRw9Pb2xiXPz8+HycnJmMHp6WkoLCyM03R0dETbbDabbCM4UVJSAm1tbaBSqZjTiKcQj7DQ1oJXPGdQ8hrEt5gvNTU14HK5oLOzE3p6euJwu93gdDqhtbUVuru7/2rv6uqC9vZ2qK+vl2UVH8M15PF4olvIwsICk/n5+ShC7fjd0dFRfgZOSmUO/xIbUygUoFaro1tIMvB9oD6fifxcTShwJ4e50+SIRPB9qdL/JEzH/x5/AACs1FXqy4cMAAAAAElFTkSuQmCC",
    Q: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEvUlEQVR42u1YW0isVRQ+at6TNAdPoYl3JRVTxBuaYRGBPshBTbylL1Io4uVgDwZJqKBGeMHIDMU0VErBB7UxEjWPIoqpRwMxDPKGN7TI+2W1v82/ZWb8NdSZoQc/+PCf2d+/9tp7r73WGh89esADHqAzWN5C+6I+HTNh/Jpxg3GcMfQGrT/jCOMW47e3XNSd8ZmzszM1NzdTUlISsc9rjNYyOgvGxdjYWGppaSEvLy9ov9CHg7/m5+cTsLS0hEnBYBnd6xibmpri2pKSEuh+14eDXzo6OlJtbS3FxcVh0j8YX74m7n6Ljo7mWnd3d2hb9OEgjvMnaefAj2/QfqiiQyza6uuifO7j40MREREkXRTDa3Q/BwcHU0BAAHTf6PMmj6Wnp9Pk5KTYnScymncwNjg4SHl5edDMMxpoY/JAxBljOaOjzDji7e+Kigoe/GFhYZh8UkY34OvryzUNDQ3QnDC+JqN7zFjCWM8Y/l/OBTAehIaGkre3N4wuMb6ioXkTO9Pf388n7+3tFbsYo6KJxHdtbW1cMzY2JqcR8Tzn4eFB4eHhZGhoeCLZvxZ1QUFB3Ojh4SEpFAoY/UBDk2NpaUkrKyskEBgYCN0zFc2Pnp6edHp6ysd3d3fJ1tYWmk80bMXC1tbWFtdFRUVB892NSdjNzY2Wl5dpfHycrKysLmRW1IwLooquri6xQ0GMnnhuampS04SEhGC8W8PWG6ampmcDAwO0vr5OCAn2Xc1NDioYJ8zMzMjIyAjic8ZPNTTPU1JS1CY/Pz8nPz8/6HsYf8AiT05O1DRZWVkiZIxVbD1FbLKjJQsLC4w/vyZO1WDO+Dbj9yo5rF96EbX0n6qqKtJER0eH0FJ9ff2V8cbGRowdSzH9WNpN8Q4W9i6j1W1u80toCBwcHAhBLNVcNAk0NDR0xYGzszNycnLisXZwcHBlfHp6mgwMDEQ+XHJxceF69rzH+OpdU85HLA6pp6eHMjMz+WqNjY0vEPRyqKmpodLSUtkxXDobGxtuIzk5mWcB6XPhfXIi4mUhJiaGT4KjQ229Dri1mrGnivj4eKqsrOTPiYmJcO5Pqeu5F3g9nZiY4IaPj4/p4uKC7oKjoyP+d35+Xhz3U21UFgTuZkZGBmkL2dnZIvYU2qq9XyFp7+3t3du5/f19sre3h4Ot2mwOeOFHWVMFkiuCHf1ebm4upaWlcebk5FB1dTX19fXR6uqq2jvDw8MitcRq00E0nxuFhYW0sLBAxcXF5O/vTyp5jN9IpA5XV1dR1i6JClFUVERzc3Ois/5Lm8croGRl6XJSFPeysjK+I9vb22q3F887Ozs0MjJC5eXlFBkZefmeZOOZLnrABuwSOpSNjQ3Z+EJNVSqVsmNoCDo7O8nOzg4OtuvCwSokbfR2Il0ILC4uUkJCwuUu4RmhoArsamtrK1lbW0PTqJMdFA6kpqaqTT47Oyvaek60WqOjo3LNgqBOdlBpYmJCBQUFtLa2JnuMdXV1vFKgu9HE5uYmvyjm5uY6iUF0Meu4FPcFFqGLW/we+sP29nZ+nOhM7sKZmRnq7u5GwwEn39eWc/gl1oPaCcNoLu9DYYPZ/OWGn6u3Aoy8JVWTKC1R2Hrh4Z+ED/i/418jpjudlF+5UQAAAABJRU5ErkJggg==",
    r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABzklEQVR42u2XPUvDUBSGDTRpiyCioDi46CAIgihCN1FJF6uOUhD1B4hLnV1EFxERB7VDB3Up1C/E2K5CBxdtQ6GIiBXcbC2Ig4h6PIEbKOGCtfce6JAXnukdzgPJPblpaHDjxo2busg2coYcMc6RGdZpyA5y6ujHWd+C7CMnjn5MpuADAg42WaciRU4fYX0b8sPp52UKXnEGbCA+pBUpcPol1ncjZU4/IVPwkjPAGnqPPCKfnL7I+ifki9OPyBRMcAaIMiRT8JBAsFem4KpkuXekQ6agH1mxT6OiKOD1ekHTtKrweDyVcreyH29lgtbLHw6HoVQqVU06nQZVVYHtQz/10r4JhUKQSqXAMIw/SSaTEIvFwOfzWYJT1HIqWxu1vnsL1ILWUn4REFymFuxiJ7BWwS1qwX7kW0DwgFpwWHD/GdSCk4KC19SCc4KCd4hCKRgRFHxGGikF1wQFy7K/wc7sCQp+ID2UgolAIACmaUI2m4VMJlMVuVwOotGoLdlHJTeLvOq6Dvl8/t/E43Fb8AJplynWhOxKvg9a/zB6Pd+mbQZkCJqEgtMybtIFQsFFUcFO5I1QcF1UcJBQzuJYVLCZnbZRAoLs+ubGTV3nF+nlg7kw+H6AAAAAAElFTkSuQmCC",
    R: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADJUlEQVR42u2YXUhaYRjHs9I0aSwNpQ8pXLBYDcbWCCKyOVYXQ6Wr3Ywp1OXYjV5IH7sxB2FjLKltlzWhm/bFUK/bRbAIFyOIMWQGg4JqxZIUU589z+E1Rjd16n2hCx/4ccC/55yf57zveZ9jSUmxilWsYl2ICiKfkHeMz8hDlqmQV8jHY/l9luuQWeTDsfwuT8G4yWQCm80GfX19oNVqAT97wTIlst3c3Ax2ux2sViuoVCrK3Sw3IPnW1lZwOBzQ3d0NpaWllLt4Cn4ZGBiAQrW0tNAJniNqRI8kxsbGpCydToPBYKDcw/IryO7MzIyUJxIJKC8vp9zGUzBKv54qn89DfX09nWAX+Yn8QjJDQ0NSvrOzA2q1mvJtlq8j2enpaSlfXl6mjLjDU3Cebh1VLpeDqakpGBkZOWJ4eBgWFhak/ODgACYmJo6y0dFRaRuLxaScvscEb/MUDLW3twOPikajBcFrPAX9SqVSuhJ0i89aS0tL0NbWRnJJpJanoAbx0Wy0WCywuroKqVQK9vf3TySZTMLe3h5MTk4WxuY33rf3/+plgx+qqqpAo9GcCD2SaMtu6yz7sUIr1tnZCT6f79R4PB6oqKggQYdoOXoor4+Pj8sef0ajkQQfixakh/JWMBiUJXd4eAiNjY0k+FS0oJlmYCgUkn0FaanDfV+KFryB5MLhsGzBrq4uEnwrWtBCs3FxcVG2IDUSuG9EtKC9rKwM1tbWZAu6XC4S/Cpa0FlZWQmbm5uyBd1uNwn+QBQiBd01NTXSCiG3/H4/Cf5GtCIFn5nNZshms7IFqd1iLVqtSME3HR0dZ2oUIpEICaaRqyIF5/V6vTTgnU7nqRkcHISenp7CenxdlNwj5I9Op4OmpiZoaGiQBe3DBMOIkafYJeQ1Hby/vx82NjbO3A/Ozc1BdXU1SSaQe9y6aerjAoEAl46anqE0jtnVvMlD8DuNI54Vj8eBOnQ89gMenfTRKyWvymQyQJMNj/3kvIIm5K/X65Xa/JWVFS7Qq2ddXR0JBs4reIvGCv0TQGswbXmhUChI8P15BS+z2WYVQC9r34pVrAtd/wCkmK79XfCowgAAAABJRU5ErkJggg=="
  },
  eyes: {
    size: 80,
    b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAtCAYAAACwNXvbAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAxQAAAMUBHc26qAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAlNSURBVFiFlVdbbJTHFf7OzPzXvXi96wuXtUlxAo6pU0NBoWouIk0iopb2KUqbvjUqD1XUSlVbJRF0+QOR8tCnPLSKlL5VpVLU0KRVgEACaUhqbMCAA4ZgO8bYxnjt9e7a3t3/On1Y23jtNUlGGukfzZn5znfmm3PmJyklVmuWZa2zbfukpmnPp1Kpi/ewiwJoTaVSXavZsFVRABQKhTcuX+7dXCqVTliW9cAqIIZt26cdxzllWdbWbwxkWVaHbds/OHnyI3bkyHuJUsn+r2VZyWU2SqlUOnHhwsXWd99937Rt523LssQ3AioUCm8dPXosBgC3bo3QsWMnGmzbPmNZVmIehJdKpX9fudLXcfbseePOnUkMDAw1OI67/2sDHThw4EfpdLplaOgmiBiIGAYHh9jHH3+63radM5ZlRYvF0uEbN/q/f/r0JyEiBsYYOjt7Ip7n/9qyrNavBJr39M9Hjx6PLWxARCAiXLt2Q3R393zLtp0ro6Oju48dOxlmjIMxDiKOIAhw5kx3jeO4b1uWxe4J5DjOr65f/6I2k8nMs6FFVkQMly9f0fr6biSJKFJ2ouzMwvf4+CSNjaWbPc//7apAlmVFfN//40cfnQovBVnKiojh7NkelEounnnmaSwwWsrswoW+qO/7r1iW1VwVqFQqvdLZeTZSLBZBRIteVn4zMEbo7LwIwwhh27aHKlgxxuB5Pvr6bkZc1/vDCiDLspiU8hfnz5/XloZqeeiWjjs7L6K9fQvq6hIgqmQ1MpIWAD1vWZa+nNHTw8O3FNt2KkJVyYoqWLmuj66uXjzxxCNQFKWCme9LTExkOYCfVQDNzs7+rquru/arWCwfp9NZ3L49iR07HlpxXjdvpqOO4724CGRZVj2A7w4PDy8TQPXzuftdnr969Us0Ntahvr62gtXMTAmM0f2WZWkMAKSUP75y5apS6Tnh644BQm/vILZufXDxjBZY5XIlD8D3GAAUCoVn+/v7Q0u9/Kaspqby8LwAyWQDlt6vTGYu5vvBM5yImJTyjePHT+p3aS+NNcP27Vvx5JOPYu3aRoyMjAMgcM5X2M7MFNHRcT9GRqbAmIAQCjgXVFcX9hiAbZOTk76UQdULGo/H0NJyHz788DxsG2hv37RCEAv2c3M2MpkZJJN1i6xcNwARrWNSyp0DA4PR5apaMGxoqMf4+CR8P0AuV4BpmlUdWrAfGkqjqal+kaXnAYxRXBSLxYempjLK3diXN2lt3YTt2zugqgr6+m6CqHxvmpubkUyuxcREBufOXV0h+2LRRRBIRCIGbFuCiEFKKCIIgi3T09mKUIRCYezYsQ3vvXccnGsQQodhhDAzU0Rn5zB0PYSWlhiamtZgbGxqRRTGxqaxfn0thoZyYIwDgGSc8/tyuWyFogxDh+PYsG0Xvh9UKHEhVOVGqCb7dHoW8XhoSXghBWMs4ro+GBOLC7LZHMbHJ/Hcc3swM1PA6OgkJiZmwBjDli2NME0V09MzGBubXFTmUlZSEopFB+GwDtclAPAEEdHyu0HE8Nln3ejp+Ry1tbV47LGHkU5fBQCEQir+859P5gHEqpc5n7cRjWrI531IiVkGIFjtgrquj6mpaQjBwTkHEUOp5ME0jWWqW7k2n7cRiSgwDA4p5RUmpfTKaWO1NMOQy80iEjHnVeUhHq+pkmwr187NOTBNBaYpPCHYKRYEsmgYxj3TTiaTRTweAcAgJSBEtepbuVbKclkJh0WeCOdYEARd69atvWfy/OKLm2hqqkNb2xpEoyrS6dwK1tXyIBFgmoID6BGmabzb3JzcfevWmLEaK9t28cEH/0NdXQzZbAFSEjgXVZksdaDc5LVU6kCeEdGpDRuai19VEjzPRzqdQxDIqvPLq2+5fEByzv4KACyVSg2bpp5paKj/WiWiWjKtVn3L8icQ4W0AEACg6/ovd+165Mg777wfW7pI01TE4zEYhgFVVaFpKlRVmU+WwXyX8DzAcfwKUMPgCAI58eqrB7KLQKlU6vTLL79yYevW9l0AKJGoRSJRiyAIkMlkYdsOXNeD4xRQKEgwxmAYOgxDh67r0HUVoZAOACgWPdi2lIwxIqITC2+SxZe/rmsvtLe3Hh0YGGzt7u7G1FRuXsoKOBfgXMHmzS0YGhqDrutYv34N+vvHwLkCIcrzqqoiGg1h06Y1RdNUP2WM/rLiXZdKpYYMQ/9TPp8vjY2Nw/M8LG8bNybR0dGKbdseRCJRs2Le9wPk8yUUCo7HOb1x4EDqsxWMAICI+hsa6gsA9BW7ADh9ugstLRswO1vE7duZaiZlQUvQ8r0rBoyx/oaGeqWtbTNCoTCi0agMh0PFUMgs6rpOuq4JxlggpaT2dik9z/Nd15Ou62uOE4Qcx2e+L6HrwiAipWLvSk9kWFEU9sADLX4QBHJ2tgDDMJBI1JKuGyc0TX22ubmp4bXXDsVCIf0pXVcOh8OGqygM09PTVCgUpKJwqetK4LryhxXRWvqz/NJLL7156tTHL1y71k+aZmKhRyJRNDWtQ1PTmlwiEZ4rleyeubnZndevD8RGRye5lBymGYFhlLtpRtHRUZdLJtc27t27113OiIjoJ/39X5IQKha6pumQknDnTg69vbdqCgVHVRTx+OHD/0xcvXqDO44HTdNxd035ns3OuhgfH9+14owsy/pOJpMh35fQNAVCKNi8eSPt2NFOxaKNzs7+QAgV2axbk0hIj3MBIVTs3LmVNm5M0sRETvb3Z6QQKgAgm3VqQiG+B8AHyxlNGoZBQigQQoWiqGhuXgfOOQxDRyhkQggVuq4UFUUhRdEghIrm5jXEOUdDQ81iJABA05gtBLu8QgypVGrEMEIyFotBUcoLPv98UI6PZ+Tg4B3peQRFURCLqYGUQe/GjRukEArOnbsu0+mcvHbtjhRCmT8DIB7Xipzz01VVxzn9ZvfuJ/IL3pZKHi5dGpKjozkphIING2JFIvzLMIyfP/row9lYLIZMZk5eujQsczlnMWzJpFlkDH/bt2/fjapAhw4d+kc0Gvn7nj27so2NdVDVMmAkEkJbW2O+rk6/GI/HXty3b9+Aqio/feqph9NtbRuc+voYotEQ4nEdra3RXCymHRGC/X5VeS+0gwcPPl4olFKcs28TMS4lBonw5sGD1ltL7V5//fXaQqGwNwiwC6A6gLo0jR/ev3//J8v3/D+a/9zXJrFo8AAAAABJRU5ErkJggg==",
    B: "data:image/png;base64,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",
    k: "data:image/png;base64,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",
    K: "data:image/png;base64,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",
    n: "data:image/png;base64,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",
    N: "data:image/png;base64,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",
    p: "data:image/png;base64,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",
    P: "data:image/png;base64,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",
    q: "data:image/png;base64,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",
    Q: "data:image/png;base64,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",
    r: "data:image/png;base64,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",
    R: "data:image/png;base64,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"
  },
  fantasy: {
    size: 80,
    b: "data:image/png;base64,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",
    B: "data:image/png;base64,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",
    k: "data:image/png;base64,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",
    K: "data:image/png;base64,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",
    n: "data:image/png;base64,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",
    N: "data:image/png;base64,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",
    p: "data:image/png;base64,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",
    P: "data:image/png;base64,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",
    q: "data:image/png;base64,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",
    Q: "data:image/png;base64,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",
    r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAtCAYAAADcMyneAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3wAAAN8BD61hjgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAm+SURBVFiFtVldbBTXFf7O/Znd8a7xehdsg2NIE2KbkiYBNQQItI2ohPJQRUVRpD41kar2pY99wZU6Xid5qFQ1apOnvLQPVd+qBBo1alISUUAiqWJCAsQmxAZ7scEGsvZ6l52/e/swM/u/No3pSKN7d+bee757vnPOPWeWtNb4ptfRo7/+FRF+TkSdjLEE58wEAN9XK0qpJa31HSL606uvvvL6N5UhGh9ks9mNAB4GMABgq+t62xmjv46NjZ1unq5/cvbsZ4/kcovwPA+uq8AYh2nGU6ZppgYGerY9+ui3fABNALPZbMJ1/ZNaY0lKdpqIzgEYtyxrpnYcjY6O7gDww3K5fIgxto8xllpeLtzN55con1+KdXV1xbZu7T8Wi8V+C6CklLoLoGRZVu7o0ZEL7757eueNG7dAxMEYBxEL+wzbtm3GgQOPXo7F5GtEJAHMaa2/AHAFwFbH8c6Pj+c60umEl8kkSl1dcQlgCcA/hGDHAXwgPM/7aHLyspienjavX5/D7dtfAyAjErJ375Po79/y7NLSyg8Y4yQEY0Lw2NjY2E+JyFDKB0AgomjPCLoEzgmepx++c6f8e6UYdXRwO5HgTEqYSuGK4/huLpfH3FxBEPENjDFs2GCavb3JlzZvTj7f1WU4wvO8/KlT/x5YWLhV2XmghUgIx+Rkzjh//qrBmABjHHv2bL/7yCN9aQCG79facBUcEcAYw9KSx7/4omwG2uVxxjik5Ni3zxh2XT8fbKw6r1BwUCwu0cJCecPBg1tuC631ZCazcWBh4Xbd4kCgEc45kkkTW7dughACUkpkMklRLtu/FEJssW0HjUIisL6vkcnEsGMHoVQilEoaWgdKAADPU1Q7HkCFiY4OAaV0ThiGcW7jxo2HiCZbDp6ZuY4HHujHtm0peJ4P1/UwMXFZLi+vDN+5s4yVlRKIeAshhJmZBdj2p0ilOtHd3Yne3gQ4VyBiWF72MDubj9eCqm1NUwDAlOCcX+rt7S0ClGweHADM5Y6DiFWcIKSr0m8lJAK8sLCEW7dWQHSzyYmIeKxxfrRJ0xRaCHZJAJjs6dnkNw8K+lIKSGkgFotDSllpDcOAYRhhX0KIoOWcQylAaw3f19CaoJSG1oBSGkoRHMeHbSvYto8gDNc6WCA7mZQlIkwJABdSqZQ6ePCAe/XqNfnccz+qCJRSQCkdxjg3pNiF5ym4rgfP8+H7Cq4btMF7P7RVASECTXEuIAQD5xxCcMTjEvG4RCwmQrA+ymUPhYKDiYk8Bge7vZ4ekwCcJa01stlsv207f7958+bQiRMfdhSLdkW41hTRUdM2UfWN3jEmYJoSphlDPG4gHpd46KFUsaNDXBCCvWBZ1gwDAMuyrsdixp7Nm/uOPf30fm9lpQjHcaCUbuHZzfHu3t6h6R2gUS77yOfLWFgoYmgo7XZ2yt8IwfZFJwrVnsXZbLZDKVV44403GecSyWQSyWQSiUQCyWQC8XgcnAea4DxwkEAT1b7WgOf54a3geQq+rxtuwPcBpQDfJygF9PQksWtXX+6VV7IDqN1OY7IwMjKSMwyj3/M87boeua6L69fnUCyWYNt2xeAjowcAranyjDFecSDDkBUnklKGDschhIBpGpBSgDECY5FW8ZJlWX+uxdOULAwODj547dq1IcMwdnPOX5qdnf3+W28dY5ENRSGmVb/6W4R2J1q8C+6hoX489tjAFOf0B8bYeaXU55Zl3WnE0wTwxRdf9ABcBHBxbGyMeZ73JIBkbXirtTmiamhofSbXzquOC68PLcv6YyOGVQE2XExrEEDIZDJIp9OIx+OIxeIwDAOXLl2B43g1oCNg9YCrv9EImq0hf3WAWmuutQIA7N79BLq7U3BdD47jwrbd8Extpb0mIE2gQ5tdH0AATClFRIT33/+wrT3VwGhBd1vtAfegwVUHEBHXWlO0eDvhtRQ2AqmPkY1j1fopVipIiQ4e3I90Ol05BoXgYSvw8cefYXp6bpUNNG4c4Rl8XyjWRATMz99EPl8AQOjr68X09Cx8X0EpjXy+WCe82m/nLJVB6wNYpZjw1VfTIOLIZDI4cGAPTp36qC7OBTlhM43tnQUAaH02CIBpHWW9geBy2UahUEQjdfVAVncW4D5RHNhgQPH+/XvQ3Z2ClAYcx8WRI89CysgWRaWdmLiGTz6ZbALdTDcQxNh1AAwoDgL14uItrKyU4PvR4R/Y36ZNGRQKJeTzRSgFuK4Pomp8bEf3fXOSKMxcuTId2lr9+bpz5yCUAnK5xZrYuLr2aujmzSIbAKz2MgwzbLWQUSgUYdtOC+HttRfQq0G0TooRaBAAYdeu76Crqyu0u6BOEYJDSon+/j488cQOSCnAOcfiYh6nT18MwawW3NdPsajmiwTbtlEuO8hkUpidnQsTThXmhkES+uCDWzA1NVeZE4CsLhid1/fNi7UOFv300wtgjCOTSePxx7+NEyfOtswH9+7diRs3vsbychnt6a7EwTUpXnUHvu/LKJuJliqXbZTLVeGNJ8TKShme15iCRXAa46Fa00nWpFgpACBs3/4Q0uluMMYxNTWLp556vEV9wuF5HgYHBzA8HJSZN27kMT29iEa6g3RrbQ2uSTEQVHYbNnSio8MEQDU1iYIQEq7rw/PccBYhjEzQmpDP3w2Btcwb12uDEEFhRBgf/7xlPnjo0D7Mz9/Gl1/OIvr61apmCUA2iVhvPggeeXG7fND3FTiPTo7KvJp+u9hIIFonxUqpOKBRa9jRkkRBuXju3CQ8T9XUx9U7+LgUlZVU6QfvCADkWgCb6uLoymazh1zXPSalTLR6Xz+PdOPzFudu7XgAgO8rW0r2Pcuy/nPPALPZbKdtO68r5b/wzjv/NKenZ9rUvrylzdXXxq1qZ1H5vWVLF3bv7isxRq8xRr+zLCvfEmA2myUAB2zb/gXn/MjExCS9994Hccfx2gBoV5D/74CTSRPDw+lSX1+HVgr/EoLeBvCeZVlzAECjo6NPOY5zvFQqmePj44mLFyfY3bvlML4JMCbCloNzCc5FGP+iZxyMyUq/mmqxMMsO2uh5BE7r+i9e8biBnp4O9PTEC+m0IbXG+Msvjz5NIyMjb545c+ZnJ0+eJCKOI0d+jOHhoTDWaQC60q/eVVsLmur3msgBImcAomeonDpEAGP1x16p5OHUqVuVjT7zTNongil83//u/Px8xaTffvv4/4XKdjEyYiewzWrU0xqKCAnBGJvo7u7eJYSoAxVMrP0AxMCYDBfldW0VALsHe2V1oKvjo/DD0NkpobX+2rJG8yIWi/3t8OHDzx8+fLgxaN7Ln3gNYygkfc34u8baBKX0XwDgv/d1Gc8Rb6riAAAAAElFTkSuQmCC",
    R: "data:image/png;base64,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"
  },
  modern: {
    size: 80,
    b: "data:image/png;base64,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",
    B: "data:image/png;base64,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",
    k: "data:image/png;base64,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",
    K: "data:image/png;base64,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",
    n: "data:image/png;base64,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",
    N: "data:image/png;base64,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",
    p: "data:image/png;base64,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",
    P: "data:image/png;base64,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",
    q: "data:image/png;base64,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",
    Q: "data:image/png;base64,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",
    r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAtCAYAAAAz8ULgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABEAAAARABBMRn7QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUzSURBVFiF7VldbBRVFP7uPbPTlm6LC22JVJTZUjCIVQyQRmu0hhAhabENRBB9EEkQo9GIoDFBNPGFQIUKPmBMHwRbUKMg1iiaQCImYCSxhmhRu1MgBAOF/tBddtrduT7MzO7M7Oy0xi2hSb9kds7c87Pf3HvP3LlnmBACqhpZBaAN3qhVlPBxL4WqRp4A8GUWPzsaFCV8KEuMRwEcy+K3WlHCByTr6uzZPwfXP78haLf49OCBaFlZqe+/nzt3PvrKptcLOScQSeDEQSSl5He3vhm9Y/p03xh9/QPRd7Y3F9rbXt2wbnBG+e0AgBTJRGJY7+npcTgLoQvf6AASyaS4dq0XnMgkRyDJIklIJkeOoQsh+geuO9qSyaRuyXykALcCxgVJyU+p6zrFYrEPOzp+HXRqGMAAORCYLHSd/GIIXSdN05rOnDnzFpjN3yJAPDhSDF+SW7ZsLSgsLKxMheYc3DwYETjniEZjfiHw0cetBZOLi8OGj+Vv+FqIxzXfGL4kT5465bi2JweXzCQhCSRlD/N751lPH06+nedNsry8vKD1k/2+xowZPwzMODPYZGbOAku27ABm6cGcMXxQMjVU4CYpAKa3trXhxo3sw8dsQ8U5gVP6mrnaiJPRRpQxRSxdNuTlyVjduFw3eAHMXHHy4vH4watXry1Z+9y6gosXL3o6+w13tuekJY92uEumTsHml9bfKA4Gj8py4ElFCWscABQlrOXn5zeUlZXu/fyzg9q8eff4DsVYQblzBt7e/LJ2W3HRXlkONChKWAPMnrSjq+vvFxOJRNPG1zbJx44dd+jGsifvv3cuNjz79BBx2lhRUbHH8b/uu6momLVHluWV7zXt0NaseWrEJS0XWPzIQ+KFtc9oAUla6SYIePSkBVWNLBoaGvqhf2CgKDpoe5YzMy9t51TWepxhfwKk7GFmO1CQn4dJkyZdD0jSYkUJ/+zFJStJAOjs/KPt0KHDq746csQwNrOWk5W1xkGSka2Gzjjs2U0kGRlO9ieCMdwPLnoANdULD8yunL06Gw/fh7kQQly6dAkdHb8BGJs5OacyDOHXUxgnLxgTJHOFCZK5wgTJXGGCZK4wQTJX8F27OefBuro6VFXdByC9V0ntYayDM3Nvw4321LUpp3y4MwaAaaUl4IwF/Xj4vardlUgk/mppaQmcv3DBMLb2MSxze2rf7jrayLBP73EYOCfjhgCUlUzB0sWPDRPxSkUJn/tPPRmPx7d9d/So/v7uD9I9O0Zv5qFQSF84v2obgFVeXDznpKpGqoiosbl5d162m8glvjjybR5nvFFVI1Veek+SsVhs1759+/nly5fHlp2J3v5+fH/8R65p2i4vfcZwd3ertZJENWp3Ny1b+rhD51Vmydh3c556+3bu0117cNe++58rV4gTr+nuVmtnzlQcRdUMksPDwyt6e/sC9fV1GXeUrk64qxIeGe+uXjja09ltx+BgLFBcRCvgqvxmkBRC6F+3t2PnzuaMIGNdHFhRvwxLah/WM/43w/IWxATJXIFFIl1v2BuEEMt/OX26+sSJnzKNGXdkJ2PMlAmMs/TKwrmxKtlXotS16cMy+2fe3Dm4e1b4JIDDbpKivf2bobimmUQYppVNk70qa8Y6bK6/Fkmb7NZZMk+1O23cKJkSQm9f35C1UMuBAKoXzJclANi+o0l2fx7xws0o/QGQLWFycRGqF8wfH3NSAoBQKDQqY2MlsXrFqgtJIMmsCXl8EeOSBOISyJQNOxpVzbwoaHwkY5FI100p7/0f/AtqgngTt18VQwAAAABJRU5ErkJggg==",
    R: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAtCAYAAAAz8ULgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABEAAAARABBMRn7QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUzSURBVFiF7VlrbBRVFP529tGdbsujLXTdtexaRBENBiH+ERNJpBgpkVYeJf7QUCWg+EMeAko0kV+ojSQ2IIQgEUwRqGgwvokSEn5IeBkfURQWmi27xRYWu5bZMuf4Yx57Z3d2imFLbNIvTefOueee+e7j3HvPWRczIxoONgFogz1mxOKJ7+0qouHgXAAHCrQT0RCLJz4pYOMRAN8VaLcoFk/s8Rhv90y6t/eDD9vKRI36x+rSyWTC8et3jL8zve39XQGVCESASgRiAhFDJcKKZc3pC7FzjjYqKqvSb23ZGRBlG9a91Bv78wwAwCTp9XpozNixlsaSJLGjdQAet5srq8Zo5HRiYtnt9gxowyVJPKqi0iJzuz1k8hjIwP8BQ4Kkx6lSckvuQCCw7f5JE3s1SXbmGIAsl46UJMntaEOS3H6/3HLfxLtey0qzdvyyXDaQDUeSb7a8I6d7eycY70SsOwVATGBmlJWPdDKBF1a8LKdSqVpmBhGBGCAisLBS5dJSRxuOJB+a/rDlXVWtTkFEUEn7eCFMnjLV1LG2HdCf8kl2dHTIc+sfd1TWes/Zp/YAmzKA9QLrDUQd/c8sO6Er0SnnkmQw6JnFzSh1GHpjupkAlQlMDGKGZSr1PVKTafXEDCYyy0Z9IVzr68OOzZvI6KtLP3FKZFn+qLKqqq5tb7tcM26cbWOn6S60TxbSKTTdXYlOvL5qeV/q8uWvFeXawlg8oUgAEIsnlL6+voauZHLr7FkzldOnTjnPxSDhj99+xaqlTys93X9tVZRrDbF4QgH0kRRRWxNa7vV6W1rf2+abWTfLUjeYI3ns6BG0bFifUdXrK892dLaKdXmb+dmOzlZFUeY/v+RZZeeO7TfugjeBzw/s47ffeFXp78/MzyUI2IykgWg4+GCJz/ftiFGjysvLy0251Xu1f1kPzhYMq6InGx5vlgH8k04jffXq3/3X+x+NxRM/2HEpSBIA7q6NtC1oWtTUOG8+AJhTx8za0/BYc5PXvFclzfNVttPJ7gAAcPibL3Doy8/2nDl3YVEhHo6bucvl4lAojCkPTAUwOGvy59Mn4HK5HJfVkLhgDJMsFoZJFgvDJIuFYZLFwjDJYsHx7GZGWXv7Ppw4cVx/Z0ucY8Q2bMYyOXLjRqTXmzcozsZEF+MdYEaZzedNOF3VIh6P58yy5S96I5EoAJi3HDbjFC2uMWIcNmIcZrAQ9opxTTbm0b6bvBjHx227+lX1+oRYPHH+P42k3y9vnD1nDq1cvcaUDdbN/FJXko4ePrQRQJMdF9s1GQ0HJ6uq2rh67bqSQp0oJp5avLSEiBqj4eBku3pbkoFAYFPzc0ukYPC2wWWno6JqDOobF0p+Wd5kV5833ZFQ9Qy/3z+9dvx498FPrXlPMe7Orj1hnQmxNou3cYZ5Q2e2j7vDNRG3qtL0SKh6xvnOpCWpmkfS6/PNG11R4W3fvzevR7mebYYvdt6rqQrZDWuWw85dy0eO8KYu0zzkZH7zSLoAamh8EmteWZ9nZLCTA7u3b8bB/XvyEktDYjMfJlkseKLh4FpRIEnStJPHj2NL67t5yoZXsuDN2iljJxe83DgaSZTnk/n9l59ApE7L5eSKhKr5iYbGjN/v14kQkomk7/aamjwjLBDTPFQoG4SRo2M5z0V5PslLyYsYXVmZkSRtgjOZDI4c+srnioSq+djJH5H784gdbkXqT8SVnm40L6gfImsSALp7um9IWTVyQeIo6fmeQr+IEWXzP8YI0g2OZCp1BYC+Jm+ik7cE/wKfjx1PbiTAVgAAAABJRU5ErkJggg=="
  },
  spatial: {
    size: 80,
    b: "data:image/png;base64,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",
    B: "data:image/png;base64,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",
    k: "data:image/png;base64,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",
    K: "data:image/png;base64,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",
    n: "data:image/png;base64,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",
    N: "data:image/png;base64,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",
    p: "data:image/png;base64,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",
    P: "data:image/png;base64,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",
    q: "data:image/png;base64,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",
    Q: "data:image/png;base64,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",
    r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAtCAYAAAAz8ULgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA5QAAAOUBj+WbPAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARoSURBVFiFxZhNbNxEGIbfb+zEdhKyDaA0iK5KiJQWiFDSE6RSL6hHVCTEqRJHDghVXHpL4lrsjXslLlyjSsAJCY7VigOEa8WfEII0QFGabLdbku2uPcNh1+uxPf5bO2UkK/vF45ln3ne+mdGQEAL/V3EcZ45z/gdj7KmkOp7H/9afJJSi1DzP02/d+gqMMRAxEBGIGBhj0DQdV65cek53HOc9AC/maHDXtu2bJ0HKuQAgQCSGkIOYsYHLOoBPms0mOOcgIgAEIgz/0uh/Fy++LhzH+dS27W61iAPl5P7k2IdEs9mE67ojmaOyEzGsr7/G/Y/84jjOAoDzOUh2bNs+SsSUxIiCjiCTKwaxqnS7vc97vd6q6/ZdWZlBe4PfpmkYpml8DGAzHZKF+g36H0KqK7FY5Xjh07dvfzN19+6fw/qDbwI3GFZXX8aFCytWEqAskNp2gPmjl8FUcXpRq588uLTv5flIAWQSWDhOUiHdAV+NVMSYzSw0SD2rUlpHRPTg8uVLx67LvagyAMAYoOv6hBDiYTpk1OZwLuiBGiKxYpKShmG8BeCFTKmAH9Ih1fMxMXGSbAegua77z+amnKRp0yAcb21tqaoxAFZysrIA0jTN4WI+GI2cnX62CiGwvf3FrL/ox7OZIt9T6D0QAPjtT02ZWF9/NdG9kZL9fv/3a9c+OJMgiM45BwB0Oo/Qbj8cNaIaSNF4AA+lzSHIRqOxmGTZxsbG/vb2Z8+2Wu3ITlTNEyz8cZtj2Z1e0vfWsjFjDAsLTw+nSRhQ06Q5mYpYIVh0Wev1+rh/v42VlUUYxmQLwG64b6Df934tAFmNvXLsecDOzo9YWnoe587Vv2w0PnpXxZCxHahPJtXF6QeYnJCq3SDbxqJx1tkgB2S25Wk7VTRb1XFpyGptVSuazpB9RIGq0fKxamcpqWRe28aLs0oBJfPNv3EVTkMppOR4NqpiFopLJY6f2dXbrAIfEzKsZLWJU2l2F7Ft3LiidbKIbeM8JZUsk7151Syt5EnaLKtfClJl80k8pSHHtTF/nF4KZvfJgGbNySd6Mo8+pjmB+flZnDplgTF6yXGcD6Wuv7Zt+6fCkFWrWa8/g1rNwtFRD/v7j9YAeoWIYFm6ZlkTbwB4MwfkydpMBBwc/Iu9vTaISCNiFmMM8/MzOHu2pvkUY6yTeZ+8px/1NY9cRko6jlMH8Lb8kjGylpbqePy4H2owUAOhhqO/Ve88j+PevU4EKA6uhOScXz88bL/farU9qeFJw5iEYRjSiP1G/DrytAjioHM5Bk6fnkWn00O360baCQ9GCQmAdnf/0u7c+UXz72zCF0/Jl/5F4rm56QzF42rGEifPFpYdJ18jahoTa2tnjgHiRGTs7bUn4vVTIA1jEjMz09J8iyo62CLl2H8vDyh69SffphHRsa5r7wD4TQixwRhd1bTo7VvYchny++XlxYPl5UWEB5K9bUW8iHwfKw8AfGvb9uGNG8539Xrtar1ei1XyPPGz//s/s1PvmLrJam8AAAAASUVORK5CYII=",
    R: "data:image/png;base64,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"
  },
  veronika: {
    size: 80,
    b: "data:image/png;base64,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",
    B: "data:image/png;base64,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",
    k: "data:image/png;base64,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",
    K: "data:image/png;base64,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",
    n: "data:image/png;base64,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",
    N: "data:image/png;base64,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",
    p: "data:image/png;base64,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",
    P: "data:image/png;base64,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",
    q: "data:image/png;base64,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",
    Q: "data:image/png;base64,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",
    r: "data:image/png;base64,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",
    R: "data:image/png;base64,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"
  }
};

exports.default = chessSets;
},{}],16:[function(require,module,exports) {
var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }
  
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

},{}],12:[function(require,module,exports) {
var global = arguments[3];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' ||
  // $flow-disable-line
  typeof value === 'symbol' || typeof value === 'boolean';
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString(val) {
  return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop(a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) {
  return false;
};

/**
 * Return same value
 */
var identity = function (_) {
  return _;
};

/**
 * Generate a static keys string from compiler modules.
 */

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
  if (a === b) {
    return true;
  }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

/**
 * Ensure a function is called only once.
 */
function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = ['component', 'directive', 'filter'];

var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured'];

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: 'development' !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: 'development' !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }
      obj = obj[segments[i]];
    }
    return obj;
  };
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = {}.watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer;
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function () {
    function Set() {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };
    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = noop; // work around flow check
var formatComponentName = noop;

if ('development' !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }
    var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) {
        res += str;
      }
      if (n > 1) {
        str += str;
      }
      n >>= 1;
    }
    return res;
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function (text) {
  if (text === void 0) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned;
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;
    while (len--) args[len] = arguments[len];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // notify change
    ob.dep.notify();
    return result;
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto ? protoAugment : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj, key, val, customSetter, shallow) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */
      if ('development' !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
  if ('development' !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  var ob = target.__ob__;
  if (target._isVue || ob && ob.vmCount) {
    'development' !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 */
function del(target, key) {
  if ('development' !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot delete reactive property on undefined, null, or primitive value: " + target);
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  var ob = target.__ob__;
  if (target._isVue || ob && ob.vmCount) {
    'development' !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if ('development' !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }
    return defaultStrat(parent, child);
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
  if (!from) {
    return to;
  }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      'development' !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    'development' !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }
  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */
  if (!childVal) {
    return Object.create(parentVal || null);
  }
  if ('development' !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */
strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
  if (childVal && 'development' !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) {
    extend(ret, childVal);
  }
  return ret;
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Validate component names
 */
function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName(name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
  var props = options.props;
  if (!props) {
    return;
  }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if ('development' !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else if ('development' !== 'production') {
    warn("Invalid value for option \"props\": expected an Array or an Object, " + "but got " + toRawType(props) + ".", vm);
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
  var inject = options.inject;
  if (!inject) {
    return;
  }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val) ? extend({ from: key }, val) : { from: val };
    }
  } else if ('development' !== 'production') {
    warn("Invalid value for option \"inject\": expected an Array or an Object, " + "but got " + toRawType(inject) + ".", vm);
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    warn("Invalid value for option \"" + name + "\": expected an Object, " + "but got " + toRawType(value) + ".", vm);
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
  if ('development' !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) {
    return assets[id];
  }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ('development' !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

/*  */

function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if ('development' !== 'production' &&
  // skip validation for weex recycle-list child component props
  !(false && isObject(value) && '@binding' in value)) {
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ('development' !== 'production' && isObject(def)) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn("Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + expectedTypes.map(capitalize).join(', ') + ", got " + toRawType(value) + ".", vm);
    return;
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }
  return -1;
}

/*  */

function handleError(err, vm, info) {
  if (vm) {
    var cur = vm;
    while (cur = cur.$parent) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) {
              return;
            }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError(err, vm, info) {
  if ('development' !== 'production') {
    warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err;
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) ||
// PhantomJS
MessageChannel.toString() === '[object MessageChannelConstructor]')) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) {
      setTimeout(noop);
    }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask(fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res;
  });
}

function nextTick(cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    });
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if ('development' !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + 'referenced during render. Make sure that this property is reactive, ' + 'either in the data option, or for class-based components, by ' + 'initializing the property. ' + 'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed;
    }
  };

  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

var mark;
var measure;

if ('development' !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = function (tag) {
      return perf.mark(tag);
    };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns) {
  function invoker() {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments);
    }
  }
  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, vm) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      'development' !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook(def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return;
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if ('development' !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }
      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }
  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true;
    }
  }
  return false;
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i);
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + c[0].text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res;
}

/*  */

function ensureCtor(comp, base) {
  if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
    comp = comp.default;
  }
  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node;
}

function resolveAsyncComponent(factory, baseCtor, context) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      'development' !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject('development' !== 'production' ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}

/*  */

function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}

/*  */

function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}

/*  */

/*  */

function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add(event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm;
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm;
    }
    if (!fn) {
      vm._events[event] = null;
      return vm;
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break;
        }
      }
    }
    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if ('development' !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, "event handler for \"" + event + "\"");
        }
      }
    }
    return vm;
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
  var slots = {};
  if (!children) {
    return slots;
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots;
}

function isWhitespace(node) {
  return node.isComment && !node.asyncFactory || node.text === ' ';
}

function resolveScopedSlots(fns, // see flow/vnode
res) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res;
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle(vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
      , vm.$options._parentElm, vm.$options._refElm);
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return;
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent(vm, el, hydrating) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if ('development' !== 'production') {
      /* istanbul ignore if */
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
      } else {
        warn('Failed to mount component: template or render function not defined.', vm);
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ('development' !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure("vue " + name + " render", startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure("vue " + name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if ('development' !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  parentVnode.data.scopedSlots || // has new scoped slots
  vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if ('development' !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }
  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return;
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, hook + " hook");
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if ('development' !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) {
    return a.id - b.id;
  });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ('development' !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks(queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = 'development' !== 'production' ? expOrFn.toString() : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      'development' !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }
  this.value = this.lazy ? undefined : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
    } else {
      throw e;
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value;
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown() {
  var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function (key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if ('development' !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
        warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);
  toggleObserving(true);
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    'development' !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if ('development' !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn("Method \"" + key + "\" has already been defined as a data property.", vm);
      }
    }
    if (props && hasOwn(props, key)) {
      'development' !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ('development' !== 'production' && getter == null) {
      warn("Getter is missing for computed property \"" + key + "\".", vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if ('development' !== 'production') {
      if (key in vm.$data) {
        warn("The computed property \"" + key + "\" is already defined in data.", vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
  }
  if ('development' !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if ('development' !== 'production') {
      if (methods[key] == null) {
        warn("Method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
      }
      if (props && hasOwn(props, key)) {
        warn("Method \"" + key + "\" has already been defined as a prop.", vm);
      }
      if (key in vm && isReserved(key)) {
        warn("Method \"" + key + "\" conflicts with an existing Vue instance method. " + "Avoid defining component methods that start with _ or $.");
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  var propsDef = {};
  propsDef.get = function () {
    return this._props;
  };
  if ('development' !== 'production') {
    dataDef.set = function (newData) {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}

/*  */

function initProvide(vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}

function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if ('development' !== 'production') {
        defineReactive(vm, key, result[key], function () {
          warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject).filter(function (key) {
      /* istanbul ignore next */
      return Object.getOwnPropertyDescriptor(inject, key).enumerable;
    }) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
        } else if ('development' !== 'production') {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
    }
    return result;
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList(val, render) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    ret._isVList = true;
  }
  return ret;
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) {
    // scoped slot
    props = props || {};
    if (bindObject) {
      if ('development' !== 'production' && !isObject(bindObject)) {
        warn('slot v-bind without argument expects an Object', this);
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ('development' !== 'production' && slotNodes._rendered) {
        warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes);
  } else {
    return nodes;
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}

/*  */

function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1;
  } else {
    return expect !== actual;
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName);
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key;
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      'development' !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function (key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on["update:" + key] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop(key);
    }
  }
  return data;
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree;
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      'development' !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data;
}

/*  */

function installRenderHelpers(target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext(data, props, children, parent, Ctor) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    return resolveSlots(children, parent);
  };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode;
    };
  } else {
    this._c = function (a, b, c, d) {
      return createElement(contextVm, a, b, c, d, needNormalization);
    };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }
    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }

  var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options);
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res;
  }
}

function cloneAndMarkFunctionalResult(vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init(vnode, hydrating, parentElm, refElm) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },

  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if ('development' !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }
    return;
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent, // activeInstance in lifecycle state
parentElm, refElm) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    'development' !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // warn against non-primitive key
  if ('development' !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }
    if (isDef(data)) {
      registerDeepBindings(data);
    }
    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender(vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if ('development' !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin(Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    // reset _rendered flag on slots for duplicate slot check
    if ('development' !== 'production') {
      for (var key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false;
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ('development' !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ('development' !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };
}

/*  */

var uid$3 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ('development' !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */
    if ('development' !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ('development' !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified;
}

function dedupe(latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res;
  } else {
    return latest;
  }
}

function Vue(options) {
  if ('development' !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}

/*  */

function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}

/*  */

function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    var name = extendOptions.name || Super.options.name;
    if ('development' !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps$1(Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1(Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if ('development' !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}

/*  */

function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}

function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry(cache, key, keys, current) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created() {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed() {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted() {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) {
        return matches(val, name);
      });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) {
        return !matches(val, name);
      });
    });
  },

  render: function render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
      // not included
      include && (!name || !matches(include, name)) ||
      // excluded
      exclude && name && matches(exclude, name)) {
        return vnode;
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || slot && slot[0];
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive

  /*  */

};function initGlobalAPI(Vue) {
  // config
  var configDef = {};
  configDef.get = function () {
    return config;
  };
  if ('development' !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.16';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false;
};

/*  */

function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */
  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */
  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }
      res += key;
    }
  }
  return res;
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }
  if (isReservedTag(tag)) {
    return false;
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      'development' !== 'production' && warn('Cannot find element: ' + el);
      return document.createElement('div');
    }
    return selected;
  } else {
    return el;
  }
}

/*  */

function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm;
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode(a, b) {
  return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
}

function sameInputType(a, b) {
  if (a.tag !== 'input') {
    return true;
  }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) {
      map[key] = i;
    }
  }
  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove() {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1(vnode, inVPre) {
    return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function (ignore) {
      return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
    })) && config.isUnknownElement(vnode.tag);
  }

  var creatingElmInVPre = 0;

  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if ('development' !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }

      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ('development' !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true;
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break;
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if ('development' !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable(vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) {
        i.create(emptyNode, vnode);
      }
      if (isDef(i.insert)) {
        insertedVnodeQueue.push(vnode);
      }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope(vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) && i !== vnode.context && i !== vnode.fnContext && isDef(i = i.$options._scopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }
      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if ('development' !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys(children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn("Duplicate keys detected: '" + key + "'. This may cause an update error.", vnode.context);
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) {
        return i;
      }
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return;
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || data && data.pre;
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    }
    // assert node match
    if ('development' !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true /* hydrating */);
      }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ('development' !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false;
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break;
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ('development' !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false;
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true;
  }

  function assertNodeMatch(node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || !isUnknownElement$$1(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }
      return;
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if ('development' !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(vnode, insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm$1, nodeOps.nextSibling(oldElm));

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res;
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
    }
  }
}

var baseModules = [ref, directives];

/*  */

function updateAttrs(oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr(el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (isIE && !isIE9 && el.tagName === 'TEXTAREA' && key === 'placeholder' && !el.__ieph) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs

  /*  */

};function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
    return;
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass

  /*  */

  /*  */

  // add a raw attr (use this in preTransforms)


  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
};var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents(on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler(handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler() {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  };
}

function add$1(event, handler, once$$1, capture, passive) {
  handler = withMacroTask(handler);
  if (once$$1) {
    handler = createOnceHandler(handler, event, capture);
  }
  target$1.addEventListener(event, handler, supportsPassive ? { capture: capture, passive: passive } : capture);
}

function remove$2(event, handler, capture, _target) {
  (_target || target$1).removeEventListener(event, handler._withTask || handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners

  /*  */

};function updateDOMProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }
      if (cur === oldProps[key]) {
        continue;
      }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, checkVal) {
  return !elm.composing && (elm.tagName === 'OPTION' || isNotInFocusAndDirty(elm, checkVal) || isDirtyWithModifiers(elm, checkVal));
}

function isNotInFocusAndDirty(elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try {
    notInFocus = document.activeElement !== elm;
  } catch (e) {}
  return notInFocus && elm.value !== checkVal;
}

function isDirtyWithModifiers(elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false;
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal);
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
  }
  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps

  /*  */

};var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle ? extend(data.staticStyle, style) : style;
}

// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }
  return bindingStyle;
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res;
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && prop in emptyStyle) {
    return prop;
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
};function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition(def) {
  if (!def) {
    return;
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res;
  } else if (typeof def === 'string') {
    return autoCssTransition(def);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveClass: name + "-leave",
    leaveToClass: name + "-leave-to",
    leaveActiveClass: name + "-leave-active"
  };
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : /* istanbul ignore next */function (fn) {
  return fn();
};

function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) {
    return cb();
  }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
}

function toMs(s) {
  return Number(s.slice(0, -1)) * 1000;
}

/*  */

function enter(vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return;
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

  var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

  if ('development' !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm();
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

  if ('development' !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
  } else if (isNaN(val)) {
    warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val);
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength(fn) {
  if (isUndef(fn)) {
    return false;
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
  } else {
    return (fn._length || fn.length) > 1;
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [attrs, klass, events, domProps, style, transition];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted(el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) {
        return !looseEqual(o, prevOptions[i]);
      })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple ? binding.value.some(function (v) {
          return hasNoMatchingOption(v, curOptions);
        }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected(el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    'development' !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return;
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption(value, options) {
  return options.every(function (o) {
    return !looseEqual(o, value);
  });
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) {
    return;
  }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) {
      return;
    }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

};var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data;
}

function placeholder(h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    });
  }
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render(h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return;
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) {
      return c.tag || isAsyncPlaceholder(c);
    });
    /* istanbul ignore if */
    if (!children.length) {
      return;
    }

    // warn multiple elements
    if ('development' !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode;

    // warn invalid mode
    if ('development' !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + this._uid + "-";
    child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) {
      return d.name === 'show';
    })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) &&
    // #6687 component root is a comment node
    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild;
        }
        var delayedLeave;
        var performLeave = function () {
          delayedLeave();
        };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        });
      }
    }

    return rawChild;
  }

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final desired state. This way in the second pass removed
  // nodes will remain where they should be.

};var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
        } else if ('development' !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },

  beforeUpdate: function beforeUpdate() {
    // force removing pass
    this.__patch__(this._vnode, this.kept, false, // hydrating
    true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove;
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) {
          removeClass(clone, cls);
        });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup

  /*  */

  // install platform specific utils
};Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if ('development' !== 'production' && 'development' !== 'test' && isChrome) {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }
    if ('development' !== 'production' && 'development' !== 'test' && config.productionTip !== false && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);
}

/*  */

exports.default = Vue;
},{}],3:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chessSets = require('./chess-sets');

var _chessSets2 = _interopRequireDefault(_chessSets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: "ChessBoard",
  props: {
    version: { type: String, required: false, default: '1.0.0' },
    initialSelectedBg: { type: String, required: false, default: '#bde6ed' },
    initialLightBg: { type: String, required: false, default: '#F0D9B5' },
    initialDarkBg: { type: String, required: false, default: '#B58863' },
    initialFlipped: { type: Boolean, required: false, default: false },
    initialPos: { type: String, required: false, default: "RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr" },
    initialChessSet: { type: String, required: false, default: 'default' }
  },
  data: function data() {
    return {
      title: "Vue Chessboard",
      sets: _chessSets2.default,
      selectedBg: this.initialSelectedBg,
      lightBg: this.initialLightBg,
      darkBg: this.initialDarkBg,
      flipped: this.initialFlipped,
      emptyPos: "0".repeat(64),
      position: this.initialPos,
      chessSet: this.initialChessSet,
      sqFrom: -1,
      sqTo: -1,
      isDragging: false,
      isMounted: false,
      status_msg: 'Mensajes de depuración',
      debug: true
    };
  },
  mounted: function mounted() {
    this.$nextTick(function () {
      this.isMounted = true;
      var board = this;
      this.status_msg = this.decoratedVersion;
      window.addEventListener('resize', function () {
        board.$forceUpdate();
      });
    });
  },
  methods: {
    reset: function reset() {
      this.position = this.initialPos;
    },
    empty: function empty() {
      this.position = this.emptyPos;
    },
    getIndex: function getIndex(y, x) {
      return (y - 1) * 8 + (x - 1) * 2 ^ (this.flipped ? 7 : 56);
    },
    getIndexPlus: function getIndexPlus(y, x) {
      return ((y - 1) * 8 + (x - 1) * 2 ^ (this.flipped ? 7 : 56)) + (this.flipped ? -1 : 1);
    },
    getRow: function getRow(n) {
      return Math.floor(n / 8);
    },
    getCol: function getCol(n) {
      return n % 8;
    },
    isOdd: function isOdd(n) {
      return !!(n % 2);
    },
    isLight: function isLight(n) {
      return this.isOdd(this.getRow(n)) && !this.isOdd(this.getCol(n)) || !this.isOdd(this.getRow(n)) && this.isOdd(this.getCol(n));
    },
    flip: function flip(ev) {
      this.flipped = !this.flipped;
    },
    setBg: function setBg(light, dark) {
      this.lightBg = light || this.initialLightBg;
      this.darkBg = dark || this.initialDarkBg;
    },
    move: function move(from, to, promotion) {
      var currPos = this.position.split('');
      currPos[from] = '0';
      currPos[to] = promotion ? promotion : this.position[from];
      this.position = currPos.join('');
    },
    isSqEmpty: function isSqEmpty(index) {
      return this.position[index] === '0';
    },
    isSqSelected: function isSqSelected(index) {
      return this.sqFrom === index;
    },
    getSqHeight: function getSqHeight() {
      if (!this.isMounted) return '5vw';
      var sq0 = document.getElementsByClassName('square')[0];
      // console.log(`Square height should be ${sq0.offsetWidth}px`)
      return sq0.offsetWidth + 'px';
    },
    getSqStyle: function getSqStyle() {
      return { textAlign: 'center', width: '100%', height: this.getSqHeight() };
    },
    getStyle: function getStyle(index) {
      return this.isSqSelected(index) ? this.getSelectedSqStyle() : this.isLight(index) ? this.getLightSqStyle() : this.getDarkSqStyle();
    },
    getOpacity: function getOpacity(index) {
      var op = index === this.sqFrom && this.isDragging ? 0 : 1;
      if (op === 0) {}
      return op;
    },
    getLightSqStyle: function getLightSqStyle() {
      var tempStyle = this.getSqStyle();
      tempStyle.backgroundColor = this.lightBg;
      return tempStyle;
    },
    getDarkSqStyle: function getDarkSqStyle() {
      var tempStyle = this.getSqStyle();
      tempStyle.backgroundColor = this.darkBg;
      return tempStyle;
    },
    getSelectedSqStyle: function getSelectedSqStyle() {
      var tempStyle = this.getSqStyle();
      tempStyle.backgroundColor = this.selectedBg;
      return tempStyle;
    },
    onDragStart: function onDragStart(index, ev) {
      var ctx = void 0;
      this.status_msg = 'Dragging from square ' + index;
      var size = ev.target.offsetWidth;
      var pos = size / 2;
      if (navigator.userAgent.match(/Firefox/)) {
        ctx = document.createElement("http://www.w3.org/1999/xhtml", "canvas").getContext('2d');
      } else {
        ctx = document.createElement("canvas").getContext('2d');
      }
      ctx.canvas.width = size;
      ctx.canvas.height = size;
      var img = new Image();
      img.src = ev.target.src;
      ctx.drawImage(img, 0, 0, size, size);
      ev.dataTransfer.setData("text/plain", index);
      ev.dataTransfer.setDragImage(ctx.canvas, pos, pos);
      this.isDragging = true;
      this.sqFrom = -1;
      this.onSqClick(index);
      return true;
    },
    onMouseMove: function onMouseMove(index) {
      if (navigator.userAgent.match(/Firefox/) && this.isDragging) {
        this.onDragOver(index);
        return true;
      } else {
        return false;
      }
    },
    onDragOver: function onDragOver(index) {
      this.sqTo = index;
      this.status_msg = 'Dragging over ' + this.sqTo;
    },
    onMouseUp: function onMouseUp(index) {
      if (navigator.userAgent.match(/Firefox/) && this.isDragging) {
        this.onDragEnd(index);
        this.onSqDrop(index);
        return true;
      } else {
        return false;
      }
    },
    onDragEnd: function onDragEnd(index) {
      var _this = this;

      var currSqTo = this.sqTo;
      setTimeout(function () {
        _this.status_msg = 'Ending dragging from square ' + index + ' to square ' + currSqTo;
      }, 1000);
      this.isDragging = false;
    },
    onSqClick: function onSqClick(index) {
      if (this.sqFrom === -1) {
        if (this.isSqEmpty(index)) {
          return -1;
        } else {
          return this.sqFrom = index;
        }
      } else {
        if (this.sqFrom === index) {
          return this.sqFrom = -1;
        } else {
          this.move(this.sqFrom, index);
          return this.sqFrom = -1;
        }
      }
    },
    onSqDrop: function onSqDrop(index) {
      this.status_msg = 'Dropping on square ' + index;
      this.onSqClick(index);
    }
  },
  computed: {
    decoratedVersion: function decoratedVersion() {
      return this.title + ' v. ' + this.version;
    }
  }
}; //
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
//
//
//
        var $fe081a = exports.default || module.exports;
      
      if (typeof $fe081a === 'function') {
        $fe081a = $fe081a.options;
      }
    
        /* template */
        Object.assign($fe081a, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticStyle: { width: "100%" },
      attrs: { alt: _vm.decoratedVersion },
      on: {
        dragover: function($event) {
          $event.preventDefault()
          _vm.status_msg = _vm.status_msg + " - Dragging over the main div"
        }
      }
    },
    [
      _vm.debug ? _c("h4", [_vm._v(_vm._s(_vm.status_msg))]) : _vm._e(),
      _vm._v(" "),
      _vm._l(8, function(y) {
        return _c(
          "div",
          {
            key: y,
            staticStyle: { display: "flex", width: "100%" },
            on: {
              dblclick: function($event) {
                if (
                  !("button" in $event) &&
                  _vm._k(
                    $event.keyCode,
                    "cancel",
                    undefined,
                    $event.key,
                    undefined
                  )
                ) {
                  return null
                }
                $event.stopPropagation()
                _vm.flip($event)
              }
            }
          },
          _vm._l(4, function(x) {
            return _c(
              "div",
              {
                key: x,
                staticStyle: {
                  width: "100%",
                  display: "flex",
                  "flex-direction": "row",
                  "align-self": "center",
                  "justify-content": "center"
                }
              },
              [
                _c(
                  "div",
                  {
                    staticClass: "square",
                    style: _vm.getStyle(_vm.getIndex(y, x)),
                    attrs: { droppable: "", "data-index": _vm.getIndex(y, x) },
                    on: {
                      dragenter: function($event) {
                        $event.preventDefault()
                        _vm.onDragOver(_vm.getIndex(y, x))
                      },
                      dragover: function($event) {
                        $event.preventDefault()
                        _vm.onDragOver(_vm.getIndex(y, x))
                      },
                      click: function($event) {
                        _vm.onSqClick(_vm.getIndex(y, x))
                      },
                      drop: function($event) {
                        if (
                          !("button" in $event) &&
                          _vm._k(
                            $event.keyCode,
                            "cancel",
                            undefined,
                            $event.key,
                            undefined
                          )
                        ) {
                          return null
                        }
                        $event.preventDefault()
                        $event.stopPropagation()
                        _vm.onSqDrop(_vm.getIndex(y, x))
                      }
                    }
                  },
                  [
                    _vm.position[_vm.getIndex(y, x)] !== "0"
                      ? _c("img", {
                          style: {
                            cursor: "pointer",
                            opacity: _vm.getOpacity(_vm.getIndex(y, x)),
                            mozOpacity: _vm.getOpacity(_vm.getIndex(y, x))
                          },
                          attrs: {
                            draggable: "true",
                            width: "100%",
                            height: "100%",
                            src:
                              _vm.sets[_vm.chessSet][
                                _vm.position[_vm.getIndex(y, x)]
                              ]
                          },
                          on: {
                            dragstart: function($event) {
                              _vm.onDragStart(_vm.getIndex(y, x), $event)
                            },
                            dragend: function($event) {
                              _vm.onDragEnd(_vm.getIndex(y, x))
                            }
                          }
                        })
                      : _vm._e()
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "square",
                    style: _vm.getStyle(_vm.getIndexPlus(y, x)),
                    attrs: {
                      droppable: "",
                      "data-index": _vm.getIndexPlus(y, x)
                    },
                    on: {
                      dragenter: function($event) {
                        $event.preventDefault()
                        _vm.onDragOver(_vm.getIndexPlus(y, x))
                      },
                      dragover: function($event) {
                        $event.preventDefault()
                        _vm.onDragOver(_vm.getIndexPlus(y, x))
                      },
                      click: function($event) {
                        _vm.onSqClick(_vm.getIndexPlus(y, x))
                      },
                      drop: function($event) {
                        if (
                          !("button" in $event) &&
                          _vm._k(
                            $event.keyCode,
                            "cancel",
                            undefined,
                            $event.key,
                            undefined
                          )
                        ) {
                          return null
                        }
                        $event.preventDefault()
                        $event.stopPropagation()
                        _vm.onSqDrop(_vm.getIndexPlus(y, x))
                      }
                    }
                  },
                  [
                    _vm.position[_vm.getIndexPlus(y, x)] !== "0"
                      ? _c("img", {
                          style: {
                            cursor: "pointer",
                            opacity: _vm.getOpacity(_vm.getIndexPlus(y, x)),
                            mozOpacity: _vm.getOpacity(_vm.getIndexPlus(y, x))
                          },
                          attrs: {
                            draggable: "true",
                            width: "100%",
                            height: "100%",
                            src:
                              _vm.sets[_vm.chessSet][
                                _vm.position[_vm.getIndexPlus(y, x)]
                              ]
                          },
                          on: {
                            dragstart: function($event) {
                              _vm.onDragStart(_vm.getIndexPlus(y, x), $event)
                            },
                            dragend: function($event) {
                              _vm.onDragEnd(_vm.getIndexPlus(y, x))
                            }
                          }
                        })
                      : _vm._e()
                  ]
                )
              ]
            )
          })
        )
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$fe081a', $fe081a);
          } else {
            api.reload('$fe081a', $fe081a);
          }
        }

        
      }
    })();
},{"./chess-sets":13,"vue-hot-reload-api":16,"vue":12}],4:[function(require,module,exports) {
module.exports = {
  "name": "vue-chessboard",
  "author": "Domingo E. Savoretti",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "dependencies": {
    "vue-hot-reload-api": "^2.3.0"
  },
  "devDependencies": {
    "@vue/component-compiler-utils": "^2.0.0",
    "babel-core": "^6.26.3",
    "node-sass": "^4.9.0",
    "node-simple-router": "^0.10.1",
    "parcel-bundler": "^1.9.4",
    "vue": "^2.5.16",
    "vue-template-compiler": "^2.5.16"
  },
  "scripts": {
    "test": "./server.js",
    "build": "parcel build index.js",
    "watch": "parcel watch index.js"
  }
};
},{}],1:[function(require,module,exports) {
'use strict';

var _vue = require('vue/dist/vue.js');

var _vue2 = _interopRequireDefault(_vue);

var _chessboard = require('./chessboard.vue');

var _chessboard2 = _interopRequireDefault(_chessboard);

var _package = require('./package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***************************************************************/

window.greet = function () {
  var who = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "World";

  setTimeout(function () {
    return console.clear();
  }, 1000);
  console.log('Hello, ' + who + '!');
};

// greet()

/***************************************************************/

window.vm = new _vue2.default({
  el: "#app",
  components: { ChessBoard: _chessboard2.default },
  template: '\n      <ChessBoard version="' + _package.version + '" />\n    '
});
window.board = vm.$children[0];
},{"vue/dist/vue.js":7,"./chessboard.vue":3,"./package.json":4}],8:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '46025' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[8,1], null)
//# sourceMappingURL=/index.map