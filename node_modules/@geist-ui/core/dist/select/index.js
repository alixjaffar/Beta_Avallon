'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styledJsx_cjs = require('../styled-jsx.cjs.js');
var React = require('react');
var reactDom = require('react-dom');

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

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
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
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

var defaultFont = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mono: 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  prism: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,"Liberation Mono", "Courier New", monospace'
};
var defaultBreakpoints = {
  xs: {
    min: '0',
    max: '650px'
  },
  sm: {
    min: '650px',
    max: '900px'
  },
  md: {
    min: '900px',
    max: '1280px'
  },
  lg: {
    min: '1280px',
    max: '1920px'
  },
  xl: {
    min: '1920px',
    max: '10000px'
  }
};
var defaultLayout = {
  gap: '16pt',
  gapNegative: '-16pt',
  gapHalf: '8pt',
  gapHalfNegative: '-8pt',
  gapQuarter: '4pt',
  gapQuarterNegative: '-4pt',
  pageMargin: '16pt',
  pageWidth: '750pt',
  pageWidthWithMargin: '782pt',
  breakpointMobile: defaultBreakpoints.xs.max,
  breakpointTablet: defaultBreakpoints.sm.max,
  radius: '6px',
  unit: '16px'
};

var palette$1 = {
  accents_1: '#fafafa',
  accents_2: '#eaeaea',
  accents_3: '#999',
  accents_4: '#888',
  accents_5: '#666',
  accents_6: '#444',
  accents_7: '#333',
  accents_8: '#111',
  background: '#fff',
  foreground: '#000',
  selection: '#79ffe1',
  secondary: '#666',
  code: '#f81ce5',
  border: '#eaeaea',
  error: '#e00',
  errorLight: '#ff1a1a',
  errorLighter: '#f7d4d6',
  errorDark: '#c50000',
  success: '#0070f3',
  successLight: '#3291ff',
  successLighter: '#d3e5ff',
  successDark: '#0761d1',
  warning: '#f5a623',
  warningLight: '#f7b955',
  warningLighter: '#ffefcf',
  warningDark: '#ab570a',
  cyan: '#50e3c2',
  cyanLighter: '#aaffec',
  cyanLight: '#79ffe1',
  cyanDark: '#29bc9b',
  violet: '#7928ca',
  violetLighter: '#e3d7fc',
  violetLight: '#8a63d2',
  violetDark: '#4c2889',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
  link: '#0070f3'
};
var expressiveness$1 = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.02)',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 5px 10px rgba(0, 0, 0, 0.12)',
  shadowMedium: '0 8px 30px rgba(0, 0, 0, 0.12)',
  shadowLarge: '0 30px 60px rgba(0, 0, 0, 0.12)',
  portalOpacity: 0.25
};
var font$1 = defaultFont;
var breakpoints$1 = defaultBreakpoints;
var layout$1 = defaultLayout;
var themes$1 = {
  type: 'light',
  font: font$1,
  layout: layout$1,
  palette: palette$1,
  breakpoints: breakpoints$1,
  expressiveness: expressiveness$1
};
var lightTheme = themes$1;

var palette = {
  accents_1: '#111',
  accents_2: '#333',
  accents_3: '#444',
  accents_4: '#666',
  accents_5: '#888',
  accents_6: '#999',
  accents_7: '#eaeaea',
  accents_8: '#fafafa',
  background: '#000',
  foreground: '#fff',
  selection: '#f81ce5',
  secondary: '#888',
  code: '#79ffe1',
  border: '#333',
  error: '#e00',
  errorLighter: '#f7d4d6',
  errorLight: '#ff1a1a',
  errorDark: '#c50000',
  success: '#0070f3',
  successLighter: '#d3e5ff',
  successLight: '#3291ff',
  successDark: '#0761d1',
  warning: '#f5a623',
  warningLighter: '#ffefcf',
  warningLight: '#f7b955',
  warningDark: '#ab570a',
  cyan: '#50e3c2',
  cyanLighter: '#aaffec',
  cyanLight: '#79ffe1',
  cyanDark: '#29bc9b',
  violet: '#7928ca',
  violetLighter: '#e3d7fc',
  violetLight: '#8a63d2',
  violetDark: '#4c2889',
  purple: '#f81ce5',
  alert: '#ff0080',
  magenta: '#eb367f',
  link: '#3291ff'
};
var expressiveness = {
  linkStyle: 'none',
  linkHoverStyle: 'none',
  dropdownBoxShadow: '0 0 0 1px #333',
  scrollerStart: 'rgba(255, 255, 255, 1)',
  scrollerEnd: 'rgba(255, 255, 255, 0)',
  shadowSmall: '0 0 0 1px #333',
  shadowMedium: '0 0 0 1px #333',
  shadowLarge: '0 0 0 1px #333',
  portalOpacity: 0.75
};
var font = defaultFont;
var breakpoints = defaultBreakpoints;
var layout = defaultLayout;
var themes = {
  type: 'dark',
  font: font,
  layout: layout,
  palette: palette,
  breakpoints: breakpoints,
  expressiveness: expressiveness
};
var darkTheme = themes;

var isObject = function isObject(target) {
  return target && _typeof(target) === 'object';
};
var deepDuplicable = function deepDuplicable(source, target) {
  if (!isObject(target) || !isObject(source)) return source;
  var sourceKeys = Object.keys(source);
  var result = {};

  for (var _i = 0, _sourceKeys = sourceKeys; _i < _sourceKeys.length; _i++) {
    var key = _sourceKeys[_i];
    var sourceValue = source[key];
    var targetValue = target[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      result[key] = targetValue.concat(sourceValue);
    } else if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepDuplicable(sourceValue, _objectSpread2({}, targetValue));
    } else if (targetValue) {
      result[key] = targetValue;
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
};

var getPresets = function getPresets() {
  return [lightTheme, darkTheme];
};

var getPresetStaticTheme = function getPresetStaticTheme() {
  return lightTheme;
};

var isAvailableThemeType = function isAvailableThemeType(type) {
  if (!type) return false;
  var presetThemes = getPresets();
  var hasType = presetThemes.find(function (theme) {
    return theme.type === type;
  });
  return !hasType;
};

var isPresetTheme = function isPresetTheme(themeOrType) {
  if (!themeOrType) return false;
  var isType = typeof themeOrType === 'string';
  var type = isType ? themeOrType : themeOrType.type;
  return !isAvailableThemeType(type);
};

var hasUserCustomTheme = function hasUserCustomTheme() {
  var themes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return !!themes.find(function (item) {
    return isAvailableThemeType(item.type);
  });
};

var create = function create(base, custom) {
  if (!isAvailableThemeType(custom.type)) {
    throw new Error('Duplicate or unavailable theme type');
  }

  return deepDuplicable(base, custom);
};

var createFromDark = function createFromDark(custom) {
  return create(darkTheme, custom);
};

var createFromLight = function createFromLight(custom) {
  return create(lightTheme, custom);
};

var Themes = {
  isPresetTheme: isPresetTheme,
  isAvailableThemeType: isAvailableThemeType,
  hasUserCustomTheme: hasUserCustomTheme,
  getPresets: getPresets,
  getPresetStaticTheme: getPresetStaticTheme,
  create: create,
  createFromDark: createFromDark,
  createFromLight: createFromLight
};
var Themes$1 = Themes;

var defaultTheme = Themes$1.getPresetStaticTheme();
var ThemeContext = /*#__PURE__*/React__default["default"].createContext(defaultTheme);
var useTheme$1 = function useTheme() {
  return React__default["default"].useContext(ThemeContext);
};

var useTheme = useTheme$1;

var useCurrentState = function useCurrentState(initialState) {
  var _useState = React.useState(function () {
    return typeof initialState === 'function' ? initialState() : initialState;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var ref = React.useRef(initialState);
  React.useEffect(function () {
    ref.current = state;
  }, [state]);

  var setValue = function setValue(val) {
    var result = typeof val === 'function' ? val(ref.current) : val;
    ref.current = result;
    setState(result);
  };

  return [state, setValue, ref];
};

var useCurrentState$1 = useCurrentState;

var getId = function getId() {
  return Math.random().toString(32).slice(2, 10);
};
var pickChildByProps = function pickChildByProps(children, key, value) {
  var target = [];
  var isArray = Array.isArray(value);
  var withoutPropChildren = React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return null;
    if (!item.props) return item;

    if (isArray) {
      if (value.includes(item.props[key])) {
        target.push(item);
        return null;
      }

      return item;
    }

    if (item.props[key] === value) {
      target.push(item);
      return null;
    }

    return item;
  });
  var targetChildren = target.length >= 0 ? target : undefined;
  return [withoutPropChildren, targetChildren];
};
var isBrowser = function isBrowser() {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
};
var isCSSNumberValue = function isCSSNumberValue(value) {
  return value !== undefined && !Number.isNaN(+value);
};

var SelectIconComponent = function SelectIconComponent() {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: "jsx-2742933678"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 9l6 6 6-6",
    className: "jsx-2742933678"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2742933678"
  }, "svg.jsx-2742933678{color:inherit;stroke:currentColor;-webkit-transition:all 200ms ease;transition:all 200ms ease;width:1.214em;height:1.214em;}"));
};

SelectIconComponent.displayName = 'GeistSelectIcon';
var SelectIcon = /*#__PURE__*/React__default["default"].memo(SelectIconComponent);
var SelectIcon$1 = SelectIcon;

var defaultContext$1 = {
  visible: false,
  disableAll: false
};
var SelectContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
var useSelectContext = function useSelectContext() {
  return React__default["default"].useContext(SelectContext);
};

var useSSR = function useSSR() {
  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      browser = _useState2[0],
      setBrowser = _useState2[1];

  React.useEffect(function () {
    setBrowser(isBrowser());
  }, []);
  return {
    isBrowser: browser,
    isServer: !browser
  };
};

var useSSR$1 = useSSR;

var createElement = function createElement(id) {
  var el = document.createElement('div');
  el.setAttribute('id', id);
  return el;
};

var usePortal = function usePortal() {
  var selectId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getId();
  var getContainer = arguments.length > 1 ? arguments[1] : undefined;
  var id = "geist-ui-".concat(selectId);

  var _useSSR = useSSR$1(),
      isBrowser = _useSSR.isBrowser;

  var _useState = React.useState(isBrowser ? createElement(id) : null),
      _useState2 = _slicedToArray(_useState, 2),
      elSnapshot = _useState2[0],
      setElSnapshot = _useState2[1];

  React.useEffect(function () {
    var customContainer = getContainer ? getContainer() : null;
    var parentElement = customContainer || document.body;
    var hasElement = parentElement.querySelector("#".concat(id));
    var el = hasElement || createElement(id);

    if (!hasElement) {
      parentElement.appendChild(el);
    }

    setElSnapshot(el);
  }, []);
  return elSnapshot;
};

var usePortal$1 = usePortal;

var useResize = function useResize(callback) {
  var immediatelyInvoke = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  React.useEffect(function () {
    var fn = function fn() {
      return callback();
    };

    if (immediatelyInvoke) {
      fn();
    }

    window.addEventListener('resize', fn);
    return function () {
      return window.removeEventListener('resize', fn);
    };
  }, []);
};

var useResize$1 = useResize;

var _excluded$6 = ["children", "className", "visible", "enterTime", "leaveTime", "clearTime", "name"];
var defaultProps$6 = {
  visible: false,
  enterTime: 60,
  leaveTime: 60,
  clearTime: 60,
  className: '',
  name: 'transition'
};

var CssTransition = function CssTransition(_ref) {
  var children = _ref.children,
      className = _ref.className,
      visible = _ref.visible,
      enterTime = _ref.enterTime,
      leaveTime = _ref.leaveTime,
      clearTime = _ref.clearTime,
      name = _ref.name,
      props = _objectWithoutProperties(_ref, _excluded$6);

  var _useState = React.useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      classes = _useState2[0],
      setClasses = _useState2[1];

  var _useState3 = React.useState(visible),
      _useState4 = _slicedToArray(_useState3, 2),
      renderable = _useState4[0],
      setRenderable = _useState4[1];

  React.useEffect(function () {
    var statusClassName = visible ? 'enter' : 'leave';
    var time = visible ? enterTime : leaveTime;

    if (visible && !renderable) {
      setRenderable(true);
    }

    setClasses("".concat(name, "-").concat(statusClassName)); // set class to active

    var timer = setTimeout(function () {
      setClasses("".concat(name, "-").concat(statusClassName, " ").concat(name, "-").concat(statusClassName, "-active"));
      clearTimeout(timer);
    }, time); // remove classess when animation over

    var clearClassesTimer = setTimeout(function () {
      if (!visible) {
        setClasses('');
        setRenderable(false);
      }

      clearTimeout(clearClassesTimer);
    }, time + clearTime);
    return function () {
      clearTimeout(timer);
      clearTimeout(clearClassesTimer);
    };
  }, [visible, renderable]);
  if (! /*#__PURE__*/React__default["default"].isValidElement(children) || !renderable) return null;
  return /*#__PURE__*/React__default["default"].cloneElement(children, _objectSpread2(_objectSpread2({}, props), {}, {
    className: "".concat(children.props.className, " ").concat(className, " ").concat(classes)
  }));
};

CssTransition.defaultProps = defaultProps$6;
CssTransition.displayName = 'GeistCssTransition';
var CssTransition$1 = CssTransition;

var useClickAnyWhere = function useClickAnyWhere(handler) {
  React.useEffect(function () {
    var callback = function callback(event) {
      return handler(event);
    };

    document.addEventListener('click', callback);
    return function () {
      return document.removeEventListener('click', callback);
    };
  }, [handler]);
};

var useClickAnyWhere$1 = useClickAnyWhere;

var useDOMObserver = function useDOMObserver(ref) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var config = {
    attributes: false,
    childList: true,
    subtree: true
  };
  React.useEffect(function () {
    if (!ref || !ref.current) return;
    var unmount = false;

    var done = function done() {
      if (unmount) return;
      callback.apply(void 0, arguments);
    };

    var observer = new MutationObserver(done);
    observer.observe(ref.current, config);
    return function () {
      unmount = true;
      observer.disconnect();
    };
  }, [ref]);
};

var useDOMObserver$1 = useDOMObserver;

var warningStack = {};

var useWarning = function useWarning(message, component) {
  var tag = component ? " [".concat(component, "]") : ' ';
  var log = "[Geist UI]".concat(tag, ": ").concat(message);
  if (typeof console === 'undefined') return;
  if (warningStack[log]) return;
  warningStack[log] = true;

  if (process.env.NODE_ENV !== 'production') {
    return console.error(log);
  }

  console.warn(log);
};

var useWarning$1 = useWarning;

var getElementOffset = function getElementOffset(el) {
  if (!el) return {
    top: 0,
    left: 0
  };

  var _el$getBoundingClient = el.getBoundingClientRect(),
      top = _el$getBoundingClient.top,
      left = _el$getBoundingClient.left;

  return {
    top: top,
    left: left
  };
};
var defaultRect$1 = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0,
  height: 0,
  elementTop: -1000
};

var getRectFromDOMWithContainer = function getRectFromDOMWithContainer(domRect, getContainer) {
  if (!domRect) return defaultRect$1;
  var container = getContainer ? getContainer() : null;
  var scrollElement = container || document.documentElement;

  var _getElementOffset = getElementOffset(container),
      offsetTop = _getElementOffset.top,
      offsetLeft = _getElementOffset.left;

  return _objectSpread2(_objectSpread2({}, domRect), {}, {
    width: domRect.width || domRect.right - domRect.left,
    height: domRect.height || domRect.top - domRect.bottom,
    top: domRect.bottom + scrollElement.scrollTop - offsetTop,
    left: domRect.left + scrollElement.scrollLeft - offsetLeft,
    elementTop: domRect.top + scrollElement.scrollTop - offsetTop
  });
};
var getRefRect = function getRefRect(ref, getContainer) {
  if (!ref || !ref.current) return defaultRect$1;
  var rect = ref.current.getBoundingClientRect();
  return getRectFromDOMWithContainer(rect, getContainer);
};

var classObjectToString = function classObjectToString(className) {
  var keys = Object.keys(className);
  var len = keys.length;
  var str = '';

  for (var index = 0; index < len; index++) {
    var key = keys[index];
    var val = className[keys[index]];
    if (!val) continue;
    str = str ? "".concat(str, " ").concat(String(key)) : String(key);
  }

  return str;
};

var isObjectClassName = function isObjectClassName(value) {
  return _typeof(value) === 'object' && !Array.isArray(value);
};

var useClasses = function useClasses() {
  var len = arguments.length;
  var classes = '';
  if (len === 0) return classes;

  for (var index = 0; index < len; index++) {
    var val = index < 0 || arguments.length <= index ? undefined : arguments[index];
    if (!val) continue;

    if (isObjectClassName(val)) {
      classes += " ".concat(classObjectToString(val));
    } else {
      classes += " ".concat(String(val).trim());
    }
  }

  return classes.trim();
};

var useClasses$1 = useClasses;

var defaultRect = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0
};
var Dropdown = /*#__PURE__*/React__default["default"].memo(function (_ref) {
  var children = _ref.children,
      parent = _ref.parent,
      visible = _ref.visible,
      disableMatchWidth = _ref.disableMatchWidth,
      getPopupContainer = _ref.getPopupContainer;
  var el = usePortal$1('dropdown', getPopupContainer);

  var _useState = React.useState(defaultRect),
      _useState2 = _slicedToArray(_useState, 2),
      rect = _useState2[0],
      setRect = _useState2[1];

  var classes = useClasses$1('dropdown', disableMatchWidth ? 'disable-match' : 'width-match');
  if (!parent) return null;
  /* istanbul ignore next */

  if (process.env.NODE_ENV !== 'production') {
    if (getPopupContainer && getPopupContainer()) {
      var _el = getPopupContainer();

      var style = window.getComputedStyle(_el);

      if (style.position === 'static') {
        useWarning$1('The element specified by "getPopupContainer" must have "position" set.');
      }
    }
  }

  var updateRect = function updateRect() {
    var _getRefRect = getRefRect(parent, getPopupContainer),
        top = _getRefRect.top,
        left = _getRefRect.left,
        right = _getRefRect.right,
        nativeWidth = _getRefRect.width;

    setRect({
      top: top,
      left: left,
      right: right,
      width: nativeWidth
    });
  };

  useResize$1(updateRect);
  useClickAnyWhere$1(function () {
    var _getRefRect2 = getRefRect(parent, getPopupContainer),
        top = _getRefRect2.top,
        left = _getRefRect2.left;

    var shouldUpdatePosition = top !== rect.top || left !== rect.left;
    if (!shouldUpdatePosition) return;
    updateRect();
  });
  useDOMObserver$1(parent, function () {
    updateRect();
  });
  React.useEffect(function () {
    if (!parent || !parent.current) return;
    parent.current.addEventListener('mouseenter', updateRect);
    /* istanbul ignore next */

    return function () {
      if (!parent || !parent.current) return;
      parent.current.removeEventListener('mouseenter', updateRect);
    };
  }, [parent]);

  var clickHandler = function clickHandler(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
  };

  var mouseDownHandler = function mouseDownHandler(event) {
    event.preventDefault();
  };

  if (!el) return null;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    visible: visible
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: clickHandler,
    onMouseDown: mouseDownHandler,
    className: styledJsx_cjs.style.dynamic([["1644673105", [rect.top + 2, rect.left, rect.width, rect.width]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1644673105",
    dynamic: [rect.top + 2, rect.left, rect.width, rect.width]
  }, ".dropdown.__jsx-style-dynamic-selector{position:absolute;top:".concat(rect.top + 2, "px;left:").concat(rect.left, "px;z-index:1100;}.width-match.__jsx-style-dynamic-selector{width:").concat(rect.width, "px;}.disable-match.__jsx-style-dynamic-selector{min-width:").concat(rect.width, "px;}")))), el);
});
var Dropdown$1 = Dropdown;

var defaultProps$5 = {
  className: '',
  dropdownStyle: {}
};
var SelectDropdown = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, dropdownRef) {
  var visible = _ref.visible,
      children = _ref.children,
      className = _ref.className,
      dropdownStyle = _ref.dropdownStyle,
      disableMatchWidth = _ref.disableMatchWidth,
      getPopupContainer = _ref.getPopupContainer;
  var theme = useTheme();
  var internalDropdownRef = React.useRef(null);

  var _useSelectContext = useSelectContext(),
      ref = _useSelectContext.ref;

  var classes = useClasses$1('select-dropdown', className);
  React.useImperativeHandle(dropdownRef, function () {
    return internalDropdownRef.current;
  });
  return /*#__PURE__*/React__default["default"].createElement(Dropdown$1, {
    parent: ref,
    visible: visible,
    disableMatchWidth: disableMatchWidth,
    getPopupContainer: getPopupContainer
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    ref: internalDropdownRef,
    style: dropdownStyle,
    className: styledJsx_cjs.style.dynamic([["2782510679", [theme.layout.radius, theme.expressiveness.shadowLarge, theme.palette.background]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2782510679",
    dynamic: [theme.layout.radius, theme.expressiveness.shadowLarge, theme.palette.background]
  }, ".select-dropdown.__jsx-style-dynamic-selector{border-radius:".concat(theme.layout.radius, ";box-shadow:").concat(theme.expressiveness.shadowLarge, ";background-color:").concat(theme.palette.background, ";max-height:17em;overflow-y:auto;overflow-anchor:none;padding:0.38em 0;-webkit-scroll-behavior:smooth;-moz-scroll-behavior:smooth;-ms-scroll-behavior:smooth;scroll-behavior:smooth;}"))));
});
SelectDropdown.defaultProps = defaultProps$5;
SelectDropdown.displayName = 'GeistSelectDropdown';
var SelectDropdown$1 = SelectDropdown;

var ScalePropKeys = ['width', 'height', 'padding', 'margin', 'w', 'h', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'pl', 'pr', 'pt', 'pb', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'ml', 'mr', 'mt', 'mb', 'px', 'py', 'mx', 'my', 'font', 'unit', 'scale'];

var defaultDynamicLayoutPipe = function defaultDynamicLayoutPipe(scale1x) {
  return "".concat(scale1x);
};

var defaultContext = {
  getScaleProps: function getScaleProps() {
    return undefined;
  },
  getAllScaleProps: function getAllScaleProps() {
    return {};
  },
  SCALES: {
    pl: defaultDynamicLayoutPipe,
    pr: defaultDynamicLayoutPipe,
    pb: defaultDynamicLayoutPipe,
    pt: defaultDynamicLayoutPipe,
    px: defaultDynamicLayoutPipe,
    py: defaultDynamicLayoutPipe,
    mb: defaultDynamicLayoutPipe,
    ml: defaultDynamicLayoutPipe,
    mr: defaultDynamicLayoutPipe,
    mt: defaultDynamicLayoutPipe,
    mx: defaultDynamicLayoutPipe,
    my: defaultDynamicLayoutPipe,
    width: defaultDynamicLayoutPipe,
    height: defaultDynamicLayoutPipe,
    font: defaultDynamicLayoutPipe
  },
  unit: '16px'
};
var ScaleContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var useScale$1 = function useScale() {
  return React__default["default"].useContext(ScaleContext);
};

var generateGetScaleProps = function generateGetScaleProps(props) {
  var getScaleProps = function getScaleProps(keyOrKeys) {
    if (!Array.isArray(keyOrKeys)) return props[keyOrKeys];
    var value = undefined;

    var _iterator = _createForOfIteratorHelper(keyOrKeys),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        var currentValue = props[key];

        if (typeof currentValue !== 'undefined') {
          value = currentValue;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return value;
  };

  return getScaleProps;
};
var generateGetAllScaleProps = function generateGetAllScaleProps(props) {
  var getAllScaleProps = function getAllScaleProps() {
    var scaleProps = {};

    var _iterator2 = _createForOfIteratorHelper(ScalePropKeys),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var key = _step2.value;
        var value = props[key];

        if (typeof value !== 'undefined') {
          scaleProps[key] = value;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return scaleProps;
  };

  return getAllScaleProps;
};

var _excluded$5 = ["children"],
    _excluded2 = ["paddingLeft", "pl", "paddingRight", "pr", "paddingTop", "pt", "paddingBottom", "pb", "marginTop", "mt", "marginRight", "mr", "marginBottom", "mb", "marginLeft", "ml", "px", "py", "mx", "my", "width", "height", "font", "w", "h", "margin", "padding", "unit", "scale"];

var reduceScaleCoefficient = function reduceScaleCoefficient(scale) {
  if (scale === 1) return scale;
  var diff = Math.abs((scale - 1) / 2);
  return scale > 1 ? 1 + diff : 1 - diff;
};

var withScale = function withScale(Render) {
  var ScaleFC = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
    var _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref30, _ref31, _ref32, _ref33;

    var children = _ref.children,
        props = _objectWithoutProperties(_ref, _excluded$5);

    var _useTheme = useTheme(),
        layout = _useTheme.layout;

    var paddingLeft = props.paddingLeft,
        pl = props.pl,
        paddingRight = props.paddingRight,
        pr = props.pr,
        paddingTop = props.paddingTop,
        pt = props.pt,
        paddingBottom = props.paddingBottom,
        pb = props.pb,
        marginTop = props.marginTop,
        mt = props.mt,
        marginRight = props.marginRight,
        mr = props.mr,
        marginBottom = props.marginBottom,
        mb = props.mb,
        marginLeft = props.marginLeft,
        ml = props.ml,
        px = props.px,
        py = props.py,
        mx = props.mx,
        my = props.my,
        width = props.width,
        height = props.height,
        font = props.font,
        w = props.w,
        h = props.h,
        margin = props.margin,
        padding = props.padding,
        _props$unit = props.unit,
        unit = _props$unit === void 0 ? layout.unit : _props$unit,
        _props$scale = props.scale,
        scale = _props$scale === void 0 ? 1 : _props$scale,
        innerProps = _objectWithoutProperties(props, _excluded2);

    var makeScaleHandler = function makeScaleHandler(attrValue) {
      return function (scale1x, defaultValue) {
        // 0 means disable scale and the default value is 0
        if (scale1x === 0) {
          scale1x = 1;
          defaultValue = defaultValue || 0;
        }

        var factor = reduceScaleCoefficient(scale) * scale1x;

        if (typeof attrValue === 'undefined') {
          if (typeof defaultValue !== 'undefined') return "".concat(defaultValue);
          return "calc(".concat(factor, " * ").concat(unit, ")");
        }

        if (!isCSSNumberValue(attrValue)) return "".concat(attrValue);
        var customFactor = factor * Number(attrValue);
        return "calc(".concat(customFactor, " * ").concat(unit, ")");
      };
    };

    var value = {
      unit: unit,
      SCALES: {
        pt: makeScaleHandler((_ref2 = (_ref3 = paddingTop !== null && paddingTop !== void 0 ? paddingTop : pt) !== null && _ref3 !== void 0 ? _ref3 : py) !== null && _ref2 !== void 0 ? _ref2 : padding),
        pr: makeScaleHandler((_ref4 = (_ref5 = paddingRight !== null && paddingRight !== void 0 ? paddingRight : pr) !== null && _ref5 !== void 0 ? _ref5 : px) !== null && _ref4 !== void 0 ? _ref4 : padding),
        pb: makeScaleHandler((_ref6 = (_ref7 = paddingBottom !== null && paddingBottom !== void 0 ? paddingBottom : pb) !== null && _ref7 !== void 0 ? _ref7 : py) !== null && _ref6 !== void 0 ? _ref6 : padding),
        pl: makeScaleHandler((_ref8 = (_ref9 = paddingLeft !== null && paddingLeft !== void 0 ? paddingLeft : pl) !== null && _ref9 !== void 0 ? _ref9 : px) !== null && _ref8 !== void 0 ? _ref8 : padding),
        px: makeScaleHandler((_ref10 = (_ref11 = (_ref12 = (_ref13 = px !== null && px !== void 0 ? px : paddingLeft) !== null && _ref13 !== void 0 ? _ref13 : paddingRight) !== null && _ref12 !== void 0 ? _ref12 : pl) !== null && _ref11 !== void 0 ? _ref11 : pr) !== null && _ref10 !== void 0 ? _ref10 : padding),
        py: makeScaleHandler((_ref14 = (_ref15 = (_ref16 = (_ref17 = py !== null && py !== void 0 ? py : paddingTop) !== null && _ref17 !== void 0 ? _ref17 : paddingBottom) !== null && _ref16 !== void 0 ? _ref16 : pt) !== null && _ref15 !== void 0 ? _ref15 : pb) !== null && _ref14 !== void 0 ? _ref14 : padding),
        mt: makeScaleHandler((_ref18 = (_ref19 = marginTop !== null && marginTop !== void 0 ? marginTop : mt) !== null && _ref19 !== void 0 ? _ref19 : my) !== null && _ref18 !== void 0 ? _ref18 : margin),
        mr: makeScaleHandler((_ref20 = (_ref21 = marginRight !== null && marginRight !== void 0 ? marginRight : mr) !== null && _ref21 !== void 0 ? _ref21 : mx) !== null && _ref20 !== void 0 ? _ref20 : margin),
        mb: makeScaleHandler((_ref22 = (_ref23 = marginBottom !== null && marginBottom !== void 0 ? marginBottom : mb) !== null && _ref23 !== void 0 ? _ref23 : my) !== null && _ref22 !== void 0 ? _ref22 : margin),
        ml: makeScaleHandler((_ref24 = (_ref25 = marginLeft !== null && marginLeft !== void 0 ? marginLeft : ml) !== null && _ref25 !== void 0 ? _ref25 : mx) !== null && _ref24 !== void 0 ? _ref24 : margin),
        mx: makeScaleHandler((_ref26 = (_ref27 = (_ref28 = (_ref29 = mx !== null && mx !== void 0 ? mx : marginLeft) !== null && _ref29 !== void 0 ? _ref29 : marginRight) !== null && _ref28 !== void 0 ? _ref28 : ml) !== null && _ref27 !== void 0 ? _ref27 : mr) !== null && _ref26 !== void 0 ? _ref26 : margin),
        my: makeScaleHandler((_ref30 = (_ref31 = (_ref32 = (_ref33 = my !== null && my !== void 0 ? my : marginTop) !== null && _ref33 !== void 0 ? _ref33 : marginBottom) !== null && _ref32 !== void 0 ? _ref32 : mt) !== null && _ref31 !== void 0 ? _ref31 : mb) !== null && _ref30 !== void 0 ? _ref30 : margin),
        width: makeScaleHandler(width !== null && width !== void 0 ? width : w),
        height: makeScaleHandler(height !== null && height !== void 0 ? height : h),
        font: makeScaleHandler(font)
      },
      getScaleProps: generateGetScaleProps(props),
      getAllScaleProps: generateGetAllScaleProps(props)
    };
    return /*#__PURE__*/React__default["default"].createElement(ScaleContext.Provider, {
      value: value
    }, /*#__PURE__*/React__default["default"].createElement(Render, _extends({}, innerProps, {
      ref: ref
    }), children));
  });
  ScaleFC.displayName = "Scale".concat(Render.displayName || 'Wrapper');
  return ScaleFC;
};

var withScale$1 = withScale;

var useScale = useScale$1;

var _excluded$4 = ["xs", "sm", "md", "lg", "xl", "justify", "direction", "alignItems", "alignContent", "children", "className"];
var defaultProps$4 = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  className: ''
};

var getItemLayout = function getItemLayout(val) {
  var display = val === 0 ? 'display: none;' : 'display: inherit;';

  if (typeof val === 'number') {
    var width = 100 / 24 * val;
    var ratio = width > 100 ? '100%' : width < 0 ? '0' : "".concat(width, "%");
    return {
      grow: 0,
      display: display,
      width: ratio,
      basis: ratio
    };
  }

  return {
    grow: 1,
    display: display,
    width: '100%',
    basis: '0'
  };
};

var GridBasicItem = function GridBasicItem(_ref) {
  var xs = _ref.xs,
      sm = _ref.sm,
      md = _ref.md,
      lg = _ref.lg,
      xl = _ref.xl,
      justify = _ref.justify,
      direction = _ref.direction,
      alignItems = _ref.alignItems,
      alignContent = _ref.alignContent,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$4);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = React.useMemo(function () {
    var aligns = {
      justify: justify,
      direction: direction,
      alignItems: alignItems,
      alignContent: alignContent,
      xs: xs,
      sm: sm,
      md: md,
      lg: lg,
      xl: xl
    };
    var classString = Object.keys(aligns).reduce(function (pre, name) {
      if (aligns[name] !== undefined && aligns[name] !== false) return "".concat(pre, " ").concat(name);
      return pre;
    }, '');
    return classString.trim();
  }, [justify, direction, alignItems, alignContent, xs, sm, md, lg, xl]);
  var layout = React.useMemo(function () {
    return {
      xs: getItemLayout(xs),
      sm: getItemLayout(sm),
      md: getItemLayout(md),
      lg: getItemLayout(lg),
      xl: getItemLayout(xl)
    };
  }, [xs, sm, md, lg, xl]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["568430467", [SCALES.font(1, 'inherit'), SCALES.height(1, 'auto'), justify, direction, alignContent, alignItems, layout.xs.grow, layout.xs.width, layout.xs.basis, layout.xs.display, theme.breakpoints.sm.min, layout.sm.grow, layout.sm.width, layout.sm.basis, layout.sm.display, theme.breakpoints.md.min, layout.md.grow, layout.md.width, layout.md.basis, layout.md.display, theme.breakpoints.lg.min, layout.lg.grow, layout.lg.width, layout.lg.basis, layout.lg.display, theme.breakpoints.xl.min, layout.xl.grow, layout.xl.width, layout.xl.basis, layout.xl.display]]]) + " " + (props && props.className != null && props.className || useClasses$1('item', classes, className) || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "568430467",
    dynamic: [SCALES.font(1, 'inherit'), SCALES.height(1, 'auto'), justify, direction, alignContent, alignItems, layout.xs.grow, layout.xs.width, layout.xs.basis, layout.xs.display, theme.breakpoints.sm.min, layout.sm.grow, layout.sm.width, layout.sm.basis, layout.sm.display, theme.breakpoints.md.min, layout.md.grow, layout.md.width, layout.md.basis, layout.md.display, theme.breakpoints.lg.min, layout.lg.grow, layout.lg.width, layout.lg.basis, layout.lg.display, theme.breakpoints.xl.min, layout.xl.grow, layout.xl.width, layout.xl.basis, layout.xl.display]
  }, ".item.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1, 'inherit'), ";height:").concat(SCALES.height(1, 'auto'), ";}.justify.__jsx-style-dynamic-selector{-webkit-box-pack:").concat(justify, ";-webkit-justify-content:").concat(justify, ";-ms-flex-pack:").concat(justify, ";justify-content:").concat(justify, ";}.direction.__jsx-style-dynamic-selector{-webkit-flex-direction:").concat(direction, ";-ms-flex-direction:").concat(direction, ";flex-direction:").concat(direction, ";}.alignContent.__jsx-style-dynamic-selector{-webkit-align-content:").concat(alignContent, ";-ms-flex-line-pack:").concat(alignContent, ";align-content:").concat(alignContent, ";}.alignItems.__jsx-style-dynamic-selector{-webkit-align-items:").concat(alignItems, ";-webkit-box-align:").concat(alignItems, ";-ms-flex-align:").concat(alignItems, ";align-items:").concat(alignItems, ";}.xs.__jsx-style-dynamic-selector{-webkit-box-flex:").concat(layout.xs.grow, ";-webkit-flex-grow:").concat(layout.xs.grow, ";-ms-flex-positive:").concat(layout.xs.grow, ";flex-grow:").concat(layout.xs.grow, ";max-width:").concat(layout.xs.width, ";-webkit-flex-basis:").concat(layout.xs.basis, ";-ms-flex-preferred-size:").concat(layout.xs.basis, ";flex-basis:").concat(layout.xs.basis, ";").concat(layout.xs.display, ";}@media only screen and (min-width:").concat(theme.breakpoints.sm.min, "){.sm.__jsx-style-dynamic-selector{-webkit-box-flex:").concat(layout.sm.grow, ";-webkit-flex-grow:").concat(layout.sm.grow, ";-ms-flex-positive:").concat(layout.sm.grow, ";flex-grow:").concat(layout.sm.grow, ";max-width:").concat(layout.sm.width, ";-webkit-flex-basis:").concat(layout.sm.basis, ";-ms-flex-preferred-size:").concat(layout.sm.basis, ";flex-basis:").concat(layout.sm.basis, ";").concat(layout.sm.display, ";}}@media only screen and (min-width:").concat(theme.breakpoints.md.min, "){.md.__jsx-style-dynamic-selector{-webkit-box-flex:").concat(layout.md.grow, ";-webkit-flex-grow:").concat(layout.md.grow, ";-ms-flex-positive:").concat(layout.md.grow, ";flex-grow:").concat(layout.md.grow, ";max-width:").concat(layout.md.width, ";-webkit-flex-basis:").concat(layout.md.basis, ";-ms-flex-preferred-size:").concat(layout.md.basis, ";flex-basis:").concat(layout.md.basis, ";").concat(layout.md.display, ";}}@media only screen and (min-width:").concat(theme.breakpoints.lg.min, "){.lg.__jsx-style-dynamic-selector{-webkit-box-flex:").concat(layout.lg.grow, ";-webkit-flex-grow:").concat(layout.lg.grow, ";-ms-flex-positive:").concat(layout.lg.grow, ";flex-grow:").concat(layout.lg.grow, ";max-width:").concat(layout.lg.width, ";-webkit-flex-basis:").concat(layout.lg.basis, ";-ms-flex-preferred-size:").concat(layout.lg.basis, ";flex-basis:").concat(layout.lg.basis, ";").concat(layout.lg.display, ";}}@media only screen and (min-width:").concat(theme.breakpoints.xl.min, "){.xl.__jsx-style-dynamic-selector{-webkit-box-flex:").concat(layout.xl.grow, ";-webkit-flex-grow:").concat(layout.xl.grow, ";-ms-flex-positive:").concat(layout.xl.grow, ";flex-grow:").concat(layout.xl.grow, ";max-width:").concat(layout.xl.width, ";-webkit-flex-basis:").concat(layout.xl.basis, ";-ms-flex-preferred-size:").concat(layout.xl.basis, ";flex-basis:").concat(layout.xl.basis, ";").concat(layout.xl.display, ";}}")));
};

GridBasicItem.defaultProps = defaultProps$4;
GridBasicItem.displayName = 'GeistGridBasicItem';
var GridBasicItem$1 = GridBasicItem;

var _excluded$3 = ["children", "className"];
var defaultProps$3 = {
  className: ''
};

var GridComponent = function GridComponent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$3);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _styles$className = {
    styles: /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "1271839607",
      dynamic: [SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0, 'var(--grid-gap-unit)'), SCALES.pr(0, 'var(--grid-gap-unit)'), SCALES.pb(0, 'var(--grid-gap-unit)'), SCALES.pl(0, 'var(--grid-gap-unit)')]
    }, "div.__jsx-style-dynamic-selector{margin:".concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";box-sizing:border-box;padding:").concat(SCALES.pt(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pr(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pb(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pl(0, 'var(--grid-gap-unit)'), ";}")),
    className: styledJsx_cjs.style.dynamic([["1271839607", [SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0, 'var(--grid-gap-unit)'), SCALES.pr(0, 'var(--grid-gap-unit)'), SCALES.pb(0, 'var(--grid-gap-unit)'), SCALES.pl(0, 'var(--grid-gap-unit)')]]])
  },
      resolveClassName = _styles$className.className,
      styles = _styles$className.styles;
  var classes = useClasses$1(resolveClassName, className);
  return /*#__PURE__*/React__default["default"].createElement(GridBasicItem$1, _extends({
    className: classes
  }, props), children, styles);
};

GridComponent.defaultProps = defaultProps$3;
GridComponent.displayName = 'GeistGrid';
var Grid = withScale$1(GridComponent);
var Grid$1 = Grid;

var _excluded$2 = ["gap", "wrap", "children", "className"];
var defaultProps$2 = {
  gap: 0,
  wrap: 'wrap',
  className: ''
};

var GridContainerComponent = function GridContainerComponent(_ref) {
  var gap = _ref.gap,
      wrap = _ref.wrap,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$2);

  var _useScale = useScale(),
      unit = _useScale.unit,
      SCALES = _useScale.SCALES;

  var gapUnit = React.useMemo(function () {
    return "calc(".concat(gap, " * ").concat(unit, " * 1/3)");
  }, [gap, unit]);
  var _styles$className = {
    styles: /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "3631618093",
      dynamic: [gapUnit, wrap, SCALES.width(1, 'var(--grid-container-width)'), SCALES.mt(0, 'var(--grid-container-margin)'), SCALES.mr(0, 'var(--grid-container-margin)'), SCALES.mb(0, 'var(--grid-container-margin)'), SCALES.ml(0, 'var(--grid-container-margin)')]
    }, "div.__jsx-style-dynamic-selector{--grid-gap-unit:".concat(gapUnit, ";--grid-container-margin:calc(-1 * var(--grid-gap-unit));--grid-container-width:calc(100% + var(--grid-gap-unit) * 2);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:").concat(wrap, ";-ms-flex-wrap:").concat(wrap, ";flex-wrap:").concat(wrap, ";box-sizing:border-box;width:").concat(SCALES.width(1, 'var(--grid-container-width)'), ";margin:").concat(SCALES.mt(0, 'var(--grid-container-margin)'), " ").concat(SCALES.mr(0, 'var(--grid-container-margin)'), " ").concat(SCALES.mb(0, 'var(--grid-container-margin)'), " ").concat(SCALES.ml(0, 'var(--grid-container-margin)'), ";}")),
    className: styledJsx_cjs.style.dynamic([["3631618093", [gapUnit, wrap, SCALES.width(1, 'var(--grid-container-width)'), SCALES.mt(0, 'var(--grid-container-margin)'), SCALES.mr(0, 'var(--grid-container-margin)'), SCALES.mb(0, 'var(--grid-container-margin)'), SCALES.ml(0, 'var(--grid-container-margin)')]]])
  },
      resolveClassName = _styles$className.className,
      styles = _styles$className.styles;
  var classes = useClasses$1(resolveClassName, className);
  return /*#__PURE__*/React__default["default"].createElement(GridBasicItem$1, _extends({
    className: classes
  }, props), children, styles);
};

GridContainerComponent.defaultProps = defaultProps$2;
GridContainerComponent.displayName = 'GeistGridContainer';
var GridContainer = withScale$1(GridContainerComponent);
var GridContainer$1 = GridContainer;

Grid$1.Container = GridContainer$1;

var SelectIconClear = function SelectIconClear(_ref) {
  var onClick = _ref.onClick;
  var theme = useTheme();

  var clickHandler = function clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    onClick && onClick(event);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["1984024521", [theme.palette.accents_3, theme.palette.foreground]]]) + " " + "clear-icon"
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["1984024521", [theme.palette.accents_3, theme.palette.foreground]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M18 6L6 18",
    className: styledJsx_cjs.style.dynamic([["1984024521", [theme.palette.accents_3, theme.palette.foreground]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 6l12 12",
    className: styledJsx_cjs.style.dynamic([["1984024521", [theme.palette.accents_3, theme.palette.foreground]]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1984024521",
    dynamic: [theme.palette.accents_3, theme.palette.foreground]
  }, ".clear-icon.__jsx-style-dynamic-selector{padding:0 0 0 0.5em;margin:0;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;cursor:pointer;box-sizing:border-box;-webkit-transition:color 150ms ease 0s;transition:color 150ms ease 0s;color:".concat(theme.palette.accents_3, ";visibility:visible;opacity:1;}.clear-icon.__jsx-style-dynamic-selector:hover{color:").concat(theme.palette.foreground, ";}svg.__jsx-style-dynamic-selector{color:currentColor;width:1em;height:1em;}")));
};

var MemoSelectIconClear = /*#__PURE__*/React__default["default"].memo(SelectIconClear);
var SelectClearIcon = MemoSelectIconClear;

var SelectMultipleValue = function SelectMultipleValue(_ref) {
  var disabled = _ref.disabled,
      onClear = _ref.onClear,
      children = _ref.children;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement(Grid$1, null, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3357578496", [theme.layout.radius, theme.palette.accents_2, disabled ? theme.palette.accents_4 : theme.palette.accents_6]]]) + " " + "item"
  }, children, !!onClear && /*#__PURE__*/React__default["default"].createElement(SelectClearIcon, {
    onClick: onClear
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3357578496",
    dynamic: [theme.layout.radius, theme.palette.accents_2, disabled ? theme.palette.accents_4 : theme.palette.accents_6]
  }, ".item.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;justify-items:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;line-height:1;padding:0 0.5em;font-size:var(--select-font-size);height:calc(var(--select-font-size) * 2);border-radius:".concat(theme.layout.radius, ";background-color:").concat(theme.palette.accents_2, ";color:").concat(disabled ? theme.palette.accents_4 : theme.palette.accents_6, ";}.item.__jsx-style-dynamic-selector>div:not(.clear-icon),.item.__jsx-style-dynamic-selector>div:not(.clear-icon):hover{border-radius:0;background-color:transparent;padding:0;margin:0;color:inherit;}")));
};

SelectMultipleValue.displayName = 'GeistSelectMultipleValue';
var SelectMultipleValue$1 = SelectMultipleValue;

var getColors = function getColors(palette, status) {
  var colors = {
    "default": {
      border: palette.border,
      borderActive: palette.foreground,
      iconBorder: palette.accents_5,
      placeholderColor: palette.accents_3
    },
    secondary: {
      border: palette.border,
      borderActive: palette.foreground,
      iconBorder: palette.accents_5,
      placeholderColor: palette.accents_3
    },
    success: {
      border: palette.successLight,
      borderActive: palette.successDark,
      iconBorder: palette.success,
      placeholderColor: palette.accents_3
    },
    warning: {
      border: palette.warningLight,
      borderActive: palette.warningDark,
      iconBorder: palette.warning,
      placeholderColor: palette.accents_3
    },
    error: {
      border: palette.errorLight,
      borderActive: palette.errorDark,
      iconBorder: palette.error,
      placeholderColor: palette.error
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var Ellipsis = function Ellipsis(_ref) {
  var children = _ref.children,
      height = _ref.height;
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["822089635", [height]]])
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "822089635",
    dynamic: [height]
  }, "span.__jsx-style-dynamic-selector{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:".concat(height, ";min-width:0;}")));
};

var Ellipsis$1 = /*#__PURE__*/React__default["default"].memo(Ellipsis);

var SelectInput = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, inputRef) {
  var visible = _ref.visible,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus;
  var ref = React.useRef(null);
  React.useImperativeHandle(inputRef, function () {
    return ref.current;
  });
  React.useEffect(function () {
    if (visible) {
      var _ref$current;

      (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.focus();
    }
  }, [visible]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("input", {
    ref: ref,
    type: "search",
    role: "combobox",
    "aria-haspopup": "listbox",
    readOnly: true,
    unselectable: "on",
    "aria-expanded": visible,
    onBlur: onBlur,
    onFocus: onFocus,
    className: "jsx-2813108835"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2813108835"
  }, "input.jsx-2813108835{position:fixed;top:-10000px;left:-10000px;opacity:0;z-index:-1;width:0;height:0;padding:0;font-size:0;border:none;}"));
});
SelectInput.displayName = 'GeistSelectInput';
var SelectInput$1 = SelectInput;

var _excluded$1 = ["children", "type", "disabled", "initialValue", "value", "icon", "onChange", "pure", "multiple", "clearable", "placeholder", "className", "dropdownClassName", "dropdownStyle", "disableMatchWidth", "getPopupContainer", "onDropdownVisibleChange"];
var defaultProps$1 = {
  disabled: false,
  type: 'default',
  icon: SelectIcon$1,
  pure: false,
  multiple: false,
  clearable: true,
  className: '',
  disableMatchWidth: false,
  onDropdownVisibleChange: function onDropdownVisibleChange() {}
};
var SelectComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, selectRef) {
  var children = _ref.children,
      type = _ref.type,
      disabled = _ref.disabled,
      init = _ref.initialValue,
      customValue = _ref.value,
      Icon = _ref.icon,
      onChange = _ref.onChange,
      pure = _ref.pure,
      multiple = _ref.multiple,
      clearable = _ref.clearable,
      placeholder = _ref.placeholder,
      className = _ref.className,
      dropdownClassName = _ref.dropdownClassName,
      dropdownStyle = _ref.dropdownStyle,
      disableMatchWidth = _ref.disableMatchWidth,
      getPopupContainer = _ref.getPopupContainer,
      onDropdownVisibleChange = _ref.onDropdownVisibleChange,
      props = _objectWithoutProperties(_ref, _excluded$1);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var ref = React.useRef(null);
  var inputRef = React.useRef(null);
  var dropdownRef = React.useRef(null);

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      selectFocus = _useState4[0],
      setSelectFocus = _useState4[1];

  var _useCurrentState = useCurrentState$1(function () {
    if (!multiple) return init;
    if (Array.isArray(init)) return init;
    return typeof init === 'undefined' ? [] : [init];
  }),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      value = _useCurrentState2[0],
      setValue = _useCurrentState2[1],
      valueRef = _useCurrentState2[2];

  var isEmpty = React.useMemo(function () {
    if (!Array.isArray(value)) return !value;
    return value.length === 0;
  }, [value]);

  var _useMemo = React.useMemo(function () {
    return getColors(theme.palette, type);
  }, [theme.palette, type]),
      border = _useMemo.border,
      borderActive = _useMemo.borderActive,
      iconBorder = _useMemo.iconBorder,
      placeholderColor = _useMemo.placeholderColor;

  var updateVisible = function updateVisible(next) {
    onDropdownVisibleChange(next);
    setVisible(next);
  };

  var updateValue = function updateValue(next) {
    setValue(function (last) {
      if (!Array.isArray(last)) return next;
      if (!last.includes(next)) return [].concat(_toConsumableArray(last), [next]);
      return last.filter(function (item) {
        return item !== next;
      });
    });
    onChange && onChange(valueRef.current);

    if (!multiple) {
      updateVisible(false);
    }
  };

  var initialValue = React.useMemo(function () {
    return {
      value: value,
      visible: visible,
      updateValue: updateValue,
      updateVisible: updateVisible,
      ref: ref,
      disableAll: disabled
    };
  }, [visible, disabled, ref, value, multiple]);

  var clickHandler = function clickHandler(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    if (disabled) return;
    updateVisible(!visible);
    event.preventDefault();
  };

  var mouseDownHandler = function mouseDownHandler(event) {
    /* istanbul ignore next */
    if (visible) {
      event.preventDefault();
    }
  };

  React.useEffect(function () {
    if (customValue === undefined) return;
    setValue(customValue);
  }, [customValue]);
  React.useImperativeHandle(selectRef, function () {
    return {
      focus: function focus() {
        var _inputRef$current;

        return (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
      },
      blur: function blur() {
        var _inputRef$current2;

        return (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.blur();
      },
      scrollTo: function scrollTo(options) {
        var _dropdownRef$current;

        return (_dropdownRef$current = dropdownRef.current) === null || _dropdownRef$current === void 0 ? void 0 : _dropdownRef$current.scrollTo(options);
      }
    };
  }, [inputRef, dropdownRef]);
  var selectedChild = React.useMemo(function () {
    var _pickChildByProps = pickChildByProps(children, 'value', value),
        _pickChildByProps2 = _slicedToArray(_pickChildByProps, 2),
        optionChildren = _pickChildByProps2[1];

    return React__default["default"].Children.map(optionChildren, function (child) {
      if (! /*#__PURE__*/React__default["default"].isValidElement(child)) return null;
      var el = /*#__PURE__*/React__default["default"].cloneElement(child, {
        preventAllEvents: true
      });
      if (!multiple) return el;
      return /*#__PURE__*/React__default["default"].createElement(SelectMultipleValue$1, {
        disabled: disabled,
        onClear: clearable ? function () {
          return updateValue(child.props.value);
        } : null
      }, el);
    });
  }, [value, children, multiple]);

  var onInputBlur = function onInputBlur() {
    updateVisible(false);
    setSelectFocus(false);
  };

  var classes = useClasses$1('select', {
    active: selectFocus || visible,
    multiple: multiple
  }, className);
  return /*#__PURE__*/React__default["default"].createElement(SelectContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: ref,
    onClick: clickHandler,
    onMouseDown: mouseDownHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["3282295248", [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement(SelectInput$1, {
    ref: inputRef,
    visible: visible,
    onBlur: onInputBlur,
    onFocus: function onFocus() {
      return setSelectFocus(true);
    }
  }), isEmpty && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3282295248", [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]]]) + " " + "value placeholder"
  }, /*#__PURE__*/React__default["default"].createElement(Ellipsis$1, {
    height: "var(--select-height)"
  }, placeholder)), value && !multiple && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3282295248", [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]]]) + " " + "value"
  }, selectedChild), value && multiple && /*#__PURE__*/React__default["default"].createElement(Grid$1.Container, {
    gap: 0.5
  }, selectedChild), /*#__PURE__*/React__default["default"].createElement(SelectDropdown$1, {
    ref: dropdownRef,
    visible: visible,
    className: dropdownClassName,
    dropdownStyle: dropdownStyle,
    disableMatchWidth: disableMatchWidth,
    getPopupContainer: getPopupContainer
  }, children), !pure && /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3282295248", [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]]]) + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: styledJsx_cjs.style.dynamic([["3282295248", [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3282295248",
    dynamic: [disabled ? 'not-allowed' : 'pointer', border, theme.layout.radius, disabled ? theme.palette.accents_1 : theme.palette.background, SCALES.font(0.875), SCALES.height(2.25), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0.334), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.334), SCALES.pr(0.334), SCALES.pb(0.334), SCALES.pl(0.667), disabled ? theme.palette.border : borderActive, disabled ? theme.palette.accents_5 : borderActive, disabled ? theme.palette.accents_4 : theme.palette.foreground, placeholderColor, theme.layout.gapQuarter, visible ? '180' : '0', iconBorder]
  }, ".select.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;position:relative;cursor:".concat(disabled ? 'not-allowed' : 'pointer', ";max-width:90vw;overflow:hidden;-webkit-transition:border 150ms ease-in 0s,color 200ms ease-out 0s, box-shadow 200ms ease 0s;transition:border 150ms ease-in 0s,color 200ms ease-out 0s, box-shadow 200ms ease 0s;border:1px solid ").concat(border, ";border-radius:").concat(theme.layout.radius, ";background-color:").concat(disabled ? theme.palette.accents_1 : theme.palette.background, ";--select-font-size:").concat(SCALES.font(0.875), ";--select-height:").concat(SCALES.height(2.25), ";min-width:11.5em;width:").concat(SCALES.width(1, 'initial'), ";height:var(--select-height);padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.334), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.667), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.multiple.__jsx-style-dynamic-selector{height:auto;min-height:var(--select-height);padding:").concat(SCALES.pt(0.334), " ").concat(SCALES.pr(0.334), " ").concat(SCALES.pb(0.334), " ").concat(SCALES.pl(0.667), ";}.select.active.__jsx-style-dynamic-selector,.select.__jsx-style-dynamic-selector:hover{border-color:").concat(disabled ? theme.palette.border : borderActive, ";}.select.active.icon.__jsx-style-dynamic-selector,.select.__jsx-style-dynamic-selector:hover .icon.__jsx-style-dynamic-selector{color:").concat(disabled ? theme.palette.accents_5 : borderActive, ";}.value.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex:1;-ms-flex:1;flex:1;height:100%;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;line-height:1;padding:0;margin-right:1.25em;font-size:var(--select-font-size);color:").concat(disabled ? theme.palette.accents_4 : theme.palette.foreground, ";width:calc(100% - 1.25em);}.value.__jsx-style-dynamic-selector>div,.value.__jsx-style-dynamic-selector>div:hover{border-radius:0;background-color:transparent;padding:0;margin:0;color:inherit;}.placeholder.__jsx-style-dynamic-selector{color:").concat(placeholderColor, ";}.icon.__jsx-style-dynamic-selector{position:absolute;right:").concat(theme.layout.gapQuarter, ";font-size:var(--select-font-size);top:50%;bottom:0;-webkit-transform:translateY(-50%) rotate(").concat(visible ? '180' : '0', "deg);-ms-transform:translateY(-50%) rotate(").concat(visible ? '180' : '0', "deg);transform:translateY(-50%) rotate(").concat(visible ? '180' : '0', "deg);pointer-events:none;-webkit-transition:-webkit-transform 200ms ease;-webkit-transition:transform 200ms ease;transition:transform 200ms ease;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:").concat(iconBorder, ";}"))));
});
SelectComponent.defaultProps = defaultProps$1;
SelectComponent.displayName = 'GeistSelect';
var Select = withScale$1(SelectComponent);
var Select$1 = Select;

var _excluded = ["value", "className", "children", "disabled", "divider", "label", "preventAllEvents"];
var defaultProps = {
  disabled: false,
  divider: false,
  label: false,
  className: '',
  preventAllEvents: false
};

var SelectOptionComponent = function SelectOptionComponent(_ref) {
  var identValue = _ref.value,
      className = _ref.className,
      children = _ref.children,
      disabled = _ref.disabled,
      divider = _ref.divider,
      label = _ref.label,
      preventAllEvents = _ref.preventAllEvents,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useSelectContext = useSelectContext(),
      updateValue = _useSelectContext.updateValue,
      value = _useSelectContext.value,
      disableAll = _useSelectContext.disableAll;

  var isDisabled = React.useMemo(function () {
    return disabled || disableAll;
  }, [disabled, disableAll]);
  var isLabel = React.useMemo(function () {
    return label || divider;
  }, [label, divider]);
  var classes = useClasses$1('option', {
    divider: divider,
    label: label
  }, className);

  if (!isLabel && identValue === undefined) {
    useWarning$1('The props "value" is required.', 'Select Option');
  }

  var selected = React.useMemo(function () {
    if (!value) return false;

    if (typeof value === 'string') {
      return identValue === value;
    }

    return value.includes("".concat(identValue));
  }, [identValue, value]);
  var bgColor = React.useMemo(function () {
    if (isDisabled) return theme.palette.accents_1;
    return selected ? theme.palette.accents_2 : theme.palette.background;
  }, [selected, isDisabled, theme.palette]);
  var hoverBgColor = React.useMemo(function () {
    if (isDisabled || isLabel || selected) return bgColor;
    return theme.palette.accents_1;
  }, [selected, isDisabled, theme.palette, isLabel, bgColor]);
  var color = React.useMemo(function () {
    if (isDisabled) return theme.palette.accents_4;
    return selected ? theme.palette.foreground : theme.palette.accents_5;
  }, [selected, isDisabled, theme.palette]);

  var clickHandler = function clickHandler(event) {
    if (preventAllEvents) return;
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    if (isDisabled || isLabel) return;
    updateValue && updateValue(identValue);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["199367556", [bgColor, color, isDisabled ? 'not-allowed' : 'pointer', SCALES.font(0.75), SCALES.width(1, '100%'), SCALES.height(2.25), SCALES.pt(0), SCALES.pr(0.667), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverBgColor, theme.palette.accents_7, theme.palette.border, SCALES.width(1, '100%'), SCALES.height(1, 0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0.5), SCALES.mr(0), SCALES.mb(0.5), SCALES.ml(0), theme.palette.accents_7, theme.palette.border, SCALES.font(0.875), SCALES.width(1, '100%')]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement(Ellipsis$1, {
    height: SCALES.height(2.25)
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "199367556",
    dynamic: [bgColor, color, isDisabled ? 'not-allowed' : 'pointer', SCALES.font(0.75), SCALES.width(1, '100%'), SCALES.height(2.25), SCALES.pt(0), SCALES.pr(0.667), SCALES.pb(0), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverBgColor, theme.palette.accents_7, theme.palette.border, SCALES.width(1, '100%'), SCALES.height(1, 0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0.5), SCALES.mr(0), SCALES.mb(0.5), SCALES.ml(0), theme.palette.accents_7, theme.palette.border, SCALES.font(0.875), SCALES.width(1, '100%')]
  }, ".option.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;max-width:100%;box-sizing:border-box;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-weight:normal;background-color:".concat(bgColor, ";color:").concat(color, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:0;cursor:").concat(isDisabled ? 'not-allowed' : 'pointer', ";-webkit-transition:background 0.2s ease 0s,border-color 0.2s ease 0s;transition:background 0.2s ease 0s,border-color 0.2s ease 0s;--select-font-size:").concat(SCALES.font(0.75), ";font-size:var(--select-font-size);width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(2.25), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.667), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.667), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.option.__jsx-style-dynamic-selector:hover{background-color:").concat(hoverBgColor, ";color:").concat(theme.palette.accents_7, ";}.divider.__jsx-style-dynamic-selector{line-height:0;overflow:hidden;border-top:1px solid ").concat(theme.palette.border, ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 0), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0.5), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0.5), " ").concat(SCALES.ml(0), ";}.label.__jsx-style-dynamic-selector{color:").concat(theme.palette.accents_7, ";border-bottom:1px solid ").concat(theme.palette.border, ";text-transform:capitalize;cursor:default;font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, '100%'), ";font-weight:500;}")));
};

SelectOptionComponent.defaultProps = defaultProps;
SelectOptionComponent.displayName = 'GeistSelectOption';
var SelectOption = withScale$1(SelectOptionComponent);
var SelectOption$1 = SelectOption;

Select$1.Option = SelectOption$1;

exports["default"] = Select$1;
