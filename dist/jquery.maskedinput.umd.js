/*!
 * maskedinput.js 1.0.9
 * git://github.com/danielgindi/jquery.maskedinput.git
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(global = global || self, global.MaskedInput = factory(global.jQuery));
}(this, (function ($) { 'use strict';

	$ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	'use strict';
	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode: isPure ? 'pure' : 'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$2();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};
	var internalState_1 = internalState.set;
	var internalState_2 = internalState.get;
	var internalState_3 = internalState.has;
	var internalState_4 = internalState.enforce;
	var internalState_5 = internalState.getterFor;

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};
	var arrayIncludes_1 = arrayIncludes.includes;
	var arrayIncludes_2 = arrayIncludes.indexOf;

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	'use strict';




	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	'use strict';












	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var es_array_concat = {

	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};
	var arrayIteration_1 = arrayIteration.forEach;
	var arrayIteration_2 = arrayIteration.map;
	var arrayIteration_3 = arrayIteration.filter;
	var arrayIteration_4 = arrayIteration.some;
	var arrayIteration_5 = arrayIteration.every;
	var arrayIteration_6 = arrayIteration.find;
	var arrayIteration_7 = arrayIteration.findIndex;

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	'use strict';

	var $find = arrayIteration.find;



	var FIND = 'find';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH = arrayMethodUsesToLength(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var es_array_find = {

	};

	'use strict';


	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	'use strict';
	var $forEach = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	'use strict';



	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var es_array_forEach = {

	};

	'use strict';

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var es_array_indexOf = {

	};

	'use strict';





	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$2 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$2 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var es_array_join = {

	};

	'use strict';

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$3 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var es_array_map = {

	};

	'use strict';











	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$4 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var es_array_slice = {

	};

	'use strict';










	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$5 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var es_array_splice = {

	};

	var defineProperty$1 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$1(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var es_function_name = {

	};

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var es_object_keys = {

	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	'use strict';



	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var es_object_toString = {

	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	'use strict';


	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	'use strict';



	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	'use strict';





	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$2 = objectDefineProperty.f;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;





	var setInternalState = internalState.set;



	var MATCH$1 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;

	var FORCED$1 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$1 || fails(function () {
	  re2[MATCH$1] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$1) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$1) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y$1 && sticky) setInternalState(result, { sticky: sticky });

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$2(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$1 = getOwnPropertyNames(NativeRegExp);
	  var index = 0;
	  while (keys$1.length > index) proxy(keys$1[index++]);
	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var es_regexp_constructor = {

	};

	'use strict';



	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$2 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	'use strict';



	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	var es_regexp_exec = {

	};

	var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

	// `RegExp.prototype.flags` getter
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
	  objectDefineProperty.f(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regexpFlags
	  });
	}

	var es_regexp_flags = {

	};

	'use strict';





	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var nativeToString = RegExpPrototype$1[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var es_regexp_toString = {

	};

	'use strict';
	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$4 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$4] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};
	var stringMultibyte_1 = stringMultibyte.codeAt;
	var stringMultibyte_2 = stringMultibyte.charAt;

	'use strict';
	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	'use strict';







	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var es_string_match = {

	};

	'use strict';









	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$3(min$3(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var es_string_replace = {

	};

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};
	var domIterables_1 = domIterables.CSSRuleList;
	var domIterables_2 = domIterables.CSSStyleDeclaration;
	var domIterables_3 = domIterables.CSSValueList;
	var domIterables_4 = domIterables.ClientRectList;
	var domIterables_5 = domIterables.DOMRectList;
	var domIterables_6 = domIterables.DOMStringList;
	var domIterables_7 = domIterables.DOMTokenList;
	var domIterables_8 = domIterables.DataTransferItemList;
	var domIterables_9 = domIterables.FileList;
	var domIterables_10 = domIterables.HTMLAllCollection;
	var domIterables_11 = domIterables.HTMLCollection;
	var domIterables_12 = domIterables.HTMLFormElement;
	var domIterables_13 = domIterables.HTMLSelectElement;
	var domIterables_14 = domIterables.MediaList;
	var domIterables_15 = domIterables.MimeTypeArray;
	var domIterables_16 = domIterables.NamedNodeMap;
	var domIterables_17 = domIterables.NodeList;
	var domIterables_18 = domIterables.PaintRequestList;
	var domIterables_19 = domIterables.Plugin;
	var domIterables_20 = domIterables.PluginArray;
	var domIterables_21 = domIterables.SVGLengthList;
	var domIterables_22 = domIterables.SVGNumberList;
	var domIterables_23 = domIterables.SVGPathSegList;
	var domIterables_24 = domIterables.SVGPointList;
	var domIterables_25 = domIterables.SVGStringList;
	var domIterables_26 = domIterables.SVGTransformList;
	var domIterables_27 = domIterables.SourceBufferList;
	var domIterables_28 = domIterables.StyleSheetList;
	var domIterables_29 = domIterables.TextTrackCueList;
	var domIterables_30 = domIterables.TextTrackList;
	var domIterables_31 = domIterables.TouchList;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var web_domCollections_forEach = {

	};

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	var REACT_ELEMENT_TYPE;

	function _jsx(type, props, key, children) {
	  if (!REACT_ELEMENT_TYPE) {
	    REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;
	  }

	  var defaultProps = type && type.defaultProps;
	  var childrenLength = arguments.length - 3;

	  if (!props && childrenLength !== 0) {
	    props = {
	      children: void 0
	    };
	  }

	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = new Array(childrenLength);

	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 3];
	    }

	    props.children = childArray;
	  }

	  if (props && defaultProps) {
	    for (var propName in defaultProps) {
	      if (props[propName] === void 0) {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  } else if (!props) {
	    props = defaultProps || {};
	  }

	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key === undefined ? null : '' + key,
	    ref: null,
	    props: props,
	    _owner: null
	  };
	}

	function _asyncIterator(iterable) {
	  var method;

	  if (typeof Symbol !== "undefined") {
	    if (Symbol.asyncIterator) {
	      method = iterable[Symbol.asyncIterator];
	      if (method != null) return method.call(iterable);
	    }

	    if (Symbol.iterator) {
	      method = iterable[Symbol.iterator];
	      if (method != null) return method.call(iterable);
	    }
	  }

	  throw new TypeError("Object is not async iterable");
	}

	function _AwaitValue(value) {
	  this.wrapped = value;
	}

	function _AsyncGenerator(gen) {
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
	      var wrappedAwait = value instanceof _AwaitValue;
	      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
	        if (wrappedAwait) {
	          resume(key === "return" ? "return" : "next", arg);
	          return;
	        }

	        settle(result.done ? "return" : "normal", arg);
	      }, function (err) {
	        resume("throw", err);
	      });
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
	  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
	    return this;
	  };
	}

	_AsyncGenerator.prototype.next = function (arg) {
	  return this._invoke("next", arg);
	};

	_AsyncGenerator.prototype.throw = function (arg) {
	  return this._invoke("throw", arg);
	};

	_AsyncGenerator.prototype.return = function (arg) {
	  return this._invoke("return", arg);
	};

	function _wrapAsyncGenerator(fn) {
	  return function () {
	    return new _AsyncGenerator(fn.apply(this, arguments));
	  };
	}

	function _awaitAsyncGenerator(value) {
	  return new _AwaitValue(value);
	}

	function _asyncGeneratorDelegate(inner, awaitWrap) {
	  var iter = {},
	      waiting = false;

	  function pump(key, value) {
	    waiting = true;
	    value = new Promise(function (resolve) {
	      resolve(inner[key](value));
	    });
	    return {
	      done: false,
	      value: awaitWrap(value)
	    };
	  }

	  ;

	  if (typeof Symbol === "function" && Symbol.iterator) {
	    iter[Symbol.iterator] = function () {
	      return this;
	    };
	  }

	  iter.next = function (value) {
	    if (waiting) {
	      waiting = false;
	      return value;
	    }

	    return pump("next", value);
	  };

	  if (typeof inner.throw === "function") {
	    iter.throw = function (value) {
	      if (waiting) {
	        waiting = false;
	        throw value;
	      }

	      return pump("throw", value);
	    };
	  }

	  if (typeof inner.return === "function") {
	    iter.return = function (value) {
	      if (waiting) {
	        waiting = false;
	        return value;
	      }

	      return pump("return", value);
	    };
	  }

	  return iter;
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
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineEnumerableProperties(obj, descs) {
	  for (var key in descs) {
	    var desc = descs[key];
	    desc.configurable = desc.enumerable = true;
	    if ("value" in desc) desc.writable = true;
	    Object.defineProperty(obj, key, desc);
	  }

	  if (Object.getOwnPropertySymbols) {
	    var objectSymbols = Object.getOwnPropertySymbols(descs);

	    for (var i = 0; i < objectSymbols.length; i++) {
	      var sym = objectSymbols[i];
	      var desc = descs[sym];
	      desc.configurable = desc.enumerable = true;
	      if ("value" in desc) desc.writable = true;
	      Object.defineProperty(obj, sym, desc);
	    }
	  }

	  return obj;
	}

	function _defaults(obj, defaults) {
	  var keys = Object.getOwnPropertyNames(defaults);

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var value = Object.getOwnPropertyDescriptor(defaults, key);

	    if (value && value.configurable && obj[key] === undefined) {
	      Object.defineProperty(obj, key, value);
	    }
	  }

	  return obj;
	}

	function _defineProperty(obj, key, value) {
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

	function _extends() {
	  _extends = Object.assign || function (target) {
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

	  return _extends.apply(this, arguments);
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? Object(arguments[i]) : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
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
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
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
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _instanceof(left, right) {
	  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
	    return !!right[Symbol.hasInstance](left);
	  } else {
	    return left instanceof right;
	  }
	}

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : {
	    default: obj
	  };
	}

	function _getRequireWildcardCache() {
	  if (typeof WeakMap !== "function") return null;
	  var cache = new WeakMap();

	  _getRequireWildcardCache = function () {
	    return cache;
	  };

	  return cache;
	}

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  }

	  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
	    return {
	      default: obj
	    };
	  }

	  var cache = _getRequireWildcardCache();

	  if (cache && cache.has(obj)) {
	    return cache.get(obj);
	  }

	  var newObj = {};
	  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) {
	      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

	      if (desc && (desc.get || desc.set)) {
	        Object.defineProperty(newObj, key, desc);
	      } else {
	        newObj[key] = obj[key];
	      }
	    }
	  }

	  newObj.default = obj;

	  if (cache) {
	    cache.set(obj, newObj);
	  }

	  return newObj;
	}

	function _newArrowCheck(innerThis, boundThis) {
	  if (innerThis !== boundThis) {
	    throw new TypeError("Cannot instantiate an arrow function");
	  }
	}

	function _objectDestructuringEmpty(obj) {
	  if (obj == null) throw new TypeError("Cannot destructure undefined");
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};

	  var target = _objectWithoutPropertiesLoose(source, excluded);

	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
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
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function () {
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

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	function set$1(target, property, value, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.set) {
	    set$1 = Reflect.set;
	  } else {
	    set$1 = function set(target, property, value, receiver) {
	      var base = _superPropBase(target, property);

	      var desc;

	      if (base) {
	        desc = Object.getOwnPropertyDescriptor(base, property);

	        if (desc.set) {
	          desc.set.call(receiver, value);
	          return true;
	        } else if (!desc.writable) {
	          return false;
	        }
	      }

	      desc = Object.getOwnPropertyDescriptor(receiver, property);

	      if (desc) {
	        if (!desc.writable) {
	          return false;
	        }

	        desc.value = value;
	        Object.defineProperty(receiver, property, desc);
	      } else {
	        _defineProperty(receiver, property, value);
	      }

	      return true;
	    };
	  }

	  return set$1(target, property, value, receiver);
	}

	function _set(target, property, value, receiver, isStrict) {
	  var s = set$1(target, property, value, receiver || target);

	  if (!s && isStrict) {
	    throw new Error('failed to set property');
	  }

	  return value;
	}

	function _taggedTemplateLiteral(strings, raw) {
	  if (!raw) {
	    raw = strings.slice(0);
	  }

	  return Object.freeze(Object.defineProperties(strings, {
	    raw: {
	      value: Object.freeze(raw)
	    }
	  }));
	}

	function _taggedTemplateLiteralLoose(strings, raw) {
	  if (!raw) {
	    raw = strings.slice(0);
	  }

	  strings.raw = raw;
	  return strings;
	}

	function _readOnlyError(name) {
	  throw new Error("\"" + name + "\" is read-only");
	}

	function _classNameTDZError(name) {
	  throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
	}

	function _temporalUndefined() {}

	function _tdz(name) {
	  throw new ReferenceError(name + " is not defined - temporal dead zone");
	}

	function _temporalRef(val, name) {
	  return val === _temporalUndefined ? _tdz(name) : val;
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _slicedToArrayLoose(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _toArray(arr) {
	  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _iterableToArrayLimitLoose(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];

	  for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
	    _arr.push(_step.value);

	    if (i && _arr.length === i) break;
	  }

	  return _arr;
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

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o) {
	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
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

	  var it,
	      normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
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

	function _createForOfIteratorHelperLoose(o) {
	  var i = 0;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () {
	      if (i >= o.length) return {
	        done: true
	      };
	      return {
	        done: false,
	        value: o[i++]
	      };
	    };
	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  i = o[Symbol.iterator]();
	  return i.next.bind(i);
	}

	function _skipFirstGeneratorNext(fn) {
	  return function () {
	    var it = fn.apply(this, arguments);
	    it.next();
	    return it;
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

	function _initializerWarningHelper(descriptor, context) {
	  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
	}

	function _initializerDefineProperty(target, property, descriptor, context) {
	  if (!descriptor) return;
	  Object.defineProperty(target, property, {
	    enumerable: descriptor.enumerable,
	    configurable: descriptor.configurable,
	    writable: descriptor.writable,
	    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	  });
	}

	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object.keys(descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;

	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }

	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);

	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }

	  if (desc.initializer === void 0) {
	    Object.defineProperty(target, property, desc);
	    desc = null;
	  }

	  return desc;
	}

	var id$1 = 0;

	function _classPrivateFieldLooseKey(name) {
	  return "__private_" + id$1++ + "_" + name;
	}

	function _classPrivateFieldLooseBase(receiver, privateKey) {
	  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
	    throw new TypeError("attempted to use private field on non-instance");
	  }

	  return receiver;
	}

	function _classPrivateFieldGet(receiver, privateMap) {
	  var descriptor = privateMap.get(receiver);

	  if (!descriptor) {
	    throw new TypeError("attempted to get private field on non-instance");
	  }

	  if (descriptor.get) {
	    return descriptor.get.call(receiver);
	  }

	  return descriptor.value;
	}

	function _classPrivateFieldSet(receiver, privateMap, value) {
	  var descriptor = privateMap.get(receiver);

	  if (!descriptor) {
	    throw new TypeError("attempted to set private field on non-instance");
	  }

	  if (descriptor.set) {
	    descriptor.set.call(receiver, value);
	  } else {
	    if (!descriptor.writable) {
	      throw new TypeError("attempted to set read only private field");
	    }

	    descriptor.value = value;
	  }

	  return value;
	}

	function _classPrivateFieldDestructureSet(receiver, privateMap) {
	  if (!privateMap.has(receiver)) {
	    throw new TypeError("attempted to set private field on non-instance");
	  }

	  var descriptor = privateMap.get(receiver);

	  if (descriptor.set) {
	    if (!("__destrObj" in descriptor)) {
	      descriptor.__destrObj = {
	        set value(v) {
	          descriptor.set.call(receiver, v);
	        }

	      };
	    }

	    return descriptor.__destrObj;
	  } else {
	    if (!descriptor.writable) {
	      throw new TypeError("attempted to set read only private field");
	    }

	    return descriptor;
	  }
	}

	function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
	  if (receiver !== classConstructor) {
	    throw new TypeError("Private static access of wrong provenance");
	  }

	  if (descriptor.get) {
	    return descriptor.get.call(receiver);
	  }

	  return descriptor.value;
	}

	function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
	  if (receiver !== classConstructor) {
	    throw new TypeError("Private static access of wrong provenance");
	  }

	  if (descriptor.set) {
	    descriptor.set.call(receiver, value);
	  } else {
	    if (!descriptor.writable) {
	      throw new TypeError("attempted to set read only private field");
	    }

	    descriptor.value = value;
	  }

	  return value;
	}

	function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
	  if (receiver !== classConstructor) {
	    throw new TypeError("Private static access of wrong provenance");
	  }

	  return method;
	}

	function _classStaticPrivateMethodSet() {
	  throw new TypeError("attempted to set read only static private field");
	}

	function _decorate(decorators, factory, superClass, mixins) {
	  var api = _getDecoratorsApi();

	  if (mixins) {
	    for (var i = 0; i < mixins.length; i++) {
	      api = mixins[i](api);
	    }
	  }

	  var r = factory(function initialize(O) {
	    api.initializeInstanceElements(O, decorated.elements);
	  }, superClass);
	  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
	  api.initializeClassElements(r.F, decorated.elements);
	  return api.runClassFinishers(r.F, decorated.finishers);
	}

	function _getDecoratorsApi() {
	  _getDecoratorsApi = function () {
	    return api;
	  };

	  var api = {
	    elementsDefinitionOrder: [["method"], ["field"]],
	    initializeInstanceElements: function (O, elements) {
	      ["method", "field"].forEach(function (kind) {
	        elements.forEach(function (element) {
	          if (element.kind === kind && element.placement === "own") {
	            this.defineClassElement(O, element);
	          }
	        }, this);
	      }, this);
	    },
	    initializeClassElements: function (F, elements) {
	      var proto = F.prototype;
	      ["method", "field"].forEach(function (kind) {
	        elements.forEach(function (element) {
	          var placement = element.placement;

	          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
	            var receiver = placement === "static" ? F : proto;
	            this.defineClassElement(receiver, element);
	          }
	        }, this);
	      }, this);
	    },
	    defineClassElement: function (receiver, element) {
	      var descriptor = element.descriptor;

	      if (element.kind === "field") {
	        var initializer = element.initializer;
	        descriptor = {
	          enumerable: descriptor.enumerable,
	          writable: descriptor.writable,
	          configurable: descriptor.configurable,
	          value: initializer === void 0 ? void 0 : initializer.call(receiver)
	        };
	      }

	      Object.defineProperty(receiver, element.key, descriptor);
	    },
	    decorateClass: function (elements, decorators) {
	      var newElements = [];
	      var finishers = [];
	      var placements = {
	        static: [],
	        prototype: [],
	        own: []
	      };
	      elements.forEach(function (element) {
	        this.addElementPlacement(element, placements);
	      }, this);
	      elements.forEach(function (element) {
	        if (!_hasDecorators(element)) return newElements.push(element);
	        var elementFinishersExtras = this.decorateElement(element, placements);
	        newElements.push(elementFinishersExtras.element);
	        newElements.push.apply(newElements, elementFinishersExtras.extras);
	        finishers.push.apply(finishers, elementFinishersExtras.finishers);
	      }, this);

	      if (!decorators) {
	        return {
	          elements: newElements,
	          finishers: finishers
	        };
	      }

	      var result = this.decorateConstructor(newElements, decorators);
	      finishers.push.apply(finishers, result.finishers);
	      result.finishers = finishers;
	      return result;
	    },
	    addElementPlacement: function (element, placements, silent) {
	      var keys = placements[element.placement];

	      if (!silent && keys.indexOf(element.key) !== -1) {
	        throw new TypeError("Duplicated element (" + element.key + ")");
	      }

	      keys.push(element.key);
	    },
	    decorateElement: function (element, placements) {
	      var extras = [];
	      var finishers = [];

	      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
	        var keys = placements[element.placement];
	        keys.splice(keys.indexOf(element.key), 1);
	        var elementObject = this.fromElementDescriptor(element);
	        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
	        element = elementFinisherExtras.element;
	        this.addElementPlacement(element, placements);

	        if (elementFinisherExtras.finisher) {
	          finishers.push(elementFinisherExtras.finisher);
	        }

	        var newExtras = elementFinisherExtras.extras;

	        if (newExtras) {
	          for (var j = 0; j < newExtras.length; j++) {
	            this.addElementPlacement(newExtras[j], placements);
	          }

	          extras.push.apply(extras, newExtras);
	        }
	      }

	      return {
	        element: element,
	        finishers: finishers,
	        extras: extras
	      };
	    },
	    decorateConstructor: function (elements, decorators) {
	      var finishers = [];

	      for (var i = decorators.length - 1; i >= 0; i--) {
	        var obj = this.fromClassDescriptor(elements);
	        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

	        if (elementsAndFinisher.finisher !== undefined) {
	          finishers.push(elementsAndFinisher.finisher);
	        }

	        if (elementsAndFinisher.elements !== undefined) {
	          elements = elementsAndFinisher.elements;

	          for (var j = 0; j < elements.length - 1; j++) {
	            for (var k = j + 1; k < elements.length; k++) {
	              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
	                throw new TypeError("Duplicated element (" + elements[j].key + ")");
	              }
	            }
	          }
	        }
	      }

	      return {
	        elements: elements,
	        finishers: finishers
	      };
	    },
	    fromElementDescriptor: function (element) {
	      var obj = {
	        kind: element.kind,
	        key: element.key,
	        placement: element.placement,
	        descriptor: element.descriptor
	      };
	      var desc = {
	        value: "Descriptor",
	        configurable: true
	      };
	      Object.defineProperty(obj, Symbol.toStringTag, desc);
	      if (element.kind === "field") obj.initializer = element.initializer;
	      return obj;
	    },
	    toElementDescriptors: function (elementObjects) {
	      if (elementObjects === undefined) return;
	      return _toArray(elementObjects).map(function (elementObject) {
	        var element = this.toElementDescriptor(elementObject);
	        this.disallowProperty(elementObject, "finisher", "An element descriptor");
	        this.disallowProperty(elementObject, "extras", "An element descriptor");
	        return element;
	      }, this);
	    },
	    toElementDescriptor: function (elementObject) {
	      var kind = String(elementObject.kind);

	      if (kind !== "method" && kind !== "field") {
	        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
	      }

	      var key = _toPropertyKey(elementObject.key);

	      var placement = String(elementObject.placement);

	      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
	        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
	      }

	      var descriptor = elementObject.descriptor;
	      this.disallowProperty(elementObject, "elements", "An element descriptor");
	      var element = {
	        kind: kind,
	        key: key,
	        placement: placement,
	        descriptor: Object.assign({}, descriptor)
	      };

	      if (kind !== "field") {
	        this.disallowProperty(elementObject, "initializer", "A method descriptor");
	      } else {
	        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
	        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
	        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
	        element.initializer = elementObject.initializer;
	      }

	      return element;
	    },
	    toElementFinisherExtras: function (elementObject) {
	      var element = this.toElementDescriptor(elementObject);

	      var finisher = _optionalCallableProperty(elementObject, "finisher");

	      var extras = this.toElementDescriptors(elementObject.extras);
	      return {
	        element: element,
	        finisher: finisher,
	        extras: extras
	      };
	    },
	    fromClassDescriptor: function (elements) {
	      var obj = {
	        kind: "class",
	        elements: elements.map(this.fromElementDescriptor, this)
	      };
	      var desc = {
	        value: "Descriptor",
	        configurable: true
	      };
	      Object.defineProperty(obj, Symbol.toStringTag, desc);
	      return obj;
	    },
	    toClassDescriptor: function (obj) {
	      var kind = String(obj.kind);

	      if (kind !== "class") {
	        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
	      }

	      this.disallowProperty(obj, "key", "A class descriptor");
	      this.disallowProperty(obj, "placement", "A class descriptor");
	      this.disallowProperty(obj, "descriptor", "A class descriptor");
	      this.disallowProperty(obj, "initializer", "A class descriptor");
	      this.disallowProperty(obj, "extras", "A class descriptor");

	      var finisher = _optionalCallableProperty(obj, "finisher");

	      var elements = this.toElementDescriptors(obj.elements);
	      return {
	        elements: elements,
	        finisher: finisher
	      };
	    },
	    runClassFinishers: function (constructor, finishers) {
	      for (var i = 0; i < finishers.length; i++) {
	        var newConstructor = (0, finishers[i])(constructor);

	        if (newConstructor !== undefined) {
	          if (typeof newConstructor !== "function") {
	            throw new TypeError("Finishers must return a constructor.");
	          }

	          constructor = newConstructor;
	        }
	      }

	      return constructor;
	    },
	    disallowProperty: function (obj, name, objectType) {
	      if (obj[name] !== undefined) {
	        throw new TypeError(objectType + " can't have a ." + name + " property.");
	      }
	    }
	  };
	  return api;
	}

	function _createElementDescriptor(def) {
	  var key = _toPropertyKey(def.key);

	  var descriptor;

	  if (def.kind === "method") {
	    descriptor = {
	      value: def.value,
	      writable: true,
	      configurable: true,
	      enumerable: false
	    };
	  } else if (def.kind === "get") {
	    descriptor = {
	      get: def.value,
	      configurable: true,
	      enumerable: false
	    };
	  } else if (def.kind === "set") {
	    descriptor = {
	      set: def.value,
	      configurable: true,
	      enumerable: false
	    };
	  } else if (def.kind === "field") {
	    descriptor = {
	      configurable: true,
	      writable: true,
	      enumerable: true
	    };
	  }

	  var element = {
	    kind: def.kind === "field" ? "field" : "method",
	    key: key,
	    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
	    descriptor: descriptor
	  };
	  if (def.decorators) element.decorators = def.decorators;
	  if (def.kind === "field") element.initializer = def.value;
	  return element;
	}

	function _coalesceGetterSetter(element, other) {
	  if (element.descriptor.get !== undefined) {
	    other.descriptor.get = element.descriptor.get;
	  } else {
	    other.descriptor.set = element.descriptor.set;
	  }
	}

	function _coalesceClassElements(elements) {
	  var newElements = [];

	  var isSameElement = function (other) {
	    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
	  };

	  for (var i = 0; i < elements.length; i++) {
	    var element = elements[i];
	    var other;

	    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
	      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
	        if (_hasDecorators(element) || _hasDecorators(other)) {
	          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
	        }

	        other.descriptor = element.descriptor;
	      } else {
	        if (_hasDecorators(element)) {
	          if (_hasDecorators(other)) {
	            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
	          }

	          other.decorators = element.decorators;
	        }

	        _coalesceGetterSetter(element, other);
	      }
	    } else {
	      newElements.push(element);
	    }
	  }

	  return newElements;
	}

	function _hasDecorators(element) {
	  return element.decorators && element.decorators.length;
	}

	function _isDataDescriptor(desc) {
	  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
	}

	function _optionalCallableProperty(obj, name) {
	  var value = obj[name];

	  if (value !== undefined && typeof value !== "function") {
	    throw new TypeError("Expected '" + name + "' to be a function");
	  }

	  return value;
	}

	function _classPrivateMethodGet(receiver, privateSet, fn) {
	  if (!privateSet.has(receiver)) {
	    throw new TypeError("attempted to get private field on non-instance");
	  }

	  return fn;
	}

	function _classPrivateMethodSet() {
	  throw new TypeError("attempted to reassign private method");
	}

	function _wrapRegExp(re, groups) {
	  _wrapRegExp = function (re, groups) {
	    return new BabelRegExp(re, undefined, groups);
	  };

	  var _RegExp = _wrapNativeSuper(RegExp);

	  var _super = RegExp.prototype;

	  var _groups = new WeakMap();

	  function BabelRegExp(re, flags, groups) {
	    var _this = _RegExp.call(this, re, flags);

	    _groups.set(_this, groups || _groups.get(re));

	    return _this;
	  }

	  _inherits(BabelRegExp, _RegExp);

	  BabelRegExp.prototype.exec = function (str) {
	    var result = _super.exec.call(this, str);

	    if (result) result.groups = buildGroups(result, this);
	    return result;
	  };

	  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
	    if (typeof substitution === "string") {
	      var groups = _groups.get(this);

	      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
	        return "$" + groups[name];
	      }));
	    } else if (typeof substitution === "function") {
	      var _this = this;

	      return _super[Symbol.replace].call(this, str, function () {
	        var args = [];
	        args.push.apply(args, arguments);

	        if (typeof args[args.length - 1] !== "object") {
	          args.push(buildGroups(args, _this));
	        }

	        return substitution.apply(this, args);
	      });
	    } else {
	      return _super[Symbol.replace].call(this, str, substitution);
	    }
	  };

	  function buildGroups(result, re) {
	    var g = _groups.get(re);

	    return Object.keys(g).reduce(function (groups, name) {
	      groups[name] = result[g[name]];
	      return groups;
	    }, Object.create(null));
	  }

	  return _wrapRegExp.apply(this, arguments);
	}

	'use strict';
	/**
	                         * @typedef {String} MaskedInput~PartType
	                         * @name MaskedInput~PartType
	                         * @enum {String}
	                         */
	var PartType = {
	  /** @const */NUMBER: 'number',
	  /** @const */TEXT: 'text',
	  /** @const */LABEL: 'label' };


	/**
	                                  * @typedef {Object} MaskedInput~Part
	                                  * @property {MaskedInput~PartType} [type] - Type of the field
	                                  * @property {String|undefined} [name] - Name for this field
	                                  * @property {String|undefined} [ariaLabel] - An ARIA accessibility label
	                                  * @property {String|undefined} [text] - Text for this field if it's a LABEL
	                                  * @property {String|undefined} [placeholder] - Placeholder for the field
	                                  * @property {Number} [length] - Length of the field
	                                  * @property {Number} [maxLength] - Maximum length of the field
	                                  * @property {Number|undefined} [numericMin] - Minimum numeric value
	                                  * @property {Number|undefined} [numericMax] - Maximum numeric value
	                                  * @property {Boolean|undefined} [wholeNumber] - Force the number to be whole? (default `false`)
	                                  * @property {RegExp|String|function(value:String)|undefined} [validator] - Validator regex or function
	                                  * @property {String[]|undefined} [options] - Options to choose from for textual field
	                                  * @property {function(value,part:MaskedInput~Part)|undefined} [postProcess] - Function for post processing a value before retrieving by user
	                                  * @property {Boolean|Number|undefined} [padding] - Enable padding in value result (default `true`)
	                                  * @property {Boolean|undefined} [required] - Is the field required (default `true`)
	                                  * @property {String|undefined} [defaultValue] - Default value, used if field is not `required`
	                                  * @property {Boolean|undefined} [forcePlaceholderWidth] - Always consider placeholder's width (default `true`)
	                                  */

	/**
	                                      * @typedef {Object} MaskedInput~Pattern
	                                      * @property {RegExp|String} [pattern] - Pattern to recognize in the format
	                                      * @property {MaskedInput~PartType} [type] - Type of the field
	                                      * @property {String|undefined} [name] - Name for this field
	                                      * @property {String|undefined} [ariaLabel] - An ARIA accessibility label
	                                      * @property {String|function(match):String|undefined} [text] - Text for this field if it's a LABEL
	                                      * @property {String|function(match):String|undefined} [placeholder] - Placeholder for the field
	                                      * @property {Number|function(match):Number} [length] - Length of the field
	                                      * @property {Number|function(match):Number} [maxLength] - Maximum length of the field
	                                      * @property {Number|function(match):Number|undefined} [numericMin] - Minimum numeric value
	                                      * @property {Number|function(match):Number|undefined} [numericMax] - Maximum numeric value
	                                      * @property {Boolean|undefined} [wholeNumber] - Force the number to be whole? (default `false`)
	                                      * @property {RegExp|String|function(value:String)|undefined} [validator] - Validator regex or function
	                                      * @property {String[]|function(match):String[]|undefined} [options] - Options to choose from for textual field
	                                      * @property {function(value,part:MaskedInput~Part)|undefined} [postProcess] - Function for post processing a value before retrieving by user
	                                      * @property {Boolean|Number|function(match):(Boolean|Number)|undefined} [padding] - Enable padding in value result (default `true`)
	                                      * @property {Boolean|function(match):Boolean|undefined} [required] - Is the field required (default `true`)
	                                      * @property {String|function(match):String|undefined} [defaultValue] - Default value, used if field is not `required`
	                                      * @property {Boolean|function(match):Boolean|undefined} [forcePlaceholderWidth] - Always consider placeholder's width (default `true`)
	                                      */

	/**
	                                          * @typedef {Object} MaskedInput~Options
	                                          * @property {String} [format] - Format to show
	                                          * @property {Object<String, MaskedInput~Pattern>} [patterns] - Additional patterns to recognize in the format
	                                          */
	var defaults = /** @type {MaskedInput.Options} */{
	  patterns: {} };


	var execRegexWithLeftovers = function execRegexWithLeftovers(regex, input, onMatch, onLeftover) {

	  var match,lastIndex = 0;
	  regex.lastIndex = 0;
	  while (match = regex.exec(input)) {

	    // Add skipped raw text
	    if (match.index > lastIndex) {
	      onLeftover(input.substring(lastIndex, match.index));
	    }

	    onMatch(match);

	    lastIndex = regex.lastIndex;
	  }

	  // Add remaining text
	  if (input.length > lastIndex) {
	    onLeftover(input.substring(lastIndex, input.length));
	  }

	};

	/**
	    * Get the selection range in an element
	    * @param {HTMLInputElement} el
	    * @returns {{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}}
	    */
	var getSelectionRange = function getSelectionRange(el) {
	  var begin,end,direction = 'none';

	  if (el.setSelectionRange) {

	    begin = el.selectionStart;
	    end = el.selectionEnd;
	    direction = el.selectionDirection;

	  } else if (document.selection && document.selection.createRange) {

	    var range = document.selection.createRange();
	    begin = 0 - range.duplicate().moveStart('character', -10000);
	    end = begin + range.text.length;
	  }

	  return {
	    begin: begin,
	    end: end,
	    direction: direction };

	};

	/**
	    * Set the selection range in an element
	    * @param {HTMLInputElement} el
	    * @param {Number|{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}} begin
	    * @param {Number?} end
	    * @param {('forward'|'backward'|'none')?} direction
	    */
	var setSelectionRange = function setSelectionRange(el, begin, end, direction) {

	  if (_typeof(arguments[1]) === 'object' && 'begin' in arguments[1]) {
	    begin = arguments[1].begin;
	    end = arguments[1].end;
	    direction = arguments[1].direction;
	  }

	  if (direction === undefined) {
	    if (typeof arguments[2] === 'string' && (
	    arguments[2] === 'forward' || arguments[2] === 'backward' || arguments[2] === 'none')) {
	      direction = arguments[2];
	      end = null;
	    }
	  }

	  end = end == null ? begin : end;

	  if (el.setSelectionRange) {
	    el.setSelectionRange(begin, end, direction);

	  } else {
	    if (el.createTextRange) {
	      var range = el.createTextRange();
	      range.collapse(true);
	      range.moveEnd('character', end);
	      range.moveStart('character', begin);
	      range.select();
	    }
	  }

	};

	var repeatChar = function repeatChar(char, length) {
	  var out = '';
	  for (var i = 0; i < length; i++) {
	    out += char;
	  }
	  return out;
	};

	/**
	    * @param {String[]} options
	    * @param {String} term
	    * @param {Boolean?} closestChoice
	    * @param {Boolean?} returnFullMatch
	    * @param {Boolean?} caseSensitive
	    * @returns {String|undefined}
	    */
	var findMatchInArray = function findMatchInArray(options, term, closestChoice, returnFullMatch, caseSensitive) {

	  var i, option, optionLower;
	  var termLower = caseSensitive ? term : term.toLowerCase();

	  if (closestChoice) {
	    // Search for a partial option or partial content match, return the longest match found, or `false`

	    var maxMatchLength = 0;
	    var maxMatchOption;
	    var maxMatchFullOption;

	    for (i = 0; i < options.length; i++) {
	      option = options[i];
	      optionLower = caseSensitive ? option : option.toLowerCase();

	      for (var clen = Math.min(option.length, 1); clen <= term.length; clen++) {
	        if (option.length >= clen &&
	        optionLower.substr(0, clen) === termLower.substr(0, clen)) {
	          if (clen > maxMatchLength) {
	            maxMatchLength = clen;
	            maxMatchOption = option.substr(0, clen);
	            maxMatchFullOption = option;
	          }
	        } else {
	          break;
	        }
	      }
	    }

	    return returnFullMatch ? maxMatchFullOption : maxMatchOption;

	  } else {

	    // Search for an exact match or option "starts with" the content - all case insensitive
	    for (i = 0; i < options.length; i++) {
	      option = options[i];
	      optionLower = caseSensitive ? option : option.toLowerCase();

	      if (option.length >= term.length &&
	      optionLower.substr(0, term.length) === termLower)
	      return returnFullMatch ? option : true;
	    }
	  }
	};

	/**
	    * Regex escape
	    * @param {String} str
	    * @returns {XML|void|string}
	    */
	var escapeRegExp = function escapeRegExp(str) {
	  return str.replace(/[-[\]/{}()*+?.\\$|]/g, '\\$&');
	};
	/**
	    * Search for closest element to a specified point
	    * @param {HTMLElement[]} elements
	    * @param {{left: Number, top: Number }} offset
	    * @returns {HTMLElement|null}
	    */
	var closestToOffset = function closestToOffset(elements, offset) {
	  var x = offset.left,
	  y = offset.top;
	  var bestMatch = null,
	  minDistance = null;

	  for (var i = 0; i < elements.length; i++) {
	    var el = elements[i],$el = $(el);
	    var elOffset = $el.offset();

	    elOffset.right = elOffset.left + $el.outerWidth();
	    elOffset.bottom = elOffset.top + $el.outerHeight();

	    if (
	    x >= elOffset.left && x <= elOffset.right &&
	    y >= elOffset.top && y <= elOffset.bottom)
	    {
	      return el;
	    }

	    var offsets = [
	    [elOffset.left, elOffset.top],
	    [elOffset.right, elOffset.top],
	    [elOffset.left, elOffset.bottom],
	    [elOffset.right, elOffset.bottom]];


	    for (var o = 0; o < 4; o++) {
	      var _offset = offsets[o];
	      var dx = _offset[0] - x;
	      var dy = _offset[1] - y;
	      var distance = Math.sqrt(dx * dx + dy * dy);

	      if (minDistance == null || distance < minDistance) {
	        minDistance = distance;
	        bestMatch = el;
	      }
	    }
	  }

	  return bestMatch;
	};

	var callFunctor = function callFunctor(functor, bind, _arg1) {
	  return typeof functor === 'function' ?
	  functor.apply(bind, Array.prototype.slice.call(arguments, 2)) :
	  functor;
	};

	var inputBackbufferCssProps = [
	'font-family',
	'font-size',
	'font-weight',
	'font-size',
	'letter-spacing',
	'text-transform',
	'word-spacing',
	'text-indent',
	'box-sizing',
	'padding-left',
	'padding-right'];


	var hasComputedStyle = document.defaultView && document.defaultView.getComputedStyle;

	/**
	                                                                                       * Gets the precise content width for an element, with fractions
	                                                                                       * @param {Element} el
	                                                                                       * @returns {Number}
	                                                                                       */
	var getPreciseContentWidth = function getPreciseContentWidth(el) {

	  var style = hasComputedStyle ? document.defaultView.getComputedStyle(el) : el.currentStyle;
	  var width = parseFloat(style['width']) || 0;

	  if (style['boxSizing'] === 'border-box') {
	    width -= parseFloat(style['paddingLeft']) || 0;
	    width -= parseFloat(style['paddingRight']) || 0;
	    width -= parseFloat(style['borderLeftWidth']) || 0;
	    width -= parseFloat(style['borderRightWidth']) || 0;

	    if (width < 0) {
	      width = 0;
	    }
	  }

	  return width;
	};

	var FOCUSABLES = [
	'a[href]',
	'area[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'button:not([disabled])',
	'iframe',
	'object',
	'embed',
	'*[tabindex]',
	'*[contenteditable]'];


	var FOCUSABLE_SELECTOR = FOCUSABLES.join(',');
	var TABBABLE_SELECTOR = FOCUSABLES.map(function (x) {return x + ':not([tabindex=-1])';}).join(',');

	var KEY_ENTER = 13;
	var KEY_ARROW_UP = 38;
	var KEY_ARROW_DOWN = 40;
	var KEY_ARROW_LEFT = 37;
	var KEY_ARROW_RIGHT = 39;

	/** @class MaskedInput */var 
	MaskedInput = /*#__PURE__*/function () {
	  /**
	                                         * @param {MaskedInput.Options?} options
	                                         * @returns {MaskedInput}
	                                         */
	  function MaskedInput(options) {var _this = this;_classCallCheck(this, MaskedInput);
	    /** @private */
	    var o = this.o = $.extend({}, MaskedInput.defaults, options);

	    var patterns = {};
	    MaskedInput.patternAddons.forEach(function (addon) {
	      patterns = $.extend(patterns, addon);
	    });
	    patterns = $.extend(patterns, o.patterns);
	    o.patterns = patterns;

	    /** This is for encapsulating private data */
	    var p = this.p = {};

	    p.enabled = true;
	    p.inputs = [];

	    /** @public */
	    var $el = this.$el = $('<div>').addClass(o.className || 'masked-input');

	    /** @public */
	    this.el = this.$el[0];

	    // Set control data
	    $el.
	    data('control', this).
	    data('maskedinput', this);

	    // Parse format
	    p.parsed = this._parseFormat(o.format);

	    // Create backbuffer for input
	    p.$inputBackBuffer = $('<span aria-hidden="true" style="position:absolute;z-index:-1;left:0;top:-9999px;white-space:pre;"/>');

	    // Hook up click event
	    $el.on('click', function (event) {
	      if (event.target !== event.currentTarget &&
	      $(event.target).is(FOCUSABLE_SELECTOR)) return;

	      var offset = $(event.currentTarget).offset();
	      offset.left += event.offsetX;
	      offset.top += event.offsetY;

	      var el = closestToOffset($el.children(FOCUSABLE_SELECTOR), offset);

	      if (el) {
	        el.focus();
	      }
	    });

	    this.render();

	    setTimeout(function () {
	      if (_this.el && _this.el.parentNode) {
	        _this.resize();
	      }
	    }, 0);

	    return this;
	  }

	  /**
	     *
	     * @private
	     * @param format
	     * @returns {MaskedInput~Part[]}
	     */_createClass(MaskedInput, [{ key: "_parseFormat", value: function _parseFormat(
	    format) {
	      var o = this.o;

	      var parsedFormat = [];

	      // Loop through basic format matches

	      execRegexWithLeftovers(FORMAT_REGEX, format, function onMatch(match) {

	        var numericMatch = match[1] || match[2];
	        var textMatch = match[3];
	        var quotedMatch = match[4];

	        var i, part;

	        if (numericMatch) {
	          part = { type: PartType.NUMBER };
	          i = numericMatch.indexOf(':');

	          if (i > -1) {
	            part.length = i;
	            part.name = numericMatch.substr(i + 1);
	          } else {
	            part.length = numericMatch.length;
	          }

	          if (match[2]) {// max length
	            part.maxLength = part.length;
	            part.length = 0;
	          }

	          parsedFormat.push(part);
	        } else if (textMatch) {
	          part = { type: PartType.TEXT };
	          if (textMatch[0] === '*') {
	            part.length = 0;
	          } else {
	            i = textMatch.indexOf(':');

	            if (i > -1) {
	              part.length = i;
	              part.name = textMatch.substr(i + 1);
	            } else {
	              part.length = textMatch.length;
	            }
	          }
	          parsedFormat.push(part);
	        } else if (quotedMatch) {
	          var labelText = quotedMatch.substr(1, quotedMatch.length - 2);
	          part = {
	            type: PartType.LABEL,
	            text: labelText,
	            length: labelText.length };

	          parsedFormat.push(part);
	        }

	      }.bind(this), function onLeftover(leftover) {var _this2 = this;

	        var leftoverParts = [];

	        var part = {
	          type: PartType.LABEL,
	          text: leftover,
	          length: leftover.length };

	        leftoverParts.push(part);

	        Object.keys(o.patterns).forEach(function (key) {
	          var patterns = o.patterns[key];

	          var regex = new RegExp(
	          patterns.pattern instanceof RegExp ?
	          patterns.pattern.source :
	          patterns.pattern,
	          patterns.pattern instanceof RegExp ?
	          patterns.pattern.flags + (patterns.pattern.flags.indexOf('g') > -1 ? '' : 'g') :
	          'g');var _loop = function _loop(_fpos) {



	            var fpart = leftoverParts[_fpos];
	            if (fpart.type !== PartType.LABEL) {fpos = _fpos;return "continue";}

	            var newParts = [];

	            execRegexWithLeftovers(regex, fpart.text, function onMatch(match) {

	              var validator;
	              if (patterns.validator instanceof RegExp || typeof patterns.validator === 'function') {
	                validator = patterns.validator;
	              } else if (typeof patterns.validator === 'string') {
	                try {
	                  validator = new RegExp(patterns.validator);
	                } catch (ignored) {/* nothing to do */}
	              }

	              // Translate the part
	              var part = {
	                type: callFunctor(patterns.type, this, match[0]),
	                name: callFunctor(patterns.name, this, match[0]),
	                ariaLabel: callFunctor(patterns.ariaLabel, this, match[0]),
	                text: callFunctor(patterns.text, this, match[0]),
	                placeholder: callFunctor(patterns.placeholder, this, match[0]),
	                length: callFunctor(patterns.length, this, match[0]) || 0,
	                maxLength: callFunctor(patterns.maxLength, this, match[0]) || 0,
	                numericMin: callFunctor(patterns.numericMin, this, match[0]),
	                numericMax: callFunctor(patterns.numericMax, this, match[0]),
	                wholeNumber: callFunctor(patterns.wholeNumber, this, match[0]),
	                validator: validator,
	                options: callFunctor(patterns.options, this, match[0]),
	                postProcess: patterns.postProcess,
	                padding: callFunctor(patterns.padding, this, match[0]),
	                required: callFunctor(patterns.required, this, match[0]),
	                defaultValue: callFunctor(patterns.defaultValue, this, match[0]),
	                forcePlaceholderWidth: callFunctor(patterns.forcePlaceholderWidth, this, match[0]) };

	              //noinspection JSReferencingMutableVariableFromClosure
	              newParts.push(part);

	            }.bind(_this2), function onLeftover(leftover) {
	              var part = {
	                type: PartType.LABEL,
	                text: leftover,
	                length: leftover.length };

	              //noinspection JSReferencingMutableVariableFromClosure
	              newParts.push(part);
	            }.bind(_this2));

	            // Replace old label with new parts
	            Array.prototype.splice.apply(leftoverParts, [_fpos, 1].concat(newParts));

	            // Move leftoverParts position as necessary
	            _fpos += newParts.length - 1;fpos = _fpos;};for (var fpos = 0; fpos < leftoverParts.length; fpos++) {var _ret = _loop(fpos);if (_ret === "continue") continue;
	          }

	        });

	        parsedFormat = parsedFormat.concat(leftoverParts);
	      }.bind(this));

	      return parsedFormat;
	    } }, { key: "render", value: function render()

	    {var _this3 = this;
	      var p = this.p;

	      this.$el.empty();

	      var inputs = [];

	      p.parsed.forEach(function (part) {
	        if (part.type === PartType.LABEL) {
	          var $el = _this3._renderText(part).appendTo(_this3.$el);
	          part.$el = $el;
	          part.el = $el[0];
	          return;
	        }

	        var $input = _this3._renderInput(part).appendTo(_this3.$el);

	        part.$el = $input;
	        part.el = $input[0];

	        inputs.push($input);

	        if (part.name && parseInt(part.name, 10).toString() !== part.name) {
	          inputs[part.name] = (inputs[part.name] || []).concat(part.el);
	        }
	      });

	      p.inputs = inputs;

	      this.resize();

	      return this;
	    }

	    /**
	       *
	       * @private
	       * @param {MaskedInput~Part} part
	       * @param {HTMLInputElement?} input
	       * @returns {jQuery}
	       */ }, { key: "_renderInput", value: function _renderInput(
	    part, input) {var _this4 = this;
	      var p = this.p;

	      var isNewInput = !input;

	      var $input;

	      if (isNewInput) {
	        $input = $('<input>').data('part', part).prop('disabled', !p.enabled);
	        input = $input[0];
	      } else {
	        $input = $(input);
	      }

	      if (part.name) {
	        input.setAttribute('data-name', part.name);
	      } else {
	        input.removeAttribute('data-name');
	      }

	      if (part.ariaLabel) {
	        input.setAttribute('aria-label', part.ariaLabel);
	      } else {
	        input.removeAttribute('aria-label');
	      }

	      if (part.length || part.maxLength || typeof part.placeholder === 'string') {
	        //noinspection UnnecessaryLocalVariableJS
	        var placeholder = typeof part.placeholder === 'string' ?
	        part.placeholder :
	        part.placeholder === undefined || part.placeholder ? repeatChar('_', part.length || part.maxLength) : '';
	        input.placeholder = placeholder;
	      }

	      if (isNewInput) {
	        $input.
	        on('input.maskedinput', function (event) {
	          _this4._handleInput(event, input, part);
	          _this4._syncInputSizeForPart(part);
	        }).
	        on('keydown.maskedinput', function (event) {
	          _this4._handleKeydown(event, input, part);
	        }).
	        on('keypress.maskedinput', function (event) {
	          _this4._handleKeypress(event, input, part);
	        });
	      }

	      return $input;
	    }

	    /**
	       *
	       * @private
	       * @param {MaskedInput~Part} part
	       * @returns {jQuery}
	       */ }, { key: "_renderText", value: function _renderText(
	    part) {
	      return $('<span style="white-space: pre">').text(part.text);
	    }

	    /**
	       *
	       * @private
	       * @param {jQuery|Element|String} input
	       * @param {Boolean=true} alwaysConsiderPlaceholder
	       * @param {String=A} fallbackText
	       * @returns {MaskedInput}
	       */ }, { key: "_syncInputSize", value: function _syncInputSize(
	    input, alwaysConsiderPlaceholder, fallbackText) {
	      var p = this.p;

	      if (alwaysConsiderPlaceholder === undefined) {
	        alwaysConsiderPlaceholder = true;
	      }

	      if (fallbackText === undefined) {
	        fallbackText = 'A';
	      }

	      var $input = $(input),$backBuffer = p.$inputBackBuffer;

	      /** @type {HTMLInputElement} */
	      var inputEl = $input[0];

	      fallbackText = fallbackText == null ? '' : fallbackText + '';
	      var value = inputEl.value || inputEl.placeholder || fallbackText;

	      // Introduce backbuffer to DOM
	      $backBuffer.
	      css($input.css(inputBackbufferCssProps)).
	      text(value).
	      appendTo(this.$el);

	      // Measure these
	      var backBufferWidth = getPreciseContentWidth($backBuffer[0]) + 1 /* caret width */;
	      var currentWidth = getPreciseContentWidth(inputEl);

	      if (alwaysConsiderPlaceholder &&
	      inputEl.value &&
	      inputEl.placeholder &&
	      inputEl.placeholder !== inputEl.value) {
	        $backBuffer.text(inputEl.placeholder);
	        backBufferWidth = Math.max(
	        backBufferWidth,
	        getPreciseContentWidth($backBuffer[0]) + 1 /* caret width */);

	      }

	      // Compare
	      if (backBufferWidth !== currentWidth) {
	        // Update if needed
	        $input.css('width', backBufferWidth + 'px');
	      }

	      if ($input[0].scrollWidth > backBufferWidth) {
	        $input.css('width', inputEl.scrollWidth);
	      }

	      // Remove backbuffer from DOM
	      $backBuffer.remove();

	      return this;
	    }

	    /**
	       *
	       * @private
	       * @param {MaskedInput~Part} part
	       * @returns {MaskedInput}
	       */ }, { key: "_syncInputSizeForPart", value: function _syncInputSizeForPart(
	    part) {
	      if (!part.el || part.type === PartType.LABEL) return this;
	      return this._syncInputSize(
	      part.el,
	      part.forcePlaceholderWidth === undefined ? true : !!part.forcePlaceholderWidth);

	    }

	    /**
	       *
	       * @private
	       * @param {jQuery.Event} event
	       * @param {HTMLInputElement} input
	       * @param {MaskedInput~Part} part
	       * @returns {MaskedInput}
	       */ }, { key: "_handleInput", value: function _handleInput(
	    event, input, part) {
	      var content = input.value;
	      var validatedContent;

	      // Update input if acceptable
	      validatedContent = this._validateContent(content, part);

	      if (validatedContent === false) {
	        event.preventDefault();

	        // Fire change event
	        this.$el.trigger('change');

	        return this;
	      }

	      if (typeof validatedContent === 'string' &&
	      content !== validatedContent) {
	        input.value = validatedContent;
	      }

	      this._syncInputSizeForPart(part);

	      if (this._shouldMoveToNextFieldAfterInput(getSelectionRange(input), input.value, part)) {
	        $(input).nextAll(TABBABLE_SELECTOR).first().focus();
	      }

	      // Fire change event
	      this.$el.trigger('change');

	      return this;
	    }

	    /**
	       *
	       * @private
	       * @param {jQuery.Event} event
	       * @param {HTMLInputElement} input
	       * @param {MaskedInput~Part} part
	       * @returns {MaskedInput}
	       */ }, { key: "_handleKeydown", value: function _handleKeydown(
	    event, input, part) {
	      if (input.readOnly) return this;

	      var keycode = event.which;
	      var triggerChange = false;

	      var contentBefore = input.value;
	      var validatedContent;

	      // Handle UP/DOWN arrows for next/previous value

	      if (keycode === KEY_ARROW_UP || keycode === KEY_ARROW_DOWN) {

	        var nextValue,tryToUpdate = false;

	        var minLen = part.maxLength ?
	        Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) :
	        part.length || 1;
	        var maxLen = Math.max(part.length || 0, part.maxLength || 0);

	        if (part.type === PartType.TEXT && part.options) {

	          var fullMatch = findMatchInArray(part.options, contentBefore, true, true, false);
	          var index = part.options.indexOf(fullMatch);

	          if (index === -1) {
	            if (keycode === KEY_ARROW_UP) {
	              index = 0;
	            } else {
	              index = part.options.length - 1;
	            }
	          } else {
	            index += keycode === KEY_ARROW_DOWN ? 1 : -1;
	          }

	          if (index === part.options.length) {
	            index = 0;
	          } else if (index === -1) {
	            index = part.options.length - 1;
	          }

	          nextValue = part.options[index];

	          tryToUpdate = true;

	        } else if (part.type === PartType.NUMBER) {

	          if (!contentBefore &&
	          keycode === KEY_ARROW_DOWN &&
	          part.wholeNumber && (
	          typeof part.numericMax === 'number' || maxLen > 0) &&
	          typeof part.numericMin === 'number' &&
	          part.numericMin >= 0) {

	            // Start with largest number if going down from nothing
	            nextValue = typeof part.numericMax === 'number' ?
	            part.numericMax :
	            parseInt(repeatChar('9', maxLen), 10);

	          } else if (!contentBefore &&
	          keycode === KEY_ARROW_UP &&
	          part.wholeNumber &&
	          typeof part.numericMin === 'number') {

	            // Start with minimum number
	            nextValue = part.numericMin === 0 ? 1 : part.numericMin;

	          } else {
	            /// Up or down
	            nextValue = parseFloat(contentBefore) || 0;
	            nextValue += keycode === KEY_ARROW_UP ? 1 : -1;
	          }

	          // Limit to whole numbers
	          if (part.wholeNumber) {
	            nextValue = Math.round(nextValue);
	          }

	          // Limit to min/max
	          if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
	            nextValue = Math.max(
	            Math.min(
	            nextValue,
	            typeof part.numericMax === 'number' ? part.numericMax : Infinity),

	            typeof part.numericMin === 'number' ? part.numericMin : -Infinity);

	          }

	          nextValue = nextValue + '';

	          // Left-pad with zeroes when we figure out that we want that
	          if (typeof part.numericMin === 'number' &&
	          part.numericMin >= 0) {
	            nextValue = repeatChar('0', minLen - nextValue.length) + nextValue;
	          }

	          tryToUpdate = true;
	        }

	        // Update input if acceptable
	        if (tryToUpdate && nextValue !== contentBefore) {
	          validatedContent = this._validateContent(nextValue, part);
	          if (validatedContent === true) {
	            validatedContent = nextValue;
	          }
	          if (validatedContent !== false) {
	            input.value = validatedContent;
	            this._syncInputSizeForPart(part);
	            event.preventDefault();

	            triggerChange = true;
	          }
	        }
	      }

	      if (triggerChange) {
	        // Fire change event
	        this.$el.trigger('change');
	      }

	      // Handle LEFT/RIGHT arrows, basically when we are at the end/beginning of an input
	      if (keycode === KEY_ARROW_LEFT || keycode === KEY_ARROW_RIGHT) {
	        var isRtl = $(input).css('direction') === 'rtl';

	        if (!isRtl && keycode === KEY_ARROW_LEFT || isRtl && keycode === KEY_ARROW_RIGHT) {
	          if (getSelectionRange(input).begin === 0) {
	            $(input).prevAll(TABBABLE_SELECTOR).first().focus();
	          }
	        } else {
	          if (getSelectionRange(input).begin === input.value.length) {
	            $(input).nextAll(TABBABLE_SELECTOR).first().focus();
	          }
	        }
	      }

	      return this;
	    }

	    /**
	       *
	       * @private
	       * @param {jQuery.Event} event
	       * @param {HTMLInputElement} input
	       * @param {MaskedInput~Part} part
	       * @returns {MaskedInput}
	       */ }, { key: "_handleKeypress", value: function _handleKeypress(
	    event, input, part) {
	      if (input.readOnly) return this;

	      var keycode = event.which;
	      var pos = getSelectionRange(input);

	      if (event.ctrlKey || event.altKey || event.metaKey ||
	      !keycode ||
	      keycode < 32 || keycode === KEY_ENTER) return this; // Not a character, perform default

	      event.preventDefault();

	      var triggerChange = false;
	      var moveToNextField = false;

	      var pressedChar = event.key || String.fromCharCode(keycode);

	      var contentBefore = input.value;
	      var contentAfter = contentBefore.substr(0, pos.begin) +
	      pressedChar +
	      contentBefore.substr(pos.end);

	      var validatedContent = this._validateContent(contentAfter, part);
	      if (validatedContent === false) return this; // Not validated, ignore keypress

	      if (typeof validatedContent === 'string') {
	        contentAfter = validatedContent;
	      }

	      if (contentAfter !== contentBefore || contentAfter.substr(pos.begin, 1) === pressedChar) {

	        var newPos = {};

	        // Set caret at new position

	        if (pos.end - pos.begin > 0 && pos.direction === 'backward') {
	          newPos.begin = newPos.end = pos.begin;
	        } else {
	          newPos.begin = newPos.end = pos.begin + 1;
	        }

	        // Show rest of only choice found
	        if (part.type === PartType.TEXT && part.options) {

	          var fullMatch = findMatchInArray(part.options, contentAfter, false, true, false);
	          if (fullMatch !== undefined && fullMatch.length !== contentAfter.length) {
	            // Choose a selection range for the rest of the match
	            newPos.begin = contentAfter.length;
	            newPos.end = fullMatch.length;

	            // Set new input to full match
	            contentAfter = fullMatch;
	          }

	        }

	        // Update value
	        input.value = contentAfter;

	        // Update selection / caret
	        //noinspection JSCheckFunctionSignatures
	        setSelectionRange(input, newPos);

	        // See if we need to move on to next field
	        moveToNextField = this._shouldMoveToNextFieldAfterInput(newPos, contentAfter, part);

	        triggerChange = true;

	      } else {

	        // These are usually used as separators
	        if (pressedChar === '/' ||
	        pressedChar === ':' ||
	        pressedChar === '-' ||
	        pressedChar === '(' ||
	        pressedChar === ')' ||
	        pressedChar === '.') {
	          moveToNextField = true;
	        }
	      }

	      this._syncInputSizeForPart(part);

	      if (triggerChange) {
	        // Fire change event
	        this.$el.trigger('change');
	      }

	      if (moveToNextField) {
	        $(input).nextAll(TABBABLE_SELECTOR).first().focus();
	      }

	      return this;
	    }

	    /**
	       * Determines if we need to skip to next field after input change
	       * @private
	       * @param {{begin: Number, end: Number}} newPos
	       * @param {String} newContent
	       * @param {MaskedInput~Part} part
	       */ }, { key: "_shouldMoveToNextFieldAfterInput", value: function _shouldMoveToNextFieldAfterInput(
	    newPos, newContent, part) {
	      if (newPos.begin === newContent.length) {
	        if (part.type === PartType.TEXT) {
	          return findMatchInArray(part.options, newContent, false, true, false) === newContent;
	        } else {
	          return (part.length || part.maxLength || 0) > 0 &&
	          newContent.length === (part.length || part.maxLength);
	        }
	      }

	      return false;
	    }

	    /**
	       *
	       * @private
	       * @param {String} content
	       * @param {MaskedInput~Part} part
	       * @returns {String|Boolean}
	       */ }, { key: "_validateContent", value: function _validateContent(
	    content, part) {

	      // Priority given to validator
	      if (part.validator) {
	        if (part.validator instanceof RegExp) {
	          return part.validator.test(content);
	        }

	        var ret = part.validator.call(this, content, part);
	        if (ret == null) {
	          ret = false;
	        }
	        return ret;
	      }

	      var maxLen = Math.max(part.length || 0, part.maxLength || 0);

	      // Test numeric
	      if (part.type === PartType.NUMBER) {

	        if (part.wholeNumber) {
	          content = content.replace(/[^-0-9]/g, ''); // Zeroes and "-" only
	        } else {
	          content = content.replace(/[^-0-9.]/g, ''); // Zeroes, "-" and "." only
	        }

	        content = content.
	        replace(/^.+-/g, '-') // Dash can only be at the beginning
	        .replace(/\..*\./g, '.'); // Only one decimal point

	        if (maxLen > 0 && content.length > maxLen) {
	          content = content.substr(0, maxLen);
	        }

	        // Limit to min/max
	        // It's important to do this AFTER trimming the value,
	        // To allow inserting character in the middle.
	        if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
	          var parsedValue = parseFloat(content);
	          if (!isNaN(parsedValue)) {
	            parsedValue = Math.max(
	            Math.min(
	            parsedValue,
	            typeof part.numericMax === 'number' ? part.numericMax : Infinity),

	            typeof part.numericMin === 'number' ? part.numericMin : -Infinity);


	            if (parsedValue !== parseFloat(content)) {
	              content = parsedValue + '';
	            }
	          }
	        }

	        if (!content) {
	          return false;
	        }

	        return content;
	      }

	      // Test textual
	      if (part.type === PartType.TEXT) {
	        if (part.options) {
	          var match = findMatchInArray(part.options, content, true, false, false);
	          if (match !== undefined) {
	            return match;
	          }
	          return false;
	        }

	        return maxLen === 0 || content.length <= maxLen;
	      }

	      return false;
	    }

	    /**
	       * @public
	       * @returns {MaskedInput}
	       */ }, { key: "resize", value: function resize()
	    {var _this5 = this;
	      var p = this.p;

	      (p.parsed || []).forEach(function (part) {return _this5._syncInputSizeForPart(part);});

	      return this;
	    }

	    /**
	       * Retrieve a field element by index or label
	       * @public
	       * @param {Number|String} index
	       * @returns {HTMLInputElement}
	       */ }, { key: "field", value: function field(
	    index) {
	      var p = this.p;

	      var input = p.inputs[index];

	      if (!input) return undefined;

	      return $.isArray(input) ? input.slice(0) : input;
	    }

	    /**
	       * Creates a pattern for parsing an incoming value
	       * @private
	       * @returns {string}
	       */ }, { key: "_valuePattern", value: function _valuePattern()
	    {
	      var p = this.p;

	      var pattern = '';

	      p.parsed.forEach(function (part) {
	        var group = '';

	        var minLen = part.maxLength ?
	        Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) :
	        part.length || 1;
	        var maxLen = Math.max(part.length || 0, part.maxLength || 0);

	        if (part.type === PartType.TEXT) {
	          if (part.options) {
	            for (var i = 0; i < part.options.length; i++) {
	              if (i > 0) {
	                group += '|';
	              }
	              group += escapeRegExp(part.options[i]);
	            }
	          } else {
	            if (maxLen) {
	              group += '.{0,' + maxLen + '}';
	            } else {
	              group += '.*?';
	            }
	          }
	        } else if (part.type === PartType.NUMBER) {
	          if (part.wholeNumber) {
	            if (part.length > 0) {
	              group += '[-+]' + '[0-9]{' + (minLen - 1) + ',' + (maxLen - 1) + '}';
	              group += '|[0-9]{' + minLen + ',' + maxLen + '}';
	            } else {
	              group += '[-+]?[0-9]+';
	            }
	          } else {
	            if (maxLen) {
	              group += '[-+]' + '[0-9.]{' + (minLen - 1) + ',' + (maxLen - 1) + '}';
	              group += '|[0-9.]{' + minLen + ',' + maxLen + '}';
	            } else {
	              group += '[-+]?(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)';
	            }
	          }
	        } else /* if (part.type === PartType.LABEL) */{
	            group += escapeRegExp(part.text == null ? '' : part.text + '');
	          }

	        pattern += '(' + group + ')';

	        if (part.required !== undefined && !part.required) {
	          pattern += '?';
	        }
	      });

	      return '^' + pattern + '$';
	    }

	    /**
	       * Retrieve or set an input element's value
	       * @private
	       * @param {HTMLInputElement|jQuery|String} input
	       * @param {String?} newValue
	       * @returns {String|MaskedInput|undefined}
	       */ }, { key: "_fieldValue", value: function _fieldValue(
	    input, newValue) {
	      var $input = $(input);
	      if (!$input.length) return undefined;
	      input = $input[0];

	      var part = /**MaskedInput~Part=*/$input.data('part');
	      var validatedValue;

	      if (newValue === undefined) {
	        var value = input.value;

	        // Predefined choices?
	        if (part.type === PartType.TEXT && part.options) {
	          return findMatchInArray(part.options, value, true, true, false);
	        }

	        // Enforce length
	        var maxLen = Math.max(part.length || 0, part.maxLength || 0);
	        if (maxLen > 0 && value.length > maxLen) {
	          value = value.substr(0, maxLen);
	        }

	        // Validate value
	        validatedValue = this._validateContent(value, part);
	        if (validatedValue === false) return undefined;

	        if (validatedValue !== true) {// A string, probably
	          value = validatedValue + '';
	        }

	        return value;
	      } else {
	        newValue = newValue == null ? '' : newValue + '';
	        validatedValue = this._validateContent(newValue, part);
	        if (validatedValue === false) {
	          validatedValue = '';
	        } else if (validatedValue === true) {
	          validatedValue = newValue;
	        }

	        input.value = validatedValue;

	        this._syncInputSizeForPart(part);
	      }
	    }

	    /**
	       * Retrieve an input element's value by index or label
	       * @public
	       * @param {Number|String} index
	       * @param {String?} newValue
	       * @returns {String|MaskedInput|undefined}
	       */ }, { key: "fieldValue", value: function fieldValue(
	    index, newValue) {
	      var p = this.p;

	      var input = p.inputs[index];

	      if (!input) return undefined;

	      if (newValue === undefined) {
	        return this._fieldValue(input);
	      } else {
	        this._fieldValue(input, newValue);
	        return this;
	      }
	    }

	    /**
	       * Gets or sets an option by name
	       * @param {String} name
	       * @param {*?} newValue
	       * @returns {MaskedInput}
	       */ }, { key: "option", value: function option(
	    name, newValue) {
	      var o = this.o;

	      if (arguments.length === 2) {
	        if (name === 'patterns') {
	          o[name] = {};

	          MaskedInput.patternAddons.forEach(function (addon) {
	            o[name] = $.extend(o[name], addon);
	          });

	          o[name] = $.extend(o[name], newValue);
	        } else {
	          o[name] = newValue;
	        }
	      } else {
	        return o[name];
	      }
	    }

	    /**
	       * Gets or sets a part's option by option name
	       * @private
	       * @param {MaskedInput~Part} part
	       * @param {String|Object<String, *>} name
	       * @param {*?} value
	       * @returns {MaskedInput|*}
	       */ }, { key: "_fieldOption", value: function _fieldOption(
	    part, name, value) {var _this6 = this;
	      var p = this.p;

	      if (!part) {
	        return arguments.length === 3 ? this : undefined;
	      }

	      if (arguments.length === 3 || _typeof(name) === 'object') {

	        if (_typeof(name) === 'object') {
	          // Set the options object for part
	          Object.keys( /**@type {Object<String, *>}*/name).forEach(function (key) {
	            _this6._fieldOption(part, key, name[key]);
	          });

	          return this;
	        }

	        if (name === 'name' && part.name !== value) {

	          // Remove by the old name
	          if (parseInt(part.name, 10).toString() !== part.name &&
	          p.inputs[part.name]) {
	            if (p.inputs[part.name] instanceof HTMLElement) {
	              delete p.inputs[part.name];
	            } else {
	              p.inputs[part.name].splice(p.inputs[part.name].indexOf(part), 1);
	              if (p.inputs[part.name].length === 1) {
	                p.inputs[part.name] = p.inputs[part.name][0];
	              }
	            }
	          }

	          // Assign the new name
	          if (value && parseInt(value, 10).toString() !== value) {
	            if (p.inputs[value]) {
	              if (p.inputs[value] instanceof HTMLElement) {
	                p.inputs[value] = [p.inputs[value], part];
	              } else {
	                p.inputs[value] = part;
	              }
	            } else {
	              p.inputs[value] = part;
	            }
	          }
	        }

	        if (name !== 'el' && name !== '$el') {
	          // Do not allow overriding the internal element pointer by mistake
	          part[name] = value;
	        }

	        if (part.el && (
	        name === 'length' ||
	        name === 'name' ||
	        name === 'ariaLabel' ||
	        name === 'placeholder')) {
	          this._renderInput(part, part.el);
	        }

	      } else {

	        if (Array.isArray(name)) {
	          // Return value mapping as an object
	          var options = {};

	          /**@type String[]*/name.forEach(function (key) {
	            options[key] = part[key];
	          });

	          return options;
	        } else {
	          // Return value
	          return part[name];
	        }
	      }

	      return this;
	    }

	    /**
	       * Gets or sets a part's option by part's index and option name
	       * @public
	       * @param {Number|String} index
	       * @param {String|Object} name
	       * @param {*?} value
	       * @returns {MaskedInput|*}
	       */ }, { key: "fieldOption", value: function fieldOption(
	    index, name, value) {
	      var that = this,
	      p = this.p;

	      var inputEls = p.inputs[index];
	      if (!inputEls) return this;

	      if (inputEls.length > 1) {
	        if (arguments.length === 3 || _typeof(name) === 'object') {

	          // Set the option/options for all inputs
	          inputEls.forEach(function (el) {
	            that._fieldOption($(el).data('part'), name, value);
	          });

	          delete p.valueRegex;

	          return this;
	        } else {

	          // Return array of option/options for all inputs
	          return inputEls.map(function (el) {return that._fieldOption($(el).data('part'), name);});
	        }
	      } else {
	        if (arguments.length === 3) {

	          // Set the option/options for input
	          this._fieldOption($(inputEls).data('part'), name, value);

	          delete p.valueRegex;

	          return this;
	        } else {

	          // Return value/values
	          return this._fieldOption($(inputEls).data('part'), name);
	        }
	      }
	    }

	    /**
	       * Get or set the full value
	       * @public
	       * @param {String?} newValue
	       * @returns {String|undefined|MaskedInput}
	       */ }, { key: "value", value: function value(
	    newValue) {
	      var p = this.p;

	      var pi, part, value;

	      if (newValue === undefined) {

	        var out = '';

	        for (pi = 0; pi < p.parsed.length; pi++) {
	          part = p.parsed[pi];

	          if (part.type === PartType.TEXT) {

	            value = this._fieldValue(part.el);

	            // Check that the value is OK
	            if (part.postProcess) {
	              value = part.postProcess.call(this, value, part) + '';
	            }

	            if (value === undefined) {
	              if (part.required === undefined || part.required) {
	                return undefined;
	              }

	              value = part.defaultValue || '';
	            }

	            out += value === undefined ? '' : value;

	          } else if (part.type === PartType.NUMBER) {

	            value = this._fieldValue(part.el);

	            // Check that the value is OK
	            if (value === undefined) {
	              if (part.required === undefined || part.required) {
	                return undefined;
	              }

	              value = part.defaultValue || '';
	            }

	            // Post process
	            if (part.postProcess) {
	              value = part.postProcess.call(this, value, part);

	              // Check again that the value is OK
	              if (value === undefined) {
	                if (part.required === undefined || part.required) {
	                  return undefined;
	                }

	                value = part.defaultValue || '';
	              } else {
	                value = value + '';
	              }
	            }

	            var minLen = part.maxLength ?
	            Math.max(0, Math.min(part.length || 0, part.maxLength || 0)) :
	            part.length || 0;
	            var maxLen = Math.max(part.length || 0, part.maxLength || 0);

	            // Try to pad with zeroes where possible
	            if (part.padding || part.padding === undefined) {
	              var padding = typeof part.padding === 'number' ? part.padding || minLen : minLen;

	              if (padding > 0 && value.length < padding) {
	                for (var i = 0; i < value.length; i++) {
	                  if (/[0-9.]/.test(value[i])) {
	                    value = value.substr(0, i) +
	                    repeatChar('0', padding - value.length) +
	                    value.substr(i);
	                    break;
	                  }
	                }

	                if (value.length < padding) {
	                  value = repeatChar('0', padding - value.length) + value;
	                }
	              }
	            }

	            out += value === undefined ? '' : value;

	          } else {// PartType.LABEL
	            // Probably a raw text between labels
	            out += part.text;
	          }

	        }

	        return out;

	      } else {
	        if (!p.valueRegex) {
	          p.valueRegex = new RegExp(this._valuePattern(), 'i');
	        }

	        var matches = newValue.match(p.valueRegex) || [];
	        for (var _i = 1, _pi = 0; _i < matches.length && _pi < p.parsed.length; _i++, _pi++) {
	          part = p.parsed[_pi];
	          value = matches[_i] || '';

	          if (part.type !== PartType.LABEL) {

	            this._fieldValue(part.el, value);

	          }

	        }

	        // Allow clearing the field
	        if (!matches.length && (newValue === '' || newValue === null)) {
	          for (pi = 0; pi < p.parsed.length; pi++) {
	            part = p.parsed[pi];

	            if (part.type !== PartType.LABEL) {
	              this._fieldValue(part.el, '');
	            }

	          }
	        }
	      }

	      return this;
	    }

	    /**
	       *
	       * @returns {function(string?):(String|MaskedInput|undefined)}
	       */ }, { key: "enable",




	    /**
	                               * Set input enabled/disabled mode
	                               * @param {Boolean} [enabled=true]
	                               * @returns {MaskedInput} this
	                               */value: function enable(
	    enabled) {
	      var p = this.p;

	      enabled = !!enabled || enabled === undefined;

	      p.enabled = enabled;

	      this.$el.attr('disabled', enabled ? null : true);
	      this.$el.find('input').prop('disabled', !enabled);

	      return this;
	    }

	    /**
	       * Set input enabled/disabled mode
	       * @param {Boolean} [disabled=true]
	       * @returns {MaskedInput} this
	       */ }, { key: "disable", value: function disable(
	    disabled) {
	      disabled = !!disabled || disabled === undefined;
	      return this.enable(!disabled);
	    }

	    /**
	       * @public
	       * @returns {Boolean} <code>true</code> if enabled
	       */ }, { key: "val", get: function get() {return this.value;} }, { key: "isEnabled", get: function get()
	    {
	      return this.p.enabled;
	    }

	    /**
	       * Set input enabled/disabled mode
	       * @param {Boolean} enabled
	       */, set: function set(
	    enabled) {
	      this.enable(enabled);
	    }

	    /**
	       * @public
	       * @returns {Boolean} <code>true</code> if disabled
	       */ }, { key: "isDisabled", get: function get()
	    {
	      return !this.p.enabled;
	    }

	    /**
	       * Set input enabled/disabled mode
	       * @param {Boolean} disabled
	       */, set: function set(
	    disabled) {
	      this.disable(disabled);
	    } }]);return MaskedInput;}();


	var FORMAT_REGEX = new RegExp(
	'(0+(?::[a-zA-Z0-9_]+)?)' + /* numeric value, fixed length, with possible :name_123 */
	'|(#+(?::[a-zA-Z0-9_]+)?)' + /* numeric value, with possible :name_123 */
	'|((?:@+|\\*)(?::[a-zA-Z0-9_]+)?)' + /* text value with maximum or variable length, with possible :name_123 */
	'|("[^"]*"|\'[^\']*\')' /* possible quoted text */,
	'g');


	/**
	       * @public
	       * @expose
	       */
	MaskedInput.PartType = PartType;

	/**
	                                  * Here we can add more pattern addons
	                                  * @public
	                                  * @expose
	                                  */
	MaskedInput.patternAddons = [];

	/**
	                                 * Default options for the control
	                                 * @public
	                                 * @expose
	                                 * @type {MaskedInput.Options}
	                                 */
	MaskedInput.defaults = defaults;

	'use strict';

	/**
	                                                      * @name MaskedInput~Options
	                                                      * @property {MaskedInput~DateLocale} [dateLocale] - Date localization map
	                                                      */

	/**
	                                                          * @typedef {Object} MaskedInput~DateLocale
	                                                          * @property {String[]} [MMM]
	                                                          * @property {String[]} [MMMM]
	                                                          * @property {String[]} [t]
	                                                          * @property {String[]} [tt]
	                                                          * @property {String[]} [T]
	                                                          * @property {String[]} [TT]
	                                                          */

	var repeatChar$1 = function repeatChar(char, length) {
	  var out = '';
	  for (var i = 0; i < length; i++) {
	    out += char;
	  }
	  return out;
	};

	var maxArrayStringLength = function maxArrayStringLength(array) {
	  var slen = 0;
	  for (var i = 0; i < array.length; i++) {
	    if (array[i].length > slen) {
	      slen = array[i].length;
	    }
	  }
	  return slen;
	};

	//noinspection UnnecessaryLocalVariableJS
	var EnglishDateLocale = /** @type {MaskedInput~DateLocale} */{
	  MMM: [
	  'Jan', 'Feb', 'Mar',
	  'Apr', 'May', 'Jun',
	  'Jul', 'Aug', 'Sep',
	  'Oct', 'Nov', 'Dec'],

	  MMMM: [
	  'January', 'February', 'March',
	  'April', 'May', 'June',
	  'July', 'August', 'September',
	  'October', 'November', 'December'],

	  t: ['a', 'p'],
	  tt: ['am', 'pm'],
	  T: ['A', 'P'],
	  TT: ['AM', 'PM'],
	  aria: {
	    day: 'Day',
	    month: 'Month',
	    year: 'Year',
	    hour: 'Hour',
	    minutes: 'Minutes',
	    seconds: 'Seconds',
	    ampm: 'Am/Pm' } };



	MaskedInput.defaults.dateLocale = EnglishDateLocale;

	var DATE_PATTERN_MAP = {
	  // d - 1-31
	  // dd - 01-31
	  dd: {
	    pattern: /\bdd?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'day',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('d', match.length);
	    },
	    numericMin: 0, // Allow typing in zeroes, like 06
	    numericMax: 31,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    postProcess: function postProcess(value) {
	      value = parseInt(value);
	      if (value < 1 || value > 31) return undefined;
	      return value + '';
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).day;
	    } },

	  MM: {
	    // M - 1-12
	    // MM - 01-12
	    pattern: /\bMM?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'month',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('m', match.length);
	    },
	    numericMin: 0, // Allow typing in zeroes, like 06
	    numericMax: 12,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    postProcess: function postProcess(value) {
	      value = parseInt(value);
	      if (value < 1 || value > 12) return undefined;
	      return value + '';
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).month;
	    } },

	  MMM: {
	    // MMM - Jan-Dec
	    pattern: /\bMMM\b/,
	    type: MaskedInput.PartType.TEXT,
	    name: 'month',
	    placeholder: function placeholder(match) {
	      return repeatChar$1('m', match.length);
	    },
	    length: function length(match) {
	      return maxArrayStringLength(this.option('dateLocale')[match]);
	    },
	    options: function options(match) {
	      return this.option('dateLocale')[match];
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).month;
	    } },

	  MMMM: {
	    // MMMM - January-December
	    pattern: /\bMMMM\b/,
	    type: MaskedInput.PartType.TEXT,
	    name: 'month',
	    placeholder: function placeholder(match) {
	      return repeatChar$1('m', match.length);
	    },
	    length: function length(match) {
	      return maxArrayStringLength(this.option('dateLocale')[match]);
	    },
	    options: function options(match) {
	      return this.option('dateLocale')[match];
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).month;
	    } },

	  yyyy: {
	    // yy - 85
	    // yyyy - 1985
	    pattern: /\byy(?:yy)?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'year',
	    wholeNumber: true,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('y', match.length);
	    },
	    maxLength: function maxLength(match) {
	      return match.length;
	    },
	    postProcess: function postProcess(value, part) {

	      if (part.maxLength === 4) {
	        var baseYear = Math.floor(new Date().getFullYear() / 100) * 100;
	        var nowYear = new Date().getFullYear();

	        var year = parseInt(value, 10);

	        if (year < 100) {
	          year += baseYear;
	          if (year - nowYear > 50) {
	            year -= 100;
	          } else if (nowYear - year > 50) {
	            year += 100;
	          }
	        }

	        return year + '';
	      } else {

	        return value;
	      }
	    },
	    padding: function padding(match) {
	      return match.length;
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).year;
	    } },

	  HH: {
	    // H - 0-24
	    // HH - 00-24
	    pattern: /\bHH?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'hours',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('h', match.length);
	    },
	    numericMin: 0,
	    numericMax: 23,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).hour;
	    } },

	  hh: {
	    // h - 1-12
	    // hh - 01-12
	    pattern: /\bhh?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'hours_12',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('h', match.length);
	    },
	    numericMin: 1,
	    numericMax: 12,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).hour;
	    } },

	  mm: {
	    // m - 0-59
	    // mm - 00-59
	    pattern: /\bmm?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'minutes',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('m', match.length);
	    },
	    numericMin: 0,
	    numericMax: 59,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).minutes;
	    } },

	  ss: {
	    // s - 0-59
	    // ss - 00-59
	    pattern: /\bss?\b/,
	    type: MaskedInput.PartType.NUMBER,
	    name: 'seconds',
	    maxLength: 2,
	    placeholder: function placeholder(match) {
	      return repeatChar$1('s', match.length);
	    },
	    numericMin: 0,
	    numericMax: 59,
	    wholeNumber: true,
	    padding: function padding(match) {
	      return match.length;
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).seconds;
	    } },

	  tt: {
	    // t - a/p
	    // tt - am/pm
	    // T - A/P
	    // TT - AM/PM
	    pattern: /\btt?|TT?\b/,
	    type: MaskedInput.PartType.TEXT,
	    name: 'ampm',
	    length: function length(match) {
	      return maxArrayStringLength(this.option('dateLocale')[match]);
	    },
	    options: function options(match) {
	      return this.option('dateLocale')[match];
	    },
	    defaultValue: function defaultValue(match) {
	      return this.option('dateLocale')[match][0];
	    },
	    ariaLabel: function ariaLabel(_match) {
	      return (this.option('dateLocale').aria || {}).ampm;
	    } } };



	MaskedInput.patternAddons.push(DATE_PATTERN_MAP);

	return MaskedInput;

})));

//# sourceMappingURL=jquery.maskedinput.umd.js.map