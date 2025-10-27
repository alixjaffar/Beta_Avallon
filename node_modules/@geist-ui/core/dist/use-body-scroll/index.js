'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaultOptions = {
  scrollLayer: false,
  delayReset: 0
};
var elementStack = new Map();

var getOwnerPaddingRight = function getOwnerPaddingRight(element) {
  var owner = (element === null || element === void 0 ? void 0 : element.ownerDocument) || document;
  var view = owner.defaultView || window;
  return Number.parseInt(view.getComputedStyle(element).paddingRight, 10) || 0;
};

var getOwnerScrollbarWidth = function getOwnerScrollbarWidth(element) {
  var doc = (element === null || element === void 0 ? void 0 : element.ownerDocument) || document;
  return Math.abs(window.innerWidth - doc.documentElement.clientWidth);
};

var useBodyScroll = function useBodyScroll(elementRef, options) {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return [false, function (t) {
    return t;
  }];
  var elRef = elementRef || react.useRef(document.body);

  var _useState = react.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hidden = _useState2[0],
      setHidden = _useState2[1];

  var safeOptions = _objectSpread2(_objectSpread2({}, defaultOptions), options || {});

  react.useEffect(function () {
    if (!elRef || !elRef.current) return;
    var lastOverflow = elRef.current.style.overflow;

    if (hidden) {
      if (elementStack.has(elRef.current)) return;
      var paddingRight = getOwnerPaddingRight(elRef.current);
      var scrollbarWidth = getOwnerScrollbarWidth(elRef.current);
      elementStack.set(elRef.current, {
        overflow: lastOverflow,
        paddingRight: elRef.current.style.paddingRight
      });
      elRef.current.style.overflow = 'hidden';
      elRef.current.style.paddingRight = "".concat(paddingRight + scrollbarWidth, "px");
      return;
    } // reset element overflow


    if (!elementStack.has(elRef.current)) return;

    var reset = function reset(el) {
      var store = elementStack.get(el);
      if (!store) return;
      el.style.overflow = store.overflow;
      el.style.paddingRight = store.paddingRight;
      elementStack["delete"](el);
    };

    var timer = window.setTimeout(function () {
      reset(elRef.current);
      window.clearTimeout(timer);
    }, safeOptions.delayReset);
  }, [hidden, elRef]);
  return [hidden, setHidden];
};

var useBodyScroll$1 = useBodyScroll;

exports["default"] = useBodyScroll$1;
