'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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

var defaultToastLayout = {
  padding: '12px 16px',
  margin: '8px 0',
  width: '420px',
  maxWidth: '90vw',
  maxHeight: '75px',
  placement: 'bottomRight'
};
var defaultParams = {
  toasts: [],
  toastLayout: defaultToastLayout,
  updateToastLayout: function updateToastLayout(t) {
    return t;
  },
  updateToasts: function updateToasts(t) {
    return t;
  },
  lastUpdateToastId: null,
  updateLastToastId: function updateLastToastId() {
    return null;
  }
};
var GeistUIContent = /*#__PURE__*/React__default["default"].createContext(defaultParams);
var useGeistUIContext = function useGeistUIContext() {
  return React__default["default"].useContext(GeistUIContent);
};

var getId = function getId() {
  return Math.random().toString(32).slice(2, 10);
};

var defaultToast = {
  delay: 2000,
  type: 'default'
};

var useToasts = function useToasts(layout) {
  var _useGeistUIContext = useGeistUIContext(),
      updateToasts = _useGeistUIContext.updateToasts,
      toasts = _useGeistUIContext.toasts,
      updateToastLayout = _useGeistUIContext.updateToastLayout,
      updateLastToastId = _useGeistUIContext.updateLastToastId;

  React.useEffect(function () {
    if (!layout) return;
    updateToastLayout(function () {
      return layout ? _objectSpread2(_objectSpread2({}, defaultToastLayout), layout) : defaultToastLayout;
    });
  }, []);

  var cancel = function cancel(internalId) {
    updateToasts(function (currentToasts) {
      return currentToasts.map(function (item) {
        if (item._internalIdent !== internalId) return item;
        return _objectSpread2(_objectSpread2({}, item), {}, {
          visible: false
        });
      });
    });
    updateLastToastId(function () {
      return internalId;
    });
  };

  var removeAll = function removeAll() {
    updateToasts(function (last) {
      return last.map(function (toast) {
        return _objectSpread2(_objectSpread2({}, toast), {}, {
          visible: false
        });
      });
    });
  };

  var findToastOneByID = function findToastOneByID(id) {
    return toasts.find(function (t) {
      return t.id === id;
    });
  };

  var removeToastOneByID = function removeToastOneByID(id) {
    updateToasts(function (last) {
      return last.map(function (toast) {
        if (toast.id !== id) return toast;
        return _objectSpread2(_objectSpread2({}, toast), {}, {
          visible: false
        });
      });
    });
  };

  var setToast = function setToast(toast) {
    var internalIdent = "toast-".concat(getId());
    var delay = toast.delay || defaultToast.delay;

    if (toast.id) {
      var hasIdent = toasts.find(function (t) {
        return t.id === toast.id;
      });

      if (hasIdent) {
        throw new Error('Toast: Already have the same key: "ident"');
      }
    }

    updateToasts(function (last) {
      var newToast = {
        delay: delay,
        text: toast.text,
        visible: true,
        type: toast.type || defaultToast.type,
        id: toast.id || internalIdent,
        actions: toast.actions || [],
        _internalIdent: internalIdent,
        _timeout: window.setTimeout(function () {
          cancel(internalIdent);

          if (newToast._timeout) {
            window.clearTimeout(newToast._timeout);
            newToast._timeout = null;
          }
        }, delay),
        cancel: function (_cancel) {
          function cancel() {
            return _cancel.apply(this, arguments);
          }

          cancel.toString = function () {
            return _cancel.toString();
          };

          return cancel;
        }(function () {
          return cancel(internalIdent);
        })
      };
      return [].concat(_toConsumableArray(last), [newToast]);
    });
  };

  return {
    toasts: toasts,
    setToast: setToast,
    removeAll: removeAll,
    findToastOneByID: findToastOneByID,
    removeToastOneByID: removeToastOneByID
  };
};

var useToasts$1 = useToasts;

exports["default"] = useToasts$1;
