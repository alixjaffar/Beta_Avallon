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

var getId = function getId() {
  return Math.random().toString(32).slice(2, 10);
};
var getReactNode = function getReactNode(node) {
  if (!node) return null;
  if (typeof node !== 'function') return node;
  return node();
};
var isBrowser = function isBrowser() {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
};
var isCSSNumberValue = function isCSSNumberValue(value) {
  return value !== undefined && !Number.isNaN(+value);
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

var _excluded$4 = ["children", "className", "visible", "enterTime", "leaveTime", "clearTime", "name"];
var defaultProps$3 = {
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
      props = _objectWithoutProperties(_ref, _excluded$4);

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

CssTransition.defaultProps = defaultProps$3;
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

var getColors = function getColors(type, palette) {
  var colors = {
    "default": palette.background,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    secondary: palette.secondary,
    dark: palette.foreground,
    lite: palette.background
  };
  var color = type === 'lite' || type === 'default' ? palette.foreground : palette.background;
  return {
    color: color,
    bgColor: colors[type]
  };
};

var defaultTooltipPosition = {
  top: '-1000px',
  left: '-1000px',
  transform: 'none'
};
var getPosition = function getPosition(placement, rect, offset) {
  var positions = {
    top: {
      top: "".concat(rect.top - offset, "px"),
      left: "".concat(rect.left + rect.width / 2, "px"),
      transform: 'translate(-50%, -100%)'
    },
    topStart: {
      top: "".concat(rect.top - offset, "px"),
      left: "".concat(rect.left, "px"),
      transform: 'translate(0, -100%)'
    },
    topEnd: {
      top: "".concat(rect.top - offset, "px"),
      left: "".concat(rect.left + rect.width, "px"),
      transform: 'translate(-100%, -100%)'
    },
    bottom: {
      top: "".concat(rect.bottom + offset, "px"),
      left: "".concat(rect.left + rect.width / 2, "px"),
      transform: 'translate(-50%, 0)'
    },
    bottomStart: {
      top: "".concat(rect.bottom + offset, "px"),
      left: "".concat(rect.left, "px"),
      transform: 'translate(0, 0)'
    },
    bottomEnd: {
      top: "".concat(rect.bottom + offset, "px"),
      left: "".concat(rect.left + rect.width, "px"),
      transform: 'translate(-100%, 0)'
    },
    left: {
      top: "".concat(rect.top + rect.height / 2, "px"),
      left: "".concat(rect.left - offset, "px"),
      transform: 'translate(-100%, -50%)'
    },
    leftStart: {
      top: "".concat(rect.top, "px"),
      left: "".concat(rect.left - offset, "px"),
      transform: 'translate(-100%, 0)'
    },
    leftEnd: {
      top: "".concat(rect.top + rect.height, "px"),
      left: "".concat(rect.left - offset, "px"),
      transform: 'translate(-100%, -100%)'
    },
    right: {
      top: "".concat(rect.top + rect.height / 2, "px"),
      left: "".concat(rect.right + offset, "px"),
      transform: 'translate(0, -50%)'
    },
    rightStart: {
      top: "".concat(rect.top, "px"),
      left: "".concat(rect.right + offset, "px"),
      transform: 'translate(0, 0)'
    },
    rightEnd: {
      top: "".concat(rect.top + rect.height, "px"),
      left: "".concat(rect.right + offset, "px"),
      transform: 'translate(0, -100%)'
    }
  };
  return positions[placement] || positions.top;
};
var getIconPosition = function getIconPosition(placement, offsetX, offsetY) {
  var offsetAbsolute = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '3px';
  var positions = {
    top: {
      top: 'auto',
      right: 'auto',
      left: '50%',
      bottom: "".concat(offsetAbsolute),
      transform: 'translate(-50%, 100%) rotate(-90deg)'
    },
    topStart: {
      top: 'auto',
      right: 'auto',
      left: "".concat(offsetX),
      bottom: "".concat(offsetAbsolute),
      transform: 'translate(0, 100%) rotate(-90deg)'
    },
    topEnd: {
      top: 'auto',
      right: "".concat(offsetX),
      left: 'auto',
      bottom: "".concat(offsetAbsolute),
      transform: 'translate(0, 100%) rotate(-90deg)'
    },
    bottom: {
      top: "".concat(offsetAbsolute),
      right: 'auto',
      left: '50%',
      bottom: 'auto',
      transform: 'translate(-50%, -100%) rotate(90deg)'
    },
    bottomStart: {
      top: "".concat(offsetAbsolute),
      right: 'auto',
      left: "".concat(offsetX),
      bottom: 'auto',
      transform: 'translate(0, -100%) rotate(90deg)'
    },
    bottomEnd: {
      top: "".concat(offsetAbsolute),
      right: "".concat(offsetX),
      left: 'auto',
      bottom: 'auto',
      transform: 'translate(0, -100%) rotate(90deg)'
    },
    left: {
      top: '50%',
      right: '0',
      left: 'auto',
      bottom: 'auto',
      transform: 'translate(100%, -50%) rotate(180deg)'
    },
    leftStart: {
      top: "".concat(offsetY),
      right: '0',
      left: 'auto',
      bottom: 'auto',
      transform: 'translate(100%, -50%) rotate(180deg)'
    },
    leftEnd: {
      top: 'auto',
      right: '0',
      left: 'auto',
      bottom: "".concat(offsetY),
      transform: 'translate(100%, 50%) rotate(180deg)'
    },
    right: {
      top: '50%',
      right: 'auto',
      left: '0',
      bottom: 'auto',
      transform: 'translate(-100%, -50%) rotate(0deg)'
    },
    rightStart: {
      top: "".concat(offsetY),
      right: 'auto',
      left: '0',
      bottom: 'auto',
      transform: 'translate(-100%, -50%) rotate(0deg)'
    },
    rightEnd: {
      top: 'auto',
      right: 'auto',
      left: '0',
      bottom: "".concat(offsetY),
      transform: 'translate(-100%, 50%) rotate(0deg)'
    }
  };
  return positions[placement] || positions.top;
};

var TooltipIcon = function TooltipIcon(_ref) {
  var placement = _ref.placement,
      shadow = _ref.shadow;
  var theme = useTheme();

  var _useMemo = React.useMemo(function () {
    return getIconPosition(placement, 'var(--tooltip-icon-offset-x)', 'var(--tooltip-icon-offset-y)');
  }, [placement]),
      transform = _useMemo.transform,
      top = _useMemo.top,
      left = _useMemo.left,
      right = _useMemo.right,
      bottom = _useMemo.bottom;

  var bgColorWithDark = React.useMemo(function () {
    if (!shadow || theme.type !== 'dark') return 'var(--tooltip-content-bg)';
    return theme.palette.accents_2;
  }, [theme.type, shadow]);
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2440507693", [bgColorWithDark, left, top, right, bottom, transform]]])
  }, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2440507693",
    dynamic: [bgColorWithDark, left, top, right, bottom, transform]
  }, "span.__jsx-style-dynamic-selector{width:0;height:0;border-style:solid;border-width:6px 7px 6px 0;border-color:transparent ".concat(bgColorWithDark, " transparent transparent;position:absolute;left:").concat(left, ";top:").concat(top, ";right:").concat(right, ";bottom:").concat(bottom, ";-webkit-transform:").concat(transform, ";-ms-transform:").concat(transform, ";transform:").concat(transform, ";}")));
};

var TooltipIcon$1 = TooltipIcon;

var ScalePropKeys = ['width', 'height', 'padding', 'margin', 'w', 'h', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'pl', 'pr', 'pt', 'pb', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'ml', 'mr', 'mt', 'mb', 'px', 'py', 'mx', 'my', 'font', 'unit', 'scale'];

var defaultDynamicLayoutPipe = function defaultDynamicLayoutPipe(scale1x) {
  return "".concat(scale1x);
};

var defaultContext$1 = {
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
var ScaleContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
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

var _excluded$3 = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$3);

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

var defaultRect = {
  top: -1000,
  left: -1000,
  right: -1000,
  bottom: -1000,
  width: 0,
  height: 0
};
var getRect = function getRect(ref) {
  if (!ref || !ref.current) return defaultRect;
  var rect = ref.current.getBoundingClientRect();
  return _objectSpread2(_objectSpread2({}, rect), {}, {
    width: rect.width || rect.right - rect.left,
    height: rect.height || rect.bottom - rect.top,
    top: rect.top + document.documentElement.scrollTop,
    bottom: rect.bottom + document.documentElement.scrollTop,
    left: rect.left + document.documentElement.scrollLeft,
    right: rect.right + document.documentElement.scrollLeft
  });
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

var TooltipContent = function TooltipContent(_ref) {
  var children = _ref.children,
      parent = _ref.parent,
      visible = _ref.visible,
      offset = _ref.offset,
      iconOffset = _ref.iconOffset,
      placement = _ref.placement,
      type = _ref.type,
      className = _ref.className,
      hideArrow = _ref.hideArrow;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var el = usePortal$1('tooltip');
  var selfRef = React.useRef(null);

  var _useState = React.useState(defaultTooltipPosition),
      _useState2 = _slicedToArray(_useState, 2),
      rect = _useState2[0],
      setRect = _useState2[1];

  var colors = React.useMemo(function () {
    return getColors(type, theme.palette);
  }, [type, theme.palette]);
  var hasShadow = type === 'default';
  var classes = useClasses$1('tooltip-content', className);
  if (!parent) return null;

  var updateRect = function updateRect() {
    var position = getPosition(placement, getRect(parent), offset);
    setRect(position);
  };

  useResize$1(updateRect);
  useClickAnyWhere$1(function () {
    return updateRect();
  });
  React.useEffect(function () {
    updateRect();
  }, [visible]);

  var preventHandler = function preventHandler(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  if (!el) return null;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    visible: visible
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    ref: selfRef,
    onClick: preventHandler,
    className: styledJsx_cjs.style.dynamic([["2387841858", [iconOffset.x, iconOffset.y, colors.bgColor, rect.top, rect.left, rect.transform, colors.color, theme.layout.radius, hasShadow ? theme.expressiveness.shadowMedium : 'none', SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.font(1), SCALES.pt(0.65), SCALES.pr(0.9), SCALES.pb(0.65), SCALES.pl(0.9)]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2387841858", [iconOffset.x, iconOffset.y, colors.bgColor, rect.top, rect.left, rect.transform, colors.color, theme.layout.radius, hasShadow ? theme.expressiveness.shadowMedium : 'none', SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.font(1), SCALES.pt(0.65), SCALES.pr(0.9), SCALES.pb(0.65), SCALES.pl(0.9)]]]) + " " + "inner"
  }, !hideArrow && /*#__PURE__*/React__default["default"].createElement(TooltipIcon$1, {
    placement: placement,
    shadow: hasShadow
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2387841858",
    dynamic: [iconOffset.x, iconOffset.y, colors.bgColor, rect.top, rect.left, rect.transform, colors.color, theme.layout.radius, hasShadow ? theme.expressiveness.shadowMedium : 'none', SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.font(1), SCALES.pt(0.65), SCALES.pr(0.9), SCALES.pb(0.65), SCALES.pl(0.9)]
  }, ".tooltip-content.__jsx-style-dynamic-selector{--tooltip-icon-offset-x:".concat(iconOffset.x, ";--tooltip-icon-offset-y:").concat(iconOffset.y, ";--tooltip-content-bg:").concat(colors.bgColor, ";box-sizing:border-box;position:absolute;top:").concat(rect.top, ";left:").concat(rect.left, ";-webkit-transform:").concat(rect.transform, ";-ms-transform:").concat(rect.transform, ";transform:").concat(rect.transform, ";background-color:var(--tooltip-content-bg);color:").concat(colors.color, ";border-radius:").concat(theme.layout.radius, ";padding:0;z-index:1000;box-shadow:").concat(hasShadow ? theme.expressiveness.shadowMedium : 'none', ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";}.inner.__jsx-style-dynamic-selector{box-sizing:border-box;position:relative;font-size:").concat(SCALES.font(1), ";padding:").concat(SCALES.pt(0.65), " ").concat(SCALES.pr(0.9), " ").concat(SCALES.pb(0.65), " ").concat(SCALES.pl(0.9), ";height:100%;}")))), el);
};

var TooltipContent$1 = TooltipContent;

var useClickAway = function useClickAway(ref, handler) {
  var handlerRef = React.useRef(handler);
  React.useEffect(function () {
    handlerRef.current = handler;
  }, [handler]);
  React.useEffect(function () {
    var callback = function callback(event) {
      var el = ref.current;
      if (!event || !el || el.contains(event.target)) return;
      handlerRef.current(event);
    };

    document.addEventListener('click', callback);
    return function () {
      return document.removeEventListener('click', callback);
    };
  }, [ref]);
};

var useClickAway$1 = useClickAway;

var _excluded$2 = ["children", "initialVisible", "text", "offset", "placement", "portalClassName", "enterDelay", "leaveDelay", "trigger", "type", "className", "onVisibleChange", "hideArrow", "visible"];
var defaultProps$2 = {
  initialVisible: false,
  hideArrow: false,
  type: 'default',
  trigger: 'hover',
  placement: 'top',
  enterDelay: 100,
  leaveDelay: 150,
  offset: 12,
  className: '',
  portalClassName: '',
  onVisibleChange: function () {}
};

var TooltipComponent = function TooltipComponent(_ref) {
  var children = _ref.children,
      initialVisible = _ref.initialVisible,
      text = _ref.text,
      offset = _ref.offset,
      placement = _ref.placement,
      portalClassName = _ref.portalClassName,
      enterDelay = _ref.enterDelay,
      leaveDelay = _ref.leaveDelay,
      trigger = _ref.trigger,
      type = _ref.type,
      className = _ref.className,
      onVisibleChange = _ref.onVisibleChange,
      hideArrow = _ref.hideArrow,
      customVisible = _ref.visible,
      props = _objectWithoutProperties(_ref, _excluded$2);

  var timer = React.useRef();
  var ref = React.useRef(null);

  var _useState = React.useState(initialVisible),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var iconOffset = React.useMemo(function () {
    if (!(ref !== null && ref !== void 0 && ref.current)) return {
      x: '0.75em',
      y: '0.75em'
    };
    var rect = getRect(ref);
    return {
      x: "".concat(rect.width ? rect.width / 2 : 0, "px"),
      y: "".concat(rect.height ? rect.height / 2 : 0, "px")
    };
  }, [ref === null || ref === void 0 ? void 0 : ref.current]);
  var contentProps = {
    type: type,
    visible: visible,
    offset: offset,
    placement: placement,
    hideArrow: hideArrow,
    iconOffset: iconOffset,
    parent: ref,
    className: portalClassName
  };

  var changeVisible = function changeVisible(nextState) {
    var clear = function clear() {
      clearTimeout(timer.current);
      timer.current = undefined;
    };

    var handler = function handler(nextState) {
      setVisible(nextState);
      onVisibleChange(nextState);
      clear();
    };

    clear();

    if (nextState) {
      timer.current = window.setTimeout(function () {
        return handler(true);
      }, enterDelay);
      return;
    }

    var leaveDelayWithoutClick = trigger === 'click' ? 0 : leaveDelay;
    timer.current = window.setTimeout(function () {
      return handler(false);
    }, leaveDelayWithoutClick);
  };

  var mouseEventHandler = function mouseEventHandler(next) {
    return trigger === 'hover' && changeVisible(next);
  };

  var clickEventHandler = function clickEventHandler() {
    return trigger === 'click' && changeVisible(!visible);
  };

  useClickAway$1(ref, function () {
    return trigger === 'click' && changeVisible(false);
  });
  React.useEffect(function () {
    if (customVisible === undefined) return;
    changeVisible(customVisible);
  }, [customVisible]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: ref,
    onClick: clickEventHandler,
    onMouseEnter: function onMouseEnter() {
      return mouseEventHandler(true);
    },
    onMouseLeave: function onMouseLeave() {
      return mouseEventHandler(false);
    }
  }, props, {
    className: "jsx-418573366" + " " + (props && props.className != null && props.className || useClasses$1('tooltip', className) || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(TooltipContent$1, contentProps, text), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "418573366"
  }, ".tooltip.jsx-418573366{width:-webkit-max-content;width:-moz-max-content;width:max-content;display:inline-block;}"));
};

TooltipComponent.defaultProps = defaultProps$2;
TooltipComponent.displayName = 'GeistTooltip';
var Tooltip = withScale$1(TooltipComponent);
var Tooltip$1 = Tooltip;

var defaultContext = {
  disableItemsAutoClose: false,
  onItemClick: function onItemClick() {}
};
var PopoverContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var usePopoverContext = function usePopoverContext() {
  return React.useContext(PopoverContext);
};

var _excluded$1 = ["content", "children", "trigger", "placement", "initialVisible", "portalClassName", "disableItemsAutoClose", "onVisibleChange", "visible"];
var defaultProps$1 = {
  disableItemsAutoClose: false,
  trigger: 'click',
  placement: 'bottom',
  portalClassName: '',
  initialVisible: false,
  hideArrow: false,
  type: 'default',
  enterDelay: 100,
  leaveDelay: 150,
  offset: 12,
  className: '',
  onVisibleChange: function () {}
};

var PopoverComponent = function PopoverComponent(_ref) {
  var content = _ref.content,
      children = _ref.children,
      trigger = _ref.trigger,
      placement = _ref.placement,
      initialVisible = _ref.initialVisible,
      portalClassName = _ref.portalClassName,
      disableItemsAutoClose = _ref.disableItemsAutoClose,
      onVisibleChange = _ref.onVisibleChange,
      customVisible = _ref.visible,
      props = _objectWithoutProperties(_ref, _excluded$1);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(initialVisible),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var textNode = React.useMemo(function () {
    return getReactNode(content);
  }, [content]);

  var onChildClick = function onChildClick() {
    onPopoverVisibleChange(false);
  };

  var value = React.useMemo(function () {
    return {
      onItemClick: onChildClick,
      disableItemsAutoClose: disableItemsAutoClose
    };
  }, [disableItemsAutoClose]);
  var classes = useClasses$1('popover', portalClassName);

  var onPopoverVisibleChange = function onPopoverVisibleChange(next) {
    setVisible(next);
    onVisibleChange(next);
  };

  React.useEffect(function () {
    if (customVisible === undefined) return;
    onPopoverVisibleChange(customVisible);
  }, [customVisible]);
  return /*#__PURE__*/React__default["default"].createElement(PopoverContext.Provider, {
    value: value
  }, /*#__PURE__*/React__default["default"].createElement(Tooltip$1, _extends({
    text: textNode,
    trigger: trigger,
    placement: placement,
    portalClassName: classes,
    visible: visible,
    onVisibleChange: onPopoverVisibleChange
  }, props), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "622655983",
    dynamic: [SCALES.pt(0.9), SCALES.pr(0), SCALES.pb(0.9), SCALES.pl(0)]
  }, ".tooltip-content.popover > .inner{padding:".concat(SCALES.pt(0.9), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0.9), " ").concat(SCALES.pl(0), ";}"))));
};

PopoverComponent.defaultProps = defaultProps$1;
PopoverComponent.displayName = 'GeistPopover';
var Popover = withScale$1(PopoverComponent);
var Popover$1 = Popover;

var _excluded = ["children", "line", "title", "className", "onClick", "disableAutoClose"];
var defaultProps = {
  line: false,
  title: false,
  disableAutoClose: false,
  className: ''
};

var PopoverItemComponent = function PopoverItemComponent(_ref) {
  var children = _ref.children,
      line = _ref.line,
      title = _ref.title,
      className = _ref.className,
      onClick = _ref.onClick,
      disableAutoClose = _ref.disableAutoClose,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _usePopoverContext = usePopoverContext(),
      disableItemsAutoClose = _usePopoverContext.disableItemsAutoClose,
      onItemClick = _usePopoverContext.onItemClick;

  var hasHandler = Boolean(onClick);
  var dontCloseByClick = disableAutoClose || disableItemsAutoClose || title || line;
  var classes = useClasses$1('item', {
    line: line,
    title: title
  }, className);

  var clickHandler = function clickHandler(event) {
    onClick && onClick(event);

    if (dontCloseByClick) {
      return event.stopPropagation();
    }

    onItemClick(event);
  };

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["190621384", [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.5), SCALES.pr(0.75), SCALES.pb(0.5), SCALES.pl(0.75), hasHandler ? 'pointer' : 'default', theme.palette.foreground, theme.palette.border, SCALES.height(0.0625), SCALES.mt(0.35), SCALES.mr(0), SCALES.mb(0.35), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.font(0.925), theme.palette.foreground]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "190621384",
    dynamic: [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0.5), SCALES.pr(0.75), SCALES.pb(0.5), SCALES.pl(0.75), hasHandler ? 'pointer' : 'default', theme.palette.foreground, theme.palette.border, SCALES.height(0.0625), SCALES.mt(0.35), SCALES.mr(0), SCALES.mb(0.35), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.font(0.925), theme.palette.foreground]
  }, ".item.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;box-sizing:border-box;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:".concat(theme.palette.accents_5, ";-webkit-transition:color,background-color 150ms linear;transition:color,background-color 150ms linear;line-height:1.25em;font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";padding:").concat(SCALES.pt(0.5), " ").concat(SCALES.pr(0.75), " ").concat(SCALES.pb(0.5), " ").concat(SCALES.pl(0.75), ";cursor:").concat(hasHandler ? 'pointer' : 'default', ";}.item.__jsx-style-dynamic-selector:hover{color:").concat(theme.palette.foreground, ";}.item.line.__jsx-style-dynamic-selector{line-height:0;padding:0;background-color:").concat(theme.palette.border, ";height:").concat(SCALES.height(0.0625), ";margin:").concat(SCALES.mt(0.35), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0.35), " ").concat(SCALES.ml(0), ";width:").concat(SCALES.width(1, '100%'), ";}.item.title.__jsx-style-dynamic-selector{font-weight:500;font-size:").concat(SCALES.font(0.925), ";color:").concat(theme.palette.foreground, ";}"))), title && /*#__PURE__*/React__default["default"].createElement(PopoverItem, {
    line: true,
    title: false
  }));
};

PopoverItemComponent.defaultProps = defaultProps;
PopoverItemComponent.displayName = 'GeistPopoverItem';
var PopoverItem = withScale$1(PopoverItemComponent);
var PopoverItem$1 = PopoverItem;

Popover$1.Item = PopoverItem$1;
Popover$1.Option = PopoverItem$1;

exports["default"] = Popover$1;
