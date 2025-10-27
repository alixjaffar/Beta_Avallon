'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styledJsx_cjs = require('./styled-jsx.cjs.js');
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

var InputLabel = function InputLabel(_ref) {
  var children = _ref.children,
      isRight = _ref.isRight;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3089782703", [theme.layout.gapHalf, theme.palette.accents_4, theme.palette.accents_1, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border]]]) + " " + ((isRight ? 'right' : '') || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3089782703",
    dynamic: [theme.layout.gapHalf, theme.palette.accents_4, theme.palette.accents_1, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border]
  }, "span.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:initial;height:100%;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;pointer-events:none;margin:0;padding:0 ".concat(theme.layout.gapHalf, ";color:").concat(theme.palette.accents_4, ";background-color:").concat(theme.palette.accents_1, ";border-top-left-radius:").concat(theme.layout.radius, ";border-bottom-left-radius:").concat(theme.layout.radius, ";border-top:1px solid ").concat(theme.palette.border, ";border-left:1px solid ").concat(theme.palette.border, ";border-bottom:1px solid ").concat(theme.palette.border, ";font-size:inherit;line-height:1;}span.right.__jsx-style-dynamic-selector{border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";border-left:0;border-right:1px solid ").concat(theme.palette.border, ";}")));
};

var MemoInputLabel = /*#__PURE__*/React__default["default"].memo(InputLabel);
var InputLabel$1 = MemoInputLabel;

var InputBlockLabelComponent = function InputBlockLabelComponent(_ref) {
  var children = _ref.children;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("label", {
    className: styledJsx_cjs.style.dynamic([["1278828862", [theme.palette.accents_6]]])
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1278828862",
    dynamic: [theme.palette.accents_6]
  }, "label.__jsx-style-dynamic-selector{display:block;font-weight:normal;color:".concat(theme.palette.accents_6, ";padding:0 0 0 1px;margin-bottom:0.5em;font-size:1em;line-height:1.5;}label.__jsx-style-dynamic-selector>*:first-child{margin-top:0;}label.__jsx-style-dynamic-selector>*:last-child{margin-bottom:0;}")));
};

InputBlockLabelComponent.displayName = 'GeistInputBlockLabel';
var InputBlockLabel = /*#__PURE__*/React__default["default"].memo(InputBlockLabelComponent);
var InputBlockLabel$1 = InputBlockLabel;

var InputIconComponent = function InputIconComponent(_ref) {
  var icon = _ref.icon,
      clickable = _ref.clickable,
      onClick = _ref.onClick;
  return /*#__PURE__*/React__default["default"].createElement("span", {
    onClick: onClick,
    className: styledJsx_cjs.style.dynamic([["4247656379", [clickable ? 'pointer' : 'default', clickable ? 'auto' : 'none']]]) + " " + "input-icon"
  }, icon, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4247656379",
    dynamic: [clickable ? 'pointer' : 'default', clickable ? 'auto' : 'none']
  }, ".input-icon.__jsx-style-dynamic-selector{box-sizing:border-box;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:calc(var(--input-height) - 2px);-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;height:100%;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;margin:0;padding:0;line-height:1;position:relative;cursor:".concat(clickable ? 'pointer' : 'default', ";pointer-events:").concat(clickable ? 'auto' : 'none', ";}.input-icon.__jsx-style-dynamic-selector svg{width:calc(var(--input-height) - 2px);height:calc(var(--input-height) - 2px);-webkit-transform:scale(0.44);-ms-transform:scale(0.44);transform:scale(0.44);}")));
};

InputIconComponent.displayName = 'GeistInputIcon';
var InputIcon = /*#__PURE__*/React__default["default"].memo(InputIconComponent);
var InputIcon$1 = InputIcon;

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

var InputIconClear = function InputIconClear(_ref) {
  var onClick = _ref.onClick,
      disabled = _ref.disabled,
      visible = _ref.visible;
  var theme = useTheme();
  var classes = useClasses$1('clear-icon', {
    visible: visible
  });

  var clickHandler = function clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    onClick && onClick(event);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["1567030211", [disabled ? 'not-allowed' : 'pointer', theme.palette.accents_3, disabled ? theme.palette.accents_3 : theme.palette.foreground]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["1567030211", [disabled ? 'not-allowed' : 'pointer', theme.palette.accents_3, disabled ? theme.palette.accents_3 : theme.palette.foreground]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M18 6L6 18",
    className: styledJsx_cjs.style.dynamic([["1567030211", [disabled ? 'not-allowed' : 'pointer', theme.palette.accents_3, disabled ? theme.palette.accents_3 : theme.palette.foreground]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 6l12 12",
    className: styledJsx_cjs.style.dynamic([["1567030211", [disabled ? 'not-allowed' : 'pointer', theme.palette.accents_3, disabled ? theme.palette.accents_3 : theme.palette.foreground]]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1567030211",
    dynamic: [disabled ? 'not-allowed' : 'pointer', theme.palette.accents_3, disabled ? theme.palette.accents_3 : theme.palette.foreground]
  }, ".clear-icon.__jsx-style-dynamic-selector{box-sizing:border-box;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:calc(var(--input-height) - 2px);-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;height:100%;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;cursor:".concat(disabled ? 'not-allowed' : 'pointer', ";-webkit-transition:color 150ms ease 0s;transition:color 150ms ease 0s;margin:0;padding:0;color:").concat(theme.palette.accents_3, ";visibility:hidden;opacity:0;}.visible.__jsx-style-dynamic-selector{visibility:visible;opacity:1;}.clear-icon.__jsx-style-dynamic-selector:hover{color:").concat(disabled ? theme.palette.accents_3 : theme.palette.foreground, ";}svg.__jsx-style-dynamic-selector{color:currentColor;width:calc(var(--input-height) - 2px);height:calc(var(--input-height) - 2px);-webkit-transform:scale(0.44);-ms-transform:scale(0.44);transform:scale(0.44);}")));
};

var MemoInputIconClear = /*#__PURE__*/React__default["default"].memo(InputIconClear);
var InputClearIcon = MemoInputIconClear;

var getColors$8 = function getColors(palette, status) {
  var colors = {
    "default": {
      color: palette.foreground,
      borderColor: palette.border,
      hoverBorder: palette.accents_5
    },
    secondary: {
      color: palette.foreground,
      borderColor: palette.secondary,
      hoverBorder: palette.secondary
    },
    success: {
      color: palette.foreground,
      borderColor: palette.successLight,
      hoverBorder: palette.success
    },
    warning: {
      color: palette.foreground,
      borderColor: palette.warningLight,
      hoverBorder: palette.warning
    },
    error: {
      color: palette.error,
      borderColor: palette.error,
      hoverBorder: palette.errorDark
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var defaultProps$1y = {
  disabled: false,
  readOnly: false,
  clearable: false,
  iconClickable: false,
  type: 'default',
  htmlType: 'text',
  autoComplete: 'off',
  className: '',
  placeholder: '',
  initialValue: ''
};

var ScalePropKeys = ['width', 'height', 'padding', 'margin', 'w', 'h', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'pl', 'pr', 'pt', 'pb', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'ml', 'mr', 'mt', 'mb', 'px', 'py', 'mx', 'my', 'font', 'unit', 'scale'];

var defaultDynamicLayoutPipe = function defaultDynamicLayoutPipe(scale1x) {
  return "".concat(scale1x);
};

var defaultContext$e = {
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
var ScaleContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$e);
var useScale$1 = function useScale() {
  return React__default["default"].useContext(ScaleContext);
};

var getId = function getId() {
  return Math.random().toString(32).slice(2, 10);
};
var hasChild = function hasChild(children, child) {
  var types = React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return null;
    return item.type;
  });
  return (types || []).includes(child);
};
var pickChild = function pickChild(children, targetChild) {
  var target = [];
  var withoutTargetChildren = React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return item;

    if (item.type === targetChild) {
      target.push(item);
      return null;
    }

    return item;
  });
  var targetChildren = target.length >= 0 ? target : undefined;
  return [withoutTargetChildren, targetChildren];
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
var setChildrenProps = function setChildrenProps(children, props) {
  var targetComponents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (React__default["default"].Children.count(children) === 0) return [];
  var allowAll = targetComponents.length === 0;

  var clone = function clone(child) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return /*#__PURE__*/React__default["default"].cloneElement(child, props);
  };

  return React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return item;
    if (allowAll) return clone(item, props);
    var isAllowed = targetComponents.find(function (child) {
      return child === item.type;
    });
    if (isAllowed) return clone(item, props);
    return item;
  });
};
var setChildrenIndex = function setChildrenIndex(children) {
  var targetComponents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (React__default["default"].Children.count(children) === 0) return [];
  var allowAll = targetComponents.length === 0;

  var clone = function clone(child) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return /*#__PURE__*/React__default["default"].cloneElement(child, props);
  };

  var index = 0;
  return React__default["default"].Children.map(children, function (item) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return item;
    index = index + 1;
    if (allowAll) return clone(item, {
      index: index
    });
    var isAllowed = targetComponents.find(function (child) {
      return child === item.type;
    });
    if (isAllowed) return clone(item, {
      index: index
    });
    index = index - 1;
    return item;
  });
};
var getReactNode = function getReactNode(node) {
  if (!node) return null;
  if (typeof node !== 'function') return node;
  return node();
};
var isChildElement = function isChildElement(parent, child) {
  if (!parent || !child) return false;
  var node = child;

  while (node) {
    if (node === parent) return true;
    node = node.parentNode;
  }

  return false;
};
var isGeistElement = function isGeistElement(el) {
  if (!el) return false;
  if (el !== null && el !== void 0 && el.dataset && el !== null && el !== void 0 && el.dataset['geist']) return true;
  el.attributes.getNamedItem('data-geist');
  return !!el.attributes.getNamedItem('data-geist');
};
var isBrowser = function isBrowser() {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
};
var isMac = function isMac() {
  if (!isBrowser()) return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};
var isCSSNumberValue = function isCSSNumberValue(value) {
  return value !== undefined && !Number.isNaN(+value);
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

var _excluded$1l = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$1l);

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

var _excluded$1k = ["label", "labelRight", "type", "htmlType", "icon", "iconRight", "iconClickable", "onIconClick", "initialValue", "onChange", "readOnly", "value", "onClearClick", "clearable", "className", "onBlur", "onFocus", "autoComplete", "placeholder", "children", "disabled"];

var simulateChangeEvent = function simulateChangeEvent(el, event) {
  return _objectSpread2(_objectSpread2({}, event), {}, {
    target: el,
    currentTarget: el
  });
};

var InputComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var label = _ref.label,
      labelRight = _ref.labelRight,
      type = _ref.type,
      htmlType = _ref.htmlType,
      icon = _ref.icon,
      iconRight = _ref.iconRight,
      iconClickable = _ref.iconClickable,
      onIconClick = _ref.onIconClick,
      initialValue = _ref.initialValue,
      onChange = _ref.onChange,
      readOnly = _ref.readOnly,
      value = _ref.value,
      onClearClick = _ref.onClearClick,
      clearable = _ref.clearable,
      className = _ref.className,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      autoComplete = _ref.autoComplete,
      placeholder = _ref.placeholder,
      children = _ref.children,
      disabled = _ref.disabled,
      props = _objectWithoutProperties(_ref, _excluded$1k);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var inputRef = React.useRef(null);
  React.useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  var _useState = React.useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      selfValue = _useState2[0],
      setSelfValue = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      hover = _useState4[0],
      setHover = _useState4[1];

  var isControlledComponent = React.useMemo(function () {
    return value !== undefined;
  }, [value]);
  var labelClasses = React.useMemo(function () {
    return labelRight ? 'right-label' : label ? 'left-label' : '';
  }, [label, labelRight]);
  var iconClasses = React.useMemo(function () {
    return iconRight ? 'right-icon' : icon ? 'left-icon' : '';
  }, [icon, iconRight]);

  var _useMemo = React.useMemo(function () {
    return getColors$8(theme.palette, type);
  }, [theme.palette, type]),
      color = _useMemo.color,
      borderColor = _useMemo.borderColor,
      hoverBorder = _useMemo.hoverBorder;

  var changeHandler = function changeHandler(event) {
    if (disabled || readOnly) return;
    setSelfValue(event.target.value);
    onChange && onChange(event);
  };

  var clearHandler = function clearHandler(event) {
    setSelfValue('');
    onClearClick && onClearClick(event);
    /* istanbul ignore next */

    if (!inputRef.current) return;
    var changeEvent = simulateChangeEvent(inputRef.current, event);
    changeEvent.target.value = '';
    onChange && onChange(changeEvent);
    inputRef.current.focus();
  };

  var focusHandler = function focusHandler(e) {
    setHover(true);
    onFocus && onFocus(e);
  };

  var blurHandler = function blurHandler(e) {
    setHover(false);
    onBlur && onBlur(e);
  };

  var iconClickHandler = function iconClickHandler(e) {
    if (disabled) return;
    onIconClick && onIconClick(e);
  };

  var iconProps = React.useMemo(function () {
    return {
      clickable: iconClickable,
      onClick: iconClickHandler
    };
  }, [iconClickable, iconClickHandler]);
  React.useEffect(function () {
    if (isControlledComponent) {
      setSelfValue(value);
    }
  });
  var controlledValue = isControlledComponent ? {
    value: selfValue
  } : {
    defaultValue: initialValue
  };

  var inputProps = _objectSpread2(_objectSpread2({}, props), controlledValue);

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["575189429", [SCALES.height(2.25), SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, 'initial'), theme.layout.radius, borderColor, theme.palette.accents_1, theme.palette.accents_2, hoverBorder, SCALES.font(0.875), color, theme.palette.accents_3, theme.palette.background, color]]]) + " " + "with-label"
  }, children && /*#__PURE__*/React__default["default"].createElement(InputBlockLabel$1, null, children), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["575189429", [SCALES.height(2.25), SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, 'initial'), theme.layout.radius, borderColor, theme.palette.accents_1, theme.palette.accents_2, hoverBorder, SCALES.font(0.875), color, theme.palette.accents_3, theme.palette.background, color]]]) + " " + (useClasses$1('input-container', className) || "")
  }, label && /*#__PURE__*/React__default["default"].createElement(InputLabel$1, null, label), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["575189429", [SCALES.height(2.25), SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, 'initial'), theme.layout.radius, borderColor, theme.palette.accents_1, theme.palette.accents_2, hoverBorder, SCALES.font(0.875), color, theme.palette.accents_3, theme.palette.background, color]]]) + " " + (useClasses$1('input-wrapper', {
      hover: hover,
      disabled: disabled
    }, labelClasses) || "")
  }, icon && /*#__PURE__*/React__default["default"].createElement(InputIcon$1, _extends({
    icon: icon
  }, iconProps)), /*#__PURE__*/React__default["default"].createElement("input", _extends({
    type: htmlType,
    ref: inputRef,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: readOnly,
    onFocus: focusHandler,
    onBlur: blurHandler,
    onChange: changeHandler,
    autoComplete: autoComplete
  }, inputProps, {
    className: styledJsx_cjs.style.dynamic([["575189429", [SCALES.height(2.25), SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, 'initial'), theme.layout.radius, borderColor, theme.palette.accents_1, theme.palette.accents_2, hoverBorder, SCALES.font(0.875), color, theme.palette.accents_3, theme.palette.background, color]]]) + " " + (inputProps && inputProps.className != null && inputProps.className || useClasses$1({
      disabled: disabled
    }, iconClasses) || "")
  })), clearable && /*#__PURE__*/React__default["default"].createElement(InputClearIcon, {
    visible: Boolean(inputRef.current && inputRef.current.value !== ''),
    disabled: disabled || readOnly,
    onClick: clearHandler
  }), iconRight && /*#__PURE__*/React__default["default"].createElement(InputIcon$1, _extends({
    icon: iconRight
  }, iconProps))), labelRight && /*#__PURE__*/React__default["default"].createElement(InputLabel$1, {
    isRight: true
  }, labelRight)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "575189429",
    dynamic: [SCALES.height(2.25), SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, 'initial'), theme.layout.radius, borderColor, theme.palette.accents_1, theme.palette.accents_2, hoverBorder, SCALES.font(0.875), color, theme.palette.accents_3, theme.palette.background, color]
  }, ".with-label.__jsx-style-dynamic-selector{display:inline-block;box-sizing:border-box;-webkit-box-align:center;--input-height:".concat(SCALES.height(2.25), ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'initial'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.input-container.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:").concat(SCALES.width(1, 'initial'), ";height:var(--input-height);}.input-wrapper.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;vertical-align:middle;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-radius:").concat(theme.layout.radius, ";border:1px solid ").concat(borderColor, ";-webkit-transition:border 0.2s ease 0s,color 0.2s ease 0s;transition:border 0.2s ease 0s,color 0.2s ease 0s;}.input-wrapper.left-label.__jsx-style-dynamic-selector{border-top-left-radius:0;border-bottom-left-radius:0;}.input-wrapper.right-label.__jsx-style-dynamic-selector{border-top-right-radius:0;border-bottom-right-radius:0;}.input-wrapper.disabled.__jsx-style-dynamic-selector{background-color:").concat(theme.palette.accents_1, ";border-color:").concat(theme.palette.accents_2, ";cursor:not-allowed;}input.disabled.__jsx-style-dynamic-selector{cursor:not-allowed;}.input-wrapper.hover.__jsx-style-dynamic-selector{border-color:").concat(hoverBorder, ";}input.__jsx-style-dynamic-selector{margin:0.25em 0.625em;padding:0;box-shadow:none;font-size:").concat(SCALES.font(0.875), ";background-color:transparent;border:none;color:").concat(color, ";outline:none;border-radius:0;width:100%;min-width:0;-webkit-appearance:none;}input.left-icon.__jsx-style-dynamic-selector{margin-left:0;}input.right-icon.__jsx-style-dynamic-selector{margin-right:0;}.__jsx-style-dynamic-selector::-webkit-input-placeholder,.__jsx-style-dynamic-selector::-moz-placeholder,.__jsx-style-dynamic-selector:-ms-input-placeholder,.__jsx-style-dynamic-selector::-webkit-input-placeholder{color:").concat(theme.palette.accents_3, ";}.__jsx-style-dynamic-selector::-moz-placeholder,.__jsx-style-dynamic-selector::-moz-placeholder,.__jsx-style-dynamic-selector:-ms-input-placeholder,.__jsx-style-dynamic-selector::-webkit-input-placeholder{color:").concat(theme.palette.accents_3, ";}.__jsx-style-dynamic-selector:-ms-input-placeholder,.__jsx-style-dynamic-selector::-moz-placeholder,.__jsx-style-dynamic-selector:-ms-input-placeholder,.__jsx-style-dynamic-selector::-webkit-input-placeholder{color:").concat(theme.palette.accents_3, ";}.__jsx-style-dynamic-selector::placeholder,.__jsx-style-dynamic-selector::-moz-placeholder,.__jsx-style-dynamic-selector:-ms-input-placeholder,.__jsx-style-dynamic-selector::-webkit-input-placeholder{color:").concat(theme.palette.accents_3, ";}.__jsx-style-dynamic-selector::-ms-reveal{display:none !important;}input.__jsx-style-dynamic-selector:-webkit-autofill,input.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:hover,input.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:active,input.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:focus{-webkit-box-shadow:0 0 0 30px ").concat(theme.palette.background, " inset !important;-webkit-text-fill-color:").concat(color, " !important;}")));
});
InputComponent.defaultProps = defaultProps$1y;
InputComponent.displayName = 'GeistInput';
var Input = withScale$1(InputComponent);
var Input$1 = Input;

var tuple = function tuple() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
};
var tupleNumber = function tupleNumber() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args;
};
tuple('default', 'secondary', 'success', 'warning', 'error', 'abort', 'secondary-light', 'success-light', 'warning-light', 'error-light');
tuple('default', 'secondary', 'success', 'warning', 'error');
tuple('default', 'secondary', 'success', 'warning', 'error', 'dark', 'lite');
tuple('default', 'secondary', 'success', 'warning', 'error', 'dark', 'lite', 'alert', 'purple', 'violet', 'cyan');
tuple('default', 'silent', 'prevent');
tuple('hover', 'click');
tuple('top', 'topStart', 'topEnd', 'left', 'leftStart', 'leftEnd', 'bottom', 'bottomStart', 'bottomEnd', 'right', 'rightStart', 'rightEnd');
tuple('start', 'center', 'end', 'left', 'right');

var _excluded$1j = ["type", "disabled", "readOnly", "onFocus", "onBlur", "className", "initialValue", "onChange", "value", "placeholder", "resize"];
tuple('none', 'both', 'horizontal', 'vertical', 'initial', 'inherit');
var defaultProps$1x = {
  initialValue: '',
  type: 'default',
  disabled: false,
  readOnly: false,
  className: '',
  resize: 'none'
};
var TextareaComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var type = _ref.type,
      disabled = _ref.disabled,
      readOnly = _ref.readOnly,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      className = _ref.className,
      initialValue = _ref.initialValue,
      onChange = _ref.onChange,
      value = _ref.value,
      placeholder = _ref.placeholder,
      resize = _ref.resize,
      props = _objectWithoutProperties(_ref, _excluded$1j);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var textareaRef = React.useRef(null);
  React.useImperativeHandle(ref, function () {
    return textareaRef.current;
  });
  var isControlledComponent = React.useMemo(function () {
    return value !== undefined;
  }, [value]);

  var _useState = React.useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      selfValue = _useState2[0],
      setSelfValue = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      hover = _useState4[0],
      setHover = _useState4[1];

  var _useMemo = React.useMemo(function () {
    return getColors$8(theme.palette, type);
  }, [theme.palette, type]),
      color = _useMemo.color,
      borderColor = _useMemo.borderColor,
      hoverBorder = _useMemo.hoverBorder;

  var classes = useClasses$1('wrapper', {
    hover: hover,
    disabled: disabled
  }, className);

  var changeHandler = function changeHandler(event) {
    if (disabled || readOnly) return;
    setSelfValue(event.target.value);
    onChange && onChange(event);
  };

  var focusHandler = function focusHandler(e) {
    setHover(true);
    onFocus && onFocus(e);
  };

  var blurHandler = function blurHandler(e) {
    setHover(false);
    onBlur && onBlur(e);
  };

  React.useEffect(function () {
    if (isControlledComponent) {
      setSelfValue(value);
    }
  });
  var controlledValue = isControlledComponent ? {
    value: selfValue
  } : {
    defaultValue: initialValue
  };

  var textareaProps = _objectSpread2(_objectSpread2({}, props), controlledValue);

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["12276481", [theme.layout.radius, borderColor, color, SCALES.font(0.875), SCALES.height(1, 'auto'), SCALES.width(1, 'initial'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverBorder, theme.palette.accents_1, theme.palette.accents_2, theme.font.sans, SCALES.pt(0.5), SCALES.pr(0.5), SCALES.pb(0.5), SCALES.pl(0.5), resize, theme.palette.background]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("textarea", _extends({
    ref: textareaRef,
    disabled: disabled,
    placeholder: placeholder,
    readOnly: readOnly,
    onFocus: focusHandler,
    onBlur: blurHandler,
    onChange: changeHandler
  }, textareaProps, {
    className: styledJsx_cjs.style.dynamic([["12276481", [theme.layout.radius, borderColor, color, SCALES.font(0.875), SCALES.height(1, 'auto'), SCALES.width(1, 'initial'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverBorder, theme.palette.accents_1, theme.palette.accents_2, theme.font.sans, SCALES.pt(0.5), SCALES.pr(0.5), SCALES.pb(0.5), SCALES.pl(0.5), resize, theme.palette.background]]]) + " " + (textareaProps && textareaProps.className != null && textareaProps.className || "")
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "12276481",
    dynamic: [theme.layout.radius, borderColor, color, SCALES.font(0.875), SCALES.height(1, 'auto'), SCALES.width(1, 'initial'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverBorder, theme.palette.accents_1, theme.palette.accents_2, theme.font.sans, SCALES.pt(0.5), SCALES.pr(0.5), SCALES.pb(0.5), SCALES.pl(0.5), resize, theme.palette.background]
  }, ".wrapper.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-radius:".concat(theme.layout.radius, ";border:1px solid ").concat(borderColor, ";color:").concat(color, ";-webkit-transition:border 0.2s ease 0s,color 0.2s ease 0s;transition:border 0.2s ease 0s,color 0.2s ease 0s;min-width:12.5rem;max-width:95vw;--textarea-font-size:").concat(SCALES.font(0.875), ";--textarea-height:").concat(SCALES.height(1, 'auto'), ";width:").concat(SCALES.width(1, 'initial'), ";height:var(--textarea-height);margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.wrapper.hover.__jsx-style-dynamic-selector{border-color:").concat(hoverBorder, ";}.wrapper.disabled.__jsx-style-dynamic-selector{background-color:").concat(theme.palette.accents_1, ";border-color:").concat(theme.palette.accents_2, ";cursor:not-allowed;}textarea.__jsx-style-dynamic-selector{background-color:transparent;box-shadow:none;display:block;font-family:").concat(theme.font.sans, ";font-size:var(--textarea-font-size);width:100%;height:var(--textarea-height);border:none;outline:none;padding:").concat(SCALES.pt(0.5), " ").concat(SCALES.pr(0.5), " ").concat(SCALES.pb(0.5), " ").concat(SCALES.pl(0.5), ";resize:").concat(resize, ";}.disabled.__jsx-style-dynamic-selector>textarea.__jsx-style-dynamic-selector{cursor:not-allowed;}textarea.__jsx-style-dynamic-selector:-webkit-autofill,textarea.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:hover,textarea.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:active,textarea.__jsx-style-dynamic-selector:-webkit-autofill.__jsx-style-dynamic-selector:focus{-webkit-box-shadow:0 0 0 30px ").concat(theme.palette.background, " inset !important;}")));
});
TextareaComponent.defaultProps = defaultProps$1x;
TextareaComponent.displayName = 'GeistTextarea';
var Textarea = withScale$1(TextareaComponent);
var Textarea$1 = Textarea;

var PasswordIcon = function PasswordIcon(_ref) {
  var visible = _ref.visible;
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    style: {
      color: 'currentColor'
    }
  }, !visible ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M1 1l22 22"
  })));
};

var MemoPasswordIcon = /*#__PURE__*/React__default["default"].memo(PasswordIcon);
var PasswordIcon$1 = MemoPasswordIcon;

var _excluded$1i = ["hideToggle", "children"];

var passwordDefaultProps = _objectSpread2(_objectSpread2({}, defaultProps$1y), {}, {
  hideToggle: false
});

var InputPasswordComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var hideToggle = _ref.hideToggle,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$1i);

  var _useScale = useScale$1(),
      getAllScaleProps = _useScale.getAllScaleProps;

  var inputRef = React.useRef(null);

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  React.useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  var iconClickHandler = function iconClickHandler() {
    setVisible(function (v) {
      return !v;
    });
    /* istanbul ignore next */

    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  var inputProps = React.useMemo(function () {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      ref: inputRef,
      iconClickable: true,
      onIconClick: iconClickHandler,
      htmlType: visible ? 'text' : 'password'
    });
  }, [props, iconClickHandler, visible, inputRef]);
  var icon = React.useMemo(function () {
    if (hideToggle) return null;
    return /*#__PURE__*/React__default["default"].createElement(PasswordIcon$1, {
      visible: visible
    });
  }, [hideToggle, visible]);
  return /*#__PURE__*/React__default["default"].createElement(Input$1, _extends({
    iconRight: icon
  }, getAllScaleProps(), inputProps), children);
});
InputPasswordComponent.defaultProps = passwordDefaultProps;
InputPasswordComponent.displayName = 'GeistInputPassword';
var InputPassword = withScale$1(InputPasswordComponent);
var InputPassword$1 = InputPassword;

Input$1.Textarea = Textarea$1;
Input$1.Password = InputPassword$1;

var defaultContext$d = {
  visible: false
};
var AutoCompleteContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$d);
var useAutoCompleteContext = function useAutoCompleteContext() {
  return React__default["default"].useContext(AutoCompleteContext);
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

var defaultProps$1w = {};

var AutoCompleteItemComponent = function AutoCompleteItemComponent(_ref) {
  var identValue = _ref.value,
      children = _ref.children,
      isLabelOnly = _ref.isLabelOnly;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useAutoCompleteConte = useAutoCompleteContext(),
      value = _useAutoCompleteConte.value,
      updateValue = _useAutoCompleteConte.updateValue,
      updateVisible = _useAutoCompleteConte.updateVisible;

  var selectHandler = function selectHandler() {
    updateValue && updateValue(identValue);
    updateVisible && updateVisible(false);
  };

  var isActive = React.useMemo(function () {
    return value === identValue;
  }, [identValue, value]);
  var classes = useClasses$1('item', {
    active: isActive
  });
  return /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: selectHandler,
    className: styledJsx_cjs.style.dynamic([["2003094915", [theme.palette.background, theme.palette.foreground, SCALES.font(0.875), SCALES.width(1, 'auto'), isLabelOnly ? SCALES.height(2.5) : SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.75), SCALES.pb(0), SCALES.pl(0.75), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.palette.accents_1, theme.palette.accents_1, theme.palette.success]]]) + " " + (classes || "")
  }, isLabelOnly ? /*#__PURE__*/React__default["default"].createElement(Ellipsis$1, {
    height: SCALES.height(2)
  }, children) : children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2003094915",
    dynamic: [theme.palette.background, theme.palette.foreground, SCALES.font(0.875), SCALES.width(1, 'auto'), isLabelOnly ? SCALES.height(2.5) : SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.75), SCALES.pb(0), SCALES.pl(0.75), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.palette.accents_1, theme.palette.accents_1, theme.palette.success]
  }, ".item.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-weight:normal;white-space:pre;background-color:".concat(theme.palette.background, ";color:").concat(theme.palette.foreground, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:0;cursor:pointer;-webkit-transition:background 0.2s ease 0s,border-color 0.2s ease 0s;transition:background 0.2s ease 0s,border-color 0.2s ease 0s;font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(isLabelOnly ? SCALES.height(2.5) : SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.75), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.75), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.item.__jsx-style-dynamic-selector:first-of-type{border-top-left-radius:").concat(theme.layout.radius, ";border-top-right-radius:").concat(theme.layout.radius, ";}.item.__jsx-style-dynamic-selector:last-of-type{border-bottom-left-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";}.item.__jsx-style-dynamic-selector:hover{background-color:").concat(theme.palette.accents_1, ";}.item.active.__jsx-style-dynamic-selector{background-color:").concat(theme.palette.accents_1, ";color:").concat(theme.palette.success, ";}")));
};

AutoCompleteItemComponent.defaultProps = defaultProps$1w;
AutoCompleteItemComponent.displayName = 'GeistAutoCompleteItem';
var AutoCompleteItem = withScale$1(AutoCompleteItemComponent);
var AutoCompleteItem$1 = AutoCompleteItem;

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

var _excluded$1h = ["children", "className", "visible", "enterTime", "leaveTime", "clearTime", "name"];
var defaultProps$1v = {
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
      props = _objectWithoutProperties(_ref, _excluded$1h);

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

CssTransition.defaultProps = defaultProps$1v;
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
var defaultRect$2 = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0,
  height: 0,
  elementTop: -1000
};

var getRectFromDOMWithContainer = function getRectFromDOMWithContainer(domRect, getContainer) {
  if (!domRect) return defaultRect$2;
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

var isUnplacedRect = function isUnplacedRect(rect) {
  if (!rect) return true;
  return rect.top === defaultRect$2.top && rect.left === defaultRect$2.left;
};
var getRefRect = function getRefRect(ref, getContainer) {
  if (!ref || !ref.current) return defaultRect$2;
  var rect = ref.current.getBoundingClientRect();
  return getRectFromDOMWithContainer(rect, getContainer);
};
var getEventRect = function getEventRect(event, getContainer) {
  var _event$target;

  var rect = event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.getBoundingClientRect();
  if (!rect) return defaultRect$2;
  return getRectFromDOMWithContainer(rect, getContainer);
};

var isRefTarget = function isRefTarget(eventOrRef) {
  return typeof (eventOrRef === null || eventOrRef === void 0 ? void 0 : eventOrRef.target) === 'undefined';
};

var useRect = function useRect(initialState) {
  var _useState = React.useState(initialState || defaultRect$2),
      _useState2 = _slicedToArray(_useState, 2),
      rect = _useState2[0],
      setRect = _useState2[1];

  var updateRect = function updateRect(eventOrRef, getContainer) {
    if (isRefTarget(eventOrRef)) return setRect(getRefRect(eventOrRef, getContainer));
    setRect(getEventRect(eventOrRef, getContainer));
  };

  return {
    rect: rect,
    setRect: updateRect
  };
};

var defaultRect$1 = {
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

  var _useState = React.useState(defaultRect$1),
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

var defaultProps$1u = {
  className: '',
  dropdownStyle: {}
};

var AutoCompleteDropdown = function AutoCompleteDropdown(_ref) {
  var children = _ref.children,
      visible = _ref.visible,
      className = _ref.className,
      dropdownStyle = _ref.dropdownStyle,
      disableMatchWidth = _ref.disableMatchWidth,
      getPopupContainer = _ref.getPopupContainer;
  var theme = useTheme();

  var _useAutoCompleteConte = useAutoCompleteContext(),
      ref = _useAutoCompleteConte.ref;

  var isEmpty = React.useMemo(function () {
    return !visible || React__default["default"].Children.count(children) === 0;
  }, [children, visible]);
  var classes = useClasses$1('auto-complete-dropdown', className);

  var clickHandler = function clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  return /*#__PURE__*/React__default["default"].createElement(Dropdown$1, {
    parent: ref,
    visible: visible,
    disableMatchWidth: disableMatchWidth,
    getPopupContainer: getPopupContainer
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: dropdownStyle,
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["155200262", [theme.layout.radius, isEmpty ? 'none' : theme.expressiveness.shadowLarge, theme.palette.background]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "155200262",
    dynamic: [theme.layout.radius, isEmpty ? 'none' : theme.expressiveness.shadowLarge, theme.palette.background]
  }, ".auto-complete-dropdown.__jsx-style-dynamic-selector{border-radius:".concat(theme.layout.radius, ";box-shadow:").concat(isEmpty ? 'none' : theme.expressiveness.shadowLarge, ";background-color:").concat(theme.palette.background, ";overflow-y:auto;max-height:15rem;overflow-anchor:none;}"))));
};

AutoCompleteDropdown.defaultProps = defaultProps$1u;
AutoCompleteDropdown.displayName = 'GeistAutoCompleteDropdown';
var AutoCompleteDropdown$1 = AutoCompleteDropdown;

var defaultProps$1t = {
  className: ''
};

var AutoCompleteSearchComponent = function AutoCompleteSearchComponent(_ref) {
  var children = _ref.children,
      className = _ref.className;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2266351824", [theme.layout.gapHalf, theme.palette.background, theme.palette.accents_5, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.875), SCALES.pb(0.875), SCALES.pl(0.875), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (className || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2266351824",
    dynamic: [theme.layout.gapHalf, theme.palette.background, theme.palette.accents_5, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.875), SCALES.pb(0.875), SCALES.pl(0.875), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "div.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-weight:normal;white-space:pre;padding:".concat(theme.layout.gapHalf, ";line-height:1;background-color:").concat(theme.palette.background, ";color:").concat(theme.palette.accents_5, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:0;border-radius:").concat(theme.layout.radius, ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.875), " ").concat(SCALES.pr(0.875), " ").concat(SCALES.pb(0.875), " ").concat(SCALES.pl(0.875), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

AutoCompleteSearchComponent.defaultProps = defaultProps$1t;
AutoCompleteSearchComponent.displayName = 'GeistAutoCompleteSearch';
var AutoCompleteSearch = withScale$1(AutoCompleteSearchComponent);
var AutoCompleteSearching = AutoCompleteSearch;

var defaultProps$1s = {
  hidden: false,
  className: ''
};

var AutoCompleteEmpty = function AutoCompleteEmpty(_ref) {
  var children = _ref.children,
      hidden = _ref.hidden,
      className = _ref.className;
  if (hidden) return null;
  return /*#__PURE__*/React__default["default"].createElement(AutoCompleteSearching, {
    className: className
  }, children);
};

AutoCompleteEmpty.defaultProps = defaultProps$1s;
AutoCompleteEmpty.displayName = 'GeistAutoCompleteEmpty';
var AutoCompleteEmpty$1 = AutoCompleteEmpty;

var _excluded$1g = ["children", "type", "color", "className", "spaceRatio"];
var defaultProps$1r = {
  type: 'default',
  className: '',
  spaceRatio: 1
};

var getIconBgColor = function getIconBgColor(type, palette, color) {
  var colors = {
    "default": palette.accents_6,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error
  };
  return color ? color : colors[type];
};

var LoadingComponent = function LoadingComponent(_ref) {
  var children = _ref.children,
      type = _ref.type,
      color = _ref.color,
      className = _ref.className,
      spaceRatio = _ref.spaceRatio,
      props = _objectWithoutProperties(_ref, _excluded$1g);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('loading-container', className);
  var bgColor = React.useMemo(function () {
    return getIconBgColor(type, theme.palette, color);
  }, [type, theme.palette, color]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]]) + " " + "loading"
  }, children && /*#__PURE__*/React__default["default"].createElement("label", {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]])
  }, children), /*#__PURE__*/React__default["default"].createElement("i", {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]])
  }), /*#__PURE__*/React__default["default"].createElement("i", {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]])
  }), /*#__PURE__*/React__default["default"].createElement("i", {
    className: styledJsx_cjs.style.dynamic([["2201634259", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2201634259",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, bgColor, spaceRatio]
  }, ".loading-container.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:relative;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, '100%'), ";min-height:1em;padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}label.__jsx-style-dynamic-selector{margin-right:0.5em;color:").concat(theme.palette.accents_5, ";line-height:1;}label.__jsx-style-dynamic-selector *{margin:0;}.loading.__jsx-style-dynamic-selector{position:absolute;top:50%;left:50%;width:100%;height:100%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}i.__jsx-style-dynamic-selector{width:0.25em;height:0.25em;border-radius:50%;background-color:").concat(bgColor, ";margin:0 calc(0.25em / 2 * ").concat(spaceRatio, ");display:inline-block;-webkit-animation:loading-blink-__jsx-style-dynamic-selector 1.4s infinite both;animation:loading-blink-__jsx-style-dynamic-selector 1.4s infinite both;}i.__jsx-style-dynamic-selector:nth-child(2){-webkit-animation-delay:0.2s;animation-delay:0.2s;}i.__jsx-style-dynamic-selector:nth-child(3){-webkit-animation-delay:0.4s;animation-delay:0.4s;}@-webkit-keyframes loading-blink-__jsx-style-dynamic-selector{0%{opacity:0.2;}20%{opacity:1;}100%{opacity:0.2;}}@keyframes loading-blink-__jsx-style-dynamic-selector{0%{opacity:0.2;}20%{opacity:1;}100%{opacity:0.2;}}")));
};

LoadingComponent.defaultProps = defaultProps$1r;
LoadingComponent.displayName = 'GeistLoading';
var Loading = withScale$1(LoadingComponent);
var Loading$1 = Loading;

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

var _excluded$1f = ["options", "initialValue", "onSelect", "onSearch", "onChange", "searching", "children", "type", "value", "clearable", "disabled", "dropdownClassName", "dropdownStyle", "disableMatchWidth", "disableFreeSolo", "getPopupContainer"];
var defaultProps$1q = {
  options: [],
  initialValue: '',
  disabled: false,
  clearable: false,
  type: 'default',
  disableMatchWidth: false,
  disableFreeSolo: false,
  className: ''
};

var childrenToOptionsNode = function childrenToOptionsNode(options) {
  return options.map(function (item, index) {
    var key = "auto-complete-item-".concat(index);
    if ( /*#__PURE__*/React__default["default"].isValidElement(item)) return /*#__PURE__*/React__default["default"].cloneElement(item, {
      key: key
    });
    var validItem = item;
    return /*#__PURE__*/React__default["default"].createElement(AutoCompleteItem$1, {
      key: key,
      value: validItem.value,
      isLabelOnly: true
    }, validItem.label);
  });
}; // When the search is not set, the "clearable" icon can be displayed in the original location.
// When the search is seted, at least one element should exist to avoid re-render.


var getSearchIcon = function getSearchIcon(searching) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (searching === undefined) return null;
  return searching ? /*#__PURE__*/React__default["default"].createElement(Loading$1, {
    scale: +scale / 2
  }) : /*#__PURE__*/React__default["default"].createElement("span", null);
};

var AutoCompleteComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, userRef) {
  var options = _ref.options,
      customInitialValue = _ref.initialValue,
      onSelect = _ref.onSelect,
      onSearch = _ref.onSearch,
      onChange = _ref.onChange,
      searching = _ref.searching,
      children = _ref.children,
      type = _ref.type,
      value = _ref.value,
      clearable = _ref.clearable,
      disabled = _ref.disabled,
      dropdownClassName = _ref.dropdownClassName,
      dropdownStyle = _ref.dropdownStyle,
      disableMatchWidth = _ref.disableMatchWidth,
      disableFreeSolo = _ref.disableFreeSolo,
      getPopupContainer = _ref.getPopupContainer,
      props = _objectWithoutProperties(_ref, _excluded$1f);

  var resetTimer = React.useRef();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES,
      getScaleProps = _useScale.getScaleProps;

  var ref = React.useRef(null);
  var inputRef = React.useRef(null);

  var _useCurrentState = useCurrentState$1(customInitialValue),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      state = _useCurrentState2[0],
      setState = _useCurrentState2[1],
      stateRef = _useCurrentState2[2];

  var _useState = React.useState(customInitialValue),
      _useState2 = _slicedToArray(_useState, 2),
      selectVal = _useState2[0],
      setSelectVal = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      visible = _useState4[0],
      setVisible = _useState4[1];

  React.useImperativeHandle(userRef, function () {
    return inputRef.current;
  });

  var _pickChild = pickChild(children, AutoCompleteSearching),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      searchChild = _pickChild2[1];

  var _pickChild3 = pickChild(children, AutoCompleteEmpty$1),
      _pickChild4 = _slicedToArray(_pickChild3, 2),
      emptyChild = _pickChild4[1];

  var autoCompleteItems = React.useMemo(function () {
    var hasSearchChild = searchChild && React__default["default"].Children.count(searchChild) > 0;
    var hasEmptyChild = emptyChild && React__default["default"].Children.count(emptyChild) > 0;

    if (searching) {
      return hasSearchChild ? searchChild : /*#__PURE__*/React__default["default"].createElement(AutoCompleteSearching, null, "Searching...");
    }

    if (options.length === 0) {
      if (state === '') return null;
      return hasEmptyChild ? emptyChild : /*#__PURE__*/React__default["default"].createElement(AutoCompleteEmpty$1, null, "No Options");
    }

    return childrenToOptionsNode(options);
  }, [searching, options]);
  var showClearIcon = React.useMemo(function () {
    return clearable && searching === undefined;
  }, [clearable, searching]);

  var updateValue = function updateValue(val) {
    if (disabled) return;
    setSelectVal(val);
    onSelect && onSelect(val);
    setState(val);
    inputRef.current && inputRef.current.focus();
  };

  var updateVisible = function updateVisible(next) {
    return setVisible(next);
  };

  var onInputChange = function onInputChange(event) {
    setVisible(true);
    onSearch && onSearch(event.target.value);
    setState(event.target.value);
  };

  var resetInputValue = function resetInputValue() {
    if (!disableFreeSolo) return;
    if (!state || state === '') return;

    if (state !== selectVal) {
      setState(selectVal);
    }
  };

  React.useEffect(function () {
    onChange && onChange(state);
  }, [state]);
  React.useEffect(function () {
    if (value === undefined) return;
    setState(value);
  }, [value]);
  var initialValue = React.useMemo(function () {
    return {
      ref: ref,
      value: state,
      updateValue: updateValue,
      visible: visible,
      updateVisible: updateVisible
    };
  }, [state, visible]);

  var toggleFocusHandler = function toggleFocusHandler(next) {
    clearTimeout(resetTimer.current);
    setVisible(next);

    if (next) {
      onSearch && onSearch(stateRef.current);
    } else {
      resetTimer.current = window.setTimeout(function () {
        resetInputValue();
        clearTimeout(resetTimer.current);
      }, 100);
    }
  };

  var inputProps = _objectSpread2(_objectSpread2({}, props), {}, {
    disabled: disabled,
    value: state
  });

  return /*#__PURE__*/React__default["default"].createElement(AutoCompleteContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    ref: ref,
    className: styledJsx_cjs.style.dynamic([["2878925540", [SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + "auto-complete"
  }, /*#__PURE__*/React__default["default"].createElement(Input$1, _extends({
    ref: inputRef,
    type: type,
    onChange: onInputChange,
    onFocus: function onFocus() {
      return toggleFocusHandler(true);
    },
    onBlur: function onBlur() {
      return toggleFocusHandler(false);
    },
    clearable: showClearIcon,
    width: SCALES.width(1, 'initial'),
    height: SCALES.height(2.25),
    iconRight: getSearchIcon(searching, getScaleProps('scale'))
  }, inputProps)), /*#__PURE__*/React__default["default"].createElement(AutoCompleteDropdown$1, {
    visible: visible,
    disableMatchWidth: disableMatchWidth,
    className: dropdownClassName,
    dropdownStyle: dropdownStyle,
    getPopupContainer: getPopupContainer
  }, autoCompleteItems), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2878925540",
    dynamic: [SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".auto-complete.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, 'max-content'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.auto-complete.__jsx-style-dynamic-selector .loading{width:-webkit-max-content;width:-moz-max-content;width:max-content;}"))));
});
AutoCompleteComponent.defaultProps = defaultProps$1q;
AutoCompleteComponent.displayName = 'GeistAutoComplete';
var AutoComplete = withScale$1(AutoCompleteComponent);
var AutoComplete$1 = AutoComplete;

AutoComplete$1.Item = AutoCompleteItem$1;
AutoComplete$1.Option = AutoCompleteItem$1;
AutoComplete$1.Searching = AutoCompleteSearching;
AutoComplete$1.Empty = AutoCompleteEmpty$1;

var _excluded$1e = ["src", "stacked", "text", "isSquare", "className"];
var defaultProps$1p = {
  stacked: false,
  text: '',
  isSquare: false,
  className: ''
};

var safeText = function safeText(text) {
  if (text.length <= 4) return text;
  return text.slice(0, 3);
};

var AvatarComponent = function AvatarComponent(_ref) {
  var src = _ref.src,
      stacked = _ref.stacked,
      text = _ref.text,
      isSquare = _ref.isSquare,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$1e);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var showText = !src;
  var radius = isSquare ? theme.layout.radius : '50%';
  var marginLeft = stacked ? SCALES.ml(-0.625) : SCALES.ml(0);
  var classes = useClasses$1('avatar', className);
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2295275975", [theme.palette.accents_2, radius, theme.palette.background, SCALES.width(1.75) || SCALES.height(1.75), SCALES.height(1.75) || SCALES.width(1.75), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), marginLeft, radius, SCALES.font(1)]]]) + " " + (classes || "")
  }, !showText && /*#__PURE__*/React__default["default"].createElement("img", _extends({
    alt: "avatar",
    src: src,
    draggable: false
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2295275975", [theme.palette.accents_2, radius, theme.palette.background, SCALES.width(1.75) || SCALES.height(1.75), SCALES.height(1.75) || SCALES.width(1.75), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), marginLeft, radius, SCALES.font(1)]]]) + " " + (props && props.className != null && props.className || "avatar-img")
  })), showText && /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2295275975", [theme.palette.accents_2, radius, theme.palette.background, SCALES.width(1.75) || SCALES.height(1.75), SCALES.height(1.75) || SCALES.width(1.75), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), marginLeft, radius, SCALES.font(1)]]]) + " " + (props && props.className != null && props.className || "avatar-text")
  }), safeText(text)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2295275975",
    dynamic: [theme.palette.accents_2, radius, theme.palette.background, SCALES.width(1.75) || SCALES.height(1.75), SCALES.height(1.75) || SCALES.width(1.75), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), marginLeft, radius, SCALES.font(1)]
  }, ".avatar.__jsx-style-dynamic-selector{display:inline-block;position:relative;overflow:hidden;border:1px solid ".concat(theme.palette.accents_2, ";border-radius:").concat(radius, ";vertical-align:top;background-color:").concat(theme.palette.background, ";box-sizing:border-box;width:").concat(SCALES.width(1.75) || SCALES.height(1.75), ";height:").concat(SCALES.height(1.75) || SCALES.width(1.75), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(marginLeft, ";}.avatar-img.__jsx-style-dynamic-selector{display:inline-block;object-fit:cover;width:100%;height:100%;border-radius:").concat(radius, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.avatar-text.__jsx-style-dynamic-selector{position:absolute;left:50%;top:50%;font-size:").concat(SCALES.font(1), ";text-align:center;-webkit-transform:translate(-50%,-50%) scale(0.65);-ms-transform:translate(-50%,-50%) scale(0.65);transform:translate(-50%,-50%) scale(0.65);white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}")));
};

AvatarComponent.defaultProps = defaultProps$1p;
AvatarComponent.displayName = 'GeistAvatar';
var Avatar = withScale$1(AvatarComponent);
var Avatar$1 = Avatar;

var defaultProps$1o = {
  className: ''
};

var AvatarGroupComponent = function AvatarGroupComponent(_ref) {
  var count = _ref.count,
      className = _ref.className,
      children = _ref.children;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1135268764", [SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.ml(0.625), SCALES.font(0.875), theme.palette.accents_7]]]) + " " + (useClasses$1('avatar-group', className) || "")
  }, children, count && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1135268764", [SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.ml(0.625), SCALES.font(0.875), theme.palette.accents_7]]]) + " " + "count"
  }, "+", count), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1135268764",
    dynamic: [SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.ml(0.625), SCALES.font(0.875), theme.palette.accents_7]
  }, ".avatar-group.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:".concat(SCALES.width(1, 'max-content'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.avatar-group.__jsx-style-dynamic-selector .avatar{margin-left:-").concat(SCALES.ml(0.625), ";}.count.__jsx-style-dynamic-selector{font-size:").concat(SCALES.font(0.875), ";display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding-left:5.5px;color:").concat(theme.palette.accents_7, ";}")));
};

AvatarGroupComponent.defaultProps = defaultProps$1o;
AvatarGroupComponent.displayName = 'GeistAvatarGroup';
var AvatarGroup = withScale$1(AvatarGroupComponent);
var AvatarGroup$1 = AvatarGroup;

Avatar$1.Group = AvatarGroup$1;

var _excluded$1d = ["type", "className", "children", "dot"];
var defaultProps$1n = {
  type: 'default',
  dot: false,
  className: ''
};

var getBgColor = function getBgColor(type, palette) {
  var colors = {
    "default": palette.foreground,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    secondary: palette.secondary
  };
  return colors[type];
};

var BadgeComponent = function BadgeComponent(_ref) {
  var type = _ref.type,
      className = _ref.className,
      children = _ref.children,
      dot = _ref.dot,
      props = _objectWithoutProperties(_ref, _excluded$1d);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var bg = React.useMemo(function () {
    return getBgColor(type, theme.palette);
  }, [type, theme.palette]);
  var color = React.useMemo(function () {
    if (!type || type === 'default') return theme.palette.background;
    return 'white';
  }, [type, theme.palette.background]);
  var classes = useClasses$1('badge', {
    dot: dot
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["427831233", [bg, color, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.25), SCALES.pr(0.4375), SCALES.pb(0.25), SCALES.pl(0.4375), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.py(0.25), SCALES.px(0.25)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), !dot && children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "427831233",
    dynamic: [bg, color, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.25), SCALES.pr(0.4375), SCALES.pb(0.25), SCALES.pl(0.4375), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.py(0.25), SCALES.px(0.25)]
  }, ".badge.__jsx-style-dynamic-selector{display:inline-block;border-radius:16px;font-variant:tabular-nums;line-height:1;vertical-align:middle;background-color:".concat(bg, ";color:").concat(color, ";border:0;font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.25), " ").concat(SCALES.pr(0.4375), " ").concat(SCALES.pb(0.25), " ").concat(SCALES.pl(0.4375), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.dot.__jsx-style-dynamic-selector{padding:").concat(SCALES.py(0.25), " ").concat(SCALES.px(0.25), ";border-radius:50%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}")));
};

BadgeComponent.defaultProps = defaultProps$1n;
BadgeComponent.displayName = 'GeistBadge';
var Badge = withScale$1(BadgeComponent);
var Badge$1 = Badge;

tuple('topLeft', 'topRight', 'bottomLeft', 'bottomRight');
var defaultProps$1m = {
  placement: 'topRight',
  className: ''
};

var getTransform = function getTransform(placement) {
  var styles = {
    topLeft: {
      top: '0',
      left: '0',
      value: 'translate(-50%, -50%)',
      origin: '0% 0%'
    },
    topRight: {
      top: '0',
      right: '0',
      value: 'translate(50%, -50%)',
      origin: '100% 0%'
    },
    bottomLeft: {
      left: '0',
      bottom: '0',
      value: 'translate(-50%, 50%)',
      origin: '0% 100%'
    },
    bottomRight: {
      right: '0',
      bottom: '0',
      value: 'translate(50%, 50%)',
      origin: '100% 100%'
    }
  };
  return styles[placement];
};

var BadgeAnchor = function BadgeAnchor(_ref) {
  var children = _ref.children,
      placement = _ref.placement;

  var _pickChild = pickChild(children, Badge$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      withoutBadgeChildren = _pickChild2[0],
      badgeChldren = _pickChild2[1];

  var _useMemo = React.useMemo(function () {
    return getTransform(placement);
  }, [placement]),
      top = _useMemo.top,
      bottom = _useMemo.bottom,
      left = _useMemo.left,
      right = _useMemo.right,
      value = _useMemo.value,
      origin = _useMemo.origin;

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1121745930", [top || 'auto', left || 'auto', right || 'auto', bottom || 'auto', value, origin]]]) + " " + "anchor"
  }, withoutBadgeChildren, /*#__PURE__*/React__default["default"].createElement("sup", {
    className: styledJsx_cjs.style.dynamic([["1121745930", [top || 'auto', left || 'auto', right || 'auto', bottom || 'auto', value, origin]]])
  }, badgeChldren), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1121745930",
    dynamic: [top || 'auto', left || 'auto', right || 'auto', bottom || 'auto', value, origin]
  }, ".anchor.__jsx-style-dynamic-selector{position:relative;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;vertical-align:middle;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;}sup.__jsx-style-dynamic-selector{position:absolute;top:".concat(top || 'auto', ";left:").concat(left || 'auto', ";right:").concat(right || 'auto', ";bottom:").concat(bottom || 'auto', ";-webkit-transform:").concat(value, ";-ms-transform:").concat(value, ";transform:").concat(value, ";-webkit-transform-origin:").concat(origin, ";-ms-transform-origin:").concat(origin, ";transform-origin:").concat(origin, ";z-index:1;}")));
};

BadgeAnchor.defaultProps = defaultProps$1m;
BadgeAnchor.displayName = 'GeistBadgeAnchor';
var BadgeAnchor$1 = BadgeAnchor;

Badge$1.Anchor = BadgeAnchor$1;

var defaultProps$1l = {
  className: ''
};

var Separator = function Separator(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('separator', className);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1571781185", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0.5), SCALES.mb(0), SCALES.ml(0.5)]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1571781185",
    dynamic: [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0.5), SCALES.mb(0), SCALES.ml(0.5)]
  }, ".separator.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:".concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0.5), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0.5), ";}")));
};

Separator.defaultProps = defaultProps$1l;
Separator.displayName = 'GeistBreadcrumbsSeparator';
var BreadcrumbsSeparator = withScale$1(Separator);
var BreadcrumbsSeparator$1 = BreadcrumbsSeparator;

var hexToRgb = function hexToRgb(color) {
  var fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var full = color.replace(fullReg, function (_, r, g, b) {
    return "".concat(r).concat(r).concat(g).concat(g).concat(b).concat(b);
  });
  var values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);

  if (!values) {
    throw new Error("Geist UI: Unsupported ".concat(color, " color."));
  }

  return [Number.parseInt(values[1], 16), Number.parseInt(values[2], 16), Number.parseInt(values[3], 16)];
};

var colorToRgbValues = function colorToRgbValues(color) {
  if (color.charAt(0) === '#') return hexToRgb(color);
  var safeColor = color.replace(/ /g, '');
  var colorType = color.substr(0, 4);
  var regArray = safeColor.match(/\((.+)\)/);

  if (!colorType.startsWith('rgb') || !regArray) {
    console.log(color);
    throw new Error("Geist UI: Only support [\"RGB\", \"RGBA\", \"HEX\"] color.");
  }

  return regArray[1].split(',').map(function (str) {
    return Number.parseFloat(str);
  });
};
var addColorAlpha = function addColorAlpha(color, alpha) {
  if (!/^#|rgb|RGB/.test(color)) return color;

  var _colorToRgbValues = colorToRgbValues(color),
      _colorToRgbValues2 = _slicedToArray(_colorToRgbValues, 3),
      r = _colorToRgbValues2[0],
      g = _colorToRgbValues2[1],
      b = _colorToRgbValues2[2];

  var safeAlpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(safeAlpha, ")");
};

var defaultProps$1k = {
  separator: '/',
  className: ''
};

var BreadcrumbsComponent = function BreadcrumbsComponent(_ref) {
  var separator = _ref.separator,
      children = _ref.children,
      className = _ref.className;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var hoverColor = React.useMemo(function () {
    return addColorAlpha(theme.palette.link, 0.85);
  }, [theme.palette.link]);
  var childrenArray = React__default["default"].Children.toArray(children);
  var withSeparatorChildren = childrenArray.map(function (item, index) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(item)) return item;
    var last = childrenArray[index - 1];
    var lastIsSeparator = /*#__PURE__*/React__default["default"].isValidElement(last) && last.type === BreadcrumbsSeparator$1;
    var currentIsSeparator = item.type === BreadcrumbsSeparator$1;

    if (!lastIsSeparator && !currentIsSeparator && index > 0) {
      return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, {
        key: index
      }, /*#__PURE__*/React__default["default"].createElement(BreadcrumbsSeparator$1, null, separator), item);
    }

    return item;
  });
  return /*#__PURE__*/React__default["default"].createElement("nav", {
    className: styledJsx_cjs.style.dynamic([["524763277", [theme.palette.accents_4, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverColor, theme.palette.accents_6]]]) + " " + (className || "")
  }, withSeparatorChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "524763277",
    dynamic: [theme.palette.accents_4, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverColor, theme.palette.accents_6]
  }, "nav.__jsx-style-dynamic-selector{line-height:inherit;color:".concat(theme.palette.accents_4, ";box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}nav.__jsx-style-dynamic-selector .link:hover{color:").concat(hoverColor, ";}nav.__jsx-style-dynamic-selector>span:last-of-type{color:").concat(theme.palette.accents_6, ";}nav.__jsx-style-dynamic-selector>.separator:last-child{display:none;}nav.__jsx-style-dynamic-selector svg{width:1em;height:1em;margin:0 4px;}nav.__jsx-style-dynamic-selector .breadcrumbs-item{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}")));
};

BreadcrumbsComponent.defaultProps = defaultProps$1k;
BreadcrumbsComponent.displayName = 'GeistBreadcrumbs';
var Breadcrumbs = withScale$1(BreadcrumbsComponent);
var Breadcrumbs$1 = Breadcrumbs;

var LinkIconComponent = function LinkIconComponent() {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: "0.9375em",
    height: "0.9375em",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: "jsx-3409194595" + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6",
    className: "jsx-3409194595"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M15 3h6v6",
    className: "jsx-3409194595"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M10 14L21 3",
    className: "jsx-3409194595"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3409194595"
  }, ".icon.jsx-3409194595{margin:0 0 -1px 0.1875em;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;color:currentColor;}"));
};
LinkIconComponent.displayName = 'GeistLinkIcon';
var LinkIcon = /*#__PURE__*/React__default["default"].memo(LinkIconComponent);
var LinkIcon$1 = LinkIcon;

var _excluded$1c = ["href", "color", "underline", "children", "className", "block", "icon"];
var defaultProps$1j = {
  href: '',
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: ''
};
var LinkComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var href = _ref.href,
      color = _ref.color,
      underline = _ref.underline,
      children = _ref.children,
      className = _ref.className,
      block = _ref.block,
      icon = _ref.icon,
      props = _objectWithoutProperties(_ref, _excluded$1c);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var linkColor = color || block ? theme.palette.link : 'inherit';
  var hoverColor = color || block ? theme.palette.successLight : 'inherit';
  var decoration = underline ? 'underline' : 'none';
  var classes = useClasses$1('link', {
    block: block
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("a", _extends({
    href: href
  }, props, {
    ref: ref,
    className: styledJsx_cjs.style.dynamic([["442871747", [linkColor, block ? theme.layout.radius : 0, SCALES.font(1, 'inherit'), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.pt(0.125), SCALES.pr(0.25), SCALES.pb(0.125), SCALES.pl(0.25), SCALES.mt(0), SCALES.mr(-0.125), SCALES.mb(0), SCALES.ml(-0.125), decoration, block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', hoverColor]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, icon && /*#__PURE__*/React__default["default"].createElement(LinkIcon$1, null), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "442871747",
    dynamic: [linkColor, block ? theme.layout.radius : 0, SCALES.font(1, 'inherit'), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.pt(0.125), SCALES.pr(0.25), SCALES.pb(0.125), SCALES.pl(0.25), SCALES.mt(0), SCALES.mr(-0.125), SCALES.mb(0), SCALES.ml(-0.125), decoration, block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', hoverColor]
  }, ".link.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:baseline;-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline;line-height:inherit;color:".concat(linkColor, ";-webkit-text-decoration:none;text-decoration:none;border-radius:").concat(block ? theme.layout.radius : 0, ";-webkit-transition:color 200ms ease 0ms;transition:color 200ms ease 0ms;font-size:").concat(SCALES.font(1, 'inherit'), ";width:").concat(SCALES.width(1, 'fit-content'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}.block.__jsx-style-dynamic-selector{padding:").concat(SCALES.pt(0.125), " ").concat(SCALES.pr(0.25), " ").concat(SCALES.pb(0.125), " ").concat(SCALES.pl(0.25), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(-0.125), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(-0.125), ";}.link.__jsx-style-dynamic-selector:hover,.link.__jsx-style-dynamic-selector:active,.link.__jsx-style-dynamic-selector:focus{-webkit-text-decoration:").concat(decoration, ";text-decoration:").concat(decoration, ";}.link.__jsx-style-dynamic-selector:hover{background-color:").concat(block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', ";color:").concat(hoverColor, ";}")));
});
LinkComponent.defaultProps = defaultProps$1j;
LinkComponent.displayName = 'GeistLink';
var Link = withScale$1(LinkComponent);
var Link$1 = Link;

var _excluded$1b = ["href", "nextLink", "onClick", "children", "className"];
var defaultProps$1i = {
  nextLink: false,
  className: ''
};
var BreadcrumbsItem = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var href = _ref.href,
      nextLink = _ref.nextLink,
      onClick = _ref.onClick,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$1b);

  var isLink = React.useMemo(function () {
    return href !== undefined || nextLink;
  }, [href, nextLink]);

  var _pickChild = pickChild(children, BreadcrumbsSeparator$1),
      _pickChild2 = _slicedToArray(_pickChild, 1),
      withoutSepChildren = _pickChild2[0];

  var classes = useClasses$1('breadcrumbs-item', className);

  var clickHandler = function clickHandler(event) {
    onClick && onClick(event);
  };

  if (!isLink) {
    return /*#__PURE__*/React__default["default"].createElement("span", {
      className: classes,
      onClick: clickHandler
    }, withoutSepChildren);
  }

  return /*#__PURE__*/React__default["default"].createElement(Link$1, _extends({
    className: classes,
    href: href,
    onClick: clickHandler,
    ref: ref
  }, props), withoutSepChildren);
});
BreadcrumbsItem.defaultProps = defaultProps$1i;
BreadcrumbsItem.displayName = 'GeistBreadcrumbsItem';
var BreadcrumbsItem$1 = BreadcrumbsItem;

Breadcrumbs$1.Item = BreadcrumbsItem$1;
Breadcrumbs$1.Separator = BreadcrumbsSeparator$1;

var defaultProps$1h = {
  x: 0,
  y: 0
};

var ButtonDrip = function ButtonDrip(_ref) {
  var x = _ref.x,
      y = _ref.y,
      color = _ref.color,
      onCompleted = _ref.onCompleted;
  var dripRef = React.useRef(null);
  /* istanbul ignore next */

  var top = Number.isNaN(+y) ? 0 : y - 10;
  /* istanbul ignore next */

  var left = Number.isNaN(+x) ? 0 : x - 10;
  React.useEffect(function () {
    /* istanbul ignore next */
    if (!dripRef.current) return;
    dripRef.current.addEventListener('animationend', onCompleted);
    return function () {
      /* istanbul ignore next */
      if (!dripRef.current) return;
      dripRef.current.removeEventListener('animationend', onCompleted);
    };
  });
  return /*#__PURE__*/React__default["default"].createElement("div", {
    ref: dripRef,
    className: "jsx-3424889537" + " " + "drip"
  }, /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    style: {
      top: top,
      left: left
    },
    className: "jsx-3424889537"
  }, /*#__PURE__*/React__default["default"].createElement("g", {
    stroke: "none",
    strokeWidth: "1",
    fill: "none",
    fillRule: "evenodd",
    className: "jsx-3424889537"
  }, /*#__PURE__*/React__default["default"].createElement("g", {
    fill: color,
    className: "jsx-3424889537"
  }, /*#__PURE__*/React__default["default"].createElement("rect", {
    width: "100%",
    height: "100%",
    rx: "10",
    className: "jsx-3424889537"
  })))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3424889537"
  }, ".drip.jsx-3424889537{position:absolute;left:0;right:0;top:0;bottom:0;}svg.jsx-3424889537{position:absolute;-webkit-animation:350ms ease-in expand-jsx-3424889537;animation:350ms ease-in expand-jsx-3424889537;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;width:1rem;height:1rem;}@-webkit-keyframes expand-jsx-3424889537{0%{opacity:0;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);}30%{opacity:1;}80%{opacity:0.5;}100%{-webkit-transform:scale(28);-ms-transform:scale(28);transform:scale(28);opacity:0;}}@keyframes expand-jsx-3424889537{0%{opacity:0;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);}30%{opacity:1;}80%{opacity:0.5;}100%{-webkit-transform:scale(28);-ms-transform:scale(28);transform:scale(28);opacity:0;}}"));
};

ButtonDrip.defaultProps = defaultProps$1h;
ButtonDrip.displayName = 'GeistButtonDrip';
var ButtonDrip$1 = ButtonDrip;

var ButtonLoading = function ButtonLoading(_ref) {
  var color = _ref.color;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "jsx-3416748964" + " " + "btn-loading"
  }, /*#__PURE__*/React__default["default"].createElement(Loading$1, {
    color: color
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3416748964"
  }, ".btn-loading.jsx-3416748964{position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;background-color:var(--geist-ui-button-bg);}"));
};

ButtonLoading.displayName = 'GeistButtonLoading';
var ButtonLoading$1 = ButtonLoading;

var _excluded$1a = ["isRight", "isSingle", "children", "className"];
var defaultProps$1g = {
  isRight: false,
  className: ''
};

var ButtonIcon = function ButtonIcon(_ref) {
  var isRight = _ref.isRight,
      isSingle = _ref.isSingle,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$1a);

  var classes = useClasses$1('icon', {
    right: isRight,
    single: isSingle
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: "jsx-643337184" + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "643337184"
  }, ".icon.jsx-643337184{position:absolute;left:var(--geist-ui-button-icon-padding);right:auto;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:var(--geist-ui-button-color);z-index:1;}.right.jsx-643337184{right:var(--geist-ui-button-icon-padding);left:auto;}.icon.jsx-643337184 svg{background:transparent;height:calc(var(--geist-ui-button-height) / 2.35);width:calc(var(--geist-ui-button-height) / 2.35);}.single.jsx-643337184{position:static;-webkit-transform:none;-ms-transform:none;transform:none;}"));
};

ButtonIcon.defaultProps = defaultProps$1g;
ButtonIcon.displayName = 'GeistButtonIcon';
var ButtonIcon$1 = ButtonIcon;

var getButtonChildrenWithIcon = function getButtonChildrenWithIcon(auto, children, icons) {
  var icon = icons.icon,
      iconRight = icons.iconRight;
  var hasIcon = icon || iconRight;
  var isRight = Boolean(iconRight);
  var paddingForAutoMode = auto ? "calc(var(--geist-ui-button-height) / 2 + var(--geist-ui-button-icon-padding) * .5)" : 0;
  var classes = useClasses$1('text', isRight ? 'right' : 'left');
  if (!hasIcon) return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "text"
  }, children);

  if (React__default["default"].Children.count(children) === 0) {
    return /*#__PURE__*/React__default["default"].createElement(ButtonIcon$1, {
      isRight: isRight,
      isSingle: true
    }, hasIcon);
  }

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(ButtonIcon$1, {
    isRight: isRight
  }, hasIcon), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3568181479", [paddingForAutoMode, paddingForAutoMode]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3568181479",
    dynamic: [paddingForAutoMode, paddingForAutoMode]
  }, ".left.__jsx-style-dynamic-selector{padding-left:".concat(paddingForAutoMode, ";}.right.__jsx-style-dynamic-selector{padding-right:").concat(paddingForAutoMode, ";}"))));
};
var filterPropsWithGroup = function filterPropsWithGroup(props, config) {
  if (!config.isButtonGroup) return props;
  return _objectSpread2(_objectSpread2({}, props), {}, {
    auto: true,
    shadow: false,
    ghost: config.ghost || props.ghost,
    type: config.type || props.type,
    disabled: config.disabled || props.disabled
  });
};

var defaultContext$c = {
  isButtonGroup: false,
  disabled: false
};
var ButtonGroupContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$c);
var useButtonGroupContext = function useButtonGroupContext() {
  return React__default["default"].useContext(ButtonGroupContext);
};

var getButtonGhostColors = function getButtonGhostColors(palette, type) {
  var colors = {
    secondary: {
      bg: palette.background,
      border: palette.foreground,
      color: palette.foreground
    },
    success: {
      bg: palette.background,
      border: palette.success,
      color: palette.success
    },
    warning: {
      bg: palette.background,
      border: palette.warning,
      color: palette.warning
    },
    error: {
      bg: palette.background,
      border: palette.error,
      color: palette.error
    }
  };
  return colors[type] || null;
};
var getButtonColors = function getButtonColors(palette, props) {
  var type = props.type,
      disabled = props.disabled,
      ghost = props.ghost;
  var colors = {
    "default": {
      bg: palette.background,
      border: palette.border,
      color: palette.accents_5
    },
    secondary: {
      bg: palette.foreground,
      border: palette.foreground,
      color: palette.background
    },
    success: {
      bg: palette.success,
      border: palette.success,
      color: '#fff'
    },
    warning: {
      bg: palette.warning,
      border: palette.warning,
      color: '#fff'
    },
    error: {
      bg: palette.error,
      border: palette.error,
      color: '#fff'
    },
    abort: {
      bg: 'transparent',
      border: 'transparent',
      color: palette.accents_5
    }
  };
  if (disabled) return {
    bg: palette.accents_1,
    border: palette.accents_2,
    color: '#ccc'
  };
  /**
   * The '-light' type is the same color as the common type,
   * only hover's color is different.
   * e.g.
   *   Color['success'] === Color['success-light']
   *   Color['warning'] === Color['warning-light']
   */

  var withoutLightType = type === null || type === void 0 ? void 0 : type.replace('-light', '');
  var defaultColor = colors["default"];
  if (ghost) return getButtonGhostColors(palette, withoutLightType) || defaultColor;
  return colors[withoutLightType] || defaultColor;
};
var getButtonGhostHoverColors = function getButtonGhostHoverColors(palette, type) {
  var colors = {
    secondary: {
      bg: palette.foreground,
      border: palette.background,
      color: palette.background
    },
    success: {
      bg: palette.success,
      border: palette.background,
      color: 'white'
    },
    warning: {
      bg: palette.warning,
      border: palette.background,
      color: 'white'
    },
    error: {
      bg: palette.error,
      border: palette.background,
      color: 'white'
    }
  };
  var withoutLightType = type.replace('-light', '');
  return colors[withoutLightType] || null;
};
var getButtonHoverColors = function getButtonHoverColors(palette, props) {
  var type = props.type,
      disabled = props.disabled,
      loading = props.loading,
      shadow = props.shadow,
      ghost = props.ghost;
  var defaultColor = getButtonColors(palette, props);
  var alphaBackground = addColorAlpha(defaultColor.bg, 0.85);
  var colors = {
    "default": {
      bg: palette.background,
      border: palette.foreground
    },
    secondary: {
      bg: palette.background,
      border: palette.foreground
    },
    success: {
      bg: palette.background,
      border: palette.success
    },
    warning: {
      bg: palette.background,
      border: palette.warning
    },
    error: {
      bg: palette.background,
      border: palette.error
    },
    abort: {
      bg: 'transparent',
      border: 'transparent',
      color: palette.accents_5
    },
    'secondary-light': _objectSpread2(_objectSpread2({}, defaultColor), {}, {
      bg: alphaBackground
    }),
    'success-light': _objectSpread2(_objectSpread2({}, defaultColor), {}, {
      bg: alphaBackground
    }),
    'warning-light': _objectSpread2(_objectSpread2({}, defaultColor), {}, {
      bg: alphaBackground
    }),
    'error-light': _objectSpread2(_objectSpread2({}, defaultColor), {}, {
      bg: alphaBackground
    })
  };
  if (disabled) return {
    bg: palette.accents_1,
    border: palette.accents_2,
    color: '#ccc'
  };
  if (loading) return _objectSpread2(_objectSpread2({}, defaultColor), {}, {
    color: 'transparent'
  });
  if (shadow) return defaultColor;
  var hoverColor = (ghost ? getButtonGhostHoverColors(palette, type) : colors[type]) || colors["default"];
  return _objectSpread2(_objectSpread2({}, hoverColor), {}, {
    color: hoverColor.color || hoverColor.border
  });
};
var getButtonCursor = function getButtonCursor(disabled, loading) {
  if (disabled) return {
    cursor: 'not-allowed',
    events: 'auto'
  };
  if (loading) return {
    cursor: 'default',
    events: 'none'
  };
  return {
    cursor: 'pointer',
    events: 'auto'
  };
};
var getButtonDripColor = function getButtonDripColor(palette, props) {
  var type = props.type;
  var isLightHover = type.endsWith('light');
  var hoverColors = getButtonHoverColors(palette, props);
  return isLightHover ? addColorAlpha(hoverColors.bg, 0.65) : addColorAlpha(palette.accents_2, 0.65);
};

var _excluded$19 = ["children", "disabled", "type", "loading", "shadow", "ghost", "effect", "onClick", "auto", "icon", "htmlType", "iconRight", "className"];
var defaultProps$1f = {
  type: 'default',
  htmlType: 'button',
  ghost: false,
  loading: false,
  shadow: false,
  auto: false,
  effect: true,
  disabled: false,
  className: ''
};
var ButtonComponent = /*#__PURE__*/React__default["default"].forwardRef(function (btnProps, ref) {
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var buttonRef = React.useRef(null);
  React.useImperativeHandle(ref, function () {
    return buttonRef.current;
  });

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      dripShow = _useState2[0],
      setDripShow = _useState2[1];

  var _useState3 = React.useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      dripX = _useState4[0],
      setDripX = _useState4[1];

  var _useState5 = React.useState(0),
      _useState6 = _slicedToArray(_useState5, 2),
      dripY = _useState6[0],
      setDripY = _useState6[1];

  var groupConfig = useButtonGroupContext();
  var filteredProps = filterPropsWithGroup(btnProps, groupConfig);
  /* eslint-disable @typescript-eslint/no-unused-vars */

  var children = filteredProps.children,
      disabled = filteredProps.disabled;
      filteredProps.type;
      var loading = filteredProps.loading,
      shadow = filteredProps.shadow,
      ghost = filteredProps.ghost,
      effect = filteredProps.effect,
      onClick = filteredProps.onClick,
      auto = filteredProps.auto,
      icon = filteredProps.icon,
      htmlType = filteredProps.htmlType,
      iconRight = filteredProps.iconRight,
      className = filteredProps.className,
      props = _objectWithoutProperties(filteredProps, _excluded$19);
  /* eslint-enable @typescript-eslint/no-unused-vars */


  var _useMemo = React.useMemo(function () {
    return getButtonColors(theme.palette, filteredProps);
  }, [theme.palette, filteredProps]),
      bg = _useMemo.bg,
      border = _useMemo.border,
      color = _useMemo.color;

  var hover = React.useMemo(function () {
    return getButtonHoverColors(theme.palette, filteredProps);
  }, [theme.palette, filteredProps]);

  var _useMemo2 = React.useMemo(function () {
    return getButtonCursor(disabled, loading);
  }, [disabled, loading]),
      cursor = _useMemo2.cursor,
      events = _useMemo2.events;

  var dripColor = React.useMemo(function () {
    return getButtonDripColor(theme.palette, filteredProps);
  }, [theme.palette, filteredProps]);
  /* istanbul ignore next */

  var dripCompletedHandle = function dripCompletedHandle() {
    setDripShow(false);
    setDripX(0);
    setDripY(0);
  };

  var clickHandler = function clickHandler(event) {
    if (disabled || loading) return;
    var showDrip = !shadow && !ghost && effect;
    /* istanbul ignore next */

    if (showDrip && buttonRef.current) {
      var rect = buttonRef.current.getBoundingClientRect();
      setDripShow(true);
      setDripX(event.clientX - rect.left);
      setDripY(event.clientY - rect.top);
    }

    onClick && onClick(event);
  };

  var childrenWithIcon = React.useMemo(function () {
    return getButtonChildrenWithIcon(auto, children, {
      icon: icon,
      iconRight: iconRight
    });
  }, [auto, children, icon, iconRight]);
  var paddingLeft = auto ? SCALES.pl(1.15) : SCALES.pl(1.375),
      paddingRight = auto ? SCALES.pr(1.15) : SCALES.pr(1.375);
  return /*#__PURE__*/React__default["default"].createElement("button", _extends({
    ref: buttonRef,
    type: htmlType,
    disabled: disabled,
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["86551275", [SCALES.height(2.5), theme.layout.radius, SCALES.font(0.875), color, bg, border, cursor, events, shadow ? theme.expressiveness.shadowSmall : 'none', SCALES.pl(0.727), SCALES.height(2.5), color, bg, auto ? 'min-content' : SCALES.width(10.5), auto ? 'auto' : 'initial', SCALES.height(2.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hover.color, hover.color, hover.bg, hover.border, cursor, events, shadow ? theme.expressiveness.shadowMedium : 'none', shadow ? '-1px' : '0px']]]) + " " + (props && props.className != null && props.className || useClasses$1('btn', className) || "")
  }), loading && /*#__PURE__*/React__default["default"].createElement(ButtonLoading$1, {
    color: color
  }), childrenWithIcon, dripShow && /*#__PURE__*/React__default["default"].createElement(ButtonDrip$1, {
    x: dripX,
    y: dripY,
    color: dripColor,
    onCompleted: dripCompletedHandle
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "86551275",
    dynamic: [SCALES.height(2.5), theme.layout.radius, SCALES.font(0.875), color, bg, border, cursor, events, shadow ? theme.expressiveness.shadowSmall : 'none', SCALES.pl(0.727), SCALES.height(2.5), color, bg, auto ? 'min-content' : SCALES.width(10.5), auto ? 'auto' : 'initial', SCALES.height(2.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hover.color, hover.color, hover.bg, hover.border, cursor, events, shadow ? theme.expressiveness.shadowMedium : 'none', shadow ? '-1px' : '0px']
  }, ".btn.__jsx-style-dynamic-selector{box-sizing:border-box;display:inline-block;line-height:".concat(SCALES.height(2.5), ";border-radius:").concat(theme.layout.radius, ";font-weight:400;font-size:").concat(SCALES.font(0.875), ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;text-transform:capitalize;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center;white-space:nowrap;-webkit-transition:background-color 200ms ease 0ms,box-shadow 200ms ease 0ms, border 200ms ease 0ms,color 200ms ease 0ms;transition:background-color 200ms ease 0ms,box-shadow 200ms ease 0ms, border 200ms ease 0ms,color 200ms ease 0ms;position:relative;overflow:hidden;color:").concat(color, ";background-color:").concat(bg, ";border:1px solid ").concat(border, ";cursor:").concat(cursor, ";pointer-events:").concat(events, ";box-shadow:").concat(shadow ? theme.expressiveness.shadowSmall : 'none', ";--geist-ui-button-icon-padding:").concat(SCALES.pl(0.727), ";--geist-ui-button-height:").concat(SCALES.height(2.5), ";--geist-ui-button-color:").concat(color, ";--geist-ui-button-bg:").concat(bg, ";min-width:").concat(auto ? 'min-content' : SCALES.width(10.5), ";width:").concat(auto ? 'auto' : 'initial', ";height:").concat(SCALES.height(2.5), ";padding:").concat(SCALES.pt(0), " ").concat(paddingRight, " ").concat(SCALES.pb(0), " ").concat(paddingLeft, ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.btn.__jsx-style-dynamic-selector:hover,.btn.__jsx-style-dynamic-selector:focus{color:").concat(hover.color, ";--geist-ui-button-color:").concat(hover.color, ";background-color:").concat(hover.bg, ";border-color:").concat(hover.border, ";cursor:").concat(cursor, ";pointer-events:").concat(events, ";box-shadow:").concat(shadow ? theme.expressiveness.shadowMedium : 'none', ";-webkit-transform:translate3d(0px,").concat(shadow ? '-1px' : '0px', ",0px);-ms-transform:translate3d(0px,").concat(shadow ? '-1px' : '0px', ",0px);transform:translate3d(0px,").concat(shadow ? '-1px' : '0px', ",0px);}.btn.__jsx-style-dynamic-selector .text{position:relative;z-index:1;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;text-align:center;line-height:inherit;top:-1px;}.btn.__jsx-style-dynamic-selector .text p,.btn.__jsx-style-dynamic-selector .text pre,.btn.__jsx-style-dynamic-selector .text div{margin:0;}")));
});
ButtonComponent.defaultProps = defaultProps$1f;
ButtonComponent.displayName = 'GeistButton';
var Button = withScale$1(ButtonComponent);
var Button$1 = Button;

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

var getColor$4 = function getColor(palette, type) {
  var disabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var colors = {
    "default": {
      color: palette.accents_5,
      bgColor: palette.background,
      borderLeftColor: palette.accents_2,
      hoverBgColor: palette.accents_1,
      hoverBorder: palette.accents_2
    },
    secondary: {
      color: palette.background,
      bgColor: palette.foreground,
      borderLeftColor: palette.accents_7,
      hoverBgColor: palette.accents_7,
      hoverBorder: palette.accents_7
    },
    success: {
      color: palette.background,
      bgColor: palette.success,
      borderLeftColor: palette.successDark,
      hoverBgColor: palette.successDark,
      hoverBorder: palette.successDark
    },
    warning: {
      color: palette.background,
      bgColor: palette.warning,
      borderLeftColor: palette.warningDark,
      hoverBgColor: palette.warningDark,
      hoverBorder: palette.warningDark
    },
    error: {
      color: palette.background,
      bgColor: palette.error,
      borderLeftColor: palette.errorDark,
      hoverBgColor: palette.errorDark,
      hoverBorder: palette.errorDark
    }
  };
  if (disabled) return _objectSpread2(_objectSpread2({}, colors["default"]), {}, {
    bgColor: palette.accents_1,
    color: palette.accents_4
  });
  return type ? colors[type] : colors["default"];
};

var ButtonDropdownIcon = function ButtonDropdownIcon(_ref) {
  var color = _ref.color,
      height = _ref.height;
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    stroke: color,
    style: {
      color: color
    },
    viewBox: "0 0 24 24",
    width: height,
    height: height,
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: "jsx-3359574434"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 9l6 6 6-6",
    className: "jsx-3359574434"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3359574434"
  }, "svg.jsx-3359574434{-webkit-transform:scale(0.6);-ms-transform:scale(0.6);transform:scale(0.6);}"));
};

ButtonDropdownIcon.displayName = 'GeistButtonDropdownIcon';
var ButtonDropdownIcon$1 = ButtonDropdownIcon;

var defaultContext$b = {
  type: 'default',
  auto: false,
  disabled: false,
  loading: false
};
var ButtonDropdownContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$b);
var useButtonDropdown = function useButtonDropdown() {
  return React__default["default"].useContext(ButtonDropdownContext);
};

var _excluded$18 = ["children", "onClick", "className", "main", "type"];
var defaultProps$1e = {
  main: false,
  type: 'default',
  onClick: function onClick() {},
  className: ''
};

var ButtonDropdownItem = function ButtonDropdownItem(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      className = _ref.className,
      main = _ref.main,
      selfType = _ref.type,
      props = _objectWithoutProperties(_ref, _excluded$18);

  var theme = useTheme();

  var _useButtonDropdown = useButtonDropdown(),
      parentType = _useButtonDropdown.type,
      disabled = _useButtonDropdown.disabled,
      loading = _useButtonDropdown.loading;

  var type = main ? parentType : selfType;
  var colors = getColor$4(theme.palette, type, disabled);

  var clickHandler = function clickHandler(event) {
    if (disabled || loading) return;
    onClick && onClick(event);
  };

  var cursor = React.useMemo(function () {
    if (loading) return 'default';
    return disabled ? 'not-allowed' : 'pointer';
  }, [loading, disabled]);
  return /*#__PURE__*/React__default["default"].createElement("button", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["772098729", [cursor, colors.bgColor, colors.color, colors.hoverBorder, colors.hoverBgColor]]]) + " " + (props && props.className != null && props.className || className || "")
  }), loading ? /*#__PURE__*/React__default["default"].createElement(Loading$1, null) : children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "772098729",
    dynamic: [cursor, colors.bgColor, colors.color, colors.hoverBorder, colors.hoverBgColor]
  }, "button.__jsx-style-dynamic-selector{position:relative;-webkit-appearance:button;text-rendering:auto;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex:1;-ms-flex:1;flex:1;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;vertical-align:middle;text-align:center;cursor:".concat(cursor, ";box-sizing:border-box;margin:0;border:none;background-color:").concat(colors.bgColor, ";color:").concat(colors.color, ";width:100%;height:var(--geist-ui-dropdown-height);min-width:var(--geist-ui-dropdown-min-width);padding:var(--geist-ui-dropdown-padding);font-size:var(--geist-ui-dropdown-font-size);}button.__jsx-style-dynamic-selector:hover{border-color:").concat(colors.hoverBorder, ";background-color:").concat(colors.hoverBgColor, ";}")));
};

ButtonDropdownItem.defaultProps = defaultProps$1e;
ButtonDropdownItem.displayName = 'GeistButtonDropdownItem';
var ButtonDropdownItem$1 = ButtonDropdownItem;

var _excluded$17 = ["children", "type", "auto", "className", "disabled", "loading", "icon"];
var defaultProps$1d = {
  type: 'default',
  auto: false,
  loading: false,
  disabled: false,
  className: ''
};

var stopPropagation$1 = function stopPropagation(event) {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

var ButtonDropdownComponent = function ButtonDropdownComponent(_ref) {
  var children = _ref.children,
      type = _ref.type,
      auto = _ref.auto,
      className = _ref.className,
      disabled = _ref.disabled,
      loading = _ref.loading,
      icon = _ref.icon,
      props = _objectWithoutProperties(_ref, _excluded$17);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var ref = React.useRef(null);
  var theme = useTheme();
  var colors = getColor$4(theme.palette, type);
  var itemChildren = pickChild(children, ButtonDropdownItem$1)[1];

  var _pickChildByProps = pickChildByProps(itemChildren, 'main', true),
      _pickChildByProps2 = _slicedToArray(_pickChildByProps, 2),
      itemChildrenWithoutMain = _pickChildByProps2[0],
      mainItemChildren = _pickChildByProps2[1];

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var clickHandler = React.useCallback(function (event) {
    event.preventDefault();
    stopPropagation$1(event);
    if (disabled || loading) return;
    setVisible(!visible);
  }, [visible]);
  var initialValue = {
    type: type,
    auto: auto,
    disabled: disabled,
    loading: loading
  };
  var bgColor = React.useMemo(function () {
    if (disabled || loading) return theme.palette.accents_1;
    return visible ? colors.hoverBgColor : colors.bgColor;
  }, [visible, colors, theme.palette]);
  var paddingLeft = auto ? SCALES.pl(1.15) : SCALES.pl(1.375),
      paddingRight = auto ? SCALES.pr(1.15) : SCALES.pr(1.375);
  useClickAway$1(ref, function () {
    return setVisible(false);
  });
  return /*#__PURE__*/React__default["default"].createElement(ButtonDropdownContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: ref,
    onClick: stopPropagation$1
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]]) + " " + (props && props.className != null && props.className || useClasses$1('btn-dropdown', className) || "")
  }), mainItemChildren, /*#__PURE__*/React__default["default"].createElement("details", {
    open: visible,
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React__default["default"].createElement("summary", {
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]]) + " " + "dropdown-box"
  }, icon ? /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      color: colors.color,
      height: SCALES.height(2.5),
      width: SCALES.height(2.5)
    },
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]]) + " " + "dropdown-icon"
  }, icon) : /*#__PURE__*/React__default["default"].createElement(ButtonDropdownIcon$1, {
    color: colors.color,
    height: SCALES.height(2.5)
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1706659335", [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]]]) + " " + "content"
  }, itemChildrenWithoutMain)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1706659335",
    dynamic: [theme.palette.border, theme.layout.radius, SCALES.height(2.5), auto ? 'min-content' : SCALES.width(10.5), SCALES.pt(0), paddingRight, SCALES.pb(0), paddingLeft, SCALES.font(0.875), theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius, SCALES.height(2.5), colors.color, bgColor, SCALES.height(2.5), colors.borderLeftColor, disabled || loading ? 'not-allowed' : 'pointer', colors.hoverBorder, colors.hoverBgColor, theme.layout.radius, theme.expressiveness.shadowLarge, theme.layout.gapHalf, theme.palette.background, theme.layout.radius, theme.layout.radius, theme.layout.radius, theme.layout.radius]
  }, ".btn-dropdown.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;position:relative;box-sizing:border-box;border:1px solid ".concat(theme.palette.border, ";border-radius:").concat(theme.layout.radius, ";--geist-ui-dropdown-height:").concat(SCALES.height(2.5), ";--geist-ui-dropdown-min-width:").concat(auto ? 'min-content' : SCALES.width(10.5), ";--geist-ui-dropdown-padding:").concat(SCALES.pt(0), " ").concat(paddingRight, " ").concat(SCALES.pb(0), " ").concat(paddingLeft, ";--geist-ui-dropdown-font-size:").concat(SCALES.font(0.875), ";}.btn-dropdown.__jsx-style-dynamic-selector>button{border-top-left-radius:").concat(theme.layout.radius, ";border-bottom-left-radius:").concat(theme.layout.radius, ";}details.__jsx-style-dynamic-selector{border-top-right-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";overflow:hidden;}.dropdown-box.__jsx-style-dynamic-selector{height:").concat(SCALES.height(2.5), ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:auto;}summary.__jsx-style-dynamic-selector{box-sizing:border-box;-webkit-tap-highlight-color:transparent;list-style:none;outline:none;color:").concat(colors.color, ";background-color:").concat(bgColor, ";height:").concat(SCALES.height(2.5), ";border-left:1px solid ").concat(colors.borderLeftColor, ";cursor:").concat(disabled || loading ? 'not-allowed' : 'pointer', ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:auto;padding:0 1px;-webkit-transition:background 0.2s ease 0s,border-color 0.2s ease 0s;transition:background 0.2s ease 0s,border-color 0.2s ease 0s;}summary.__jsx-style-dynamic-selector:hover{border-color:").concat(colors.hoverBorder, ";background-color:").concat(colors.hoverBgColor, ";}.content.__jsx-style-dynamic-selector{position:absolute;right:0;left:0;z-index:90;width:100%;border-radius:").concat(theme.layout.radius, ";box-shadow:").concat(theme.expressiveness.shadowLarge, ";-webkit-transform:translateY(").concat(theme.layout.gapHalf, ");-ms-transform:translateY(").concat(theme.layout.gapHalf, ");transform:translateY(").concat(theme.layout.gapHalf, ");background-color:").concat(theme.palette.background, ";}.content.__jsx-style-dynamic-selector>button:first-of-type{border-top-left-radius:").concat(theme.layout.radius, ";border-top-right-radius:").concat(theme.layout.radius, ";}.content.__jsx-style-dynamic-selector>button:last-of-type{border-bottom-left-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";}.dropdown-icon.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-transform:scale(0.6);-ms-transform:scale(0.6);transform:scale(0.6);}"))));
};

ButtonDropdownComponent.displayName = 'GeistButtonDropdown';
ButtonDropdownComponent.defaultProps = defaultProps$1d;
var ButtonDropdown = withScale$1(ButtonDropdownComponent);
var ButtonDropdown$1 = ButtonDropdown;

ButtonDropdown$1.Item = ButtonDropdownItem$1;

var _excluded$16 = ["disabled", "type", "ghost", "vertical", "children", "className"];
var defaultProps$1c = {
  disabled: false,
  vertical: false,
  ghost: false,
  type: 'default',
  className: ''
};

var getGroupBorderColors = function getGroupBorderColors(palette, props) {
  var ghost = props.ghost,
      type = props.type;
  if (!ghost && type !== 'default') return palette.background;
  var colors = {
    "default": palette.border,
    success: palette.success,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning
  };
  var withoutLightType = type.replace('-light', '');
  return colors[withoutLightType] || colors["default"];
};

var ButtonGroupComponent = function ButtonGroupComponent(groupProps) {
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var disabled = groupProps.disabled,
      type = groupProps.type,
      ghost = groupProps.ghost,
      vertical = groupProps.vertical,
      children = groupProps.children,
      className = groupProps.className,
      props = _objectWithoutProperties(groupProps, _excluded$16);

  var initialValue = React.useMemo(function () {
    return {
      disabled: disabled,
      type: type,
      ghost: ghost,
      isButtonGroup: true
    };
  }, [disabled, type]);
  var border = React.useMemo(function () {
    return getGroupBorderColors(theme.palette, groupProps);
  }, [theme, type, disabled, ghost]);
  var classes = useClasses$1('btn-group', {
    vertical: vertical,
    horizontal: !vertical
  }, className);
  return /*#__PURE__*/React__default["default"].createElement(ButtonGroupContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3616385743", [theme.layout.radius, border, SCALES.width(1, 'auto'), SCALES.height(1, 'min-content'), SCALES.mt(0.313), SCALES.mr(0.313), SCALES.mb(0.313), SCALES.ml(0.313), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), border, border]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3616385743",
    dynamic: [theme.layout.radius, border, SCALES.width(1, 'auto'), SCALES.height(1, 'min-content'), SCALES.mt(0.313), SCALES.mr(0.313), SCALES.mb(0.313), SCALES.ml(0.313), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), border, border]
  }, ".btn-group.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;border-radius:".concat(theme.layout.radius, ";border:1px solid ").concat(border, ";background-color:transparent;overflow:hidden;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'min-content'), ";margin:").concat(SCALES.mt(0.313), " ").concat(SCALES.mr(0.313), " ").concat(SCALES.mb(0.313), " ").concat(SCALES.ml(0.313), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}.vertical.__jsx-style-dynamic-selector{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}.btn-group.__jsx-style-dynamic-selector .btn{border:none;}.btn-group.__jsx-style-dynamic-selector .btn .text{top:0;}.horizontal.__jsx-style-dynamic-selector .btn:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0;border-left:1px solid ").concat(border, ";}.horizontal.__jsx-style-dynamic-selector .btn:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0;}.vertical.__jsx-style-dynamic-selector .btn:not(:first-child){border-top-left-radius:0;border-top-right-radius:0;border-top:1px solid ").concat(border, ";}.vertical.__jsx-style-dynamic-selector .btn:not(:last-child){border-bottom-left-radius:0;border-bottom-right-radius:0;}"))));
};

ButtonGroupComponent.defaultProps = defaultProps$1c;
ButtonGroupComponent.displayName = 'GeistButtonGroup';
var ButtonGroup = withScale$1(ButtonGroupComponent);
var ButtonGroup$1 = ButtonGroup;

/**
 * Calculate the ratio of two numbers, maximum decimal length can be specified.
 *
 * (0, 100) => 0
 * (50, 100) => 50
 * (11.22, 100) => 11.22
 * (11.22, 100, 4) => 11.2200
 */

var getProportions = function getProportions(value, max) {
  var maxFixed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var val = value / max;
  var couldBeDecimalValue = (Number.isNaN(val) ? 0 : val) * 100;
  if (couldBeDecimalValue > 100) return 100;
  if (couldBeDecimalValue < 0) return 0;
  if (!"".concat(couldBeDecimalValue).includes('.')) return couldBeDecimalValue;
  var decimal = "".concat(couldBeDecimalValue).split('.')[1];
  if (decimal.length < maxFixed) return couldBeDecimalValue;
  return +couldBeDecimalValue.toFixed(maxFixed);
};
var useProportions = function useProportions(value, max) {
  var maxFixed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  return React.useMemo(function () {
    return getProportions(value, max, maxFixed);
  }, [value, max, maxFixed]);
};

var _excluded$15 = ["value", "limit", "color", "className"];
var defaultProps$1b = {
  value: 0,
  limit: 100,
  color: '',
  className: ''
};

var getColor$3 = function getColor(val, palette) {
  if (val < 33) return palette.cyan;
  if (val < 66) return palette.warning;
  return palette.errorDark;
};

var CapacityComponent = function CapacityComponent(_ref) {
  var value = _ref.value,
      limit = _ref.limit,
      userColor = _ref.color,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$15);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var percentValue = useProportions(value, limit);
  var classes = useClasses$1('capacity', className);
  var color = React.useMemo(function () {
    if (userColor && userColor !== '') return userColor;
    return getColor$3(percentValue, theme.palette);
  }, [userColor, percentValue, theme.palette]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    title: "".concat(percentValue, "%")
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2706946339", [SCALES.width(3.125), SCALES.height(0.625), theme.layout.radius, theme.palette.accents_2, SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), percentValue, color]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2706946339", [SCALES.width(3.125), SCALES.height(0.625), theme.layout.radius, theme.palette.accents_2, SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), percentValue, color]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2706946339",
    dynamic: [SCALES.width(3.125), SCALES.height(0.625), theme.layout.radius, theme.palette.accents_2, SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), percentValue, color]
  }, ".capacity.__jsx-style-dynamic-selector{width:".concat(SCALES.width(3.125), ";height:").concat(SCALES.height(0.625), ";border-radius:").concat(theme.layout.radius, ";overflow:hidden;background-color:").concat(theme.palette.accents_2, ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}span.__jsx-style-dynamic-selector{width:").concat(percentValue, "%;background-color:").concat(color, ";height:100%;margin:0;padding:0;display:block;}")));
};

CapacityComponent.defaultProps = defaultProps$1b;
CapacityComponent.displayName = 'GeistCapacity';
var Capacity = withScale$1(CapacityComponent);
var Capacity$1 = Capacity;

var getStyles$1 = function getStyles(type, palette, isShadow) {
  var colors = {
    "default": {
      color: palette.foreground,
      bgColor: palette.background
    },
    dark: {
      color: palette.background,
      bgColor: palette.foreground
    },
    secondary: {
      color: palette.background,
      bgColor: palette.secondary
    },
    success: {
      color: palette.background,
      bgColor: palette.success
    },
    warning: {
      color: palette.background,
      bgColor: palette.warning
    },
    error: {
      color: palette.background,
      bgColor: palette.error
    },
    lite: {
      color: palette.foreground,
      bgColor: palette.background
    },
    alert: {
      color: 'white',
      bgColor: palette.alert
    },
    purple: {
      color: 'white',
      bgColor: palette.purple
    },
    violet: {
      color: 'white',
      bgColor: palette.violet
    },
    cyan: {
      color: 'black',
      bgColor: palette.cyan
    }
  };
  var showBorder = type === 'default' && !isShadow;
  return _objectSpread2(_objectSpread2({}, colors[type]), {}, {
    borderColor: showBorder ? palette.border : 'transparent'
  });
};

var _excluded$14 = ["children", "className", "disableAutoMargin"];
var defaultProps$1a = {
  disableAutoMargin: false,
  className: ''
};

var CardFooterComponent = function CardFooterComponent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      disableAutoMargin = _ref.disableAutoMargin,
      props = _objectWithoutProperties(_ref, _excluded$14);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1({
    'auto-margin': !disableAutoMargin
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("footer", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1602358380", [SCALES.py(0.66), SCALES.px(1.31), SCALES.font(0.875), theme.palette.border, theme.layout.radius, theme.layout.radius, SCALES.height(3.3), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapQuarter]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1602358380",
    dynamic: [SCALES.py(0.66), SCALES.px(1.31), SCALES.font(0.875), theme.palette.border, theme.layout.radius, theme.layout.radius, SCALES.height(3.3), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapQuarter]
  }, "footer.__jsx-style-dynamic-selector{padding:".concat(SCALES.py(0.66), " ").concat(SCALES.px(1.31), ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden;color:inherit;background-color:inherit;font-size:").concat(SCALES.font(0.875), ";border-top:1px solid ").concat(theme.palette.border, ";border-bottom-left-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";min-height:").concat(SCALES.height(3.3), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.auto-margin.__jsx-style-dynamic-selector *{margin-top:0;margin-bottom:0;margin-right:").concat(theme.layout.gapQuarter, ";}")));
};

CardFooterComponent.defaultProps = defaultProps$1a;
CardFooterComponent.displayName = 'GeistCardFooter';
var CardFooter = withScale$1(CardFooterComponent);
var CardFooter$1 = CardFooter;

var _excluded$13 = ["className", "children"];
var defaultProps$19 = {
  className: ''
};

var CardContentComponent = function CardContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$13);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["490544004", [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1), SCALES.pr(1), SCALES.pb(1), SCALES.pl(1), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || useClasses$1('content', className) || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "490544004",
    dynamic: [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1), SCALES.pr(1), SCALES.pb(1), SCALES.pl(1), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".content.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1), " ").concat(SCALES.pr(1), " ").concat(SCALES.pb(1), " ").concat(SCALES.pl(1), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.content.__jsx-style-dynamic-selector>p:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector>p:last-child{margin-bottom:0;}")));
};

CardContentComponent.defaultProps = defaultProps$19;
CardContentComponent.displayName = 'GeistCardContent';
var CardContent = withScale$1(CardContentComponent);
var CardContent$1 = CardContent;

var _excluded$12 = ["opacity"];
var defaultProps$18 = {
  opacity: 0.5
};
var ImageSkeleton = /*#__PURE__*/React__default["default"].memo(function (_ref) {
  var opacity = _ref.opacity,
      props = _objectWithoutProperties(_ref, _excluded$12);

  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2946022605", [theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_1, opacity]]]) + " " + (props && props.className != null && props.className || "skeleton")
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2946022605",
    dynamic: [theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_1, opacity]
  }, ".skeleton.__jsx-style-dynamic-selector{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background-image:linear-gradient( 270deg, ".concat(theme.palette.accents_1, ", ").concat(theme.palette.accents_2, ", ").concat(theme.palette.accents_2, ", ").concat(theme.palette.accents_1, " );background-size:400% 100%;-webkit-animation:loading-__jsx-style-dynamic-selector 3s ease-in-out infinite;animation:loading-__jsx-style-dynamic-selector 3s ease-in-out infinite;opacity:").concat(opacity, ";-webkit-transition:opacity 300ms ease-out;transition:opacity 300ms ease-out;}@-webkit-keyframes loading-__jsx-style-dynamic-selector{0%{background-position:200% 0;}to{background-position:-200% 0;}}@keyframes loading-__jsx-style-dynamic-selector{0%{background-position:200% 0;}to{background-position:-200% 0;}}")));
});
ImageSkeleton.defaultProps = defaultProps$18;
ImageSkeleton.displayName = 'GeistImageSkeleton';
var ImageSkeleton$1 = ImageSkeleton;

var transformDataSource = function transformDataSource(src) {
  var left = "".concat(src).slice(0, 4);

  if (encodeURIComponent(left) === '%3Csvg') {
    return "data:image/svg+xml;utf8,".concat(src);
  }

  return src;
};
var getHostFromUrl = function getHostFromUrl(url) {
  try {
    return new URL(url).host;
  } catch (e) {
    return url;
  }
};

var _excluded$11 = ["src", "disableSkeleton", "className", "maxDelay"];
var defaultProps$17 = {
  disableSkeleton: false,
  className: '',
  maxDelay: 3000
};

var ImageComponent = function ImageComponent(_ref) {
  var src = _ref.src,
      disableSkeleton = _ref.disableSkeleton,
      className = _ref.className,
      maxDelay = _ref.maxDelay,
      props = _objectWithoutProperties(_ref, _excluded$11);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES,
      getScaleProps = _useScale.getScaleProps;

  var width = getScaleProps(['width', 'w']);
  var height = getScaleProps(['height', 'h']);
  var showAnimation = !disableSkeleton && width && height;
  var theme = useTheme();

  var _useState = React.useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = React.useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      showSkeleton = _useState4[0],
      setShowSkeleton = _useState4[1];

  var imageRef = React.useRef(null);
  var url = React.useMemo(function () {
    return transformDataSource(src);
  }, [src]);

  var imageLoaded = function imageLoaded() {
    if (!showAnimation) return;
    setLoading(false);
  };

  React.useEffect(function () {
    if (!showAnimation) return;
    if (!imageRef.current) return;

    if (imageRef.current.complete) {
      setLoading(false);
      setShowSkeleton(false);
    }
  });
  React.useEffect(function () {
    var timer = setTimeout(function () {
      if (showAnimation) {
        setShowSkeleton(false);
      }

      clearTimeout(timer);
    }, maxDelay);
    return function () {
      return clearTimeout(timer);
    };
  }, [loading]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["4175752462", [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]]]) + " " + (useClasses$1('image', className) || "")
  }, showSkeleton && showAnimation && /*#__PURE__*/React__default["default"].createElement(ImageSkeleton$1, {
    opacity: loading ? 0.5 : 0
  }), /*#__PURE__*/React__default["default"].createElement("img", _extends({
    ref: imageRef,
    onLoad: imageLoaded,
    src: url
  }, props, {
    className: styledJsx_cjs.style.dynamic([["4175752462", [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]]]) + " " + (props && props.className != null && props.className || "")
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4175752462",
    dynamic: [theme.layout.radius, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.width(1, 'auto'), SCALES.height(1, 'auto')]
  }, ".image.__jsx-style-dynamic-selector{position:relative;border-radius:".concat(theme.layout.radius, ";overflow:hidden;max-width:100%;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}img.__jsx-style-dynamic-selector{width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";object-fit:scale-down;display:inline-block;}")));
};

ImageComponent.defaultProps = defaultProps$17;
ImageComponent.displayName = 'GeistImage';
var Image = withScale$1(ImageComponent);
var Image$1 = Image;

var ImageBrowserHttpsIcon = function ImageBrowserHttpsIcon() {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "jsx-4165143638"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M5 10.2H19V21H5V10.2Z",
    className: "jsx-4165143638"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 12C13.933 12 15.5 10.3882 15.5 8.4C15.5 6.41177 13.933 4.8 12 4.8C10.067 4.8 8.5 6.41177 8.5 8.4C8.5 10.3882 10.067 12 12 12ZM12 13.8C14.8995 13.8 17.25 11.3823 17.25 8.4C17.25 5.41766 14.8995 3 12 3C9.10051 3 6.75 5.41766 6.75 8.4C6.75 11.3823 9.10051 13.8 12 13.8Z",
    className: "jsx-4165143638"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4165143638"
  }, "svg.jsx-4165143638{width:1em;height:1em;}"));
};

var MemoImageBrowserHttpsIcon = /*#__PURE__*/React__default["default"].memo(ImageBrowserHttpsIcon);
var ImageBrowserHttpsIcon$1 = MemoImageBrowserHttpsIcon;

var getBrowserColors = function getBrowserColors(invert, palette) {
  return invert ? {
    color: palette.background,
    barBgColor: palette.foreground,
    inputBgColor: palette.accents_8,
    borderColor: palette.accents_7,
    titleColor: palette.accents_2
  } : {
    color: palette.foreground,
    barBgColor: palette.background,
    inputBgColor: palette.accents_1,
    borderColor: palette.border,
    titleColor: palette.accents_5
  };
};

var _excluded$10 = ["url", "title", "children", "showFullLink", "invert", "anchorProps", "className"];
var defaultProps$16 = {
  className: '',
  showFullLink: false,
  anchorProps: {},
  invert: false
};

var getTitle = function getTitle(title, colors) {
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["524099755", [colors.titleColor]]]) + " " + "title"
  }, title, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "524099755",
    dynamic: [colors.titleColor]
  }, ".title.__jsx-style-dynamic-selector{color:".concat(colors.titleColor, ";font-size:0.75em;}")));
};

var getAddressInput = function getAddressInput(url, showFullLink, colors, anchorProps) {
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3718009574", [colors.inputBgColor]]]) + " " + "address-input"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3718009574", [colors.inputBgColor]]]) + " " + "https"
  }, /*#__PURE__*/React__default["default"].createElement(ImageBrowserHttpsIcon$1, null)), /*#__PURE__*/React__default["default"].createElement(Link$1, _extends({
    href: url,
    title: url,
    target: "_blank"
  }, anchorProps), showFullLink ? url : getHostFromUrl(url)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3718009574",
    dynamic: [colors.inputBgColor]
  }, ".address-input.__jsx-style-dynamic-selector{height:1.75em;max-width:60%;min-width:40%;background-color:".concat(colors.inputBgColor, ";color:inherit;border-radius:3px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0 10px;overflow:hidden;position:relative;}.address-input.__jsx-style-dynamic-selector *{font-size:0.75em;color:inherit;}.address-input.__jsx-style-dynamic-selector a{max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;color:inherit;}.https.__jsx-style-dynamic-selector{width:0.75em;height:0.75em;font-size:1em;margin-right:0.31em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin-top:-1px;color:inherit;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}")));
};

var ImageBrowserComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var url = _ref.url,
      title = _ref.title,
      children = _ref.children,
      showFullLink = _ref.showFullLink,
      invert = _ref.invert,
      anchorProps = _ref.anchorProps,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$10);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var colors = React.useMemo(function () {
    return getBrowserColors(invert, theme.palette);
  }, [invert, theme.palette]);
  var input = React.useMemo(function () {
    if (url) return getAddressInput(url, showFullLink, colors, anchorProps);
    if (title) return getTitle(title, colors);
    return null;
  }, [url, showFullLink, title, colors, anchorProps]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: ref
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]]) + " " + (props && props.className != null && props.className || useClasses$1('browser', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("header", {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]])
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]]) + " " + "traffic"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]]) + " " + "close"
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]]) + " " + "mini"
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1856409351", [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]]]) + " " + "full"
  })), input), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1856409351",
    dynamic: [theme.expressiveness.shadowLarge, theme.layout.radius, SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), colors.color, colors.barBgColor, colors.borderColor, theme.layout.gapHalf]
  }, ".browser.__jsx-style-dynamic-selector{background-color:transparent;box-shadow:".concat(theme.expressiveness.shadowLarge, ";max-width:100%;border-radius:").concat(theme.layout.radius, ";overflow:hidden;font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'max-content'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}.browser.__jsx-style-dynamic-selector .image{border-top-left-radius:0;border-top-right-radius:0;}header.__jsx-style-dynamic-selector{height:2.5em;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;position:relative;color:").concat(colors.color, ";background-color:").concat(colors.barBgColor, ";border-bottom:1px solid ").concat(colors.borderColor, ";}.traffic.__jsx-style-dynamic-selector{width:auto;position:absolute;left:").concat(theme.layout.gapHalf, ";top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);bottom:0;height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-size:inherit;}.traffic.__jsx-style-dynamic-selector span.__jsx-style-dynamic-selector{border-radius:50%;width:0.75em;height:0.75em;max-width:20px;max-height:20px;display:inline-block;margin-right:0.5em;}.close.__jsx-style-dynamic-selector{background-color:#ff5f56;}.mini.__jsx-style-dynamic-selector{background-color:#ffbd2e;}.full.__jsx-style-dynamic-selector{background-color:#27c93f;}")));
});
ImageBrowserComponent.defaultProps = defaultProps$16;
ImageBrowserComponent.displayName = 'GeistImageBrowser';
var ImageBrowser = withScale$1(ImageBrowserComponent);
var ImageBrowser$1 = ImageBrowser;

Image$1.Browser = ImageBrowser$1;

var _excluded$$ = ["children", "hoverable", "className", "shadow", "type"];
var defaultProps$15 = {
  type: 'default',
  hoverable: false,
  shadow: false,
  className: ''
};

var CardComponent = function CardComponent(_ref) {
  var children = _ref.children,
      hoverable = _ref.hoverable,
      className = _ref.className,
      shadow = _ref.shadow,
      type = _ref.type,
      props = _objectWithoutProperties(_ref, _excluded$$);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var hoverShadow = React.useMemo(function () {
    if (shadow) return theme.expressiveness.shadowMedium;
    return hoverable ? theme.expressiveness.shadowSmall : 'none';
  }, [hoverable, shadow, theme.expressiveness]);

  var _useMemo = React.useMemo(function () {
    return getStyles$1(type, theme.palette, shadow);
  }, [type, theme.palette, shadow]),
      color = _useMemo.color,
      bgColor = _useMemo.bgColor,
      borderColor = _useMemo.borderColor;

  var _pickChild = pickChild(children, CardFooter$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      withoutFooterChildren = _pickChild2[0],
      footerChildren = _pickChild2[1];

  var _pickChild3 = pickChild(withoutFooterChildren, Image$1),
      _pickChild4 = _slicedToArray(_pickChild3, 2),
      withoutImageChildren = _pickChild4[0],
      imageChildren = _pickChild4[1];

  var hasContent = hasChild(withoutImageChildren, CardContent$1);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["4234389955", [theme.palette.background, theme.layout.radius, shadow ? theme.expressiveness.shadowSmall : 'none', color, bgColor, borderColor, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverShadow]]]) + " " + (props && props.className != null && props.className || useClasses$1('card', className) || "")
  }), imageChildren, hasContent ? withoutImageChildren : /*#__PURE__*/React__default["default"].createElement(CardContent$1, null, withoutImageChildren), footerChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4234389955",
    dynamic: [theme.palette.background, theme.layout.radius, shadow ? theme.expressiveness.shadowSmall : 'none', color, bgColor, borderColor, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), hoverShadow]
  }, ".card.__jsx-style-dynamic-selector{background:".concat(theme.palette.background, ";-webkit-transition:all 0.2s ease;transition:all 0.2s ease;border-radius:").concat(theme.layout.radius, ";box-shadow:").concat(shadow ? theme.expressiveness.shadowSmall : 'none', ";box-sizing:border-box;color:").concat(color, ";background-color:").concat(bgColor, ";border:1px solid ").concat(borderColor, ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.card.__jsx-style-dynamic-selector:hover{box-shadow:").concat(hoverShadow, ";}.card.__jsx-style-dynamic-selector img{width:100%;}.card.__jsx-style-dynamic-selector .image{border-bottom-left-radius:0;border-bottom-right-radius:0;}")));
};

CardComponent.defaultProps = defaultProps$15;
CardComponent.displayName = 'GeistCard';
var Card = withScale$1(CardComponent);
var Card$1 = Card;

Card$1.Footer = CardFooter$1;
Card$1.Actions = CardFooter$1;
Card$1.Content = CardContent$1;
Card$1.Body = CardContent$1;

var defaultContext$a = {
  disabledAll: false,
  inGroup: false,
  values: []
};
var CheckboxContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$a);
var useCheckbox = function useCheckbox() {
  return React__default["default"].useContext(CheckboxContext);
};

var CheckboxIconComponent = function CheckboxIconComponent(_ref) {
  var fill = _ref.fill,
      bg = _ref.bg,
      disabled = _ref.disabled,
      checked = _ref.checked;
  var theme = useTheme();

  var _useMemo = React.useMemo(function () {
    return {
      propsFill: fill,
      propsBg: bg
    };
  }, [theme.palette]),
      propsFill = _useMemo.propsFill,
      propsBg = _useMemo.propsBg;

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, checked ? /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 17 16",
    fill: "none",
    className: styledJsx_cjs.style.dynamic([["996181129", [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M12.1429 0H3.85714C1.7269 0 0 1.79086 0 4V12C0 14.2091 1.7269 16 3.85714 16H12.1429C14.2731 16 16 14.2091 16 12V4C16 1.79086 14.2731 0 12.1429 0Z",
    fill: propsFill,
    className: styledJsx_cjs.style.dynamic([["996181129", [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M16 3L7.72491 11L5 8",
    stroke: propsBg,
    strokeWidth: "1.5",
    className: styledJsx_cjs.style.dynamic([["996181129", [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']]])
  })) : /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 12 12",
    fill: "none",
    className: styledJsx_cjs.style.dynamic([["996181129", [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8.5 0.5H3.5C1.84315 0.5 0.5 1.84315 0.5 3.5V8.5C0.5 10.1569 1.84315 11.5 3.5 11.5H8.5C10.1569 11.5 11.5 10.1569 11.5 8.5V3.5C11.5 1.84315 10.1569 0.5 8.5 0.5Z",
    stroke: theme.palette.accents_5,
    className: styledJsx_cjs.style.dynamic([["996181129", [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "996181129",
    dynamic: [disabled ? 0.4 : 1, disabled ? 'not-allowed' : 'pointer']
  }, "svg.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:calc(0.86 * var(--checkbox-size));height:calc(0.86 * var(--checkbox-size));-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:".concat(disabled ? 0.4 : 1, ";cursor:").concat(disabled ? 'not-allowed' : 'pointer', ";}")));
};

CheckboxIconComponent.displayName = 'GeistCheckboxIcon';
var CheckboxIcon = /*#__PURE__*/React__default["default"].memo(CheckboxIconComponent);
var CheckboxIcon$1 = CheckboxIcon;

var getColors$7 = function getColors(palette, status) {
  var colors = {
    "default": {
      fill: palette.foreground,
      bg: palette.background
    },
    secondary: {
      fill: palette.foreground,
      bg: palette.background
    },
    success: {
      fill: palette.success,
      // fondo
      bg: palette.background
    },
    warning: {
      fill: palette.warning,
      bg: palette.background
    },
    error: {
      fill: palette.error,
      bg: palette.background
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var _excluded$_ = ["checked", "initialChecked", "disabled", "onChange", "className", "children", "type", "value"];
var defaultProps$14 = {
  disabled: false,
  type: 'default',
  initialChecked: false,
  className: '',
  value: ''
};

var CheckboxComponent = function CheckboxComponent(_ref) {
  var checked = _ref.checked,
      initialChecked = _ref.initialChecked,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      className = _ref.className,
      children = _ref.children,
      type = _ref.type,
      value = _ref.value,
      props = _objectWithoutProperties(_ref, _excluded$_);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(initialChecked),
      _useState2 = _slicedToArray(_useState, 2),
      selfChecked = _useState2[0],
      setSelfChecked = _useState2[1];

  var _useCheckbox = useCheckbox(),
      updateState = _useCheckbox.updateState,
      inGroup = _useCheckbox.inGroup,
      disabledAll = _useCheckbox.disabledAll,
      values = _useCheckbox.values;

  var isDisabled = inGroup ? disabledAll || disabled : disabled;
  var classes = useClasses$1('checkbox', className);

  if (inGroup && checked) {
    useWarning$1('Remove props "checked" when [Checkbox] component is in the group.', 'Checkbox');
  }

  if (inGroup) {
    React.useEffect(function () {
      var next = values.includes(value);
      if (next === selfChecked) return;
      setSelfChecked(next);
    }, [values.join(',')]);
  }

  var _useMemo = React.useMemo(function () {
    return getColors$7(theme.palette, type);
  }, [theme.palette, type]),
      fill = _useMemo.fill,
      bg = _useMemo.bg;

  var changeHandle = React.useCallback(function (ev) {
    if (isDisabled) return;
    var selfEvent = {
      target: {
        checked: !selfChecked
      },
      stopPropagation: ev.stopPropagation,
      preventDefault: ev.preventDefault,
      nativeEvent: ev
    };

    if (inGroup && updateState) {
      updateState && updateState(value, !selfChecked);
    }

    setSelfChecked(!selfChecked);
    onChange && onChange(selfEvent);
  }, [updateState, onChange, isDisabled, selfChecked]);
  React.useEffect(function () {
    if (checked === undefined) return;
    setSelfChecked(checked);
  }, [checked]);
  return /*#__PURE__*/React__default["default"].createElement("label", {
    className: styledJsx_cjs.style.dynamic([["4126727675", [SCALES.font(0.875), isDisabled ? 'not-allowed' : 'pointer', isDisabled ? 0.75 : 1, SCALES.width(1, 'auto'), SCALES.height(1, 'var(--checkbox-size)'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? 'not-allowed' : 'pointer']]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement(CheckboxIcon$1, {
    fill: fill,
    bg: bg,
    disabled: isDisabled,
    checked: selfChecked
  }), /*#__PURE__*/React__default["default"].createElement("input", _extends({
    type: "checkbox",
    disabled: isDisabled,
    checked: selfChecked,
    onChange: changeHandle
  }, props, {
    className: styledJsx_cjs.style.dynamic([["4126727675", [SCALES.font(0.875), isDisabled ? 'not-allowed' : 'pointer', isDisabled ? 0.75 : 1, SCALES.width(1, 'auto'), SCALES.height(1, 'var(--checkbox-size)'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? 'not-allowed' : 'pointer']]]) + " " + (props && props.className != null && props.className || "")
  })), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4126727675", [SCALES.font(0.875), isDisabled ? 'not-allowed' : 'pointer', isDisabled ? 0.75 : 1, SCALES.width(1, 'auto'), SCALES.height(1, 'var(--checkbox-size)'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? 'not-allowed' : 'pointer']]]) + " " + "text"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4126727675",
    dynamic: [SCALES.font(0.875), isDisabled ? 'not-allowed' : 'pointer', isDisabled ? 0.75 : 1, SCALES.width(1, 'auto'), SCALES.height(1, 'var(--checkbox-size)'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? 'not-allowed' : 'pointer']
  }, ".checkbox.__jsx-style-dynamic-selector{--checkbox-size:".concat(SCALES.font(0.875), ";display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:").concat(isDisabled ? 'not-allowed' : 'pointer', ";opacity:").concat(isDisabled ? 0.75 : 1, ";line-height:var(--checkbox-size);width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'var(--checkbox-size)'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.text.__jsx-style-dynamic-selector{font-size:var(--checkbox-size);line-height:var(--checkbox-size);padding-left:calc(var(--checkbox-size) * 0.5);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:").concat(isDisabled ? 'not-allowed' : 'pointer', ";}input.__jsx-style-dynamic-selector{opacity:0;outline:none;position:absolute;width:0;height:0;margin:0;padding:0;z-index:-1;font-size:0;background-color:transparent;}")));
};

CheckboxComponent.defaultProps = defaultProps$14;
CheckboxComponent.displayName = 'GeistCheckbox';
var Checkbox = withScale$1(CheckboxComponent);
var Checkbox$1 = Checkbox;

var _excluded$Z = ["disabled", "onChange", "value", "children", "className"];
var defaultProps$13 = {
  disabled: false,
  className: ''
};

var CheckboxGroupComponent = function CheckboxGroupComponent(_ref) {
  var disabled = _ref.disabled,
      onChange = _ref.onChange,
      value = _ref.value,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$Z);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      selfVal = _useState2[0],
      setSelfVal = _useState2[1];

  var classes = useClasses$1('group', className);

  if (!value) {
    value = [];
    useWarning$1('Props "value" is required.', 'Checkbox Group');
  }

  var updateState = function updateState(val, checked) {
    var removed = selfVal.filter(function (v) {
      return v !== val;
    });
    var next = checked ? [].concat(_toConsumableArray(removed), [val]) : removed;
    setSelfVal(next);
    onChange && onChange(next);
  };

  var providerValue = React.useMemo(function () {
    return {
      updateState: updateState,
      disabledAll: disabled,
      inGroup: true,
      values: selfVal
    };
  }, [disabled, selfVal]);
  React.useEffect(function () {
    setSelfVal(value);
  }, [value.join(',')]);
  return /*#__PURE__*/React__default["default"].createElement(CheckboxContext.Provider, {
    value: providerValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1727163828", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.font(1), SCALES.font(1)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1727163828",
    dynamic: [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.font(1), SCALES.font(1)]
  }, ".group.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.group.__jsx-style-dynamic-selector label{margin-right:calc(").concat(SCALES.font(1), " * 2);--checkbox-size:").concat(SCALES.font(1), ";}.group.__jsx-style-dynamic-selector label:last-of-type{margin-right:0;}"))));
};

CheckboxGroupComponent.defaultProps = defaultProps$13;
CheckboxGroupComponent.displayName = 'GeistCheckboxGroup';
var CheckboxGroup = withScale$1(CheckboxGroupComponent);
var CheckboxGroup$1 = CheckboxGroup;

Checkbox$1.Group = CheckboxGroup$1;

var _excluded$Y = ["children", "block", "className", "name", "classic"];
var defaultProps$12 = {
  block: false,
  className: '',
  name: '',
  classic: false
};

var CodeComponent = function CodeComponent(_ref) {
  var children = _ref.children,
      block = _ref.block,
      className = _ref.className,
      name = _ref.name,
      classic = _ref.classic,
      props = _objectWithoutProperties(_ref, _excluded$Y);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var theme = useTheme();

  var _useMemo = React.useMemo(function () {
    if (!classic) return {
      border: theme.palette.accents_1,
      background: addColorAlpha(theme.palette.accents_1, 0.75)
    };
    return {
      border: theme.palette.accents_2,
      background: theme.palette.background
    };
  }, [classic, theme.palette]),
      background = _useMemo.background,
      border = _useMemo.border;

  if (!block) return /*#__PURE__*/React__default["default"].createElement("code", props, children);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + "pre"
  }, name && /*#__PURE__*/React__default["default"].createElement("header", {
    className: styledJsx_cjs.style.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + "name"
  }, name)), /*#__PURE__*/React__default["default"].createElement("pre", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2383620185",
    dynamic: [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]
  }, ".pre.__jsx-style-dynamic-selector{max-width:100%;border:1px solid ".concat(border, ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(1.3), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(1.3), " ").concat(SCALES.ml(0), ";border-radius:").concat(theme.layout.radius, ";background-color:").concat(background, ";}pre.__jsx-style-dynamic-selector{max-width:100%;font-size:inherit;border:none;margin:0;line-height:1.5em;padding:").concat(SCALES.pt(1.1), " ").concat(SCALES.pr(1), " ").concat(SCALES.pb(1.1), " ").concat(SCALES.pl(1), ";}.dark.__jsx-style-dynamic-selector{color:white;background:black;}.dark.__jsx-style-dynamic-selector code.__jsx-style-dynamic-selector{color:white;}header.__jsx-style-dynamic-selector{height:auto;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;border-radius:").concat(theme.layout.radius, ";background-color:transparent;}.name.__jsx-style-dynamic-selector{border:1px solid ").concat(theme.palette.accents_2, ";background-color:").concat(theme.palette.accents_2, ";color:").concat(theme.palette.accents_5, ";height:auto;line-height:1.35em;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:").concat(SCALES.font(0.8125), ";padding:").concat(SCALES.font(0.32), " ").concat(SCALES.font(0.5), " ").concat(SCALES.font(0.32), " ").concat(SCALES.font(0.5), ";width:auto;border-top-left-radius:calc(").concat(theme.layout.radius, " - 1px);border-bottom-right-radius:").concat(theme.layout.radius, ";}")));
};

CodeComponent.defaultProps = defaultProps$12;
CodeComponent.displayName = 'GeistCode';
var Code = withScale$1(CodeComponent);
var Code$1 = Code;

var CollapseIcon = function CollapseIcon(_ref) {
  var active = _ref.active;
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    style: {
      color: 'currentColor'
    },
    className: styledJsx_cjs.style.dynamic([["2249786880", [active ? '-180deg' : '0']]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 9l6 6 6-6",
    className: styledJsx_cjs.style.dynamic([["2249786880", [active ? '-180deg' : '0']]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2249786880",
    dynamic: [active ? '-180deg' : '0']
  }, "svg.__jsx-style-dynamic-selector{-webkit-transition:-webkit-transform 200ms ease;-webkit-transition:transform 200ms ease;transition:transform 200ms ease;-webkit-transform:rotateZ(".concat(active ? '-180deg' : '0', ");-ms-transform:rotateZ(").concat(active ? '-180deg' : '0', ");transform:rotateZ(").concat(active ? '-180deg' : '0', ");width:1.5em;height:1.5em;}")));
};

var MemoCollapseIcon = /*#__PURE__*/React__default["default"].memo(CollapseIcon);
var CollapseIcon$1 = MemoCollapseIcon;

var getRealShape = function getRealShape(el) {
  var defaultShape = {
    width: 0,
    height: 0
  };
  if (!el || typeof window === 'undefined') return defaultShape;
  var rect = el.getBoundingClientRect();

  var _window$getComputedSt = window.getComputedStyle(el),
      width = _window$getComputedSt.width,
      height = _window$getComputedSt.height;

  var getCSSStyleVal = function getCSSStyleVal(str, parentNum) {
    if (!str) return 0;
    var strVal = str.includes('px') ? +str.split('px')[0] : str.includes('%') ? +str.split('%')[0] * parentNum * 0.01 : str;
    return Number.isNaN(+strVal) ? 0 : +strVal;
  };

  return {
    width: getCSSStyleVal("".concat(width), rect.width),
    height: getCSSStyleVal("".concat(height), rect.height)
  };
};

var useRealShape = function useRealShape(ref) {
  var _useState = React.useState({
    width: 0,
    height: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var update = function update() {
    var _getRealShape = getRealShape(ref.current),
        width = _getRealShape.width,
        height = _getRealShape.height;

    setState({
      width: width,
      height: height
    });
  };

  React.useEffect(function () {
    return update();
  }, [ref.current]);
  return [state, update];
};

var useRealShape$1 = useRealShape;

var defaultProps$11 = {
  isExpanded: false,
  delay: 200
};

var Expand = function Expand(_ref) {
  var isExpanded = _ref.isExpanded,
      delay = _ref.delay,
      children = _ref.children;

  var _useState = React.useState(isExpanded ? 'auto' : '0'),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  var _useState3 = React.useState(isExpanded),
      _useState4 = _slicedToArray(_useState3, 2),
      selfExpanded = _useState4[0],
      setSelfExpanded = _useState4[1];

  var _useState5 = React.useState(isExpanded),
      _useState6 = _slicedToArray(_useState5, 2),
      visible = _useState6[0],
      setVisible = _useState6[1];

  var contentRef = React.useRef(null);
  var entryTimer = React.useRef();
  var leaveTimer = React.useRef();
  var resetTimer = React.useRef();

  var _useRealShape = useRealShape$1(contentRef),
      _useRealShape2 = _slicedToArray(_useRealShape, 2),
      state = _useRealShape2[0],
      updateShape = _useRealShape2[1];

  var classes = useClasses$1('container', {
    expanded: selfExpanded
  });
  React.useEffect(function () {
    return setHeight("".concat(state.height, "px"));
  }, [state.height]);
  React.useEffect(function () {
    // show element or reset height.
    // force an update once manually, even if the element does not change.
    // (the height of the element might be "auto")
    if (isExpanded) {
      setVisible(isExpanded);
    } else {
      updateShape();
      setHeight("".concat(state.height, "px"));
    } // show expand animation


    entryTimer.current = window.setTimeout(function () {
      setSelfExpanded(isExpanded);
      clearTimeout(entryTimer.current);
    }, 30); // Reset height after animation

    if (isExpanded) {
      resetTimer.current = window.setTimeout(function () {
        setHeight('auto');
        clearTimeout(resetTimer.current);
      }, delay);
    } else {
      leaveTimer.current = window.setTimeout(function () {
        setVisible(isExpanded);
        clearTimeout(leaveTimer.current);
      }, delay / 2);
    }

    return function () {
      clearTimeout(entryTimer.current);
      clearTimeout(leaveTimer.current);
      clearTimeout(resetTimer.current);
    };
  }, [isExpanded]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1918690829", [visible ? 'visible' : 'hidden', delay, height]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    ref: contentRef,
    className: styledJsx_cjs.style.dynamic([["1918690829", [visible ? 'visible' : 'hidden', delay, height]]]) + " " + "content"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1918690829",
    dynamic: [visible ? 'visible' : 'hidden', delay, height]
  }, ".container.__jsx-style-dynamic-selector{padding:0;margin:0;height:0;overflow:hidden;visibility:".concat(visible ? 'visible' : 'hidden', ";-webkit-transition:height ").concat(delay, "ms ease;transition:height ").concat(delay, "ms ease;}.expanded.__jsx-style-dynamic-selector{height:").concat(height, ";visibility:visible;}")));
};

Expand.defaultProps = defaultProps$11;
Expand.displayName = 'GeistExpand';
var Expand$1 = Expand;

var defaultContext$9 = {
  values: []
};
var CollapseContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$9);
var useCollapseContext = function useCollapseContext() {
  return React__default["default"].useContext(CollapseContext);
};

var _excluded$X = ["children", "title", "subtitle", "initialVisible", "shadow", "className", "index"];
var defaultProps$10 = {
  className: '',
  shadow: false,
  initialVisible: false
};

var CollapseComponent = function CollapseComponent(_ref) {
  var children = _ref.children,
      title = _ref.title,
      subtitle = _ref.subtitle,
      initialVisible = _ref.initialVisible,
      shadow = _ref.shadow,
      className = _ref.className,
      index = _ref.index,
      props = _objectWithoutProperties(_ref, _excluded$X);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useCollapseContext = useCollapseContext(),
      values = _useCollapseContext.values,
      updateValues = _useCollapseContext.updateValues;

  var _useCurrentState = useCurrentState$1(initialVisible),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      visible = _useCurrentState2[0],
      setVisible = _useCurrentState2[1],
      visibleRef = _useCurrentState2[2];

  var classes = useClasses$1('collapse', {
    shadow: shadow
  }, className);

  if (!title) {
    useWarning$1('"title" is required.', 'Collapse');
  }

  React.useEffect(function () {
    if (!values.length) return;
    var isActive = !!values.find(function (item) {
      return item === index;
    });
    setVisible(isActive);
  }, [values.join(',')]);

  var clickHandler = function clickHandler() {
    var next = !visibleRef.current;
    setVisible(next);
    updateValues && updateValues(index, next);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    role: "button",
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]]) + " " + "view"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]]) + " " + "title"
  }, /*#__PURE__*/React__default["default"].createElement("h3", {
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]])
  }, title), " ", /*#__PURE__*/React__default["default"].createElement(CollapseIcon$1, {
    active: visible
  })), subtitle && /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]]) + " " + "subtitle"
  }, subtitle)), /*#__PURE__*/React__default["default"].createElement(Expand$1, {
    isExpanded: visible
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3106940587", [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]]]) + " " + "content"
  }, children)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3106940587",
    dynamic: [theme.palette.border, theme.palette.border, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.expressiveness.shadowSmall, theme.layout.radius, theme.layout.gap, theme.palette.foreground, theme.palette.accents_5, SCALES.pt(1.2), SCALES.pr(0), SCALES.pb(1.2), SCALES.pl(0)]
  }, ".collapse.__jsx-style-dynamic-selector{border-top:1px solid ".concat(theme.palette.border, ";border-bottom:1px solid ").concat(theme.palette.border, ";font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1.2), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(1.2), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.shadow.__jsx-style-dynamic-selector{box-shadow:").concat(theme.expressiveness.shadowSmall, ";border:none;border-radius:").concat(theme.layout.radius, ";padding:").concat(theme.layout.gap, ";}.view.__jsx-style-dynamic-selector{cursor:pointer;outline:none;}.title.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:").concat(theme.palette.foreground, ";}.title.__jsx-style-dynamic-selector h3.__jsx-style-dynamic-selector{margin:0;font-size:1.5em;}.subtitle.__jsx-style-dynamic-selector{color:").concat(theme.palette.accents_5, ";margin:0;}.subtitle.__jsx-style-dynamic-selector>*{margin:0;}.content.__jsx-style-dynamic-selector{font-size:inherit;line-height:1.6em;padding:").concat(SCALES.pt(1.2), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(1.2), " ").concat(SCALES.pl(0), ";}.content.__jsx-style-dynamic-selector>*:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector>*:last-child{margin-bottom:0;}")));
};

CollapseComponent.defaultProps = defaultProps$10;
CollapseComponent.displayName = 'GeistCollapse';
var Collapse = withScale$1(CollapseComponent);
var Collapse$1 = Collapse;

var _excluded$W = ["children", "accordion", "className"];
var defaultProps$$ = {
  accordion: true,
  className: ''
};

var CollapseGroupComponent = function CollapseGroupComponent(_ref) {
  var children = _ref.children,
      accordion = _ref.accordion,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$W);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useCurrentState = useCurrentState$1([]),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      state = _useCurrentState2[0],
      setState = _useCurrentState2[1],
      stateRef = _useCurrentState2[2];

  var classes = useClasses$1('collapse-group', className);

  var updateValues = function updateValues(currentIndex, nextState) {
    var hasChild = stateRef.current.find(function (val) {
      return val === currentIndex;
    });

    if (accordion) {
      if (nextState) return setState([currentIndex]);
      return setState([]);
    }

    if (nextState) {
      // In a few cases, the user will set Collapse Component state manually.
      // If the user incorrectly set the state, Group component should ignore it.

      /* istanbul ignore if */
      if (hasChild) return;
      return setState([].concat(_toConsumableArray(stateRef.current), [currentIndex]));
    }

    setState(stateRef.current.filter(function (item) {
      return item !== currentIndex;
    }));
  };

  var initialValue = React.useMemo(function () {
    return {
      values: state,
      updateValues: updateValues
    };
  }, [state.join(',')]);
  var hasIndexChildren = React.useMemo(function () {
    return setChildrenIndex(children, [Collapse$1]);
  }, [children]);
  return /*#__PURE__*/React__default["default"].createElement(CollapseContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2415399140", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.6), SCALES.pb(0), SCALES.pl(0.6), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), hasIndexChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2415399140",
    dynamic: [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.6), SCALES.pb(0), SCALES.pl(0.6), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".collapse-group.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.6), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.6), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.collapse-group.__jsx-style-dynamic-selector>div + div{border-top:none;}"))));
};

CollapseGroupComponent.defaultProps = defaultProps$$;
CollapseGroupComponent.displayName = 'GeistCollapseGroup';
var CollapseGroup = withScale$1(CollapseGroupComponent);
var CollapseGroup$1 = CollapseGroup;

Collapse$1.Group = CollapseGroup$1;

var _excluded$V = ["title", "content", "className"];
var defaultProps$_ = {
  title: 'Title',
  content: '',
  className: ''
};

var DescriptionComponent = function DescriptionComponent(_ref) {
  var title = _ref.title,
      content = _ref.content,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$V);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('description', className);
  return /*#__PURE__*/React__default["default"].createElement("dl", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2323318745", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, theme.palette.foreground]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("dt", {
    className: styledJsx_cjs.style.dynamic([["2323318745", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, theme.palette.foreground]]])
  }, title), /*#__PURE__*/React__default["default"].createElement("dd", {
    className: styledJsx_cjs.style.dynamic([["2323318745", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, theme.palette.foreground]]])
  }, content), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2323318745",
    dynamic: [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_5, theme.palette.foreground]
  }, ".description.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}dt.__jsx-style-dynamic-selector{font-size:0.75em;line-height:1em;margin-bottom:0.5em;text-transform:uppercase;white-space:nowrap;color:").concat(theme.palette.accents_5, ";font-weight:500;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}dd.__jsx-style-dynamic-selector{font-size:0.875em;margin:0;line-height:1.1em;color:").concat(theme.palette.foreground, ";font-weight:500;}dd.__jsx-style-dynamic-selector p,dt.__jsx-style-dynamic-selector p{margin:0;}")));
};

DescriptionComponent.defaultProps = defaultProps$_;
DescriptionComponent.displayName = 'GeistDescription';
var Description = withScale$1(DescriptionComponent);
var Description$1 = Description;

var _excluded$U = ["children", "caption", "shadow", "className"];
var defaultProps$Z = {
  caption: '',
  shadow: false,
  className: ''
};

var DisplayComponent = function DisplayComponent(_ref) {
  var children = _ref.children,
      caption = _ref.caption,
      shadow = _ref.shadow,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$U);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('display', className);
  var showShadow = React.useMemo(function () {
    return shadow && theme.type !== 'dark';
  }, [theme.type, shadow]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2213400331", [SCALES.font(0.875), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(2.5), SCALES.mr(0, 'auto'), SCALES.mb(2.5), SCALES.ml(0, 'auto'), SCALES.width(1, 'max-content'), showShadow ? theme.expressiveness.shadowLarge : 'none', theme.palette.accents_5, shadow ? '2.5em' : '1.3em']]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2213400331", [SCALES.font(0.875), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(2.5), SCALES.mr(0, 'auto'), SCALES.mb(2.5), SCALES.ml(0, 'auto'), SCALES.width(1, 'max-content'), showShadow ? theme.expressiveness.shadowLarge : 'none', theme.palette.accents_5, shadow ? '2.5em' : '1.3em']]]) + " " + "content"
  }, children), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2213400331", [SCALES.font(0.875), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(2.5), SCALES.mr(0, 'auto'), SCALES.mb(2.5), SCALES.ml(0, 'auto'), SCALES.width(1, 'max-content'), showShadow ? theme.expressiveness.shadowLarge : 'none', theme.palette.accents_5, shadow ? '2.5em' : '1.3em']]]) + " " + "caption"
  }, caption), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2213400331",
    dynamic: [SCALES.font(0.875), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(2.5), SCALES.mr(0, 'auto'), SCALES.mb(2.5), SCALES.ml(0, 'auto'), SCALES.width(1, 'max-content'), showShadow ? theme.expressiveness.shadowLarge : 'none', theme.palette.accents_5, shadow ? '2.5em' : '1.3em']
  }, ".display.__jsx-style-dynamic-selector{display:block;max-width:100%;font-size:".concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(2.5), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(2.5), " ").concat(SCALES.ml(0, 'auto'), ";}.content.__jsx-style-dynamic-selector{display:block;margin:0 auto;border-radius:4px;overflow:hidden;width:").concat(SCALES.width(1, 'max-content'), ";box-shadow:").concat(showShadow ? theme.expressiveness.shadowLarge : 'none', ";max-width:100%;}.content.__jsx-style-dynamic-selector pre{margin:0;-webkit-transition:min-width ease 0.2s;transition:min-width ease 0.2s;}.content.__jsx-style-dynamic-selector img{display:block;}.caption.__jsx-style-dynamic-selector{font-size:inherit;line-height:1.5em;color:").concat(theme.palette.accents_5, ";margin:").concat(shadow ? '2.5em' : '1.3em', " auto 0;text-align:center;max-width:85%;}")));
};

DisplayComponent.defaultProps = defaultProps$Z;
DisplayComponent.displayName = 'GeistDisplay';
var Display = withScale$1(DisplayComponent);
var Display$1 = Display;

var _excluded$T = ["type", "align", "children", "className"];
var defaultProps$Y = {
  align: 'center',
  type: 'default',
  className: ''
};

var getColor$2 = function getColor(type, palette) {
  var colors = {
    "default": palette.border,
    lite: palette.accents_1,
    success: palette.successLight,
    warning: palette.warningLight,
    error: palette.errorLight,
    secondary: palette.secondary,
    dark: palette.foreground
  };
  return colors[type];
};

var DividerComponent = function DividerComponent(_ref) {
  var type = _ref.type,
      align = _ref.align,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$T);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('divider', className);
  var color = React.useMemo(function () {
    return getColor$2(type, theme.palette);
  }, [type, theme.palette]);
  var alignClassName = React.useMemo(function () {
    if (!align || align === 'center') return '';
    if (align === 'left' || align === 'start') return 'start';
    return 'end';
  }, [align]);
  var alignClasses = useClasses$1('text', alignClassName);
  var textColor = type === 'default' ? theme.palette.foreground : color;
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    role: "separator"
  }, props, {
    className: styledJsx_cjs.style.dynamic([["3410666717", [color, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(0.0625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0.5), SCALES.mr(0), SCALES.mb(0.5), SCALES.ml(0), theme.palette.background, textColor]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3410666717", [color, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(0.0625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0.5), SCALES.mr(0), SCALES.mb(0.5), SCALES.ml(0), theme.palette.background, textColor]]]) + " " + (alignClasses || "")
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3410666717",
    dynamic: [color, SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(0.0625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0.5), SCALES.mr(0), SCALES.mb(0.5), SCALES.ml(0), theme.palette.background, textColor]
  }, ".divider.__jsx-style-dynamic-selector{max-width:100%;background-color:".concat(color, ";position:relative;font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(0.0625), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0.5), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0.5), " ").concat(SCALES.ml(0), ";}.text.__jsx-style-dynamic-selector{position:absolute;left:50%;top:50%;min-height:100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);padding:0 0.75em;font-size:inherit;font-weight:bold;text-transform:capitalize;background-color:").concat(theme.palette.background, ";color:").concat(textColor, ";z-index:10;}.text.start.__jsx-style-dynamic-selector{-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);left:7%;}.text.end.__jsx-style-dynamic-selector{-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);left:auto;right:7%;}")));
};

DividerComponent.defaultProps = defaultProps$Y;
DividerComponent.displayName = 'GeistDivider';
var Divider = withScale$1(DividerComponent);
var Divider$1 = Divider;

var _excluded$S = ["type", "children", "className"];
var defaultProps$X = {
  type: 'default',
  className: ''
};

var getColor$1 = function getColor(type, theme) {
  var colors = {
    "default": theme.palette.accents_2,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error
  };
  return colors[type] || colors["default"];
};

var DotComponent = function DotComponent(_ref) {
  var type = _ref.type,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$S);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var color = React.useMemo(function () {
    return getColor$1(type, theme);
  }, [type, theme]);
  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["4077256937", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color]]]) + " " + (props && props.className != null && props.className || useClasses$1('dot', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4077256937", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color]]]) + " " + "icon"
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4077256937", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color]]]) + " " + "label"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4077256937",
    dynamic: [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color]
  }, ".dot.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.icon.__jsx-style-dynamic-selector{width:0.625em;height:0.625em;min-width:calc(0.625 * 12px);min-height:calc(0.625 * 12px);line-height:0.625em;border-radius:50%;background-color:").concat(color, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.label.__jsx-style-dynamic-selector{margin-left:0.5em;font-size:1em;line-height:1em;text-transform:capitalize;}")));
};

DotComponent.defaultProps = defaultProps$X;
DotComponent.displayName = 'GeistDot';
var Dot = withScale$1(DotComponent);
var Dot$1 = Dot;

var defaultOptions$1 = {
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
  var elRef = elementRef || React.useRef(document.body);

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hidden = _useState2[0],
      setHidden = _useState2[1];

  var safeOptions = _objectSpread2(_objectSpread2({}, defaultOptions$1), options || {});

  React.useEffect(function () {
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

/**
 * KeyBinding Codes
 * The content of this file is based on the design of the open source project "microsoft/vscode",
 *   Copyright (c) Microsoft Corporation. All rights reserved.
 *
 * We inherit the KeyMod values from "microsoft/vscode",
 * but use the Browser's KeyboardEvent event implementation, and all values are used only as identification.
 */
exports.KeyCode = void 0;

(function (KeyCode) {
  KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
  KeyCode[KeyCode["Backspace"] = 8] = "Backspace";
  KeyCode[KeyCode["Tab"] = 9] = "Tab";
  KeyCode[KeyCode["Enter"] = 13] = "Enter";
  KeyCode[KeyCode["Shift"] = 16] = "Shift";
  KeyCode[KeyCode["Ctrl"] = 17] = "Ctrl";
  KeyCode[KeyCode["Alt"] = 18] = "Alt";
  KeyCode[KeyCode["PauseBreak"] = 19] = "PauseBreak";
  KeyCode[KeyCode["CapsLock"] = 20] = "CapsLock";
  KeyCode[KeyCode["Escape"] = 27] = "Escape";
  KeyCode[KeyCode["Space"] = 32] = "Space";
  KeyCode[KeyCode["PageUp"] = 33] = "PageUp";
  KeyCode[KeyCode["PageDown"] = 34] = "PageDown";
  KeyCode[KeyCode["End"] = 35] = "End";
  KeyCode[KeyCode["Home"] = 36] = "Home";
  KeyCode[KeyCode["LeftArrow"] = 37] = "LeftArrow";
  KeyCode[KeyCode["UpArrow"] = 38] = "UpArrow";
  KeyCode[KeyCode["RightArrow"] = 39] = "RightArrow";
  KeyCode[KeyCode["DownArrow"] = 40] = "DownArrow";
  KeyCode[KeyCode["Insert"] = 45] = "Insert";
  KeyCode[KeyCode["Delete"] = 46] = "Delete";
  KeyCode[KeyCode["KEY_0"] = 48] = "KEY_0";
  KeyCode[KeyCode["KEY_1"] = 49] = "KEY_1";
  KeyCode[KeyCode["KEY_2"] = 50] = "KEY_2";
  KeyCode[KeyCode["KEY_3"] = 51] = "KEY_3";
  KeyCode[KeyCode["KEY_4"] = 52] = "KEY_4";
  KeyCode[KeyCode["KEY_5"] = 53] = "KEY_5";
  KeyCode[KeyCode["KEY_6"] = 54] = "KEY_6";
  KeyCode[KeyCode["KEY_7"] = 55] = "KEY_7";
  KeyCode[KeyCode["KEY_8"] = 56] = "KEY_8";
  KeyCode[KeyCode["KEY_9"] = 57] = "KEY_9";
  KeyCode[KeyCode["KEY_A"] = 65] = "KEY_A";
  KeyCode[KeyCode["KEY_B"] = 66] = "KEY_B";
  KeyCode[KeyCode["KEY_C"] = 67] = "KEY_C";
  KeyCode[KeyCode["KEY_D"] = 68] = "KEY_D";
  KeyCode[KeyCode["KEY_E"] = 69] = "KEY_E";
  KeyCode[KeyCode["KEY_F"] = 70] = "KEY_F";
  KeyCode[KeyCode["KEY_G"] = 71] = "KEY_G";
  KeyCode[KeyCode["KEY_H"] = 72] = "KEY_H";
  KeyCode[KeyCode["KEY_I"] = 73] = "KEY_I";
  KeyCode[KeyCode["KEY_J"] = 74] = "KEY_J";
  KeyCode[KeyCode["KEY_K"] = 75] = "KEY_K";
  KeyCode[KeyCode["KEY_L"] = 76] = "KEY_L";
  KeyCode[KeyCode["KEY_M"] = 77] = "KEY_M";
  KeyCode[KeyCode["KEY_N"] = 78] = "KEY_N";
  KeyCode[KeyCode["KEY_O"] = 79] = "KEY_O";
  KeyCode[KeyCode["KEY_P"] = 80] = "KEY_P";
  KeyCode[KeyCode["KEY_Q"] = 81] = "KEY_Q";
  KeyCode[KeyCode["KEY_R"] = 82] = "KEY_R";
  KeyCode[KeyCode["KEY_S"] = 83] = "KEY_S";
  KeyCode[KeyCode["KEY_T"] = 84] = "KEY_T";
  KeyCode[KeyCode["KEY_U"] = 85] = "KEY_U";
  KeyCode[KeyCode["KEY_V"] = 86] = "KEY_V";
  KeyCode[KeyCode["KEY_W"] = 87] = "KEY_W";
  KeyCode[KeyCode["KEY_X"] = 88] = "KEY_X";
  KeyCode[KeyCode["KEY_Y"] = 89] = "KEY_Y";
  KeyCode[KeyCode["KEY_Z"] = 90] = "KEY_Z";
  KeyCode[KeyCode["Meta"] = 91] = "Meta";
  KeyCode[KeyCode["F1"] = 112] = "F1";
  KeyCode[KeyCode["F2"] = 113] = "F2";
  KeyCode[KeyCode["F3"] = 114] = "F3";
  KeyCode[KeyCode["F4"] = 115] = "F4";
  KeyCode[KeyCode["F5"] = 116] = "F5";
  KeyCode[KeyCode["F6"] = 117] = "F6";
  KeyCode[KeyCode["F7"] = 118] = "F7";
  KeyCode[KeyCode["F8"] = 119] = "F8";
  KeyCode[KeyCode["F9"] = 120] = "F9";
  KeyCode[KeyCode["F10"] = 121] = "F10";
  KeyCode[KeyCode["F11"] = 122] = "F11";
  KeyCode[KeyCode["F12"] = 123] = "F12";
  KeyCode[KeyCode["NumLock"] = 144] = "NumLock";
  KeyCode[KeyCode["ScrollLock"] = 145] = "ScrollLock";
  KeyCode[KeyCode["Equal"] = 187] = "Equal";
  KeyCode[KeyCode["Minus"] = 189] = "Minus";
  KeyCode[KeyCode["Backquote"] = 192] = "Backquote";
  KeyCode[KeyCode["Backslash"] = 220] = "Backslash";
})(exports.KeyCode || (exports.KeyCode = {}));

exports.KeyMod = void 0;

(function (KeyMod) {
  KeyMod[KeyMod["CtrlCmd"] = 2048] = "CtrlCmd";
  KeyMod[KeyMod["Shift"] = 1024] = "Shift";
  KeyMod[KeyMod["Alt"] = 512] = "Alt";
  KeyMod[KeyMod["WinCtrl"] = 256] = "WinCtrl";
})(exports.KeyMod || (exports.KeyMod = {}));

/* istanbul ignore next */

var getCtrlKeysByPlatform = function getCtrlKeysByPlatform() {
  return {
    CtrlCmd: isMac() ? 'metaKey' : 'ctrlKey',
    WinCtrl: isMac() ? 'ctrlKey' : 'metaKey'
  };
};
var getActiveModMap = function getActiveModMap(bindings) {
  var modBindings = bindings.filter(function (item) {
    return !!exports.KeyMod[item];
  });
  var activeModMap = {
    CtrlCmd: false,
    Shift: false,
    Alt: false,
    WinCtrl: false
  };
  modBindings.forEach(function (code) {
    var modKey = exports.KeyMod[code];
    activeModMap[modKey] = true;
  });
  return activeModMap;
};

var useKeyboard = function useKeyboard(handler, keyBindings) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var bindings = Array.isArray(keyBindings) ? keyBindings : [keyBindings];
  var _options$disableGloba = options.disableGlobalEvent,
      disableGlobalEvent = _options$disableGloba === void 0 ? false : _options$disableGloba,
      _options$capture = options.capture,
      capture = _options$capture === void 0 ? false : _options$capture,
      _options$stopPropagat = options.stopPropagation,
      stopPropagation = _options$stopPropagat === void 0 ? false : _options$stopPropagat,
      _options$preventDefau = options.preventDefault,
      preventDefault = _options$preventDefau === void 0 ? true : _options$preventDefau,
      _options$event = options.event,
      event = _options$event === void 0 ? 'keydown' : _options$event;
  var activeModMap = getActiveModMap(bindings);
  var keyCode = bindings.filter(function (item) {
    return !exports.KeyMod[item];
  });

  var _getCtrlKeysByPlatfor = getCtrlKeysByPlatform(),
      CtrlCmd = _getCtrlKeysByPlatfor.CtrlCmd,
      WinCtrl = _getCtrlKeysByPlatfor.WinCtrl;

  var eventHandler = function eventHandler(event) {
    if (activeModMap.Shift && !event.shiftKey) return;
    if (activeModMap.Alt && !event.altKey) return;
    if (activeModMap.CtrlCmd && !event[CtrlCmd]) return;
    if (activeModMap.WinCtrl && !event[WinCtrl]) return;
    var hitOne = keyCode.find(function (k) {
      return k === event.keyCode;
    });
    if (keyCode && !hitOne) return;

    if (stopPropagation) {
      event.stopPropagation();
    }

    if (preventDefault) {
      event.preventDefault();
    }

    handler && handler(event);
  };

  React.useEffect(function () {
    if (!disableGlobalEvent) {
      document.addEventListener(event, eventHandler);
    }

    return function () {
      document.removeEventListener(event, eventHandler);
    };
  }, [disableGlobalEvent]);

  var elementBindingHandler = function elementBindingHandler(elementEventType) {
    var isCapture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (elementEventType !== event) return function () {};
    if (isCapture !== capture) return function () {};
    return function (e) {
      return eventHandler(e);
    };
  };

  return {
    bindings: {
      onKeyDown: elementBindingHandler('keydown'),
      onKeyDownCapture: elementBindingHandler('keydown', true),
      onKeyPress: elementBindingHandler('keypress'),
      onKeyPressCapture: elementBindingHandler('keypress', true),
      onKeyUp: elementBindingHandler('keyup'),
      onKeyUpCapture: elementBindingHandler('keyup', true)
    }
  };
};

var useKeyboard$1 = useKeyboard;

var _excluded$R = ["children", "onClick", "visible", "width", "onContentClick", "backdropClassName", "positionClassName", "layerClassName"];
var defaultProps$W = {
  onClick: function onClick() {},
  visible: false,
  onContentClick: function onContentClick() {},
  backdropClassName: '',
  positionClassName: '',
  layerClassName: ''
};
var Backdrop = /*#__PURE__*/React__default["default"].memo(function (_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      visible = _ref.visible,
      width = _ref.width,
      onContentClick = _ref.onContentClick,
      backdropClassName = _ref.backdropClassName,
      positionClassName = _ref.positionClassName,
      layerClassName = _ref.layerClassName,
      props = _objectWithoutProperties(_ref, _excluded$R);

  var theme = useTheme();

  var _useCurrentState = useCurrentState$1(false),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      setIsContentMouseDown = _useCurrentState2[1],
      IsContentMouseDownRef = _useCurrentState2[2];

  var clickHandler = function clickHandler(event) {
    if (IsContentMouseDownRef.current) return;
    onClick && onClick(event);
  };

  var mouseUpHandler = function mouseUpHandler() {
    if (!IsContentMouseDownRef.current) return;
    var timer = setTimeout(function () {
      setIsContentMouseDown(false);
      clearTimeout(timer);
    }, 0);
  };

  return /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    name: "backdrop-wrapper",
    visible: visible,
    clearTime: 300
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler,
    onMouseUp: mouseUpHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2021762493", [width, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity]]]) + " " + (props && props.className != null && props.className || useClasses$1('backdrop', backdropClassName) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2021762493", [width, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity]]]) + " " + (useClasses$1('layer', layerClassName) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: onContentClick,
    onMouseDown: function onMouseDown() {
      return setIsContentMouseDown(true);
    },
    className: styledJsx_cjs.style.dynamic([["2021762493", [width, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity]]]) + " " + (useClasses$1('position', positionClassName) || "")
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2021762493",
    dynamic: [width, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity, theme.expressiveness.portalOpacity]
  }, ".backdrop.__jsx-style-dynamic-selector{position:fixed;top:0;left:0;right:0;bottom:0;overflow:auto;z-index:1000;-webkit-overflow-scrolling:touch;box-sizing:border-box;text-align:center;}.position.__jsx-style-dynamic-selector{position:relative;z-index:1001;outline:none;max-width:90%;width:".concat(width, ";margin:20px auto;vertical-align:middle;display:inline-block;}.backdrop.__jsx-style-dynamic-selector:before{display:inline-block;width:0;height:100%;vertical-align:middle;content:'';}.layer.__jsx-style-dynamic-selector{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;opacity:").concat(theme.expressiveness.portalOpacity, ";background-color:black;-webkit-transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1);transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1);pointer-events:none;z-index:1000;}.backdrop-wrapper-enter.__jsx-style-dynamic-selector .layer.__jsx-style-dynamic-selector{opacity:0;}.backdrop-wrapper-enter-active.__jsx-style-dynamic-selector .layer.__jsx-style-dynamic-selector{opacity:").concat(theme.expressiveness.portalOpacity, ";}.backdrop-wrapper-leave.__jsx-style-dynamic-selector .layer.__jsx-style-dynamic-selector{opacity:").concat(theme.expressiveness.portalOpacity, ";}.backdrop-wrapper-leave-active.__jsx-style-dynamic-selector .layer.__jsx-style-dynamic-selector{opacity:0;}"))));
});
Backdrop.defaultProps = defaultProps$W;
Backdrop.displayName = 'GeistBackdrop';
var Backdrop$1 = Backdrop;

tuple('top', 'right', 'bottom', 'left');
var getDrawerTransform = function getDrawerTransform(placement) {
  var translates = {
    top: {
      initial: 'translate3d(0, -100%, 0)',
      hidden: 'translate3d(0, -100%, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    left: {
      initial: 'translate3d(-100%, 0, 0)',
      hidden: 'translate3d(-100%, 0, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    bottom: {
      initial: 'translate3d(0, 100%, 0)',
      hidden: 'translate3d(0, 100%, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    right: {
      initial: 'translate3d(100%, 0, 0)',
      hidden: 'translate3d(100%, 0, 0)',
      visible: 'translate3d(0, 0, 0)'
    }
  };
  return translates[placement];
};

var _excluded$Q = ["className", "children", "visible", "placement"];
var defaultProps$V = {
  className: '',
  visible: false
};

var DrawerWrapper = function DrawerWrapper(_ref) {
  var className = _ref.className,
      children = _ref.children,
      visible = _ref.visible,
      placement = _ref.placement,
      props = _objectWithoutProperties(_ref, _excluded$Q);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var modalContent = React.useRef(null);
  var tabStart = React.useRef(null);
  var tabEnd = React.useRef(null);
  var transform = React.useMemo(function () {
    return getDrawerTransform(placement);
  }, [placement]);
  var classes = useClasses$1('wrapper', placement, className);
  React.useEffect(function () {
    if (!visible) return;
    var activeElement = document.activeElement;
    var isChild = isChildElement(modalContent.current, activeElement);
    if (isChild) return;
    tabStart.current && tabStart.current.focus();
  }, [visible]);

  var onKeyDown = function onKeyDown(event) {
    var isTabDown = event.keyCode === 9;
    if (!visible || !isTabDown) return;
    var activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === tabStart.current) {
        tabEnd.current && tabEnd.current.focus();
      }
    } else {
      if (activeElement === tabEnd.current) {
        tabStart.current && tabStart.current.focus();
      }
    }
  };

  return /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    name: "wrapper",
    visible: visible,
    clearTime: 300
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    role: "dialog",
    tabIndex: -1,
    onKeyDown: onKeyDown,
    ref: modalContent
  }, props, {
    className: styledJsx_cjs.style.dynamic([["3022633861", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, transform.initial, SCALES.font(1), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.width(1, 'auto'), SCALES.height(1, '100%'), transform.hidden, transform.visible, transform.visible, transform.hidden]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    tabIndex: 0,
    "aria-hidden": "true",
    ref: tabStart,
    className: styledJsx_cjs.style.dynamic([["3022633861", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, transform.initial, SCALES.font(1), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.width(1, 'auto'), SCALES.height(1, '100%'), transform.hidden, transform.visible, transform.visible, transform.hidden]]]) + " " + "hide-tab start"
  }), children, /*#__PURE__*/React__default["default"].createElement("div", {
    tabIndex: 0,
    "aria-hidden": "true",
    ref: tabEnd,
    className: styledJsx_cjs.style.dynamic([["3022633861", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, transform.initial, SCALES.font(1), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.width(1, 'auto'), SCALES.height(1, '100%'), transform.hidden, transform.visible, transform.visible, transform.hidden]]]) + " " + "hide-tab end"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3022633861",
    dynamic: [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, transform.initial, SCALES.font(1), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.width(1, 'auto'), SCALES.height(1, '100%'), transform.hidden, transform.visible, transform.visible, transform.hidden]
  }, ".wrapper.__jsx-style-dynamic-selector{position:fixed;top:0;left:0;right:0;bottom:0;max-width:100%;vertical-align:middle;overflow:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;box-sizing:border-box;background-color:".concat(theme.palette.background, ";color:").concat(theme.palette.foreground, ";border-radius:calc(3 * ").concat(theme.layout.radius, ");box-shadow:").concat(theme.expressiveness.shadowLarge, ";opacity:0;outline:none;-webkit-transform:").concat(transform.initial, ";-ms-transform:").concat(transform.initial, ";transform:").concat(transform.initial, ";-webkit-transition:opacity,-webkit-transform 400ms cubic-bezier(0.1,0.6,0.1,1);-webkit-transition:opacity,transform 400ms cubic-bezier(0.1,0.6,0.1,1);transition:opacity,transform 400ms cubic-bezier(0.1,0.6,0.1,1);font-size:").concat(SCALES.font(1), ";--modal-wrapper-padding-left:").concat(SCALES.pl(1.3125), ";--modal-wrapper-padding-right:").concat(SCALES.pr(1.3125), ";padding:").concat(SCALES.pt(1.3125), " var(--modal-wrapper-padding-right) ").concat(SCALES.pb(1.3125), " var(--modal-wrapper-padding-left);margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.top.__jsx-style-dynamic-selector,.bottom.__jsx-style-dynamic-selector{width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";}.left.__jsx-style-dynamic-selector,.right.__jsx-style-dynamic-selector{width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, '100%'), ";}.top.__jsx-style-dynamic-selector{bottom:auto;border-top-left-radius:0;border-top-right-radius:0;}.left.__jsx-style-dynamic-selector{right:auto;border-top-left-radius:0;border-bottom-left-radius:0;}.bottom.__jsx-style-dynamic-selector{top:auto;border-bottom-left-radius:0;border-bottom-right-radius:0;}.right.__jsx-style-dynamic-selector{left:auto;border-top-right-radius:0;border-bottom-right-radius:0;}.wrapper-enter.__jsx-style-dynamic-selector{opacity:0;-webkit-transform:").concat(transform.hidden, ";-ms-transform:").concat(transform.hidden, ";transform:").concat(transform.hidden, ";}.wrapper-enter-active.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:").concat(transform.visible, ";-ms-transform:").concat(transform.visible, ";transform:").concat(transform.visible, ";}.wrapper-leave.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:").concat(transform.visible, ";-ms-transform:").concat(transform.visible, ";transform:").concat(transform.visible, ";-webkit-transition:opacity,-webkit-transform 400ms cubic-bezier(0.1,0.2,0.1,1);-webkit-transition:opacity,transform 400ms cubic-bezier(0.1,0.2,0.1,1);transition:opacity,transform 400ms cubic-bezier(0.1,0.2,0.1,1);}.wrapper-leave-active.__jsx-style-dynamic-selector{opacity:0.4;-webkit-transform:").concat(transform.hidden, ";-ms-transform:").concat(transform.hidden, ";transform:").concat(transform.hidden, ";}.hide-tab.__jsx-style-dynamic-selector{outline:none;overflow:hidden;width:0;height:0;opacity:0;}"))));
};

DrawerWrapper.defaultProps = defaultProps$V;
DrawerWrapper.displayName = 'GeistDrawerWrapper';
var DrawerWrapper$1 = DrawerWrapper;

var _excluded$P = ["visible", "keyboard", "disableBackdropClick", "onClose", "onContentClick", "wrapClassName", "children"];
var defaultProps$U = {
  wrapClassName: '',
  keyboard: true,
  disableBackdropClick: false,
  placement: 'right'
};

var DrawerComponent = function DrawerComponent(_ref) {
  var customVisible = _ref.visible,
      keyboard = _ref.keyboard,
      disableBackdropClick = _ref.disableBackdropClick,
      onClose = _ref.onClose,
      onContentClick = _ref.onContentClick,
      wrapClassName = _ref.wrapClassName,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$P);

  var portal = usePortal$1('drawer');

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var _useBodyScroll = useBodyScroll$1(null, {
    delayReset: 300
  }),
      _useBodyScroll2 = _slicedToArray(_useBodyScroll, 2),
      setBodyHidden = _useBodyScroll2[1];

  var closeDrawer = function closeDrawer() {
    onClose && onClose();
    setVisible(false);
    setBodyHidden(false);
  };

  React.useEffect(function () {
    if (typeof customVisible === 'undefined') return;
    setVisible(customVisible);
    setBodyHidden(customVisible);
  }, [customVisible]);

  var _useKeyboard = useKeyboard$1(function () {
    keyboard && closeDrawer();
  }, exports.KeyCode.Escape, {
    disableGlobalEvent: true
  }),
      bindings = _useKeyboard.bindings;

  var closeFromBackdrop = function closeFromBackdrop() {
    if (disableBackdropClick) return;
    closeDrawer();
  };

  if (!portal) return null;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement(Backdrop$1, _extends({
    onClick: closeFromBackdrop,
    onContentClick: onContentClick,
    visible: visible,
    width: "100%"
  }, bindings), /*#__PURE__*/React__default["default"].createElement(DrawerWrapper$1, _extends({
    visible: visible,
    className: wrapClassName
  }, props), children)), portal);
};

DrawerComponent.defaultProps = defaultProps$U;
DrawerComponent.displayName = 'GeistDrawer';
var Drawer = withScale$1(DrawerComponent);
var Drawer$1 = Drawer;

var _excluded$O = ["className", "children"];
var defaultProps$T = {
  className: ''
};

var ModalTitleComponent = function ModalTitleComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$O);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("h2", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2865939188", [SCALES.font(1.5), theme.palette.foreground, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2865939188",
    dynamic: [SCALES.font(1.5), theme.palette.foreground, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "h2.__jsx-style-dynamic-selector{line-height:1.6;font-weight:normal;text-align:center;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;word-break:break-word;text-transform:capitalize;font-size:".concat(SCALES.font(1.5), ";color:").concat(theme.palette.foreground, ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

ModalTitleComponent.defaultProps = defaultProps$T;
ModalTitleComponent.displayName = 'GeistModalTitle';
var ModalTitle = withScale$1(ModalTitleComponent);
var ModalTitle$1 = ModalTitle;

var _excluded$N = ["className", "children"];
var defaultProps$S = {
  className: ''
};

var ModalSubtitleComponent = function ModalSubtitleComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$N);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("p", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2550488204", [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, '1.5em'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2550488204",
    dynamic: [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, '1.5em'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "p.__jsx-style-dynamic-selector{font-weight:normal;display:inline-block;text-align:center;word-break:break-word;text-transform:uppercase;color:".concat(theme.palette.accents_5, ";font-size:").concat(SCALES.font(0.875), ";line-height:1.5em;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, '1.5em'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

ModalSubtitleComponent.defaultProps = defaultProps$S;
ModalSubtitleComponent.displayName = 'GeistModalSubtitle';
var ModalSubtitle = withScale$1(ModalSubtitleComponent);
var ModalSubtitle$1 = ModalSubtitle;

var _excluded$M = ["className", "children"];
var defaultProps$R = {
  className: ''
};

var ModalContentComponent = function ModalContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$M);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["498745028", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.3125), SCALES.pr(1.3125), SCALES.pb(0.6625), SCALES.pl(1.3125), SCALES.mt(0), SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), SCALES.mb(0), SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')]]]) + " " + (props && props.className != null && props.className || useClasses$1('content', className) || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "498745028",
    dynamic: [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.3125), SCALES.pr(1.3125), SCALES.pb(0.6625), SCALES.pl(1.3125), SCALES.mt(0), SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), SCALES.mb(0), SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')]
  }, ".content.__jsx-style-dynamic-selector{position:relative;text-align:left;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1.3125), " ").concat(SCALES.pr(1.3125), " ").concat(SCALES.pb(0.6625), " ").concat(SCALES.pl(1.3125), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)'), ";}.content.__jsx-style-dynamic-selector>*:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector>*:last-child{margin-bottom:0;}")));
};

ModalContentComponent.defaultProps = defaultProps$R;
ModalContentComponent.displayName = 'GeistModalContent';
var ModalContent = withScale$1(ModalContentComponent);
var ModalContent$1 = ModalContent;

Drawer$1.Title = ModalTitle$1;
Drawer$1.Subtitle = ModalSubtitle$1;
Drawer$1.Content = ModalContent$1;

var _excluded$L = ["className", "children"];
var defaultProps$Q = {
  className: ''
};

var FieldsetTitle = function FieldsetTitle(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$L);

  var classes = useClasses$1('title', className);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: "jsx-4105044205" + " " + (props && props.className != null && props.className || classes || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4105044205"
  }, ".title.jsx-4105044205{line-height:1.5;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;word-break:break-word;font-weight:600;-webkit-letter-spacing:-0.020625em;-moz-letter-spacing:-0.020625em;-ms-letter-spacing:-0.020625em;letter-spacing:-0.020625em;font-size:1.25em;width:auto;}"));
};

FieldsetTitle.defaultProps = defaultProps$Q;
FieldsetTitle.displayName = 'GeistFieldsetTitle';
var FieldsetTitle$1 = FieldsetTitle;

var _excluded$K = ["className", "children"];
var defaultProps$P = {
  className: ''
};

var FieldsetSubtitle = function FieldsetSubtitle(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$K);

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: "jsx-2265168013" + " " + (props && props.className != null && props.className || className || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2265168013"
  }, "div.jsx-2265168013{font-size:0.875em;line-height:1.6;-webkit-letter-spacing:-0.005625em;-moz-letter-spacing:-0.005625em;-ms-letter-spacing:-0.005625em;letter-spacing:-0.005625em;margin:0.75em 0;}"));
};

FieldsetSubtitle.defaultProps = defaultProps$P;
FieldsetSubtitle.displayName = 'GeistFieldsetSubtitle';
var FieldsetSubtitle$1 = FieldsetSubtitle;

var _excluded$J = ["className", "children"];
var defaultProps$O = {
  className: ''
};

var FieldsetFooterComponent = function FieldsetFooterComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$J);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("footer", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["903731644", [theme.palette.accents_1, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.accents_6, theme.layout.gapHalf, theme.layout.gap, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(2.875), SCALES.pt(0.625), SCALES.pr(1.31), SCALES.pb(0.625), SCALES.pl(1.31), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "903731644",
    dynamic: [theme.palette.accents_1, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.accents_6, theme.layout.gapHalf, theme.layout.gap, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(2.875), SCALES.pt(0.625), SCALES.pr(1.31), SCALES.pb(0.625), SCALES.pl(1.31), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "footer.__jsx-style-dynamic-selector{background-color:".concat(theme.palette.accents_1, ";border-top:1px solid ").concat(theme.palette.border, ";border-bottom-left-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden;color:").concat(theme.palette.accents_6, ";padding:").concat(theme.layout.gapHalf, " ").concat(theme.layout.gap, ";box-sizing:border-box;font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(2.875), ";padding:").concat(SCALES.pt(0.625), " ").concat(SCALES.pr(1.31), " ").concat(SCALES.pb(0.625), " ").concat(SCALES.pl(1.31), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

FieldsetFooterComponent.defaultProps = defaultProps$O;
FieldsetFooterComponent.displayName = 'GeistFieldsetFooter';
var FieldsetFooter = withScale$1(FieldsetFooterComponent);
var FieldsetFooter$1 = FieldsetFooter;

var _excluded$I = ["className", "children"];
var defaultProps$N = {
  className: ''
};

var FieldsetContentComponent = function FieldsetContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$I);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('content', className);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2403982542", [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1.3), SCALES.pr(1.3), SCALES.pb(1.3), SCALES.pl(1.3), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2403982542",
    dynamic: [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1.3), SCALES.pr(1.3), SCALES.pb(1.3), SCALES.pl(1.3), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".content.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1.3), " ").concat(SCALES.pr(1.3), " ").concat(SCALES.pb(1.3), " ").concat(SCALES.pl(1.3), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.content.__jsx-style-dynamic-selector > *:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector > *:last-child{margin-bottom:0;}")));
};

FieldsetContentComponent.defaultProps = defaultProps$N;
FieldsetContentComponent.displayName = 'GeistFieldsetContent';
var FieldsetContent = withScale$1(FieldsetContentComponent);
var FieldsetContent$1 = FieldsetContent;

var defaultContext$8 = {
  inGroup: false,
  currentValue: ''
};
var FieldsetContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$8);
var useFieldset = function useFieldset() {
  return React__default["default"].useContext(FieldsetContext);
};

var _excluded$H = ["className", "title", "subtitle", "children", "value", "label"];
var defaultProps$M = {
  value: '',
  label: '',
  disabled: false,
  title: '',
  subtitle: '',
  className: ''
};

var FieldsetComponent = function FieldsetComponent(_ref) {
  var className = _ref.className,
      title = _ref.title,
      subtitle = _ref.subtitle,
      children = _ref.children,
      value = _ref.value,
      label = _ref.label,
      props = _objectWithoutProperties(_ref, _excluded$H);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useFieldset = useFieldset(),
      inGroup = _useFieldset.inGroup,
      currentValue = _useFieldset.currentValue,
      register = _useFieldset.register;

  var _useState = React.useState(inGroup),
      _useState2 = _slicedToArray(_useState, 2),
      hidden = _useState2[0],
      setHidden = _useState2[1];

  var classes = useClasses$1('fieldset', className);

  var _pickChild = pickChild(children, FieldsetFooter$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      withoutFooterChildren = _pickChild2[0],
      FooterChildren = _pickChild2[1];

  var hasTitle = hasChild(withoutFooterChildren, FieldsetTitle$1);
  var hasSubtitle = hasChild(withoutFooterChildren, FieldsetSubtitle$1);
  var hasContent = hasChild(withoutFooterChildren, FieldsetContent$1);

  if (inGroup) {
    if (!label) {
      useWarning$1('Props "label" is required when in a group.', 'Fieldset Group');
    }

    if (!value || value === '') {
      value = label;
    }

    React.useEffect(function () {
      register && register({
        value: value,
        label: label
      });
    }, []);
    React.useEffect(function () {
      // In a few cases, the user will set Fieldset state manually.
      // If the user incorrectly set the state, Group component should ignore it.

      /* istanbul ignore if */
      if (!currentValue || currentValue === '') return;
      setHidden(currentValue !== value);
    }, [currentValue]);
  }

  var content = React.useMemo(function () {
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, withoutFooterChildren, !hasTitle && title && /*#__PURE__*/React__default["default"].createElement(FieldsetTitle$1, null, title), !hasSubtitle && subtitle && /*#__PURE__*/React__default["default"].createElement(FieldsetSubtitle$1, null, subtitle));
  }, [withoutFooterChildren, hasTitle, hasSubtitle, title, subtitle]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3253250630", [theme.palette.background, theme.palette.border, theme.layout.radius, hidden ? 'none' : 'block', SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), hasContent ? content : /*#__PURE__*/React__default["default"].createElement(FieldsetContent$1, null, content), FooterChildren && FooterChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3253250630",
    dynamic: [theme.palette.background, theme.palette.border, theme.layout.radius, hidden ? 'none' : 'block', SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".fieldset.__jsx-style-dynamic-selector{background-color:".concat(theme.palette.background, ";border:1px solid ").concat(theme.palette.border, ";border-radius:").concat(theme.layout.radius, ";overflow:hidden;display:").concat(hidden ? 'none' : 'block', ";font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

FieldsetComponent.defaultProps = defaultProps$M;
FieldsetComponent.displayName = 'GeistFieldset';
var Fieldset = withScale$1(FieldsetComponent);
var Fieldset$1 = Fieldset;

var _excluded$G = ["className", "children", "value", "onChange"];
var defaultProps$L = {
  className: ''
};

var FieldsetGroupComponent = function FieldsetGroupComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      value = _ref.value,
      onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, _excluded$G);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(value),
      _useState2 = _slicedToArray(_useState, 2),
      selfVal = _useState2[0],
      setSelfVal = _useState2[1];

  var _useCurrentState = useCurrentState$1([]),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      items = _useCurrentState2[0],
      setItems = _useCurrentState2[1],
      ref = _useCurrentState2[2];

  var classes = useClasses$1('group', className);

  var register = function register(newItem) {
    var hasItem = ref.current.find(function (item) {
      return item.value === newItem.value;
    });

    if (hasItem) {
      useWarning$1('The "value" of each "Fieldset" must be unique.', 'Fieldset');
    }

    setItems([].concat(_toConsumableArray(ref.current), [newItem]));
  };

  var providerValue = React.useMemo(function () {
    return {
      currentValue: selfVal,
      inGroup: true,
      register: register
    };
  }, [selfVal]);
  var clickHandle = React.useCallback(function (nextValue) {
    setSelfVal(nextValue);
    onChange && onChange(nextValue);
  }, [onChange]);
  return /*#__PURE__*/React__default["default"].createElement(FieldsetContext.Provider, {
    value: providerValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3411776855", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0, 0), SCALES.ml(0), SCALES.font(1), theme.palette.accents_3, theme.palette.accents_1, theme.palette.border, theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.layout.radius]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3411776855", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0, 0), SCALES.ml(0), SCALES.font(1), theme.palette.accents_3, theme.palette.accents_1, theme.palette.border, theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.layout.radius]]]) + " " + "group-tabs"
  }, items.map(function (item) {
    return /*#__PURE__*/React__default["default"].createElement("button", {
      onClick: function onClick() {
        return clickHandle(item.value);
      },
      key: item.value,
      className: styledJsx_cjs.style.dynamic([["3411776855", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0, 0), SCALES.ml(0), SCALES.font(1), theme.palette.accents_3, theme.palette.accents_1, theme.palette.border, theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.layout.radius]]]) + " " + ((selfVal === item.value ? 'active' : '') || "")
    }, item.label);
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3411776855", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0, 0), SCALES.ml(0), SCALES.font(1), theme.palette.accents_3, theme.palette.accents_1, theme.palette.border, theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.layout.radius]]]) + " " + "group-content"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3411776855",
    dynamic: [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0, 0), SCALES.ml(0), SCALES.font(1), theme.palette.accents_3, theme.palette.accents_1, theme.palette.border, theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.layout.radius]
  }, ".group.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0, 0), " ").concat(SCALES.ml(0), ";}.group-tabs.__jsx-style-dynamic-selector{white-space:nowrap;overflow-y:hidden;overflow-x:auto;font-size:").concat(SCALES.font(1), ";margin-bottom:-1px;}.group-content.__jsx-style-dynamic-selector{border-top-left-radius:0;overflow:hidden;}.group-content.__jsx-style-dynamic-selector .fieldset{border-top-left-radius:0;}button.__jsx-style-dynamic-selector{height:2.7em;line-height:2.7em;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:").concat(theme.palette.accents_3, ";background-color:").concat(theme.palette.accents_1, ";font-size:0.875em;white-space:nowrap;text-transform:capitalize;-webkit-appearance:none;cursor:pointer;margin:0;padding:0 1.45em;overflow:hidden;-webkit-transition:all 0.2s ease 0s;transition:all 0.2s ease 0s;border-radius:0;border:1px solid ").concat(theme.palette.border, ";-webkit-text-decoration:none;text-decoration:none;outline:none;}button.active.__jsx-style-dynamic-selector{border-bottom-color:transparent;background-color:").concat(theme.palette.background, ";color:").concat(theme.palette.foreground, ";cursor:default;}button.__jsx-style-dynamic-selector:first-of-type{border-top-left-radius:").concat(theme.layout.radius, ";}button.__jsx-style-dynamic-selector:last-of-type{border-top-right-radius:").concat(theme.layout.radius, ";}button.__jsx-style-dynamic-selector+button.__jsx-style-dynamic-selector{border-left:0;}"))));
};

FieldsetGroupComponent.defaultProps = defaultProps$L;
FieldsetGroupComponent.displayName = 'GeistFieldsetGroup';
var FieldsetGroup = withScale$1(FieldsetGroupComponent);
var FieldsetGroup$1 = FieldsetGroup;

Fieldset$1.Title = FieldsetTitle$1;
Fieldset$1.Subtitle = FieldsetSubtitle$1;
Fieldset$1.Footer = FieldsetFooter$1;
Fieldset$1.Group = FieldsetGroup$1;
Fieldset$1.Content = FieldsetContent$1;
Fieldset$1.Body = FieldsetContent$1;

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

var defaultAllThemesConfig = {
  themes: Themes$1.getPresets()
};
var AllThemesContext = /*#__PURE__*/React__default["default"].createContext(defaultAllThemesConfig);
var useAllThemes$1 = function useAllThemes() {
  return React__default["default"].useContext(AllThemesContext);
};

var ThemeProvider = function ThemeProvider(_ref) {
  var children = _ref.children,
      themeType = _ref.themeType,
      _ref$themes = _ref.themes,
      themes = _ref$themes === void 0 ? [] : _ref$themes;

  var _useState = React.useState({
    themes: Themes$1.getPresets()
  }),
      _useState2 = _slicedToArray(_useState, 2),
      allThemes = _useState2[0],
      setAllThemes = _useState2[1];

  var currentTheme = React.useMemo(function () {
    var theme = allThemes.themes.find(function (item) {
      return item.type === themeType;
    });
    if (theme) return theme;
    return Themes$1.getPresetStaticTheme();
  }, [allThemes, themeType]);
  React.useEffect(function () {
    if (!(themes !== null && themes !== void 0 && themes.length)) return;
    setAllThemes(function (last) {
      var safeThemes = themes.filter(function (item) {
        return Themes$1.isAvailableThemeType(item.type);
      });
      var nextThemes = Themes$1.getPresets().concat(safeThemes);
      return _objectSpread2(_objectSpread2({}, last), {}, {
        themes: nextThemes
      });
    });
  }, [themes]);
  return /*#__PURE__*/React__default["default"].createElement(AllThemesContext.Provider, {
    value: allThemes
  }, /*#__PURE__*/React__default["default"].createElement(ThemeContext.Provider, {
    value: currentTheme
  }, children));
};

var ThemeProvider$1 = ThemeProvider;

var makeToastActions = function makeToastActions(actions, cancelHandle) {
  var handler = function handler(event, userHandler) {
    userHandler && userHandler(event, cancelHandle);
  };

  if (!actions || !actions.length) return null;
  return actions.map(function (action, index) {
    return /*#__PURE__*/React__default["default"].createElement(Button$1, {
      auto: true,
      scale: 1 / 3,
      font: "13px",
      type: action.passive ? 'default' : 'secondary',
      key: "action-".concat(index),
      onClick: function onClick(event) {
        return handler(event, action.handler);
      }
    }, action.name);
  });
};
var getColors$6 = function getColors(palette, type) {
  var colors = {
    "default": palette.background,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error
  };
  var isDefault = !type || type === 'default';
  if (isDefault) return {
    bgColor: colors["default"],
    color: palette.foreground
  };
  /**
   * Prevent main color change in special types.
   * The color will only follow the theme when it is in the default type.
   */

  return {
    bgColor: colors[type],
    color: 'white'
  };
};
tuple('topLeft', 'topRight', 'bottomLeft', 'bottomRight');
var isTopPlacement = function isTopPlacement(placement) {
  return "".concat(placement).toLowerCase().startsWith('top');
};
var isLeftPlacement = function isLeftPlacement(placement) {
  return "".concat(placement).toLowerCase().endsWith('left');
};
var getTranslateByPlacement = function getTranslateByPlacement(placement) {
  var translateInByPlacement = {
    topLeft: 'translate(-60px, -60px)',
    topRight: 'translate(60px, -60px)',
    bottomLeft: 'translate(-60px, 60px)',
    bottomRight: 'translate(60px, 60px)'
  };
  var translateOutByPlacement = {
    topLeft: 'translate(-50px, 15px) scale(0.85)',
    topRight: 'translate(50px, 15px) scale(0.85)',
    bottomLeft: 'translate(-50px, -15px) scale(0.85)',
    bottomRight: 'translate(50px, -15px) scale(0.85)'
  };
  return {
    enter: translateInByPlacement[placement],
    leave: translateOutByPlacement[placement]
  };
};

var ToastItem = /*#__PURE__*/React__default["default"].memo(function (_ref) {
  var toast = _ref.toast,
      layout = _ref.layout;
  var theme = useTheme();

  var _useMemo = React.useMemo(function () {
    return getColors$6(theme.palette, toast.type);
  }, [theme.palette, toast.type]),
      color = _useMemo.color,
      bgColor = _useMemo.bgColor;

  var isReactNode = typeof toast.text !== 'string';
  var padding = layout.padding,
      margin = layout.margin,
      maxHeight = layout.maxHeight,
      maxWidth = layout.maxWidth,
      width = layout.width,
      placement = layout.placement;

  var _useMemo2 = React.useMemo(function () {
    return getTranslateByPlacement(placement);
  }, [placement]),
      enter = _useMemo2.enter,
      leave = _useMemo2.leave;

  return /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    name: "toast",
    visible: toast.visible,
    clearTime: 350
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    key: toast.id,
    className: styledJsx_cjs.style.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "toast"
  }, isReactNode ? toast.text : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "message"
  }, toast.text), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1407001838", [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]]]) + " " + "action"
  }, makeToastActions(toast.actions, toast.cancel))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1407001838",
    dynamic: [width, maxWidth, maxHeight, theme.palette.foreground, bgColor, color, theme.layout.radius, theme.expressiveness.shadowSmall, theme.layout.gapHalf, enter, margin, padding, margin, padding, leave]
  }, ".toast.__jsx-style-dynamic-selector{width:".concat(width, ";max-width:").concat(maxWidth, ";max-height:").concat(maxHeight, ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:").concat(theme.palette.foreground, ";background-color:").concat(bgColor, ";color:").concat(color, ";border:0;border-radius:").concat(theme.layout.radius, ";opacity:1;box-shadow:").concat(theme.expressiveness.shadowSmall, ";-webkit-transition:all 350ms cubic-bezier(0.1,0.2,0.1,1);transition:all 350ms cubic-bezier(0.1,0.2,0.1,1);overflow:hidden;}.message.__jsx-style-dynamic-selector{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;font-size:0.875em;display:-webkit-box;word-break:break-all;padding-right:").concat(theme.layout.gapHalf, ";overflow:hidden;max-height:100%;text-overflow:ellipsis;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.1rem;}.toast-enter.__jsx-style-dynamic-selector{opacity:0;height:0;padding:0;margin:0;-webkit-transform:").concat(enter, ";-ms-transform:").concat(enter, ";transform:").concat(enter, ";}.toast-enter-active.__jsx-style-dynamic-selector{opacity:1;height:auto;margin:").concat(margin, ";padding:").concat(padding, ";-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);}.toast-leave.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);height:auto;margin:").concat(margin, ";padding:").concat(padding, ";}.toast-leave-active.__jsx-style-dynamic-selector{opacity:0;-webkit-transform:").concat(leave, ";-ms-transform:").concat(leave, ";transform:").concat(leave, ";}"))));
});
var ToastItem$1 = ToastItem;

var ToastContainer = function ToastContainer() {
  var theme = useTheme();
  var portal = usePortal$1('toast');

  var _useCurrentState = useCurrentState$1(false),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      setHovering = _useCurrentState2[1],
      hoveringRef = _useCurrentState2[2];

  var _useGeistUIContext = useGeistUIContext(),
      toasts = _useGeistUIContext.toasts,
      updateToasts = _useGeistUIContext.updateToasts,
      toastLayout = _useGeistUIContext.toastLayout,
      lastUpdateToastId = _useGeistUIContext.lastUpdateToastId;

  var memoizedLayout = React.useMemo(function () {
    return toastLayout;
  }, [toastLayout]);
  var toastElements = React.useMemo(function () {
    return toasts.map(function (toast) {
      return /*#__PURE__*/React__default["default"].createElement(ToastItem$1, {
        toast: toast,
        layout: memoizedLayout,
        key: toast._internalIdent
      });
    });
  }, [toasts, memoizedLayout]);
  var classNames = React.useMemo(function () {
    return useClasses$1('toasts', {
      top: isTopPlacement(toastLayout.placement),
      left: isLeftPlacement(toastLayout.placement)
    });
  }, [memoizedLayout]);

  var hoverHandler = function hoverHandler(isHovering) {
    setHovering(isHovering);

    if (isHovering) {
      return updateToasts(function (last) {
        return last.map(function (toast) {
          if (!toast.visible) return toast;
          toast._timeout && window.clearTimeout(toast._timeout);
          return _objectSpread2(_objectSpread2({}, toast), {}, {
            timeout: null
          });
        });
      });
    }

    updateToasts(function (last) {
      return last.map(function (toast, index) {
        if (!toast.visible) return toast;
        toast._timeout && window.clearTimeout(toast._timeout);
        return _objectSpread2(_objectSpread2({}, toast), {}, {
          _timeout: function () {
            var timer = window.setTimeout(function () {
              toast.cancel();
              window.clearTimeout(timer);
            }, toast.delay + index * 100);
            return timer;
          }()
        });
      });
    });
  };

  React.useEffect(function () {
    var index = toasts.findIndex(function (r) {
      return r._internalIdent === lastUpdateToastId;
    });
    var toast = toasts[index];
    if (!toast || toast.visible || !hoveringRef.current) return;
    var hasVisible = toasts.find(function (r, i) {
      return i < index && r.visible;
    });
    if (hasVisible || !hoveringRef.current) return;
    hoverHandler(false);
  }, [toasts, lastUpdateToastId]);
  React.useEffect(function () {
    var timeout = null;
    var timer = window.setInterval(function () {
      if (toasts.length === 0) return;
      timeout = window.setTimeout(function () {
        var allInvisible = !toasts.find(function (r) {
          return r.visible;
        });
        allInvisible && updateToasts(function () {
          return [];
        });
        timeout && clearTimeout(timeout);
      }, 350);
    }, 5000);
    return function () {
      timer && clearInterval(timer);
      timeout && clearTimeout(timeout);
    };
  }, [toasts]);
  if (!portal) return null;
  if (!toasts || toasts.length === 0) return null;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement("div", {
    onMouseEnter: function onMouseEnter() {
      return hoverHandler(true);
    },
    onMouseLeave: function onMouseLeave() {
      return hoverHandler(false);
    },
    className: styledJsx_cjs.style.dynamic([["622610754", [theme.layout.gap, theme.layout.gap, theme.layout.gap, theme.layout.gap]]]) + " " + (classNames || "")
  }, toastElements, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "622610754",
    dynamic: [theme.layout.gap, theme.layout.gap, theme.layout.gap, theme.layout.gap]
  }, ".toasts.__jsx-style-dynamic-selector{position:fixed;width:auto;max-width:100%;right:".concat(theme.layout.gap, ";bottom:").concat(theme.layout.gap, ";z-index:2000;-webkit-transition:all 400ms ease;transition:all 400ms ease;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}.top.__jsx-style-dynamic-selector{bottom:unset;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;top:").concat(theme.layout.gap, ";}.left.__jsx-style-dynamic-selector{right:unset;left:").concat(theme.layout.gap, ";}"))), portal);
};

var ToastContainer$1 = ToastContainer;

var GeistProvider = function GeistProvider(_ref) {
  var themes = _ref.themes,
      themeType = _ref.themeType,
      children = _ref.children;

  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      lastUpdateToastId = _useState2[0],
      setLastUpdateToastId = _useState2[1];

  var _useCurrentState = useCurrentState$1([]),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      toasts = _useCurrentState2[0],
      setToasts = _useCurrentState2[1],
      toastsRef = _useCurrentState2[2];

  var _useCurrentState3 = useCurrentState$1(defaultToastLayout),
      _useCurrentState4 = _slicedToArray(_useCurrentState3, 3),
      toastLayout = _useCurrentState4[0],
      setToastLayout = _useCurrentState4[1],
      toastLayoutRef = _useCurrentState4[2];

  var updateToasts = function updateToasts(fn) {
    var nextToasts = fn(toastsRef.current);
    setToasts(nextToasts);
  };

  var updateToastLayout = function updateToastLayout(fn) {
    var nextLayout = fn(toastLayoutRef.current);
    setToastLayout(nextLayout);
  };

  var updateLastToastId = function updateLastToastId(fn) {
    setLastUpdateToastId(fn());
  };

  var initialValue = React.useMemo(function () {
    return {
      toasts: toasts,
      toastLayout: toastLayout,
      updateToasts: updateToasts,
      lastUpdateToastId: lastUpdateToastId,
      updateToastLayout: updateToastLayout,
      updateLastToastId: updateLastToastId
    };
  }, [toasts, toastLayout, lastUpdateToastId]);
  return /*#__PURE__*/React__default["default"].createElement(GeistUIContent.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement(ThemeProvider$1, {
    themes: themes,
    themeType: themeType
  }, children, /*#__PURE__*/React__default["default"].createElement(ToastContainer$1, null)));
};

var GeistProvider$1 = GeistProvider;

var _excluded$F = ["xs", "sm", "md", "lg", "xl", "justify", "direction", "alignItems", "alignContent", "children", "className"];
var defaultProps$K = {
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
      props = _objectWithoutProperties(_ref, _excluded$F);

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

GridBasicItem.defaultProps = defaultProps$K;
GridBasicItem.displayName = 'GeistGridBasicItem';
var GridBasicItem$1 = GridBasicItem;

var _excluded$E = ["children", "className"];
var defaultProps$J = {
  className: ''
};

var GridComponent = function GridComponent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$E);

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

GridComponent.defaultProps = defaultProps$J;
GridComponent.displayName = 'GeistGrid';
var Grid = withScale$1(GridComponent);
var Grid$1 = Grid;

var _excluded$D = ["gap", "wrap", "children", "className"];
var defaultProps$I = {
  gap: 0,
  wrap: 'wrap',
  className: ''
};

var GridContainerComponent = function GridContainerComponent(_ref) {
  var gap = _ref.gap,
      wrap = _ref.wrap,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$D);

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

GridContainerComponent.defaultProps = defaultProps$I;
GridContainerComponent.displayName = 'GeistGridContainer';
var GridContainer = withScale$1(GridContainerComponent);
var GridContainer$1 = GridContainer;

Grid$1.Container = GridContainer$1;

var _excluded$C = ["command", "shift", "option", "ctrl", "children", "className"];
var defaultProps$H = {
  command: false,
  shift: false,
  option: false,
  ctrl: false,
  className: ''
};

var KeyboardComponent = function KeyboardComponent(_ref) {
  var command = _ref.command,
      shift = _ref.shift,
      option = _ref.option,
      ctrl = _ref.ctrl,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$C);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("kbd", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), command && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, "\u2318"), shift && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, "\u21E7"), option && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, "\u2325"), ctrl && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, "\u2303"), children && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["921453049", [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "921453049",
    dynamic: [theme.palette.accents_5, theme.palette.accents_1, theme.font.sans, theme.layout.radius, theme.palette.accents_2, SCALES.font(0.875), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.34), SCALES.pb(0), SCALES.pl(0.34), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "kbd.__jsx-style-dynamic-selector{line-height:2em;text-align:center;display:inline-block;color:".concat(theme.palette.accents_5, ";background-color:").concat(theme.palette.accents_1, ";font-family:").concat(theme.font.sans, ";border-radius:").concat(theme.layout.radius, ";border:1px solid ").concat(theme.palette.accents_2, ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'fit-content'), ";height:").concat(SCALES.height(1, 'auto'), ";min-width:2em;min-height:2em;padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.34), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.34), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}span.__jsx-style-dynamic-selector{line-height:2em;font-size:1em;text-align:center;}span.__jsx-style-dynamic-selector+span.__jsx-style-dynamic-selector{margin-left:0.3em;}")));
};

KeyboardComponent.defaultProps = defaultProps$H;
KeyboardComponent.displayName = 'GeistKeyboard';
var Keyboard = withScale$1(KeyboardComponent);
var Keyboard$1 = Keyboard;

var _excluded$B = ["className", "children", "visible"];
var defaultProps$G = {
  className: '',
  visible: false
};

var ModalWrapper = function ModalWrapper(_ref) {
  var className = _ref.className,
      children = _ref.children,
      visible = _ref.visible,
      props = _objectWithoutProperties(_ref, _excluded$B);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var modalContent = React.useRef(null);
  var tabStart = React.useRef(null);
  var tabEnd = React.useRef(null);
  React.useEffect(function () {
    if (!visible) return;
    var activeElement = document.activeElement;
    var isChild = isChildElement(modalContent.current, activeElement);
    if (isChild) return;
    tabStart.current && tabStart.current.focus();
  }, [visible]);

  var onKeyDown = function onKeyDown(event) {
    var isTabDown = event.keyCode === 9;
    if (!visible || !isTabDown) return;
    var activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === tabStart.current) {
        tabEnd.current && tabEnd.current.focus();
      }
    } else {
      if (activeElement === tabEnd.current) {
        tabStart.current && tabStart.current.focus();
      }
    }
  };

  return /*#__PURE__*/React__default["default"].createElement(CssTransition$1, {
    name: "wrapper",
    visible: visible,
    clearTime: 300
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({
    role: "dialog",
    tabIndex: -1,
    onKeyDown: onKeyDown,
    ref: modalContent
  }, props, {
    className: styledJsx_cjs.style.dynamic([["4268738715", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, SCALES.font(1), SCALES.height(1, 'auto'), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || useClasses$1('wrapper', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    tabIndex: 0,
    "aria-hidden": "true",
    ref: tabStart,
    className: styledJsx_cjs.style.dynamic([["4268738715", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, SCALES.font(1), SCALES.height(1, 'auto'), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + "hide-tab"
  }), children, /*#__PURE__*/React__default["default"].createElement("div", {
    tabIndex: 0,
    "aria-hidden": "true",
    ref: tabEnd,
    className: styledJsx_cjs.style.dynamic([["4268738715", [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, SCALES.font(1), SCALES.height(1, 'auto'), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + "hide-tab"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4268738715",
    dynamic: [theme.palette.background, theme.palette.foreground, theme.layout.radius, theme.expressiveness.shadowLarge, SCALES.font(1), SCALES.height(1, 'auto'), SCALES.pl(1.3125), SCALES.pr(1.3125), SCALES.pt(1.3125), SCALES.pb(1.3125), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".wrapper.__jsx-style-dynamic-selector{max-width:100%;vertical-align:middle;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;box-sizing:border-box;background-color:".concat(theme.palette.background, ";color:").concat(theme.palette.foreground, ";border-radius:").concat(theme.layout.radius, ";box-shadow:").concat(theme.expressiveness.shadowLarge, ";opacity:0;outline:none;-webkit-transform:translate3d(0px,-30px,0px);-ms-transform:translate3d(0px,-30px,0px);transform:translate3d(0px,-30px,0px);-webkit-transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1) 0s, -webkit-transform 0.35s cubic-bezier(0.4,0,0.2,1) 0s;-webkit-transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1) 0s, transform 0.35s cubic-bezier(0.4,0,0.2,1) 0s;transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1) 0s, transform 0.35s cubic-bezier(0.4,0,0.2,1) 0s;width:100%;font-size:").concat(SCALES.font(1), ";height:").concat(SCALES.height(1, 'auto'), ";--modal-wrapper-padding-left:").concat(SCALES.pl(1.3125), ";--modal-wrapper-padding-right:").concat(SCALES.pr(1.3125), ";padding:").concat(SCALES.pt(1.3125), " var(--modal-wrapper-padding-right) ").concat(SCALES.pb(1.3125), " var(--modal-wrapper-padding-left);margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.wrapper-enter.__jsx-style-dynamic-selector{opacity:0;-webkit-transform:translate3d(0px,-30px,0px);-ms-transform:translate3d(0px,-30px,0px);transform:translate3d(0px,-30px,0px);}.wrapper-enter-active.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:translate3d(0px,0px,0px);-ms-transform:translate3d(0px,0px,0px);transform:translate3d(0px,0px,0px);}.wrapper-leave.__jsx-style-dynamic-selector{opacity:1;-webkit-transform:translate3d(0px,0px,0px);-ms-transform:translate3d(0px,0px,0px);transform:translate3d(0px,0px,0px);}.wrapper-leave-active.__jsx-style-dynamic-selector{opacity:0;-webkit-transform:translate3d(0px,-30px,0px);-ms-transform:translate3d(0px,-30px,0px);transform:translate3d(0px,-30px,0px);}.hide-tab.__jsx-style-dynamic-selector{outline:none;overflow:hidden;width:0;height:0;opacity:0;}"))));
};

ModalWrapper.defaultProps = defaultProps$G;
ModalWrapper.displayName = 'GeistModalWrapper';
var ModalWrapper$1 = ModalWrapper;

var defaultContext$7 = {};
var ModalContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$7);
var useModalContext = function useModalContext() {
  return React__default["default"].useContext(ModalContext);
};

var _excluded$A = ["className", "children", "onClick", "passive", "disabled"];
var defaultProps$F = {
  className: '',
  passive: false,
  disabled: false
};
var ModalActionComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var className = _ref.className,
      children = _ref.children,
      onClick = _ref.onClick,
      passive = _ref.passive,
      disabled = _ref.disabled,
      props = _objectWithoutProperties(_ref, _excluded$A);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var btnRef = React.useRef(null);

  var _useModalContext = useModalContext(),
      _close = _useModalContext.close;

  React.useImperativeHandle(ref, function () {
    return btnRef.current;
  });

  var clickHandler = function clickHandler(event) {
    if (disabled) return;
    var actionEvent = Object.assign({}, event, {
      close: function close() {
        return _close && _close();
      }
    });
    onClick && onClick(actionEvent);
  };

  var color = React.useMemo(function () {
    return passive ? theme.palette.accents_5 : theme.palette.foreground;
  }, [theme.palette, passive, disabled]);
  var bgColor = React.useMemo(function () {
    return disabled ? theme.palette.accents_1 : theme.palette.background;
  }, [theme.palette, disabled]);
  var _styles$className = {
    styles: /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "930885138",
      dynamic: [SCALES.font(0.75), color, theme.palette.background, SCALES.height(3.5625), disabled ? color : theme.palette.foreground, disabled ? bgColor : theme.palette.accents_1]
    }, "button.btn.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(0.75), ";border:none;color:").concat(color, ";background-color:").concat(theme.palette.background, ";display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-flex:1;-ms-flex:1;flex:1;height:").concat(SCALES.height(3.5625), ";border-radius:0;min-width:0;}button.btn.__jsx-style-dynamic-selector:hover,button.btn.__jsx-style-dynamic-selector:focus{color:").concat(disabled ? color : theme.palette.foreground, ";background-color:").concat(disabled ? bgColor : theme.palette.accents_1, ";}")),
    className: styledJsx_cjs.style.dynamic([["930885138", [SCALES.font(0.75), color, theme.palette.background, SCALES.height(3.5625), disabled ? color : theme.palette.foreground, disabled ? bgColor : theme.palette.accents_1]]])
  },
      resolveClassName = _styles$className.className,
      styles = _styles$className.styles;
  var classes = useClasses$1(resolveClassName, className);

  var overrideProps = _objectSpread2(_objectSpread2({}, props), {}, {
    effect: false,
    ref: btnRef
  });

  return /*#__PURE__*/React__default["default"].createElement(Button$1, _extends({
    className: classes,
    onClick: clickHandler,
    disabled: disabled
  }, overrideProps), children, styles);
});
ModalActionComponent.defaultProps = defaultProps$F;
ModalActionComponent.displayName = 'GeistModalAction';
var ModalAction = withScale$1(ModalActionComponent);
var ModalAction$1 = ModalAction;

var _excluded$z = ["children"];

var ModalActionsComponent = function ModalActionsComponent(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$z);

  var theme = useTheme();
  var ref = React.useRef(null);

  var _useState = React.useState('auto'),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  React.useEffect(function () {
    if (!ref.current) return;
    setHeight("".concat(ref.current.clientHeight, "px"));
  }, [ref]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2914444644", [theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, height]]])
  }), /*#__PURE__*/React__default["default"].createElement("footer", _extends({
    ref: ref
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2914444644", [theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, height]]]) + " " + (props && props.className != null && props.className || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2914444644",
    dynamic: [theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, height]
  }, "footer.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;overflow:hidden;width:100%;height:auto;position:absolute;bottom:0;left:0;right:0;border-top:1px solid ".concat(theme.palette.border, ";border-bottom-left-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";}footer.__jsx-style-dynamic-selector>button.btn + button.btn{border-left:1px solid ").concat(theme.palette.border, ";}div.__jsx-style-dynamic-selector{height:").concat(height, ";-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;}")));
};

ModalActionsComponent.displayName = 'GeistModalActions';
var ModalActions = /*#__PURE__*/React__default["default"].memo(ModalActionsComponent);
var ModalActions$1 = ModalActions;

var defaultProps$E = {
  wrapClassName: '',
  keyboard: true,
  disableBackdropClick: false,
  positionClassName: '',
  backdropClassName: '',
  layerClassName: ''
};

var ModalComponent = function ModalComponent(_ref) {
  var customVisible = _ref.visible,
      onClose = _ref.onClose,
      children = _ref.children,
      keyboard = _ref.keyboard,
      wrapClassName = _ref.wrapClassName,
      onContentClick = _ref.onContentClick,
      disableBackdropClick = _ref.disableBackdropClick,
      positionClassName = _ref.positionClassName,
      backdropClassName = _ref.backdropClassName,
      layerClassName = _ref.layerClassName;
  var portal = usePortal$1('modal');

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useBodyScroll = useBodyScroll$1(null, {
    delayReset: 300
  }),
      _useBodyScroll2 = _slicedToArray(_useBodyScroll, 2),
      setBodyHidden = _useBodyScroll2[1];

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var _pickChild = pickChild(children, ModalAction$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      withoutActionsChildren = _pickChild2[0],
      ActionsChildren = _pickChild2[1];

  var hasActions = ActionsChildren && React__default["default"].Children.count(ActionsChildren) > 0;

  var closeModal = function closeModal() {
    onClose && onClose();
    setVisible(false);
    setBodyHidden(false);
  };

  React.useEffect(function () {
    if (typeof customVisible === 'undefined') return;
    setVisible(customVisible);
    setBodyHidden(customVisible);
  }, [customVisible]);

  var _useKeyboard = useKeyboard$1(function () {
    keyboard && closeModal();
  }, exports.KeyCode.Escape, {
    disableGlobalEvent: true
  }),
      bindings = _useKeyboard.bindings;

  var closeFromBackdrop = function closeFromBackdrop() {
    if (disableBackdropClick) return;
    closeModal();
  };

  var modalConfig = React.useMemo(function () {
    return {
      close: closeModal
    };
  }, []);
  if (!portal) return null;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement(ModalContext.Provider, {
    value: modalConfig
  }, /*#__PURE__*/React__default["default"].createElement(Backdrop$1, _extends({
    onClick: closeFromBackdrop,
    onContentClick: onContentClick,
    visible: visible,
    width: SCALES.width(26),
    positionClassName: positionClassName,
    backdropClassName: backdropClassName,
    layerClassName: layerClassName
  }, bindings), /*#__PURE__*/React__default["default"].createElement(ModalWrapper$1, {
    visible: visible,
    className: wrapClassName
  }, withoutActionsChildren, hasActions && /*#__PURE__*/React__default["default"].createElement(ModalActions$1, null, ActionsChildren)))), portal);
};

ModalComponent.defaultProps = defaultProps$E;
ModalComponent.displayName = 'GeistModal';
var Modal = withScale$1(ModalComponent);
var Modal$1 = Modal;

Modal$1.Title = ModalTitle$1;
Modal$1.Subtitle = ModalSubtitle$1;
Modal$1.Content = ModalContent$1;
Modal$1.Action = ModalAction$1;

var _excluded$y = ["children", "type", "label", "filled", "className"];
var defaultProps$D = {
  type: 'default',
  label: 'note',
  filled: false,
  className: ''
};

var getStatusColor = function getStatusColor(type, filled, theme) {
  var colors = {
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error
  };
  var statusColor = colors[type];
  if (!filled) return {
    color: statusColor || theme.palette.foreground,
    borderColor: statusColor || theme.palette.border,
    bgColor: theme.palette.background
  };
  var filledColor = statusColor ? 'white' : theme.palette.background;
  return {
    color: filledColor,
    borderColor: statusColor || theme.palette.foreground,
    bgColor: statusColor || theme.palette.foreground
  };
};

var NoteComponent = function NoteComponent(_ref) {
  var children = _ref.children,
      type = _ref.type,
      label = _ref.label,
      filled = _ref.filled,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$y);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useMemo = React.useMemo(function () {
    return getStatusColor(type, filled, theme);
  }, [type, filled, theme]),
      color = _useMemo.color,
      borderColor = _useMemo.borderColor,
      bgColor = _useMemo.bgColor;

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1082065680", [borderColor, color, bgColor, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(1.32), SCALES.pb(0.667), SCALES.pl(1.32), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || useClasses$1('note', className) || "")
  }), label && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1082065680", [borderColor, color, bgColor, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(1.32), SCALES.pb(0.667), SCALES.pl(1.32), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + "label"
  }, /*#__PURE__*/React__default["default"].createElement("b", {
    className: styledJsx_cjs.style.dynamic([["1082065680", [borderColor, color, bgColor, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(1.32), SCALES.pb(0.667), SCALES.pl(1.32), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]])
  }, label, ":")), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1082065680",
    dynamic: [borderColor, color, bgColor, theme.layout.radius, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(1.32), SCALES.pb(0.667), SCALES.pl(1.32), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".note.__jsx-style-dynamic-selector{line-height:1.8;border:1px solid ".concat(borderColor, ";color:").concat(color, ";background-color:").concat(bgColor, ";border-radius:").concat(theme.layout.radius, ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.667), " ").concat(SCALES.pr(1.32), " ").concat(SCALES.pb(0.667), " ").concat(SCALES.pl(1.32), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.note.__jsx-style-dynamic-selector p{margin:0;}.label.__jsx-style-dynamic-selector{text-transform:uppercase;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;padding-right:0.38em;}")));
};
NoteComponent.defaultProps = defaultProps$D;
NoteComponent.displayName = 'GeistNote';
var Note = withScale$1(NoteComponent);
var Note$1 = Note;

var _excluded$x = ["className", "children"];
var defaultProps$C = {
  className: ''
};

var PageContentComponent = function PageContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$x);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("main", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3887979816", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(3.125), SCALES.pr(0), SCALES.pb(3.125), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3887979816",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, '100%'), SCALES.pt(3.125), SCALES.pr(0), SCALES.pb(3.125), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "main.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, '100%'), ";padding:").concat(SCALES.pt(3.125), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(3.125), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

PageContentComponent.defaultProps = defaultProps$C;
PageContentComponent.displayName = 'GeistPageContent';
var PageContent = withScale$1(PageContentComponent);
var PageContent$1 = PageContent;

var _excluded$w = ["children", "render", "dotBackdrop", "className", "dotSize", "dotSpace"];
tuple('default', 'effect', 'effect-seo');
var defaultProps$B = {
  render: 'default',
  dotBackdrop: false,
  dotSize: '1px',
  dotSpace: 1
};

var DotStyles = function DotStyles(_ref) {
  var dotSpace = _ref.dotSpace,
      dotSize = _ref.dotSize;
  var background = React.useMemo(function () {
    return {
      position: "calc(".concat(dotSpace, " * 25px)"),
      size: "calc(".concat(dotSpace, " * 50px)")
    };
  }, [dotSpace]);
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["934717826", [dotSize, dotSize, background.position, background.position, background.size, background.size]]])
  }, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "934717826",
    dynamic: [dotSize, dotSize, background.position, background.position, background.size, background.size]
  }, "body{background-image:radial-gradient(#e3e3e3 ".concat(dotSize, ",transparent 0), radial-gradient(#e3e3e3 ").concat(dotSize, ",transparent 0);background-position:0 0,").concat(background.position, " ").concat(background.position, ";background-attachment:fixed;background-size:").concat(background.size, " ").concat(background.size, ";}")));
};

var PageComponent = function PageComponent(_ref2) {
  var children = _ref2.children,
      render = _ref2.render,
      dotBackdrop = _ref2.dotBackdrop,
      className = _ref2.className,
      dotSize = _ref2.dotSize,
      dotSpace = _ref2.dotSpace,
      props = _objectWithoutProperties(_ref2, _excluded$w);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var showDot = React.useMemo(function () {
    if (theme.type === 'dark') return false;
    return dotBackdrop;
  }, [dotBackdrop, theme.type]);

  var _useState = React.useState(render !== 'default'),
      _useState2 = _slicedToArray(_useState, 2),
      preventRender = _useState2[0],
      setPreventRender = _useState2[1];

  React.useEffect(function () {
    setPreventRender(false);
  }, []);

  if (preventRender) {
    var renderSEO = render === 'effect-seo';
    if (!renderSEO) return null;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      "aria-hidden": "true",
      className: "jsx-3942095687" + " " + "hidden"
    }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "3942095687"
    }, ".hidden.jsx-3942095687{opacity:0;display:none;}"));
  }

  var hasContent = hasChild(children, PageContent$1);
  return /*#__PURE__*/React__default["default"].createElement("section", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1515698274", [SCALES.font(1), SCALES.width(1, 'calc(100% - 100pt)'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(1.34), SCALES.pb(0), SCALES.pl(1.34), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto')]]]) + " " + (props && props.className != null && props.className || className || "")
  }), hasContent ? children : /*#__PURE__*/React__default["default"].createElement(PageContent$1, null, children), showDot && /*#__PURE__*/React__default["default"].createElement(DotStyles, {
    dotSize: dotSize,
    dotSpace: dotSpace
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1515698274",
    dynamic: [SCALES.font(1), SCALES.width(1, 'calc(100% - 100pt)'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(1.34), SCALES.pb(0), SCALES.pl(1.34), SCALES.mt(0), SCALES.mr(0, 'auto'), SCALES.mb(0), SCALES.ml(0, 'auto')]
  }, "section.__jsx-style-dynamic-selector{max-width:100vw;min-height:100vh;box-sizing:border-box;position:relative;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'calc(100% - 100pt)'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(1.34), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(1.34), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'auto'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'auto'), ";}")));
};

PageComponent.defaultProps = defaultProps$B;
PageComponent.displayName = 'GeistPage';
var Page = withScale$1(PageComponent);
var Page$1 = Page;

var _excluded$v = ["children", "center", "className"];
var defaultProps$A = {
  center: false,
  className: ''
};

var PageHeaderComponent = function PageHeaderComponent(_ref) {
  var children = _ref.children,
      center = _ref.center,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$v);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1({
    center: center
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("header", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3053482948", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3053482948",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "header.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.center.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}")));
};

PageHeaderComponent.defaultProps = defaultProps$A;
PageHeaderComponent.displayName = 'GeistPageHeader';
var PageHeader = withScale$1(PageHeaderComponent);
var PageHeader$1 = PageHeader;

var _excluded$u = ["children"];
var defaultProps$z = {
  className: ''
};

var PageFooterComponent = function PageFooterComponent(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$u);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("footer", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3447440073", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3447440073",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "footer.__jsx-style-dynamic-selector{position:absolute;bottom:0;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

PageFooterComponent.defaultProps = defaultProps$z;
PageFooterComponent.displayName = 'GeistPageFooter';
var PageFooter = withScale$1(PageFooterComponent);
var PageFooter$1 = PageFooter;

Page$1.Header = PageHeader$1;
Page$1.Content = PageContent$1;
Page$1.Body = PageContent$1;
Page$1.Footer = PageFooter$1;

var _excluded$t = ["active", "children", "disabled", "onClick"];

var PaginationItem = function PaginationItem(_ref) {
  var active = _ref.active,
      children = _ref.children,
      disabled = _ref.disabled,
      onClick = _ref.onClick,
      props = _objectWithoutProperties(_ref, _excluded$t);

  var theme = useTheme();

  var _useMemo = React.useMemo(function () {
    return [addColorAlpha(theme.palette.success, 0.1), addColorAlpha(theme.palette.success, 0.8)];
  }, [theme.palette.success]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      hover = _useMemo2[0],
      activeHover = _useMemo2[1];

  var classes = useClasses$1({
    active: active,
    disabled: disabled
  });

  var clickHandler = function clickHandler(event) {
    if (disabled) return;
    onClick && onClick(event);
  };

  return /*#__PURE__*/React__default["default"].createElement("li", {
    className: styledJsx_cjs.style.dynamic([["1657796974", [theme.palette.success, theme.layout.radius, theme.palette.background, hover, theme.palette.success, theme.palette.background, theme.expressiveness.shadowSmall, activeHover, theme.expressiveness.shadowMedium, theme.palette.accents_4, theme.palette.accents_2]]])
  }, /*#__PURE__*/React__default["default"].createElement("button", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1657796974", [theme.palette.success, theme.layout.radius, theme.palette.background, hover, theme.palette.success, theme.palette.background, theme.expressiveness.shadowSmall, activeHover, theme.expressiveness.shadowMedium, theme.palette.accents_4, theme.palette.accents_2]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1657796974",
    dynamic: [theme.palette.success, theme.layout.radius, theme.palette.background, hover, theme.palette.success, theme.palette.background, theme.expressiveness.shadowSmall, activeHover, theme.expressiveness.shadowMedium, theme.palette.accents_4, theme.palette.accents_2]
  }, "li.__jsx-style-dynamic-selector{margin-right:0.428em;display:inline-block;}button.__jsx-style-dynamic-selector{border:none;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;box-sizing:border-box;text-transform:capitalize;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;text-align:center;vertical-align:middle;box-shadow:none;outline:none;height:var(--pagination-size);min-width:var(--pagination-size);font-size:inherit;cursor:pointer;color:".concat(theme.palette.success, ";border-radius:").concat(theme.layout.radius, ";background-color:").concat(theme.palette.background, ";-webkit-transition:all linear 200ms 0ms;transition:all linear 200ms 0ms;}button.__jsx-style-dynamic-selector:hover{background-color:").concat(hover, ";}.active.__jsx-style-dynamic-selector{font-weight:bold;background-color:").concat(theme.palette.success, ";color:").concat(theme.palette.background, ";box-shadow:").concat(theme.expressiveness.shadowSmall, ";}.active.__jsx-style-dynamic-selector:hover{background-color:").concat(activeHover, ";box-shadow:").concat(theme.expressiveness.shadowMedium, ";}.disabled.__jsx-style-dynamic-selector{color:").concat(theme.palette.accents_4, ";cursor:not-allowed;}.disabled.__jsx-style-dynamic-selector:hover{background-color:").concat(theme.palette.accents_2, ";}button.__jsx-style-dynamic-selector svg{width:1.3em;height:1.3em;}")));
};

PaginationItem.displayName = 'GeistPaginationItem';
var PaginationItem$1 = PaginationItem;

tuple('prev', 'next', 'click');
var defaultContext$6 = {};
var PaginationContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$6);
var usePaginationContext = function usePaginationContext() {
  return React__default["default"].useContext(PaginationContext);
};

var _excluded$s = ["children"];

var PaginationPrevious = function PaginationPrevious(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$s);

  var _usePaginationContext = usePaginationContext(),
      update = _usePaginationContext.update,
      isFirst = _usePaginationContext.isFirst;

  return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, _extends({
    onClick: function onClick() {
      return update && update('prev');
    },
    disabled: isFirst
  }, props), children);
};

PaginationPrevious.displayName = 'GeistPaginationPrevious';
var PaginationPrevious$1 = PaginationPrevious;

var _excluded$r = ["children"];

var PaginationNext = function PaginationNext(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$r);

  var _usePaginationContext = usePaginationContext(),
      update = _usePaginationContext.update,
      isLast = _usePaginationContext.isLast;

  return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, _extends({
    onClick: function onClick() {
      return update && update('next');
    },
    disabled: isLast
  }, props), children);
};

PaginationNext.displayName = 'GeistPaginationNext';
var PaginationNext$1 = PaginationNext;

var PaginationEllipsis = function PaginationEllipsis(_ref) {
  var isBefore = _ref.isBefore,
      _onClick = _ref.onClick;

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showMore = _useState2[0],
      setShowMore = _useState2[1];

  return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, {
    onClick: function onClick(e) {
      return _onClick && _onClick(e);
    },
    onMouseEnter: function onMouseEnter() {
      return setShowMore(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setShowMore(false);
    }
  }, showMore ? /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]]) + " " + "more"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M13 17l5-5-5-5",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M6 17l5-5-5-5",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  })) : /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  }, /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1",
    fill: "currentColor",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "19",
    cy: "12",
    r: "1",
    fill: "currentColor",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  }), /*#__PURE__*/React__default["default"].createElement("circle", {
    cx: "5",
    cy: "12",
    r: "1",
    fill: "currentColor",
    className: styledJsx_cjs.style.dynamic([["2928474255", [isBefore ? '180deg' : '0deg']]])
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2928474255",
    dynamic: [isBefore ? '180deg' : '0deg']
  }, "svg.__jsx-style-dynamic-selector{color:currentColor;stroke:currentColor;width:1em;height:1em;}.more.__jsx-style-dynamic-selector{-webkit-transform:rotate(".concat(isBefore ? '180deg' : '0deg', ");-ms-transform:rotate(").concat(isBefore ? '180deg' : '0deg', ");transform:rotate(").concat(isBefore ? '180deg' : '0deg', ");}")));
};

PaginationEllipsis.displayName = 'GeistPaginationEllipsis';
var PaginationEllipsis$1 = PaginationEllipsis;

var PaginationPages = function PaginationPages(_ref) {
  var limit = _ref.limit,
      count = _ref.count,
      current = _ref.current,
      setPage = _ref.setPage;
  var showPages = React.useMemo(function () {
    var oddLimit = limit % 2 === 0 ? limit - 1 : limit;
    return oddLimit - 2;
  }, [limit]);
  var middleNumber = (showPages + 1) / 2;

  var _useMemo = React.useMemo(function () {
    var showEllipsis = count > limit;
    return [showEllipsis && current > middleNumber + 1, showEllipsis && current < count - middleNumber];
  }, [current, showPages, middleNumber, count, limit]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      showBeforeEllipsis = _useMemo2[0],
      showAfterEllipsis = _useMemo2[1];

  var pagesArray = React.useMemo(function () {
    return _toConsumableArray(new Array(showPages));
  }, [showPages]);
  var renderItem = React.useCallback(function (value, active) {
    return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, {
      key: "pagination-item-".concat(value),
      active: value === active,
      onClick: function onClick() {
        return setPage(value);
      }
    }, value);
  }, []);
  var startPages = pagesArray.map(function (_, index) {
    var value = index + 2;
    return renderItem(value, current);
  });
  var middlePages = pagesArray.map(function (_, index) {
    var middleIndexNumber = middleNumber - (index + 1);
    var value = current - middleIndexNumber;
    return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, {
      key: "pagination-middle-".concat(index),
      active: index + 1 === middleNumber,
      onClick: function onClick() {
        return setPage(value);
      }
    }, value);
  });
  var endPages = pagesArray.map(function (_, index) {
    var value = count - (showPages - index);
    return renderItem(value, current);
  });

  if (count <= limit) {
    /* eslint-disable react/jsx-no-useless-fragment */
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, _toConsumableArray(new Array(count)).map(function (_, index) {
      var value = index + 1;
      return /*#__PURE__*/React__default["default"].createElement(PaginationItem$1, {
        key: "pagination-item-".concat(value),
        active: value === current,
        onClick: function onClick() {
          return setPage(value);
        }
      }, value);
    }));
    /* eslint-enable */
  }

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, renderItem(1, current), showBeforeEllipsis && /*#__PURE__*/React__default["default"].createElement(PaginationEllipsis$1, {
    key: "pagination-ellipsis-before",
    isBefore: true,
    onClick: function onClick() {
      return setPage(function (last) {
        return last - 5 >= 1 ? last - 5 : 1;
      });
    }
  }), showBeforeEllipsis && showAfterEllipsis ? middlePages : showBeforeEllipsis ? endPages : startPages, showAfterEllipsis && /*#__PURE__*/React__default["default"].createElement(PaginationEllipsis$1, {
    key: "pagination-ellipsis-after",
    onClick: function onClick() {
      return setPage(function (last) {
        return last + 5 <= count ? last + 5 : count;
      });
    }
  }), renderItem(count, current));
};

PaginationPages.displayName = 'GeistPaginationPages';
var PaginationPages$1 = PaginationPages;

var _excluded$q = ["page", "initialPage", "count", "limit", "children", "onChange", "className"];
var defaultProps$y = {
  initialPage: 1,
  count: 1,
  limit: 7,
  className: ''
};

var PaginationComponent = function PaginationComponent(_ref) {
  var customPage = _ref.page,
      initialPage = _ref.initialPage,
      count = _ref.count,
      limit = _ref.limit,
      children = _ref.children,
      onChange = _ref.onChange,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$q);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useCurrentState = useCurrentState$1(initialPage),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      page = _useCurrentState2[0],
      setPage = _useCurrentState2[1],
      pageRef = _useCurrentState2[2];

  var _pickChild = pickChild(children, PaginationPrevious$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      prevChildren = _pickChild2[1];

  var _pickChild3 = pickChild(children, PaginationNext$1),
      _pickChild4 = _slicedToArray(_pickChild3, 2),
      nextChildren = _pickChild4[1];

  var _useMemo = React.useMemo(function () {
    var hasChildren = function hasChildren(c) {
      return React__default["default"].Children.count(c) > 0;
    };

    var prevDefault = /*#__PURE__*/React__default["default"].createElement(PaginationPrevious$1, null, "prev");
    var nextDefault = /*#__PURE__*/React__default["default"].createElement(PaginationNext$1, null, "next");
    return [hasChildren(prevChildren) ? prevChildren : prevDefault, hasChildren(nextChildren) ? nextChildren : nextDefault];
  }, [prevChildren, nextChildren]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      prevItem = _useMemo2[0],
      nextItem = _useMemo2[1];

  var update = function update(type) {
    if (type === 'prev' && pageRef.current > 1) {
      setPage(function (last) {
        return last - 1;
      });
    }

    if (type === 'next' && pageRef.current < count) {
      setPage(function (last) {
        return last + 1;
      });
    }
  };

  var values = React.useMemo(function () {
    return {
      isFirst: page <= 1,
      isLast: page >= count,
      update: update
    };
  }, [page, count]);
  React.useEffect(function () {
    onChange && onChange(page);
  }, [page]);
  React.useEffect(function () {
    if (customPage !== undefined) {
      setPage(customPage);
    }
  }, [customPage]);
  return /*#__PURE__*/React__default["default"].createElement(PaginationContext.Provider, {
    value: values
  }, /*#__PURE__*/React__default["default"].createElement("nav", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3826701357", [SCALES.font(2), SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), prevItem, /*#__PURE__*/React__default["default"].createElement(PaginationPages$1, {
    count: count,
    current: page,
    limit: limit,
    setPage: setPage
  }), nextItem), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3826701357",
    dynamic: [SCALES.font(2), SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "nav.__jsx-style-dynamic-selector{font-variant:tabular-nums;font-feature-settings:'tnum';--pagination-size:".concat(SCALES.font(2), ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}nav.__jsx-style-dynamic-selector button:last-of-type{margin-right:0;}")));
};

PaginationComponent.defaultProps = defaultProps$y;
PaginationComponent.displayName = 'GeistPagination';
var Pagination = withScale$1(PaginationComponent);
var Pagination$1 = Pagination;

Pagination$1.Previous = PaginationPrevious$1;
Pagination$1.Next = PaginationNext$1;

var getColors$5 = function getColors(type, palette) {
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
    return getColors$5(type, theme.palette);
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

var _excluded$p = ["children", "initialVisible", "text", "offset", "placement", "portalClassName", "enterDelay", "leaveDelay", "trigger", "type", "className", "onVisibleChange", "hideArrow", "visible"];
var defaultProps$x = {
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
      props = _objectWithoutProperties(_ref, _excluded$p);

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

TooltipComponent.defaultProps = defaultProps$x;
TooltipComponent.displayName = 'GeistTooltip';
var Tooltip = withScale$1(TooltipComponent);
var Tooltip$1 = Tooltip;

var defaultContext$5 = {
  disableItemsAutoClose: false,
  onItemClick: function onItemClick() {}
};
var PopoverContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$5);
var usePopoverContext = function usePopoverContext() {
  return React.useContext(PopoverContext);
};

var _excluded$o = ["content", "children", "trigger", "placement", "initialVisible", "portalClassName", "disableItemsAutoClose", "onVisibleChange", "visible"];
var defaultProps$w = {
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
      props = _objectWithoutProperties(_ref, _excluded$o);

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

PopoverComponent.defaultProps = defaultProps$w;
PopoverComponent.displayName = 'GeistPopover';
var Popover = withScale$1(PopoverComponent);
var Popover$1 = Popover;

var _excluded$n = ["children", "line", "title", "className", "onClick", "disableAutoClose"];
var defaultProps$v = {
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
      props = _objectWithoutProperties(_ref, _excluded$n);

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

PopoverItemComponent.defaultProps = defaultProps$v;
PopoverItemComponent.displayName = 'GeistPopoverItem';
var PopoverItem = withScale$1(PopoverItemComponent);
var PopoverItem$1 = PopoverItem;

Popover$1.Item = PopoverItem$1;
Popover$1.Option = PopoverItem$1;

var _excluded$m = ["value", "max", "className", "type", "colors", "fixedTop", "fixedBottom"];
var defaultProps$u = {
  value: 0,
  max: 100,
  type: 'default',
  fixedTop: false,
  fixedBottom: false,
  className: ''
};

var getCurrentColor = function getCurrentColor(ratio, palette, type) {
  var colors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var defaultColors = {
    "default": palette.foreground,
    success: palette.success,
    secondary: palette.secondary,
    warning: palette.warning,
    error: palette.error
  };
  var colorKeys = Object.keys(colors);
  if (colorKeys.length === 0) return defaultColors[type];
  var customColorKey = colorKeys.find(function (key) {
    return ratio <= +key;
  });
  if (!customColorKey || Number.isNaN(+customColorKey)) return defaultColors[type];
  return colors[+customColorKey];
};

var ProgressComponent = function ProgressComponent(_ref) {
  var value = _ref.value,
      max = _ref.max,
      className = _ref.className,
      type = _ref.type,
      colors = _ref.colors,
      fixedTop = _ref.fixedTop,
      fixedBottom = _ref.fixedBottom,
      props = _objectWithoutProperties(_ref, _excluded$m);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var percentValue = useProportions(value, max);
  var currentColor = getCurrentColor(percentValue, theme.palette, type, colors);
  var fixed = fixedTop || fixedBottom;
  var classes = useClasses$1('progress', {
    fixed: fixed
  }, className);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1239801602", [theme.palette.accents_2, theme.layout.radius, SCALES.width(1, '100%'), SCALES.height(0.625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), fixedTop ? 0 : 'unset', fixedBottom ? 0 : 'unset', theme.layout.radius, currentColor, percentValue]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    title: "".concat(percentValue, "%"),
    className: styledJsx_cjs.style.dynamic([["1239801602", [theme.palette.accents_2, theme.layout.radius, SCALES.width(1, '100%'), SCALES.height(0.625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), fixedTop ? 0 : 'unset', fixedBottom ? 0 : 'unset', theme.layout.radius, currentColor, percentValue]]]) + " " + "inner"
  }), /*#__PURE__*/React__default["default"].createElement("progress", _extends({
    value: value,
    max: max
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1239801602", [theme.palette.accents_2, theme.layout.radius, SCALES.width(1, '100%'), SCALES.height(0.625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), fixedTop ? 0 : 'unset', fixedBottom ? 0 : 'unset', theme.layout.radius, currentColor, percentValue]]]) + " " + (props && props.className != null && props.className || className || "")
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1239801602",
    dynamic: [theme.palette.accents_2, theme.layout.radius, SCALES.width(1, '100%'), SCALES.height(0.625), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), fixedTop ? 0 : 'unset', fixedBottom ? 0 : 'unset', theme.layout.radius, currentColor, percentValue]
  }, "progress.__jsx-style-dynamic-selector{position:fixed;top:-1000px;opacity:0;visibility:hidden;pointer-events:none;}.progress.__jsx-style-dynamic-selector{position:relative;background-color:".concat(theme.palette.accents_2, ";border-radius:").concat(theme.layout.radius, ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(0.625), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.fixed.__jsx-style-dynamic-selector{position:fixed;top:").concat(fixedTop ? 0 : 'unset', ";bottom:").concat(fixedBottom ? 0 : 'unset', ";left:0;border-radius:0;}.fixed.__jsx-style-dynamic-selector>.inner.__jsx-style-dynamic-selector{border-radius:0;}.inner.__jsx-style-dynamic-selector{position:absolute;top:0;left:0;height:100%;bottom:0;-webkit-transition:all 100ms ease-in;transition:all 100ms ease-in;border-radius:").concat(theme.layout.radius, ";background-color:").concat(currentColor, ";width:").concat(percentValue, "%;}")));
};

ProgressComponent.defaultProps = defaultProps$u;
ProgressComponent.displayName = 'GeistProgress';
var Progress = withScale$1(ProgressComponent);
var Progress$1 = Progress;

var defaultContext$4 = {
  disabledAll: false,
  inGroup: false
};
var RadioContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$4);
var useRadioContext = function useRadioContext() {
  return React__default["default"].useContext(RadioContext);
};

var _excluded$l = ["className", "children"];
var defaultProps$t = {
  className: ''
};

var RadioDescriptionComponent = function RadioDescriptionComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$l);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2489497926", [theme.palette.accents_3, SCALES.font(0.85, 'calc(var(--radio-size) * 0.85)'), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0, 'calc(var(--radio-size) + var(--radio-size) * 0.375)')]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2489497926",
    dynamic: [theme.palette.accents_3, SCALES.font(0.85, 'calc(var(--radio-size) * 0.85)'), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0, 'calc(var(--radio-size) + var(--radio-size) * 0.375)')]
  }, "span.__jsx-style-dynamic-selector{color:".concat(theme.palette.accents_3, ";font-size:").concat(SCALES.font(0.85, 'calc(var(--radio-size) * 0.85)'), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'calc(var(--radio-size) + var(--radio-size) * 0.375)'), ";}")));
};

RadioDescriptionComponent.defaultProps = defaultProps$t;
RadioDescriptionComponent.displayName = 'GeistRadioDescription';
var RadioDescription = withScale$1(RadioDescriptionComponent);
var RadioDescription$1 = RadioDescription;

var getColors$4 = function getColors(palette, status) {
  var colors = {
    "default": {
      label: palette.foreground,
      border: palette.border,
      bg: palette.foreground
    },
    secondary: {
      label: palette.foreground,
      border: palette.border,
      bg: palette.foreground
    },
    success: {
      label: palette.success,
      border: palette.success,
      bg: palette.success
    },
    warning: {
      label: palette.warning,
      border: palette.warning,
      bg: palette.warning
    },
    error: {
      label: palette.error,
      border: palette.error,
      bg: palette.error
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var _excluded$k = ["className", "checked", "onChange", "disabled", "type", "value", "children"];
var defaultProps$s = {
  type: 'default',
  disabled: false,
  className: ''
};

var RadioComponent = function RadioComponent(_ref) {
  var className = _ref.className,
      checked = _ref.checked,
      onChange = _ref.onChange,
      disabled = _ref.disabled,
      type = _ref.type,
      radioValue = _ref.value,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$k);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(!!checked),
      _useState2 = _slicedToArray(_useState, 2),
      selfChecked = _useState2[0],
      setSelfChecked = _useState2[1];

  var _useRadioContext = useRadioContext(),
      groupValue = _useRadioContext.value,
      disabledAll = _useRadioContext.disabledAll,
      inGroup = _useRadioContext.inGroup,
      updateState = _useRadioContext.updateState;

  var _pickChild = pickChild(children, RadioDescription$1),
      _pickChild2 = _slicedToArray(_pickChild, 2),
      withoutDescChildren = _pickChild2[0],
      DescChildren = _pickChild2[1];

  if (inGroup) {
    if (checked !== undefined) {
      useWarning$1('Remove props "checked" if in the Radio.Group.', 'Radio');
    }

    if (radioValue === undefined) {
      useWarning$1('Props "value" must be deinfed if in the Radio.Group.', 'Radio');
    }

    React.useEffect(function () {
      setSelfChecked(groupValue === radioValue);
    }, [groupValue, radioValue]);
  }

  var _useMemo = React.useMemo(function () {
    return getColors$4(theme.palette, type);
  }, [theme.palette, type]),
      label = _useMemo.label,
      border = _useMemo.border,
      bg = _useMemo.bg;

  var isDisabled = React.useMemo(function () {
    return disabled || disabledAll;
  }, [disabled, disabledAll]);

  var changeHandler = function changeHandler(event) {
    if (isDisabled) return;
    var selfEvent = {
      target: {
        checked: !selfChecked
      },
      stopPropagation: event.stopPropagation,
      preventDefault: event.preventDefault,
      nativeEvent: event
    };
    setSelfChecked(!selfChecked);

    if (inGroup) {
      updateState && updateState(radioValue);
    }

    onChange && onChange(selfEvent);
  };

  React.useEffect(function () {
    if (checked === undefined) return;
    setSelfChecked(Boolean(checked));
  }, [checked]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["2664604043", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]]]) + " " + (useClasses$1('radio', className) || "")
  }, /*#__PURE__*/React__default["default"].createElement("label", {
    className: styledJsx_cjs.style.dynamic([["2664604043", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]]])
  }, /*#__PURE__*/React__default["default"].createElement("input", _extends({
    type: "radio",
    value: radioValue,
    checked: selfChecked,
    onChange: changeHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2664604043", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]]]) + " " + (props && props.className != null && props.className || "")
  })), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2664604043", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]]]) + " " + "name"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["2664604043", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]]]) + " " + (useClasses$1('point', {
      active: selfChecked
    }) || "")
  }), withoutDescChildren), DescChildren && DescChildren), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2664604043",
    dynamic: [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), isDisabled ? theme.palette.accents_4 : label, isDisabled ? 'not-allowed' : 'pointer', border, isDisabled ? theme.palette.accents_4 : bg]
  }, "input.__jsx-style-dynamic-selector{opacity:0;visibility:hidden;overflow:hidden;width:1px;height:1px;top:-1000px;right:-1000px;position:fixed;font-size:0;}.radio.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;position:relative;--radio-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}label.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;color:").concat(isDisabled ? theme.palette.accents_4 : label, ";cursor:").concat(isDisabled ? 'not-allowed' : 'pointer', ";}.name.__jsx-style-dynamic-selector{font-size:var(--radio-size);font-weight:bold;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}.point.__jsx-style-dynamic-selector{height:var(--radio-size);width:var(--radio-size);border-radius:50%;border:1px solid ").concat(border, ";-webkit-transition:all 0.2s ease 0s;transition:all 0.2s ease 0s;position:relative;display:inline-block;-webkit-transform:scale(0.875);-ms-transform:scale(0.875);transform:scale(0.875);margin-right:calc(var(--radio-size) * 0.375);}.point.__jsx-style-dynamic-selector:before{content:'';position:absolute;left:-1px;top:-1px;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);height:var(--radio-size);width:var(--radio-size);border-radius:50%;background-color:").concat(isDisabled ? theme.palette.accents_4 : bg, ";}.active.__jsx-style-dynamic-selector:before{-webkit-transform:scale(0.875);-ms-transform:scale(0.875);transform:scale(0.875);-webkit-transition:all 0.2s ease 0s;transition:all 0.2s ease 0s;}")));
};

RadioComponent.defaultProps = defaultProps$s;
RadioComponent.displayName = 'GeistRadio';
var Radio = withScale$1(RadioComponent);
var Radio$1 = Radio;

var _excluded$j = ["disabled", "onChange", "value", "children", "className", "initialValue", "useRow"];
var defaultProps$r = {
  disabled: false,
  className: '',
  useRow: false
};

var RadioGroupComponent = function RadioGroupComponent(_ref) {
  var disabled = _ref.disabled,
      onChange = _ref.onChange,
      value = _ref.value,
      children = _ref.children,
      className = _ref.className,
      initialValue = _ref.initialValue,
      useRow = _ref.useRow,
      props = _objectWithoutProperties(_ref, _excluded$j);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      selfVal = _useState2[0],
      setSelfVal = _useState2[1];

  var updateState = function updateState(nextValue) {
    setSelfVal(nextValue);
    onChange && onChange(nextValue);
  };

  var providerValue = React.useMemo(function () {
    return {
      updateState: updateState,
      disabledAll: disabled,
      inGroup: true,
      value: selfVal
    };
  }, [disabled, selfVal]);
  React.useEffect(function () {
    if (value === undefined) return;
    setSelfVal(value);
  }, [value]);
  return /*#__PURE__*/React__default["default"].createElement(RadioContext.Provider, {
    value: providerValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1223822443", [useRow ? 'col' : 'column', SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), useRow ? 0 : 'var(--radio-group-gap)', useRow ? 'var(--radio-group-gap)' : 0, SCALES.font(1)]]]) + " " + (props && props.className != null && props.className || useClasses$1('radio-group', className) || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1223822443",
    dynamic: [useRow ? 'col' : 'column', SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), useRow ? 0 : 'var(--radio-group-gap)', useRow ? 'var(--radio-group-gap)' : 0, SCALES.font(1)]
  }, ".radio-group.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:".concat(useRow ? 'col' : 'column', ";-ms-flex-direction:").concat(useRow ? 'col' : 'column', ";flex-direction:").concat(useRow ? 'col' : 'column', ";--radio-group-gap:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.radio-group.__jsx-style-dynamic-selector .radio{margin-top:").concat(useRow ? 0 : 'var(--radio-group-gap)', ";margin-left:").concat(useRow ? 'var(--radio-group-gap)' : 0, ";--radio-size:").concat(SCALES.font(1), ";}.radio-group.__jsx-style-dynamic-selector .radio:first-of-type{margin:0;}")));
};

RadioGroupComponent.defaultProps = defaultProps$r;
RadioGroupComponent.displayName = 'GeistRadioGroup';
var RadioGroup = withScale$1(RadioGroupComponent);
var RadioGroup$1 = RadioGroup;

Radio$1.Group = RadioGroup$1;
Radio$1.Description = RadioDescription$1;
Radio$1.Desc = RadioDescription$1;

var RatingIcon = function RatingIcon() {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  }));
};

RatingIcon.displayName = 'GeistRatingIcon';
var RatingIcon$1 = RatingIcon;

var _excluded$i = ["type", "className", "icon", "count", "value", "initialValue", "onValueChange", "locked", "onLockedChange"];
tupleNumber(2, 3, 4, 5, 6, 7, 8, 9, 10);
tupleNumber(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
var defaultProps$q = {
  type: 'default',
  className: '',
  icon: /*#__PURE__*/React__default["default"].createElement(RatingIcon$1, null),
  count: 5,
  initialValue: 1,
  locked: false
};

var getColor = function getColor(type, palette) {
  var colors = {
    "default": palette.foreground,
    success: palette.success,
    warning: palette.warning,
    error: palette.error
  };
  return colors[type] || colors["default"];
};

var RatingComponent = function RatingComponent(_ref) {
  var type = _ref.type,
      className = _ref.className,
      icon = _ref.icon,
      count = _ref.count,
      customValue = _ref.value,
      initialValue = _ref.initialValue,
      onValueChange = _ref.onValueChange,
      locked = _ref.locked,
      onLockedChange = _ref.onLockedChange,
      props = _objectWithoutProperties(_ref, _excluded$i);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var color = React.useMemo(function () {
    return getColor(type, theme.palette);
  }, [type, theme.palette]);

  var _useState = React.useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = React.useState(locked),
      _useState4 = _slicedToArray(_useState3, 2),
      isLocked = _useState4[0],
      setIsLocked = _useState4[1];

  var lockedChangeHandler = function lockedChangeHandler(next) {
    setIsLocked(next);
    onLockedChange && onLockedChange(next);
  };

  var valueChangeHandler = function valueChangeHandler(next) {
    setValue(next);
    var emitValue = next > count ? count : next;
    onValueChange && onValueChange(emitValue);
  };

  var clickHandler = function clickHandler(index) {
    if (isLocked) return lockedChangeHandler(false);
    valueChangeHandler(index);
    lockedChangeHandler(true);
  };

  var mouseEnterHandler = function mouseEnterHandler(index) {
    if (isLocked) return;
    valueChangeHandler(index);
  };

  React.useEffect(function () {
    if (typeof customValue === 'undefined') return;
    setValue(customValue < 0 ? 0 : customValue);
  }, [customValue]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["884600549", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color, isLocked ? 'default' : 'pointer', color]]]) + " " + (props && props.className != null && props.className || useClasses$1('rating', className) || "")
  }), _toConsumableArray(Array(count)).map(function (_, index) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      key: index,
      onMouseEnter: function onMouseEnter() {
        return mouseEnterHandler(index + 1);
      },
      onClick: function onClick() {
        return clickHandler(index + 1);
      },
      className: styledJsx_cjs.style.dynamic([["884600549", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color, isLocked ? 'default' : 'pointer', color]]]) + " " + (useClasses$1('icon-box', {
        hovered: index + 1 <= value
      }) || "")
    }, icon);
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "884600549",
    dynamic: [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), color, isLocked ? 'default' : 'pointer', color]
  }, ".rating.__jsx-style-dynamic-selector{box-sizing:border-box;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;--rating-font-size:".concat(SCALES.font(1), ";font-size:var(--rating-font-size);width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.icon-box.__jsx-style-dynamic-selector{box-sizing:border-box;color:").concat(color, ";width:calc(var(--rating-font-size) * 1.5);height:calc(var(--rating-font-size) * 1.5);margin-right:calc(var(--rating-font-size) * 1 / 5);cursor:").concat(isLocked ? 'default' : 'pointer', ";}.icon-box.__jsx-style-dynamic-selector svg{width:100%;height:100%;fill:transparent;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);-webkit-transition:-webkit-transform,color,fill 30ms linear;-webkit-transition:transform,color,fill 30ms linear;transition:transform,color,fill 30ms linear;}.hovered.__jsx-style-dynamic-selector svg{fill:").concat(color, ";-webkit-transform:scale(0.9);-ms-transform:scale(0.9);transform:scale(0.9);}")));
};

RatingComponent.defaultProps = defaultProps$q;
RatingComponent.displayName = 'GeistRating';
var Rating = withScale$1(RatingComponent);
var Rating$1 = Rating;

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

var defaultContext$3 = {
  visible: false,
  disableAll: false
};
var SelectContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$3);
var useSelectContext = function useSelectContext() {
  return React__default["default"].useContext(SelectContext);
};

var defaultProps$p = {
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
SelectDropdown.defaultProps = defaultProps$p;
SelectDropdown.displayName = 'GeistSelectDropdown';
var SelectDropdown$1 = SelectDropdown;

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

var getColors$3 = function getColors(palette, status) {
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

var _excluded$h = ["children", "type", "disabled", "initialValue", "value", "icon", "onChange", "pure", "multiple", "clearable", "placeholder", "className", "dropdownClassName", "dropdownStyle", "disableMatchWidth", "getPopupContainer", "onDropdownVisibleChange"];
var defaultProps$o = {
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
      props = _objectWithoutProperties(_ref, _excluded$h);

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
    return getColors$3(theme.palette, type);
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
SelectComponent.defaultProps = defaultProps$o;
SelectComponent.displayName = 'GeistSelect';
var Select = withScale$1(SelectComponent);
var Select$1 = Select;

var _excluded$g = ["value", "className", "children", "disabled", "divider", "label", "preventAllEvents"];
var defaultProps$n = {
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
      props = _objectWithoutProperties(_ref, _excluded$g);

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

SelectOptionComponent.defaultProps = defaultProps$n;
SelectOptionComponent.displayName = 'GeistSelectOption';
var SelectOption = withScale$1(SelectOptionComponent);
var SelectOption$1 = SelectOption;

Select$1.Option = SelectOption$1;

var useDrag = function useDrag(elementRef) {
  var draggingHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var dragStartHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var dragEndHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  var onDragging = React.useRef(false);

  var _useCurrentState = useCurrentState$1(0),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      setStartX = _useCurrentState2[1],
      startXRef = _useCurrentState2[2];

  var _useCurrentState3 = useCurrentState$1(0),
      _useCurrentState4 = _slicedToArray(_useCurrentState3, 3),
      setCurrentX = _useCurrentState4[1],
      currentXRef = _useCurrentState4[2];

  var getCustomEvent = function getCustomEvent() {
    return {
      startX: startXRef.current,
      currentX: currentXRef.current
    };
  };

  var elementMouseDownHandler = function elementMouseDownHandler(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    onDragging.current = true;
    if (!elementRef || !elementRef.current) return;
    setStartX(elementRef.current.getBoundingClientRect().x);
    dragStartHandler(getCustomEvent());
  };

  var globalDraggingHandler = function globalDraggingHandler(event) {
    if (!onDragging.current) return;

    if (event.type === 'touchmove') {
      setCurrentX(event.changedTouches[0].clientX);
    } else {
      setCurrentX(event.clientX);
    }

    draggingHandler(getCustomEvent());
  };

  var globalDragEndHandler = function globalDragEndHandler() {
    if (!onDragging.current) return;
    onDragging.current = false;
    dragEndHandler(getCustomEvent());
  };

  React.useEffect(function () {
    if (!elementRef || !elementRef.current) return;
    elementRef.current.addEventListener('mousedown', elementMouseDownHandler);
    elementRef.current.addEventListener('touchstart', elementMouseDownHandler);
    window.addEventListener('mousemove', globalDraggingHandler);
    window.addEventListener('touchmove', globalDraggingHandler);
    window.addEventListener('mouseup', globalDragEndHandler);
    window.addEventListener('touchend', globalDragEndHandler);
    return function () {
      window.removeEventListener('mousemove', globalDraggingHandler);
      window.removeEventListener('touchmove', globalDraggingHandler);
      window.removeEventListener('mouseup', globalDragEndHandler);
      window.removeEventListener('touchend', globalDragEndHandler);
      if (!elementRef || !elementRef.current) return;
      elementRef.current.removeEventListener('mousedown', elementMouseDownHandler);
      elementRef.current.removeEventListener('touchstart', elementMouseDownHandler);
    };
  }, [elementRef]);
};

var useDrag$1 = useDrag;

var defaultProps$m = {
  left: 0,
  disabled: false,
  isClick: false
};
var SliderDot = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      left = _ref.left,
      isClick = _ref.isClick;
  var theme = useTheme();
  var classes = useClasses$1('dot', {
    disabled: disabled,
    click: isClick
  });
  return /*#__PURE__*/React__default["default"].createElement("div", {
    ref: ref,
    className: styledJsx_cjs.style.dynamic([["3479628597", [left, theme.palette.success, theme.palette.background, theme.palette.accents_2, theme.palette.accents_4]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3479628597",
    dynamic: [left, theme.palette.success, theme.palette.background, theme.palette.accents_2, theme.palette.accents_4]
  }, ".dot.__jsx-style-dynamic-selector{position:absolute;left:".concat(left, "%;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);height:calc(var(--slider-font-size) * 1.25);min-width:calc(var(--slider-font-size) * 1.25);line-height:calc(var(--slider-font-size) * 1.25);border-radius:calc(var(--slider-font-size) * 0.625);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-weight:700;font-size:calc(var(--slider-font-size) * 0.75);z-index:100;background-color:").concat(theme.palette.success, ";color:").concat(theme.palette.background, ";text-align:center;padding:0 calc(0.57 * var(--slider-font-size));}.dot.disabled.__jsx-style-dynamic-selector{cursor:not-allowed !important;background-color:").concat(theme.palette.accents_2, ";color:").concat(theme.palette.accents_4, ";}.dot.click.__jsx-style-dynamic-selector{-webkit-transition:all 200ms ease;transition:all 200ms ease;}.dot.__jsx-style-dynamic-selector:hover{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab;}.dot.__jsx-style-dynamic-selector:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing;}")));
});
SliderDot.defaultProps = defaultProps$m;
SliderDot.displayName = 'GeistSliderDot';
var SliderDot$1 = SliderDot;

var getMarks = function getMarks(min, max, step) {
  var value = max - min;
  var roundFunc = !(value % step) ? Math.floor : Math.ceil;
  var count = roundFunc(value / step) - 1;
  if (count >= 99) return [];
  return _toConsumableArray(new Array(count)).map(function (_, index) {
    return step * (index + 1) * 100 / value;
  });
};

var SliderMark = function SliderMark(_ref) {
  var step = _ref.step,
      max = _ref.max,
      min = _ref.min;
  var theme = useTheme();
  var marks = React.useMemo(function () {
    return getMarks(min, max, step);
  }, [min, max, step]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, marks.map(function (val, index) {
    return /*#__PURE__*/React__default["default"].createElement("span", {
      key: "".concat(val, "-").concat(index),
      style: {
        left: "".concat(val, "%")
      },
      className: styledJsx_cjs.style.dynamic([["324900419", [theme.palette.background]]])
    });
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "324900419",
    dynamic: [theme.palette.background]
  }, "span.__jsx-style-dynamic-selector{position:absolute;width:2px;height:100%;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background-color:".concat(theme.palette.background, ";}")));
};

var SliderMark$1 = SliderMark;

var getColors$2 = function getColors(palette, status) {
  var colors = {
    "default": {
      bg: palette.accents_8
    },
    secondary: {
      bg: palette.accents_8
    },
    success: {
      bg: palette.success
    },
    warning: {
      bg: palette.warning
    },
    error: {
      bg: palette.error
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var _excluded$f = ["hideValue", "disabled", "type", "step", "max", "min", "initialValue", "value", "onChange", "className", "showMarkers"];
var defaultProps$l = {
  hideValue: false,
  type: 'default',
  initialValue: 0,
  step: 1,
  min: 0,
  max: 100,
  disabled: false,
  showMarkers: false,
  className: ''
};

var getRefWidth = function getRefWidth(elementRef) {
  if (!elementRef || !elementRef.current) return 0;
  var rect = elementRef.current.getBoundingClientRect();
  return rect.width || rect.right - rect.left;
};

var getValue = function getValue(max, min, step, offsetX, railWidth) {
  if (offsetX < 0) return min;
  if (offsetX > railWidth) return max;
  var widthForEachStep = railWidth / (max - min) * step;
  if (widthForEachStep <= 0) return min;
  var slideDistance = Math.round(offsetX / widthForEachStep) * step + min;
  return Number.isInteger(slideDistance) ? slideDistance : Number.parseFloat(slideDistance.toFixed(1));
};

var SliderComponent = function SliderComponent(_ref) {
  var hideValue = _ref.hideValue,
      disabled = _ref.disabled,
      type = _ref.type,
      step = _ref.step,
      max = _ref.max,
      min = _ref.min,
      initialValue = _ref.initialValue,
      customValue = _ref.value,
      onChange = _ref.onChange,
      className = _ref.className,
      showMarkers = _ref.showMarkers,
      props = _objectWithoutProperties(_ref, _excluded$f);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useCurrentState = useCurrentState$1(0),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      setSliderWidth = _useCurrentState2[1],
      sideWidthRef = _useCurrentState2[2];

  var _useCurrentState3 = useCurrentState$1(0),
      _useCurrentState4 = _slicedToArray(_useCurrentState3, 3),
      setLastDargOffset = _useCurrentState4[1],
      lastDargOffsetRef = _useCurrentState4[2];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isClick = _useState4[0],
      setIsClick = _useState4[1];

  var sliderRef = React.useRef(null);
  var dotRef = React.useRef(null);
  var currentRatio = React.useMemo(function () {
    return (value - min) / (max - min) * 100;
  }, [value, max, min]);

  var setLastOffsetManually = function setLastOffsetManually(val) {
    var width = getRefWidth(sliderRef);
    var shouldOffset = (val - min) / (max - min) * width;
    setLastDargOffset(shouldOffset);
  };

  var updateValue = React.useCallback(function (offset) {
    var currentValue = getValue(max, min, step, offset, sideWidthRef.current);
    setValue(currentValue);
    onChange && onChange(currentValue);
  }, [max, min, step, sideWidthRef]);

  var _useMemo = React.useMemo(function () {
    return getColors$2(theme.palette, type);
  }, [theme.palette, type]),
      bg = _useMemo.bg;

  var dragHandler = function dragHandler(event) {
    if (disabled) return;
    var currentOffset = event.currentX - event.startX;
    var offset = currentOffset + lastDargOffsetRef.current;
    updateValue(offset);
  };

  var dragStartHandler = function dragStartHandler() {
    setIsClick(false);
    setSliderWidth(getRefWidth(sliderRef));
  };

  var dragEndHandler = function dragEndHandler(event) {
    if (disabled) return;
    var offset = event.currentX - event.startX;
    var currentOffset = offset + lastDargOffsetRef.current;
    var boundOffset = currentOffset < 0 ? 0 : Math.min(currentOffset, sideWidthRef.current);
    setLastDargOffset(boundOffset);
  };

  var clickHandler = function clickHandler(event) {
    if (disabled) return;
    if (!sliderRef || !sliderRef.current) return;
    setIsClick(true);
    setSliderWidth(getRefWidth(sliderRef));
    var clickOffset = event.clientX - sliderRef.current.getBoundingClientRect().x;
    setLastDargOffset(clickOffset);
    updateValue(clickOffset);
  };

  useDrag$1(dotRef, dragHandler, dragStartHandler, dragEndHandler);
  React.useEffect(function () {
    if (customValue === undefined) return;
    if (customValue === value) return;
    setValue(customValue);
  }, [customValue, value]);
  React.useEffect(function () {
    initialValue && setLastOffsetManually(initialValue);
  }, []);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler,
    ref: sliderRef
  }, props, {
    className: styledJsx_cjs.style.dynamic([["219401708", [disabled ? theme.palette.accents_2 : bg, disabled ? 'not-allow' : 'pointer', SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(0.5), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || useClasses$1('slider', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement(SliderDot$1, {
    disabled: disabled,
    ref: dotRef,
    isClick: isClick,
    left: currentRatio
  }, hideValue || value), showMarkers && /*#__PURE__*/React__default["default"].createElement(SliderMark$1, {
    max: max,
    min: min,
    step: step
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "219401708",
    dynamic: [disabled ? theme.palette.accents_2 : bg, disabled ? 'not-allow' : 'pointer', SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(0.5), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".slider.__jsx-style-dynamic-selector{border-radius:50px;background-color:".concat(disabled ? theme.palette.accents_2 : bg, ";position:relative;cursor:").concat(disabled ? 'not-allow' : 'pointer', ";--slider-font-size:").concat(SCALES.font(1), ";width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(0.5), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

SliderComponent.defaultProps = defaultProps$l;
SliderComponent.displayName = 'GeistSlider';
var Slider = withScale$1(SliderComponent);
var Slider$1 = Slider;

var getStyles = function getStyles(type, palette, fill) {
  var styles = {
    "default": {
      color: palette.foreground,
      border: palette.border,
      bgColor: palette.background
    },
    success: {
      color: palette.success,
      border: palette.success,
      bgColor: palette.background
    },
    warning: {
      color: palette.warning,
      border: palette.warning,
      bgColor: palette.background
    },
    error: {
      color: palette.error,
      border: palette.error,
      bgColor: palette.background
    },
    secondary: {
      color: palette.secondary,
      border: palette.secondary,
      bgColor: palette.background
    },
    lite: {
      color: palette.foreground,
      border: palette.border,
      bgColor: palette.accents_1
    },
    dark: {
      color: palette.background,
      border: palette.foreground,
      bgColor: palette.foreground
    }
  };
  var filledTypes = ['success', 'warning', 'error', 'secondary'];
  var style = styles[type];
  var shouldFilled = filledTypes.includes(type);
  if (!fill || !shouldFilled) return style;
  return _objectSpread2(_objectSpread2({}, style), {}, {
    color: style.bgColor,
    bgColor: style.color
  });
};

var SnippetIconComponent = function SnippetIconComponent() {
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    style: {
      color: 'currentcolor'
    },
    className: "jsx-418323402"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
    className: "jsx-418323402"
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "418323402"
  }, "svg.jsx-418323402{width:calc(var(--snippet-font-size) * 1.69);height:calc(var(--snippet-font-size) * 1.69);}"));
};

SnippetIconComponent.displayName = 'GeistSnippetIcon';
var SnippetIcon = /*#__PURE__*/React__default["default"].memo(SnippetIconComponent);
var SnippetIcon$1 = SnippetIcon;

var defaultOptions = {
  onError: function onError() {
    return useWarning$1('Failed to copy.', 'use-clipboard');
  }
};

var useClipboard = function useClipboard() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;
  var el = usePortal$1('clipboard');

  var copyText = function copyText(el, text) {
    if (!el || !text) return;
    var selection = window.getSelection();
    if (!selection) return;
    el.style.whiteSpace = 'pre';
    el.textContent = text;
    var range = window.document.createRange();
    selection.removeAllRanges();
    range.selectNode(el);
    selection.addRange(range);

    try {
      window.document.execCommand('copy');
    } catch (e) {
      options.onError && options.onError();
    }

    selection.removeAllRanges();

    if (el) {
      el.textContent = '';
    }
  };

  var copy = React.useCallback(function (text) {
    copyText(el, text);
  }, [el]);
  return {
    copy: copy
  };
};

var useClipboard$1 = useClipboard;

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

var _excluded$e = ["type", "filled", "children", "symbol", "toastText", "toastType", "text", "copy", "className"];
var defaultProps$k = {
  filled: false,
  symbol: '$',
  toastText: 'Copied to clipboard!',
  toastType: 'success',
  copy: 'default',
  type: 'default',
  className: ''
};

var textArrayToString = function textArrayToString(text) {
  return text.reduce(function (pre, current) {
    if (!current) return pre;
    return pre ? "".concat(pre, "\n").concat(current) : current;
  }, '');
};

var SnippetComponent = function SnippetComponent(_ref) {
  var type = _ref.type,
      filled = _ref.filled,
      children = _ref.children,
      symbol = _ref.symbol,
      toastText = _ref.toastText,
      toastType = _ref.toastType,
      text = _ref.text,
      copyType = _ref.copy,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$e);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useClipboard = useClipboard$1(),
      copy = _useClipboard.copy;

  var _useToasts = useToasts$1(),
      setToast = _useToasts.setToast;

  var ref = React.useRef(null);
  var isMultiLine = text && Array.isArray(text);
  var style = React.useMemo(function () {
    return getStyles(type, theme.palette, filled);
  }, [type, theme.palette, filled]);
  var showCopyIcon = React.useMemo(function () {
    return copyType !== 'prevent';
  }, [copyType]);
  var childText = React.useMemo(function () {
    if (isMultiLine) return textArrayToString(text);
    if (!children) return text;
    if (!ref.current) return '';
    return ref.current.textContent;
  }, [ref.current, children, text]);
  var symbolBefore = React.useMemo(function () {
    var str = symbol.trim();
    return str ? "".concat(str, " ") : '';
  }, [symbol]);

  var clickHandler = function clickHandler() {
    if (!childText || !showCopyIcon) return;
    copy(childText);
    if (copyType === 'silent') return;
    setToast({
      text: toastText,
      type: toastType
    });
  };

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]]) + " " + (props && props.className != null && props.className || useClasses$1('snippet', className) || "")
  }), isMultiLine ? text.map(function (t, index) {
    return /*#__PURE__*/React__default["default"].createElement("pre", {
      key: "snippet-".concat(index, "-").concat(t),
      className: styledJsx_cjs.style.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]])
    }, t);
  }) : /*#__PURE__*/React__default["default"].createElement("pre", {
    ref: ref,
    className: styledJsx_cjs.style.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]])
  }, children || text), showCopyIcon && /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: clickHandler,
    className: styledJsx_cjs.style.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]]) + " " + "copy"
  }, /*#__PURE__*/React__default["default"].createElement(SnippetIcon$1, null)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2394272060",
    dynamic: [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]
  }, ".snippet.__jsx-style-dynamic-selector{position:relative;max-width:100%;color:".concat(style.color, ";background-color:").concat(style.bgColor, ";border:1px solid ").concat(style.border, ";border-radius:").concat(theme.layout.radius, ";--snippet-font-size:").concat(SCALES.font(0.8125), ";--snippet-padding-top:").concat(SCALES.pt(0.667), ";font-size:var(--snippet-font-size);width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.667), " ").concat(SCALES.pr(2.667), " ").concat(SCALES.pb(0.667), " ").concat(SCALES.pl(0.667), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}pre.__jsx-style-dynamic-selector{margin:0;padding:0;border:none;background-color:transparent;color:").concat(style.color, ";font-size:inherit;}pre.__jsx-style-dynamic-selector::before{content:'").concat(symbolBefore, "';-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}pre.__jsx-style-dynamic-selector *{margin:0;padding:0;font-size:inherit;color:inherit;}.copy.__jsx-style-dynamic-selector{position:absolute;right:0;top:0;bottom:0;height:calc(100% - 2px);background-color:").concat(style.bgColor, ";display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:").concat(isMultiLine ? 'flex-start' : 'center', ";-webkit-box-align:").concat(isMultiLine ? 'flex-start' : 'center', ";-ms-flex-align:").concat(isMultiLine ? 'flex-start' : 'center', ";align-items:").concat(isMultiLine ? 'flex-start' : 'center', ";width:calc(3.281 * var(--snippet-font-size));color:inherit;-webkit-transition:opacity 150ms ease 0s;transition:opacity 150ms ease 0s;border-radius:").concat(theme.layout.radius, ";cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding-top:").concat(isMultiLine ? 'var(--snippet-padding-top)' : 0, ";opacity:0.65;}.copy.__jsx-style-dynamic-selector:hover{opacity:1;}")));
};

SnippetComponent.defaultProps = defaultProps$k;
SnippetComponent.displayName = 'GeistSnippet';
var Snippet = withScale$1(SnippetComponent);
var Snippet$1 = Snippet;

var _excluded$d = ["inline", "className"];
var defaultProps$j = {
  inline: false,
  className: ''
};

var SpacerComponent = function SpacerComponent(_ref) {
  var inline = _ref.inline,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$d);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1994396435", [inline ? 'inline-block' : 'block', SCALES.width(1), SCALES.height(1), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1994396435",
    dynamic: [inline ? 'inline-block' : 'block', SCALES.width(1), SCALES.height(1), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "span.__jsx-style-dynamic-selector{display:".concat(inline ? 'inline-block' : 'block', ";width:").concat(SCALES.width(1), ";height:").concat(SCALES.height(1), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

SpacerComponent.defaultProps = defaultProps$j;
SpacerComponent.displayName = 'GeistSpacer';
var Spacer = withScale$1(SpacerComponent);
var Spacer$1 = Spacer;

var _excluded$c = ["className"];
var defaultProps$i = {
  className: ''
};

var getSpans = function getSpans(theme) {
  return _toConsumableArray(new Array(12)).map(function (_, index) {
    return /*#__PURE__*/React__default["default"].createElement("span", {
      key: "spinner-".concat(index),
      className: styledJsx_cjs.style.dynamic([["3296107463", [theme.palette.foreground, theme.layout.radius]]])
    }, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "3296107463",
      dynamic: [theme.palette.foreground, theme.layout.radius]
    }, "span.__jsx-style-dynamic-selector{background-color:".concat(theme.palette.foreground, ";position:absolute;top:-3.9%;width:24%;height:8%;left:-10%;border-radius:").concat(theme.layout.radius, ";-webkit-animation:spinner-__jsx-style-dynamic-selector 1.2s linear 0s infinite normal none running;animation:spinner-__jsx-style-dynamic-selector 1.2s linear 0s infinite normal none running;}span.__jsx-style-dynamic-selector:nth-child(1){-webkit-animation-delay:-1.2s;animation-delay:-1.2s;-webkit-transform:rotate(0deg) translate(146%);-ms-transform:rotate(0deg) translate(146%);transform:rotate(0deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(2){-webkit-animation-delay:-1.1s;animation-delay:-1.1s;-webkit-transform:rotate(30deg) translate(146%);-ms-transform:rotate(30deg) translate(146%);transform:rotate(30deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(3){-webkit-animation-delay:-1s;animation-delay:-1s;-webkit-transform:rotate(60deg) translate(146%);-ms-transform:rotate(60deg) translate(146%);transform:rotate(60deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(4){-webkit-animation-delay:-0.9s;animation-delay:-0.9s;-webkit-transform:rotate(90deg) translate(146%);-ms-transform:rotate(90deg) translate(146%);transform:rotate(90deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(5){-webkit-animation-delay:-0.8s;animation-delay:-0.8s;-webkit-transform:rotate(120deg) translate(146%);-ms-transform:rotate(120deg) translate(146%);transform:rotate(120deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(6){-webkit-animation-delay:-0.7s;animation-delay:-0.7s;-webkit-transform:rotate(150deg) translate(146%);-ms-transform:rotate(150deg) translate(146%);transform:rotate(150deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(7){-webkit-animation-delay:-0.6s;animation-delay:-0.6s;-webkit-transform:rotate(180deg) translate(146%);-ms-transform:rotate(180deg) translate(146%);transform:rotate(180deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(8){-webkit-animation-delay:-0.5s;animation-delay:-0.5s;-webkit-transform:rotate(210deg) translate(146%);-ms-transform:rotate(210deg) translate(146%);transform:rotate(210deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(9){-webkit-animation-delay:-0.4s;animation-delay:-0.4s;-webkit-transform:rotate(240deg) translate(146%);-ms-transform:rotate(240deg) translate(146%);transform:rotate(240deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(10){-webkit-animation-delay:-0.3s;animation-delay:-0.3s;-webkit-transform:rotate(270deg) translate(146%);-ms-transform:rotate(270deg) translate(146%);transform:rotate(270deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(11){-webkit-animation-delay:-0.2s;animation-delay:-0.2s;-webkit-transform:rotate(300deg) translate(146%);-ms-transform:rotate(300deg) translate(146%);transform:rotate(300deg) translate(146%);}span.__jsx-style-dynamic-selector:nth-child(12){-webkit-animation-delay:-0.1s;animation-delay:-0.1s;-webkit-transform:rotate(330deg) translate(146%);-ms-transform:rotate(330deg) translate(146%);transform:rotate(330deg) translate(146%);}@-webkit-keyframes spinner-__jsx-style-dynamic-selector{0%{opacity:1;}100%{opacity:0.15;}}@keyframes spinner-__jsx-style-dynamic-selector{0%{opacity:1;}100%{opacity:0.15;}}")));
  });
};

var SpinnerComponent = function SpinnerComponent(_ref) {
  var className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$c);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses$1('spinner', className);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1153799566", [SCALES.width(1.25), SCALES.height(1.25), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1153799566", [SCALES.width(1.25), SCALES.height(1.25), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + "container"
  }, getSpans(theme)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1153799566",
    dynamic: [SCALES.width(1.25), SCALES.height(1.25), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".spinner.__jsx-style-dynamic-selector{display:block;box-sizing:border-box;width:".concat(SCALES.width(1.25), ";height:").concat(SCALES.height(1.25), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.container.__jsx-style-dynamic-selector{width:100%;height:100%;position:relative;left:50%;top:50%;}")));
};

SpinnerComponent.defaultProps = defaultProps$i;
SpinnerComponent.displayName = 'GeistSpinner';
var Spinner = withScale$1(SpinnerComponent);
var Spinner$1 = Spinner;

var defaultProps$h = {
  className: ''
};

var makeColgroup = function makeColgroup(width, columns) {
  var unsetWidthCount = columns.filter(function (c) {
    return !c.width;
  }).length;
  var customWidthTotal = columns.reduce(function (pre, current) {
    return current.width ? pre + current.width : pre;
  }, 0);
  var averageWidth = (width - customWidthTotal) / unsetWidthCount;
  if (averageWidth <= 0) return /*#__PURE__*/React__default["default"].createElement("colgroup", null);
  return /*#__PURE__*/React__default["default"].createElement("colgroup", null, columns.map(function (column, index) {
    return /*#__PURE__*/React__default["default"].createElement("col", {
      key: "colgroup-".concat(index),
      width: column.width || averageWidth
    });
  }));
};

var TableHead = function TableHead(props) {
  var theme = useTheme();
  var _ref = props,
      columns = _ref.columns,
      width = _ref.width;
  var isScalableWidth = React.useMemo(function () {
    return columns.find(function (item) {
      return !!item.width;
    });
  }, [columns]);
  var colgroup = React.useMemo(function () {
    if (!isScalableWidth) return /*#__PURE__*/React__default["default"].createElement("colgroup", null);
    return makeColgroup(width, columns);
  }, [isScalableWidth, width]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, colgroup, /*#__PURE__*/React__default["default"].createElement("thead", {
    className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React__default["default"].createElement("tr", {
    className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]])
  }, columns.map(function (column, index) {
    return /*#__PURE__*/React__default["default"].createElement("th", {
      key: "table-th-".concat(column.prop, "-").concat(index),
      className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]]) + " " + (column.className || "")
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: styledJsx_cjs.style.dynamic([["134865897", [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]]]) + " " + "thead-box"
    }, column.label));
  }))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "134865897",
    dynamic: [theme.palette.accents_5, theme.palette.accents_1, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius, theme.palette.border, theme.palette.border, theme.palette.border, theme.layout.radius, theme.layout.radius]
  }, "thead.__jsx-style-dynamic-selector{border-collapse:separate;border-spacing:0;font-size:inherit;}th.__jsx-style-dynamic-selector{padding:0 0.5em;font-size:calc(0.75 * var(--table-font-size));font-weight:normal;text-align:left;-webkit-letter-spacing:0;-moz-letter-spacing:0;-ms-letter-spacing:0;letter-spacing:0;vertical-align:middle;min-height:calc(2.5 * var(--table-font-size));color:".concat(theme.palette.accents_5, ";background:").concat(theme.palette.accents_1, ";border-bottom:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-radius:0;}th.__jsx-style-dynamic-selector:nth-child(1){border-bottom:1px solid ").concat(theme.palette.border, ";border-left:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-top-left-radius:").concat(theme.layout.radius, ";border-bottom-left-radius:").concat(theme.layout.radius, ";}th.__jsx-style-dynamic-selector:last-child{border-bottom:1px solid ").concat(theme.palette.border, ";border-right:1px solid ").concat(theme.palette.border, ";border-top:1px solid ").concat(theme.palette.border, ";border-top-right-radius:").concat(theme.layout.radius, ";border-bottom-right-radius:").concat(theme.layout.radius, ";}.thead-box.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-align:center;min-height:calc(2.5 * var(--table-font-size));text-transform:uppercase;}")));
};

TableHead.defaultProps = defaultProps$h;
TableHead.displayName = 'GeistTableHead';
var TableHead$1 = TableHead;

var TableCell = function TableCell(_ref) {
  var columns = _ref.columns,
      row = _ref.row,
      rowIndex = _ref.rowIndex,
      emptyText = _ref.emptyText,
      onCellClick = _ref.onCellClick;

  /* eslint-disable react/jsx-no-useless-fragment */
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, columns.map(function (column, index) {
    var currentRowValue = row[column.prop];
    var cellValue = currentRowValue || emptyText;
    var shouldBeRenderElement = column.renderHandler(currentRowValue, row, rowIndex);
    return /*#__PURE__*/React__default["default"].createElement("td", {
      key: "row-td-".concat(index, "-").concat(column.prop),
      onClick: function onClick() {
        return onCellClick && onCellClick(currentRowValue, rowIndex, index);
      },
      className: column.className
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "cell"
    }, shouldBeRenderElement ? shouldBeRenderElement : cellValue));
  }));
  /* eslint-enable */
};

var TableCell$1 = TableCell;

var defaultContext$2 = {
  columns: [],
  updateColumn: function updateColumn() {}
};
var TableContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$2);
var useTableContext = function useTableContext() {
  return React__default["default"].useContext(TableContext);
};

var defaultProps$g = {
  className: ''
};

var TableBody = function TableBody(_ref) {
  var data = _ref.data,
      hover = _ref.hover,
      emptyText = _ref.emptyText,
      onRow = _ref.onRow,
      onCell = _ref.onCell,
      rowClassName = _ref.rowClassName;
  var theme = useTheme();

  var _useTableContext = useTableContext(),
      columns = _useTableContext.columns;

  var rowClickHandler = function rowClickHandler(row, index) {
    onRow && onRow(row, index);
  };

  return /*#__PURE__*/React__default["default"].createElement("tbody", {
    className: styledJsx_cjs.style.dynamic([["3433300570", [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]]])
  }, data.map(function (row, index) {
    var className = rowClassName(row, index);
    return /*#__PURE__*/React__default["default"].createElement("tr", {
      key: "tbody-row-".concat(index),
      onClick: function onClick() {
        return rowClickHandler(row, index);
      },
      className: styledJsx_cjs.style.dynamic([["3433300570", [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]]]) + " " + (useClasses$1({
        hover: hover
      }, className) || "")
    }, /*#__PURE__*/React__default["default"].createElement(TableCell$1, {
      columns: columns,
      row: row,
      rowIndex: index,
      emptyText: emptyText,
      onCellClick: onCell
    }));
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3433300570",
    dynamic: [theme.palette.accents_1, theme.palette.border, theme.palette.accents_6]
  }, "tr.__jsx-style-dynamic-selector{-webkit-transition:background-color 0.25s ease;transition:background-color 0.25s ease;font-size:inherit;}tr.hover.__jsx-style-dynamic-selector:hover{background-color:".concat(theme.palette.accents_1, ";}tr.__jsx-style-dynamic-selector td{padding:0 0.5em;border-bottom:1px solid ").concat(theme.palette.border, ";color:").concat(theme.palette.accents_6, ";font-size:calc(0.875 * var(--table-font-size));text-align:left;}tr.__jsx-style-dynamic-selector .cell{min-height:calc(3.125 * var(--table-font-size));display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;}")));
};

TableBody.defaultProps = defaultProps$g;
TableBody.displayName = 'GeistTableBody';
var TableBody$1 = TableBody;

var defaultProps$f = {
  className: '',
  render: function render() {}
};

var TableColumn = function TableColumn(columnProps) {
  var _ref = columnProps,
      children = _ref.children,
      prop = _ref.prop,
      label = _ref.label,
      width = _ref.width,
      className = _ref.className,
      renderHandler = _ref.render;

  var _useTableContext = useTableContext(),
      updateColumn = _useTableContext.updateColumn;

  var safeProp = "".concat(prop).trim();

  if (!safeProp) {
    useWarning$1('The props "prop" is required.', 'Table.Column');
  }

  React.useEffect(function () {
    updateColumn({
      label: children || label,
      prop: safeProp,
      width: width,
      className: className,
      renderHandler: renderHandler
    });
  }, [children, label, prop, width, className, renderHandler]);
  return null;
};

TableColumn.defaultProps = defaultProps$f;
TableColumn.displayName = 'GeistTableColumn';
var TableColumn$1 = TableColumn;

var _excluded$b = ["children", "data", "initialData", "hover", "emptyText", "onRow", "onCell", "onChange", "className", "rowClassName"];
var defaultProps$e = {
  hover: true,
  initialData: [],
  emptyText: '',
  className: '',
  rowClassName: function rowClassName() {
    return '';
  }
};

function TableComponent(tableProps) {
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  var _ref = tableProps,
      children = _ref.children,
      customData = _ref.data,
      initialData = _ref.initialData,
      hover = _ref.hover,
      emptyText = _ref.emptyText,
      onRow = _ref.onRow,
      onCell = _ref.onCell;
      _ref.onChange;
      var className = _ref.className,
      rowClassName = _ref.rowClassName,
      props = _objectWithoutProperties(_ref, _excluded$b);
  /* eslint-enable @typescript-eslint/no-unused-vars */


  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var ref = React.useRef(null);

  var _useRealShape = useRealShape$1(ref),
      _useRealShape2 = _slicedToArray(_useRealShape, 2),
      width = _useRealShape2[0].width,
      updateShape = _useRealShape2[1];

  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      columns = _useState2[0],
      setColumns = _useState2[1];

  var _useState3 = React.useState(initialData),
      _useState4 = _slicedToArray(_useState3, 2),
      data = _useState4[0],
      setData = _useState4[1];

  var updateColumn = function updateColumn(column) {
    setColumns(function (last) {
      var hasColumn = last.find(function (item) {
        return item.prop === column.prop;
      });
      if (!hasColumn) return [].concat(_toConsumableArray(last), [column]);
      return last.map(function (item) {
        if (item.prop !== column.prop) return item;
        return column;
      });
    });
  };

  var contextValue = React.useMemo(function () {
    return {
      columns: columns,
      updateColumn: updateColumn
    };
  }, [columns]);
  React.useEffect(function () {
    if (typeof customData === 'undefined') return;
    setData(customData);
  }, [customData]);
  useResize$1(function () {
    return updateShape();
  });
  return /*#__PURE__*/React__default["default"].createElement(TableContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React__default["default"].createElement("table", _extends({
    ref: ref
  }, props, {
    className: styledJsx_cjs.style.dynamic([["2132340556", [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), /*#__PURE__*/React__default["default"].createElement(TableHead$1, {
    columns: columns,
    width: width
  }), /*#__PURE__*/React__default["default"].createElement(TableBody$1, {
    data: data,
    hover: hover,
    emptyText: emptyText,
    onRow: onRow,
    onCell: onCell,
    rowClassName: rowClassName
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2132340556",
    dynamic: [SCALES.font(1), SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "table.__jsx-style-dynamic-selector{border-collapse:separate;border-spacing:0;--table-font-size:".concat(SCALES.font(1), ";font-size:var(--table-font-size);width:").concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}"))));
}

TableComponent.defaultProps = defaultProps$e;
TableComponent.displayName = 'GeistTable';
TableComponent.Column = TableColumn$1;
var Table = withScale$1(TableComponent);
Table.Column = TableColumn$1;
var Table$1 = Table;

var defaultContext$1 = {
  inGroup: false
};
var TabsContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
var useTabsContext = function useTabsContext() {
  return React__default["default"].useContext(TabsContext);
};

var usePrevious = function usePrevious(state) {
  var ref = React.useRef(null);
  React.useEffect(function () {
    ref.current = state;
  });
  return ref ? ref.current : null;
};

var usePrevious$1 = usePrevious;

var _excluded$a = ["rect", "visible", "hoverHeightRatio", "hoverWidthRatio", "activeOpacity", "className"];

var Highlight = function Highlight(_ref) {
  var rect = _ref.rect,
      visible = _ref.visible,
      _ref$hoverHeightRatio = _ref.hoverHeightRatio,
      hoverHeightRatio = _ref$hoverHeightRatio === void 0 ? 1 : _ref$hoverHeightRatio,
      _ref$hoverWidthRatio = _ref.hoverWidthRatio,
      hoverWidthRatio = _ref$hoverWidthRatio === void 0 ? 1 : _ref$hoverWidthRatio,
      _ref$activeOpacity = _ref.activeOpacity,
      activeOpacity = _ref$activeOpacity === void 0 ? 0.8 : _ref$activeOpacity,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$a);

  var theme = useTheme();
  var ref = React.useRef(null);
  var isFirstVisible = usePrevious$1(isUnplacedRect(rect));
  var position = React.useMemo(function () {
    var width = rect.width * hoverWidthRatio;
    var height = rect.height * hoverHeightRatio;
    return {
      width: "".concat(width, "px"),
      left: "".concat(rect.left + (rect.width - width) / 2, "px"),
      height: "".concat(height, "px"),
      top: "".concat(rect.elementTop + (rect.height - height) / 2, "px"),
      transition: isFirstVisible ? 'opacity' : 'opacity, width, left, top'
    };
  }, [rect, hoverWidthRatio, hoverHeightRatio]);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    ref: ref
  }, props, {
    className: styledJsx_cjs.style.dynamic([["603024321", [theme.palette.accents_2, position.width, position.left, position.height, position.top, visible ? activeOpacity : 0, position.transition]]]) + " " + (props && props.className != null && props.className || useClasses$1('highlight', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "603024321",
    dynamic: [theme.palette.accents_2, position.width, position.left, position.height, position.top, visible ? activeOpacity : 0, position.transition]
  }, ".highlight.__jsx-style-dynamic-selector{background:".concat(theme.palette.accents_2, ";position:absolute;border-radius:5px;width:").concat(position.width, ";left:").concat(position.left, ";height:").concat(position.height, ";top:").concat(position.top, ";opacity:").concat(visible ? activeOpacity : 0, ";-webkit-transition:0.15s ease;transition:0.15s ease;-webkit-transition-property:").concat(position.transition, ";transition-property:").concat(position.transition, ";}")));
};

var Highlight$1 = Highlight;

var _excluded$9 = ["initialValue", "value", "hideDivider", "hideBorder", "children", "onChange", "className", "leftSpace", "highlight", "hoverHeightRatio", "hoverWidthRatio", "activeClassName", "activeStyle", "align"];
var defaultProps$d = {
  className: '',
  hideDivider: false,
  highlight: true,
  leftSpace: '12px',
  hoverHeightRatio: 0.7,
  hoverWidthRatio: 1.15,
  activeClassName: '',
  activeStyle: {},
  align: 'left'
};

var TabsComponent = function TabsComponent(_ref) {
  var userCustomInitialValue = _ref.initialValue,
      value = _ref.value,
      hideDivider = _ref.hideDivider,
      hideBorder = _ref.hideBorder,
      children = _ref.children,
      onChange = _ref.onChange,
      className = _ref.className,
      leftSpace = _ref.leftSpace,
      highlight = _ref.highlight,
      hoverHeightRatio = _ref.hoverHeightRatio,
      hoverWidthRatio = _ref.hoverWidthRatio,
      activeClassName = _ref.activeClassName,
      activeStyle = _ref.activeStyle,
      align = _ref.align,
      props = _objectWithoutProperties(_ref, _excluded$9);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      tabs = _useState2[0],
      setTabs = _useState2[1];

  var _useState3 = React.useState(userCustomInitialValue),
      _useState4 = _slicedToArray(_useState3, 2),
      selfValue = _useState4[0],
      setSelfValue = _useState4[1];

  var ref = React.useRef(null);

  var _useState5 = React.useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      displayHighlight = _useState6[0],
      setDisplayHighlight = _useState6[1];

  var _useRect = useRect(),
      rect = _useRect.rect,
      setRect = _useRect.setRect;

  var register = function register(next) {
    setTabs(function (last) {
      var hasItem = last.find(function (item) {
        return item.value === next.value;
      });
      if (!hasItem) return [].concat(_toConsumableArray(last), [next]);
      return last.map(function (item) {
        if (item.value !== next.value) return item;
        return _objectSpread2(_objectSpread2({}, item), next);
      });
    });
  };

  var initialValue = React.useMemo(function () {
    return {
      register: register,
      currentValue: selfValue,
      inGroup: true,
      leftSpace: leftSpace
    };
  }, [selfValue, leftSpace]);
  React.useEffect(function () {
    if (typeof value === 'undefined') return;
    setSelfValue(value);
  }, [value]);

  var clickHandler = function clickHandler(value) {
    setSelfValue(value);
    onChange && onChange(value);
  };

  var tabItemMouseOverHandler = function tabItemMouseOverHandler(event) {
    if (!isGeistElement(event.target)) return;
    setRect(event, function () {
      return ref.current;
    });

    if (highlight) {
      setDisplayHighlight(true);
    }
  };

  return /*#__PURE__*/React__default["default"].createElement(TabsContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + (props && props.className != null && props.className || useClasses$1('tabs', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("header", {
    ref: ref,
    onMouseLeave: function onMouseLeave() {
      return setDisplayHighlight(false);
    },
    className: styledJsx_cjs.style.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]])
  }, /*#__PURE__*/React__default["default"].createElement(Highlight$1, {
    rect: rect,
    visible: displayHighlight,
    hoverHeightRatio: hoverHeightRatio,
    hoverWidthRatio: hoverWidthRatio
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + (useClasses$1('scroll-container', {
      'hide-divider': hideDivider
    }) || "")
  }, tabs.map(function (_ref2) {
    var Cell = _ref2.cell,
        value = _ref2.value;
    return /*#__PURE__*/React__default["default"].createElement(Cell, {
      key: value,
      onClick: clickHandler,
      onMouseOver: tabItemMouseOverHandler,
      activeClassName: activeClassName,
      activeStyle: activeStyle,
      hideBorder: hideBorder,
      className: styledJsx_cjs.style.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]])
    });
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + "content"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1340018565",
    dynamic: [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]
  }, ".tabs.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}header.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow-y:hidden;overflow-x:scroll;-webkit-scrollbar-width:none;-moz-scrollbar-width:none;-ms-scrollbar-width:none;scrollbar-width:none;position:relative;}.scroll-container.__jsx-style-dynamic-selector{width:100%;height:100%;-webkit-flex:1;-ms-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:").concat(align, ";-webkit-justify-content:").concat(align, ";-ms-flex-pack:").concat(align, ";justify-content:").concat(align, ";border-bottom:1px solid ").concat(theme.palette.border, ";padding-left:").concat(leftSpace, ";}header.__jsx-style-dynamic-selector::-webkit-scrollbar{display:none;}.hide-divider.__jsx-style-dynamic-selector{border-color:transparent;}.content.__jsx-style-dynamic-selector{padding-top:0.625rem;}"))));
};

TabsComponent.defaultProps = defaultProps$d;
TabsComponent.displayName = 'GeistTabs';
var Tabs = withScale$1(TabsComponent);
var Tabs$1 = Tabs;

var defaultProps$c = {
  disabled: false
};

var TabsItemComponent = function TabsItemComponent(_ref) {
  var children = _ref.children,
      value = _ref.value,
      label = _ref.label,
      disabled = _ref.disabled;

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useTabsContext = useTabsContext(),
      register = _useTabsContext.register,
      currentValue = _useTabsContext.currentValue;

  var isActive = React.useMemo(function () {
    return currentValue === value;
  }, [currentValue, value]);

  var TabsInternalCell = function TabsInternalCell(_ref2) {
    var _useClasses;

    var onClick = _ref2.onClick,
        onMouseOver = _ref2.onMouseOver,
        activeClassName = _ref2.activeClassName,
        activeStyle = _ref2.activeStyle,
        hideBorder = _ref2.hideBorder;
    var theme = useTheme();
    var ref = React.useRef(null);

    var _useTabsContext2 = useTabsContext(),
        currentValue = _useTabsContext2.currentValue;

    var active = currentValue === value;
    var classes = useClasses$1('tab', (_useClasses = {
      active: active,
      disabled: disabled
    }, _defineProperty(_useClasses, activeClassName, active), _defineProperty(_useClasses, 'hide-border', hideBorder), _useClasses));

    var clickHandler = function clickHandler() {
      if (disabled) return;
      onClick && onClick(value);
    };

    return /*#__PURE__*/React__default["default"].createElement("div", {
      ref: ref,
      role: "button",
      key: value,
      onMouseOver: onMouseOver,
      onClick: clickHandler,
      style: active ? activeStyle : {},
      "data-geist": "tab-item",
      className: styledJsx_cjs.style.dynamic([["2444688710", [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.55), SCALES.pb(0.875), SCALES.pl(0.55), SCALES.mt(0), SCALES.mr(0.2), SCALES.mb(0), SCALES.ml(0.2), SCALES.pl(0.28), SCALES.pr(0.28), theme.palette.foreground, theme.palette.foreground, theme.palette.foreground, theme.palette.accents_3, label]]]) + " " + (classes || "")
    }, label, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
      id: "2444688710",
      dynamic: [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.55), SCALES.pb(0.875), SCALES.pl(0.55), SCALES.mt(0), SCALES.mr(0.2), SCALES.mb(0), SCALES.ml(0.2), SCALES.pl(0.28), SCALES.pr(0.28), theme.palette.foreground, theme.palette.foreground, theme.palette.foreground, theme.palette.accents_3, label]
    }, ".tab.__jsx-style-dynamic-selector{position:relative;box-sizing:border-box;cursor:pointer;outline:0;text-transform:capitalize;white-space:nowrap;background-color:transparent;color:".concat(theme.palette.accents_5, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:").concat(SCALES.font(0.875), ";line-height:normal;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.875), " ").concat(SCALES.pr(0.55), " ").concat(SCALES.pb(0.875), " ").concat(SCALES.pl(0.55), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0.2), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0.2), ";z-index:1;--tabs-item-hover-left:calc(-1 * ").concat(SCALES.pl(0.28), ");--tabs-item-hover-right:calc(-1 * ").concat(SCALES.pr(0.28), ");}.tab.__jsx-style-dynamic-selector:hover{color:").concat(theme.palette.foreground, ";}.tab.__jsx-style-dynamic-selector:after{position:absolute;content:'';bottom:-1px;left:0;right:0;width:100%;height:2px;border-radius:4px;-webkit-transform:scaleX(0.75);-ms-transform:scaleX(0.75);transform:scaleX(0.75);background-color:").concat(theme.palette.foreground, ";-webkit-transition:opacity,-webkit-transform 200ms ease-in;-webkit-transition:opacity,transform 200ms ease-in;transition:opacity,transform 200ms ease-in;opacity:0;}.active.__jsx-style-dynamic-selector:after{opacity:1;-webkit-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1);}.tab.__jsx-style-dynamic-selector svg{max-height:1em;margin-right:5px;}.tab.__jsx-style-dynamic-selector:first-of-type{margin-left:0;}.active.__jsx-style-dynamic-selector{color:").concat(theme.palette.foreground, ";}.disabled.__jsx-style-dynamic-selector{color:").concat(theme.palette.accents_3, ";cursor:not-allowed;}.hide-border.__jsx-style-dynamic-selector:before{display:block;content:").concat(label, ";font-weight:500;height:0;overflow:hidden;visibility:hidden;}.hide-border.__jsx-style-dynamic-selector:after{display:none;}.hide-border.active.__jsx-style-dynamic-selector{font-weight:500;}")));
  };

  TabsInternalCell.displayName = 'GeistTabsInternalCell';
  React.useEffect(function () {
    register && register({
      value: value,
      cell: TabsInternalCell
    });
  }, [value, label, disabled]);
  /* eslint-disable react/jsx-no-useless-fragment */

  return isActive ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, children) : null;
};

TabsItemComponent.defaultProps = defaultProps$c;
TabsItemComponent.displayName = 'GeistTabsItem';
var TabsItem = withScale$1(TabsItemComponent);
var TabsItem$1 = TabsItem;
/* eslint-enable */

Tabs$1.Item = TabsItem$1;
Tabs$1.Tab = TabsItem$1;

var _excluded$8 = ["type", "children", "className", "invert"];
var defaultProps$b = {
  type: 'default',
  invert: false,
  className: ''
};

var getColors$1 = function getColors(type, palette, invert) {
  var colors = {
    "default": {
      color: palette.foreground
    },
    success: {
      color: palette.success
    },
    warning: {
      color: palette.warning
    },
    error: {
      color: palette.error
    },
    secondary: {
      color: palette.secondary
    },
    dark: {
      color: palette.foreground,
      bgColor: palette.background
    },
    lite: {
      color: palette.foreground,
      bgColor: palette.accents_2
    }
  };
  var hideBorder = invert || type === 'lite';

  var cardStyle = _objectSpread2(_objectSpread2({}, colors[type]), {}, {
    bgColor: colors[type].bgColor || palette.background,
    borderColor: hideBorder ? 'transparent' : colors[type].color
  });

  return !invert ? cardStyle : _objectSpread2(_objectSpread2({}, cardStyle), {}, {
    color: cardStyle.bgColor,
    bgColor: cardStyle.color
  });
};

var TagComponent = function TagComponent(_ref) {
  var type = _ref.type,
      children = _ref.children,
      className = _ref.className,
      invert = _ref.invert,
      props = _objectWithoutProperties(_ref, _excluded$8);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useMemo = React.useMemo(function () {
    return getColors$1(type, theme.palette, invert);
  }, [type, theme.palette, invert]),
      color = _useMemo.color,
      bgColor = _useMemo.bgColor,
      borderColor = _useMemo.borderColor;

  return /*#__PURE__*/React__default["default"].createElement("span", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3652870078", [borderColor, bgColor, color, SCALES.height(0.3125), SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1.75), SCALES.pt(0.375), SCALES.pr(0.375), SCALES.pb(0.375), SCALES.pl(0.375), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3652870078",
    dynamic: [borderColor, bgColor, color, SCALES.height(0.3125), SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1.75), SCALES.pt(0.375), SCALES.pr(0.375), SCALES.pb(0.375), SCALES.pl(0.375), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, "span.__jsx-style-dynamic-selector{display:inline-block;border:1px solid ".concat(borderColor, ";background-color:").concat(bgColor, ";color:").concat(color, ";box-sizing:border-box;line-height:1em;border-radius:").concat(SCALES.height(0.3125), ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1.75), ";padding:").concat(SCALES.pt(0.375), " ").concat(SCALES.pr(0.375), " ").concat(SCALES.pb(0.375), " ").concat(SCALES.pl(0.375), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}")));
};

TagComponent.defaultProps = defaultProps$b;
TagComponent.displayName = 'GeistTag';
var Tag = withScale$1(TagComponent);
var Tag$1 = Tag;

var _excluded$7 = ["children", "tag", "className", "type"];
var defaultProps$a = {
  type: 'default',
  className: ''
};

var getTypeColor = function getTypeColor(type, palette) {
  var colors = {
    "default": 'inherit',
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error
  };
  return colors[type] || colors["default"];
};

var TextChild = function TextChild(_ref) {
  var children = _ref.children,
      tag = _ref.tag,
      className = _ref.className,
      type = _ref.type,
      props = _objectWithoutProperties(_ref, _excluded$7);

  var Component = tag;
  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES,
      getScaleProps = _useScale.getScaleProps;

  var font = getScaleProps('font');
  var mx = getScaleProps(['margin', 'marginLeft', 'marginRight', 'mx', 'ml', 'mr']);
  var my = getScaleProps(['margin', 'marginTop', 'marginBottom', 'my', 'mt', 'mb']);
  var px = getScaleProps(['padding', 'paddingLeft', 'paddingRight', 'pl', 'pr', 'px']);
  var py = getScaleProps(['padding', 'paddingTop', 'paddingBottom', 'pt', 'pb', 'py']);
  var color = React.useMemo(function () {
    return getTypeColor(type, theme.palette);
  }, [type, theme.palette]);
  var classNames = React.useMemo(function () {
    var keys = [{
      value: mx,
      className: 'mx'
    }, {
      value: my,
      className: 'my'
    }, {
      value: px,
      className: 'px'
    }, {
      value: py,
      className: 'py'
    }, {
      value: font,
      className: 'font'
    }];
    var scaleClassNames = keys.reduce(function (pre, next) {
      if (typeof next.value === 'undefined') return pre;
      return "".concat(pre, " ").concat(next.className);
    }, '');
    return "".concat(scaleClassNames, " ").concat(className).trim();
  }, [mx, my, px, py, font, className]);
  return /*#__PURE__*/React__default["default"].createElement(Component, _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3155699851", [tag, color, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.font(1, 'inherit'), SCALES.ml(0, 'revert'), SCALES.mr(0, 'revert'), SCALES.mt(0, 'revert'), SCALES.mb(0, 'revert'), SCALES.pl(0, 'revert'), SCALES.pr(0, 'revert'), SCALES.pt(0, 'revert'), SCALES.pb(0, 'revert')]]]) + " " + (props && props.className != null && props.className || classNames || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3155699851",
    dynamic: [tag, color, SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.font(1, 'inherit'), SCALES.ml(0, 'revert'), SCALES.mr(0, 'revert'), SCALES.mt(0, 'revert'), SCALES.mb(0, 'revert'), SCALES.pl(0, 'revert'), SCALES.pr(0, 'revert'), SCALES.pt(0, 'revert'), SCALES.pb(0, 'revert')]
  }, "".concat(tag, ".__jsx-style-dynamic-selector{color:").concat(color, ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";}.font.__jsx-style-dynamic-selector{font-size:").concat(SCALES.font(1, 'inherit'), ";}.mx.__jsx-style-dynamic-selector{margin-left:").concat(SCALES.ml(0, 'revert'), ";margin-right:").concat(SCALES.mr(0, 'revert'), ";}.my.__jsx-style-dynamic-selector{margin-top:").concat(SCALES.mt(0, 'revert'), ";margin-bottom:").concat(SCALES.mb(0, 'revert'), ";}.px.__jsx-style-dynamic-selector{padding-left:").concat(SCALES.pl(0, 'revert'), ";padding-right:").concat(SCALES.pr(0, 'revert'), ";}.py.__jsx-style-dynamic-selector{padding-top:").concat(SCALES.pt(0, 'revert'), ";padding-bottom:").concat(SCALES.pb(0, 'revert'), ";}")));
};

TextChild.defaultProps = defaultProps$a;
TextChild.displayName = 'GeistTextChild';
var TextChild$1 = TextChild;

var _excluded$6 = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "b", "small", "i", "span", "del", "em", "blockquote", "children", "className"];
var defaultProps$9 = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  h6: false,
  p: false,
  b: false,
  small: false,
  i: false,
  span: false,
  del: false,
  em: false,
  blockquote: false,
  className: '',
  type: 'default'
};

var getModifierChild = function getModifierChild(tags, children) {
  if (!tags.length) return children;
  var nextTag = tags.slice(1, tags.length);
  return /*#__PURE__*/React__default["default"].createElement(TextChild$1, {
    tag: tags[0]
  }, getModifierChild(nextTag, children));
};

var TextComponent = function TextComponent(_ref) {
  var h1 = _ref.h1,
      h2 = _ref.h2,
      h3 = _ref.h3,
      h4 = _ref.h4,
      h5 = _ref.h5,
      h6 = _ref.h6,
      p = _ref.p,
      b = _ref.b,
      small = _ref.small,
      i = _ref.i,
      span = _ref.span,
      del = _ref.del,
      em = _ref.em,
      blockquote = _ref.blockquote,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$6);

  var elements = {
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
    p: p,
    blockquote: blockquote
  };
  var inlineElements = {
    span: span,
    small: small,
    b: b,
    em: em,
    i: i,
    del: del
  };
  var names = Object.keys(elements).filter(function (name) {
    return elements[name];
  });
  var inlineNames = Object.keys(inlineElements).filter(function (name) {
    return inlineElements[name];
  });
  /**
   *  Render element "p" only if no element is found.
   *  If there is only one modifier, just rendered one modifier element
   *  e.g.
   *    <Text /> => <p />
   *    <Text em /> => <em />
   *    <Text p em /> => <p><em>children</em></p>
   *
   */

  var tag = React.useMemo(function () {
    if (names[0]) return names[0];
    if (inlineNames[0]) return inlineNames[0];
    return 'p';
  }, [names, inlineNames]);
  var renderableChildElements = inlineNames.filter(function (name) {
    return name !== tag;
  });
  var modifers = React.useMemo(function () {
    if (!renderableChildElements.length) return children;
    return getModifierChild(renderableChildElements, children);
  }, [renderableChildElements, children]);
  return /*#__PURE__*/React__default["default"].createElement(TextChild$1, _extends({
    className: className,
    tag: tag
  }, props), modifers);
};

TextComponent.defaultProps = defaultProps$9;
TextComponent.displayName = 'GeistText';
var Text = withScale$1(TextComponent);
var Text$1 = Text;

var getColors = function getColors(palette, status) {
  var colors = {
    "default": {
      bg: palette.success
    },
    secondary: {
      bg: palette.secondary
    },
    success: {
      bg: palette.success
    },
    warning: {
      bg: palette.warning
    },
    error: {
      bg: palette.error
    }
  };
  if (!status) return colors["default"];
  return colors[status];
};

var _excluded$5 = ["initialChecked", "checked", "disabled", "onChange", "type", "className"];
var defaultProps$8 = {
  type: 'default',
  disabled: false,
  initialChecked: false,
  className: ''
};

var ToggleComponent = function ToggleComponent(_ref) {
  var initialChecked = _ref.initialChecked,
      checked = _ref.checked,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      type = _ref.type,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$5);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = React.useState(initialChecked),
      _useState2 = _slicedToArray(_useState, 2),
      selfChecked = _useState2[0],
      setSelfChecked = _useState2[1];

  var classes = useClasses$1('toggle', {
    checked: selfChecked,
    disabled: disabled
  });
  var changeHandle = React.useCallback(function (ev) {
    if (disabled) return;
    var selfEvent = {
      target: {
        checked: !selfChecked
      },
      stopPropagation: ev.stopPropagation,
      preventDefault: ev.preventDefault,
      nativeEvent: ev
    };
    setSelfChecked(!selfChecked);
    onChange && onChange(selfEvent);
  }, [disabled, selfChecked, onChange]);

  var _useMemo = React.useMemo(function () {
    return getColors(theme.palette, type);
  }, [theme.palette, type]),
      bg = _useMemo.bg;

  React.useEffect(function () {
    if (checked === undefined) return;
    setSelfChecked(checked);
  }, [checked]);
  return /*#__PURE__*/React__default["default"].createElement("label", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["4106206985", [disabled ? 'not-allowed' : 'pointer', SCALES.font(1), SCALES.height(0.875), SCALES.width(1.75), SCALES.pt(0.1875), SCALES.pr(0), SCALES.pb(0.1875), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_2, theme.palette.background, theme.palette.accents_2, theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_4, theme.palette.accents_4, bg]]]) + " " + (props && props.className != null && props.className || className || "")
  }), /*#__PURE__*/React__default["default"].createElement("input", {
    type: "checkbox",
    disabled: disabled,
    checked: selfChecked,
    onChange: changeHandle,
    className: styledJsx_cjs.style.dynamic([["4106206985", [disabled ? 'not-allowed' : 'pointer', SCALES.font(1), SCALES.height(0.875), SCALES.width(1.75), SCALES.pt(0.1875), SCALES.pr(0), SCALES.pb(0.1875), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_2, theme.palette.background, theme.palette.accents_2, theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_4, theme.palette.accents_4, bg]]])
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["4106206985", [disabled ? 'not-allowed' : 'pointer', SCALES.font(1), SCALES.height(0.875), SCALES.width(1.75), SCALES.pt(0.1875), SCALES.pr(0), SCALES.pb(0.1875), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_2, theme.palette.background, theme.palette.accents_2, theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_4, theme.palette.accents_4, bg]]]) + " " + (classes || "")
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4106206985", [disabled ? 'not-allowed' : 'pointer', SCALES.font(1), SCALES.height(0.875), SCALES.width(1.75), SCALES.pt(0.1875), SCALES.pr(0), SCALES.pb(0.1875), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_2, theme.palette.background, theme.palette.accents_2, theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_4, theme.palette.accents_4, bg]]]) + " " + "inner"
  })), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4106206985",
    dynamic: [disabled ? 'not-allowed' : 'pointer', SCALES.font(1), SCALES.height(0.875), SCALES.width(1.75), SCALES.pt(0.1875), SCALES.pr(0), SCALES.pb(0.1875), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.palette.accents_2, theme.palette.background, theme.palette.accents_2, theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_4, theme.palette.accents_4, bg]
  }, "label.__jsx-style-dynamic-selector{-webkit-tap-highlight-color:transparent;display:inline-block;vertical-align:middle;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;cursor:".concat(disabled ? 'not-allowed' : 'pointer', ";--toggle-font-size:").concat(SCALES.font(1), ";--toggle-height:").concat(SCALES.height(0.875), ";width:").concat(SCALES.width(1.75), ";height:var(--toggle-height);padding:").concat(SCALES.pt(0.1875), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0.1875), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}input.__jsx-style-dynamic-selector{overflow:hidden;visibility:hidden;height:0;opacity:0;width:0;position:absolute;background-color:transparent;z-index:-1;}.toggle.__jsx-style-dynamic-selector{height:var(--toggle-height);width:100%;border-radius:var(--toggle-height);-webkit-transition-delay:0.12s;transition-delay:0.12s;-webkit-transition-duration:0.2s;transition-duration:0.2s;-webkit-transition-property:background,border;transition-property:background,border;-webkit-transition-timing-function:cubic-bezier(0,0,0.2,1);transition-timing-function:cubic-bezier(0,0,0.2,1);position:relative;border:1px solid transparent;background-color:").concat(theme.palette.accents_2, ";padding:0;}.inner.__jsx-style-dynamic-selector{width:calc(var(--toggle-height) - 2px);height:calc(var(--toggle-height) - 2px);position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);left:1px;box-shadow:rgba(0,0,0,0.2) 0 1px 2px 0,rgba(0,0,0,0.1) 0 1px 3px 0;-webkit-transition:left 280ms cubic-bezier(0,0,0.2,1);transition:left 280ms cubic-bezier(0,0,0.2,1);border-radius:50%;background-color:").concat(theme.palette.background, ";}.disabled.__jsx-style-dynamic-selector{border-color:").concat(theme.palette.accents_2, ";background-color:").concat(theme.palette.accents_1, ";}.disabled.__jsx-style-dynamic-selector>.inner.__jsx-style-dynamic-selector{background-color:").concat(theme.palette.accents_2, ";}.disabled.checked.__jsx-style-dynamic-selector{border-color:").concat(theme.palette.accents_4, ";background-color:").concat(theme.palette.accents_4, ";}.checked.__jsx-style-dynamic-selector{background-color:").concat(bg, ";}.checked.__jsx-style-dynamic-selector>.inner.__jsx-style-dynamic-selector{left:calc(100% - (var(--toggle-height) - 2px));box-shadow:none;}")));
};

ToggleComponent.defaultProps = defaultProps$8;
ToggleComponent.displayName = 'GeistToggle';
var Toggle = withScale$1(ToggleComponent);
var Toggle$1 = Toggle;

var defaultProps$7 = {
  width: 22,
  height: 22
};

var TreeFileIcon = function TreeFileIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M13 2v7h7",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeFileIcon.defaultProps = defaultProps$7;
TreeFileIcon.displayName = 'GeistTreeFileIcon';
var TreeFileIcon$1 = TreeFileIcon;

var defaultContext = {
  initialExpand: false,
  isImperative: false
};
var TreeContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var useTreeContext = function useTreeContext() {
  return React__default["default"].useContext(TreeContext);
};

var TreeIndents = function TreeIndents(_ref) {
  var count = _ref.count;
  if (count === 0) return null;
  return (
    /*#__PURE__*/

    /* eslint-disable react/jsx-no-useless-fragment */
    React__default["default"].createElement(React__default["default"].Fragment, null, _toConsumableArray(new Array(count)).map(function (_, index) {
      return /*#__PURE__*/React__default["default"].createElement("span", {
        key: "indent-".concat(index),
        className: styledJsx_cjs.style.dynamic([["2622387629", [index + 1]]]) + " " + "indent"
      }, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
        id: "2622387629",
        dynamic: [index + 1]
      }, "span.indent.__jsx-style-dynamic-selector{left:calc(-1.875rem * ".concat(index + 1, " + 0.75rem);}")));
    }))
    /* eslint-enable */

  );
};

var TreeIndents$1 = TreeIndents;

var sortChildren = function sortChildren(children, folderComponentType) {
  return React__default["default"].Children.toArray(children).sort(function (a, b) {
    if (! /*#__PURE__*/React__default["default"].isValidElement(a) || ! /*#__PURE__*/React__default["default"].isValidElement(b)) return 0;
    if (a.type !== b.type) return a.type !== folderComponentType ? 1 : -1;
    return "".concat(a.props.name).charCodeAt(0) - "".concat(b.props.name).charCodeAt(0);
  });
};
var makeChildPath = function makeChildPath(name, parentPath) {
  if (!parentPath) return name;
  return "".concat(parentPath, "/").concat(name);
};
var stopPropagation = function stopPropagation(event) {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

var _excluded$4 = ["name", "parentPath", "level", "extra", "className"];
var defaultProps$6 = {
  level: 0,
  className: '',
  parentPath: ''
};

var TreeFile = function TreeFile(_ref) {
  var name = _ref.name,
      parentPath = _ref.parentPath,
      level = _ref.level,
      extra = _ref.extra,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$4);

  var theme = useTheme();

  var _useTreeContext = useTreeContext(),
      onFileClick = _useTreeContext.onFileClick;

  var currentPath = React.useMemo(function () {
    return makeChildPath(name, parentPath);
  }, []);

  var clickHandler = function clickHandler(event) {
    stopPropagation(event);
    onFileClick && onFileClick(currentPath);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + (props && props.className != null && props.className || useClasses$1('file', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "names"
  }, /*#__PURE__*/React__default["default"].createElement(TreeIndents$1, {
    count: level
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement(TreeFileIcon$1, null)), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "name"
  }, name, extra && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["4220802947", [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "extra"
  }, extra))), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4220802947",
    dynamic: [level, theme.palette.accents_2, theme.palette.accents_8, theme.palette.accents_5]
  }, ".file.__jsx-style-dynamic-selector{cursor:pointer;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin-left:calc(1.875rem * ".concat(level, ");}.names.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.75rem;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:relative;}.names.__jsx-style-dynamic-selector>.indent{position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:1px;height:100%;background-color:").concat(theme.palette.accents_2, ";margin-left:-1px;}.icon.__jsx-style-dynamic-selector{width:1.5rem;height:100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-right:0.5rem;}.name.__jsx-style-dynamic-selector{-webkit-transition:opacity 100ms ease 0ms;transition:opacity 100ms ease 0ms;color:").concat(theme.palette.accents_8, ";white-space:nowrap;font-size:0.875rem;}.extra.__jsx-style-dynamic-selector{font-size:0.75rem;-webkit-align-self:baseline;-ms-flex-item-align:baseline;align-self:baseline;padding-left:4px;color:").concat(theme.palette.accents_5, ";}.name.__jsx-style-dynamic-selector:hover{opacity:0.7;}")));
};

TreeFile.defaultProps = defaultProps$6;
TreeFile.displayName = 'GeistTreeFile';
var TreeFile$1 = TreeFile;

var defaultProps$5 = {
  width: 22,
  height: 22
};

var TreeFolderIcon = function TreeFolderIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M2.707 7.454V5.62C2.707 4.725 3.469 4 4.409 4h4.843c.451 0 .884.17 1.204.474l.49.467c.126.12.296.186.473.186h8.399c.94 0 1.55.695 1.55 1.59v.737m-18.661 0h-.354a.344.344 0 00-.353.35l.508 11.587c.015.34.31.609.668.609h17.283c.358 0 .652-.269.667-.61L22 7.805a.344.344 0 00-.353-.35h-.278m-18.662 0h18.662",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeFolderIcon.defaultProps = defaultProps$5;
TreeFolderIcon.displayName = 'GeistTreeFolderIcon';
var TreeFolderIcon$1 = TreeFolderIcon;

var defaultProps$4 = {
  width: 12,
  height: 12,
  active: false
};

var TreeStatusIcon = function TreeStatusIcon(_ref) {
  var color = _ref.color,
      width = _ref.width,
      height = _ref.height,
      active = _ref.active;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    viewBox: "0 0 24 24",
    width: width,
    height: height,
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }, /*#__PURE__*/React__default["default"].createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), !active && /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M12 8v8",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8 12h8",
    className: styledJsx_cjs.style.dynamic([["4043754792", [color || theme.palette.accents_8]]])
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "4043754792",
    dynamic: [color || theme.palette.accents_8]
  }, "svg.__jsx-style-dynamic-selector{color:".concat(color || theme.palette.accents_8, ";}")));
};

TreeStatusIcon.defaultProps = defaultProps$4;
TreeStatusIcon.displayName = 'GeistTreeStatusIcon';
var TreeStatusIcon$1 = TreeStatusIcon;

var _excluded$3 = ["name", "children", "parentPath", "level", "extra", "className"];
var defaultProps$3 = {
  level: 0,
  className: '',
  parentPath: ''
};

var TreeFolder = function TreeFolder(_ref) {
  var name = _ref.name,
      children = _ref.children,
      parentPath = _ref.parentPath,
      parentLevel = _ref.level,
      extra = _ref.extra,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$3);

  var theme = useTheme();

  var _useTreeContext = useTreeContext(),
      initialExpand = _useTreeContext.initialExpand,
      isImperative = _useTreeContext.isImperative;

  var _useState = React.useState(initialExpand),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  React.useEffect(function () {
    return setExpanded(initialExpand);
  }, []);
  var currentPath = React.useMemo(function () {
    return makeChildPath(name, parentPath);
  }, []);

  var clickHandler = function clickHandler() {
    return setExpanded(!expanded);
  };

  var nextChildren = setChildrenProps(children, {
    parentPath: currentPath,
    level: parentLevel + 1
  }, [TreeFolder, TreeFile$1]);
  var sortedChildren = isImperative ? nextChildren : sortChildren(nextChildren, TreeFolder);
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({
    onClick: clickHandler
  }, props, {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + (props && props.className != null && props.className || useClasses$1('folder', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "names"
  }, /*#__PURE__*/React__default["default"].createElement(TreeIndents$1, {
    count: parentLevel
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "status"
  }, /*#__PURE__*/React__default["default"].createElement(TreeStatusIcon$1, {
    active: expanded
  })), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "icon"
  }, /*#__PURE__*/React__default["default"].createElement(TreeFolderIcon$1, null)), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "name"
  }, name, extra && /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "extra"
  }, extra))), /*#__PURE__*/React__default["default"].createElement(Expand$1, {
    isExpanded: expanded
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: stopPropagation,
    className: styledJsx_cjs.style.dynamic([["1983983326", [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]]]) + " " + "content"
  }, sortedChildren)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1983983326",
    dynamic: [parentLevel, theme.palette.accents_2, theme.palette.background, theme.palette.accents_8, theme.palette.accents_5]
  }, ".folder.__jsx-style-dynamic-selector{cursor:pointer;line-height:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.names.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:1.75rem;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-left:calc(1.875rem * ".concat(parentLevel, ");position:relative;}.names.__jsx-style-dynamic-selector>.indent{position:absolute;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:1px;height:100%;background-color:").concat(theme.palette.accents_2, ";margin-left:-1px;}.status.__jsx-style-dynamic-selector{position:absolute;left:calc(-1.125rem);top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:0.875rem;height:0.875rem;z-index:10;background-color:").concat(theme.palette.background, ";}.icon.__jsx-style-dynamic-selector{width:1.5rem;height:100%;margin-right:0.5rem;}.status.__jsx-style-dynamic-selector,.icon.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}.name.__jsx-style-dynamic-selector{-webkit-transition:opacity 100ms ease 0ms;transition:opacity 100ms ease 0ms;color:").concat(theme.palette.accents_8, ";white-space:nowrap;font-size:0.875rem;}.extra.__jsx-style-dynamic-selector{font-size:0.75rem;-webkit-align-self:baseline;-ms-flex-item-align:baseline;align-self:baseline;padding-left:4px;color:").concat(theme.palette.accents_5, ";}.name.__jsx-style-dynamic-selector:hover{opacity:0.7;}.content.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:auto;}")));
};

TreeFolder.defaultProps = defaultProps$3;
TreeFolder.displayName = 'GeistTreeFolder';
var TreeFolder$1 = TreeFolder;

var _excluded$2 = ["children", "onClick", "initialExpand", "value", "className"];
var FileTreeValueType = tuple('directory', 'file');
var directoryType = FileTreeValueType[0];
var defaultProps$2 = {
  initialExpand: false,
  className: ''
};

var makeChildren = function makeChildren() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!value || !value.length) return null;
  return value.sort(function (a, b) {
    if (a.type !== b.type) return a.type !== directoryType ? 1 : -1;
    return "".concat(a.name).charCodeAt(0) - "".concat(b.name).charCodeAt(0);
  }).map(function (item, index) {
    if (item.type === directoryType) return /*#__PURE__*/React__default["default"].createElement(TreeFolder$1, {
      name: item.name,
      extra: item.extra,
      key: "folder-".concat(item.name, "-").concat(index)
    }, makeChildren(item.files));
    return /*#__PURE__*/React__default["default"].createElement(TreeFile$1, {
      name: item.name,
      extra: item.extra,
      key: "file-".concat(item.name, "-").concat(index)
    });
  });
};

var Tree = function Tree(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      initialExpand = _ref.initialExpand,
      value = _ref.value,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$2);

  var isImperative = Boolean(value && value.length > 0);

  var onFileClick = function onFileClick(path) {
    onClick && onClick(path);
  };

  var initialValue = React.useMemo(function () {
    return {
      onFileClick: onFileClick,
      initialExpand: initialExpand,
      isImperative: isImperative
    };
  }, [initialExpand]);
  var customChildren = isImperative ? makeChildren(value) : sortChildren(children, TreeFolder$1);
  return /*#__PURE__*/React__default["default"].createElement(TreeContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: "jsx-2273069862" + " " + (props && props.className != null && props.className || useClasses$1('tree', className) || "")
  }), customChildren, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2273069862"
  }, ".tree.jsx-2273069862{padding-left:1.625rem;}")));
};

Tree.defaultProps = defaultProps$2;
Tree.displayName = 'GeistTree';
var Tree$1 = Tree;

Tree$1.File = TreeFile$1;
Tree$1.Folder = TreeFolder$1;

var useAllThemes = useAllThemes$1;

var _excluded$1 = ["src", "text", "name", "children", "className", "altText"];
var defaultProps$1 = {
  className: ''
};

var UserComponent = function UserComponent(_ref) {
  var src = _ref.src,
      text = _ref.text,
      name = _ref.name,
      children = _ref.children,
      className = _ref.className,
      altText = _ref.altText,
      props = _objectWithoutProperties(_ref, _excluded$1);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES,
      getScaleProps = _useScale.getScaleProps;

  var scale = getScaleProps('scale');
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["3188576998", [SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.5), SCALES.pb(0), SCALES.pl(0.5), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapHalf, theme.palette.accents_8, theme.palette.accents_6]]]) + " " + (props && props.className != null && props.className || useClasses$1('user', className) || "")
  }), /*#__PURE__*/React__default["default"].createElement(Avatar$1, {
    src: src,
    scale: scale,
    text: text,
    alt: altText
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: styledJsx_cjs.style.dynamic([["3188576998", [SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.5), SCALES.pb(0), SCALES.pl(0.5), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapHalf, theme.palette.accents_8, theme.palette.accents_6]]]) + " " + "names"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3188576998", [SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.5), SCALES.pb(0), SCALES.pl(0.5), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapHalf, theme.palette.accents_8, theme.palette.accents_6]]]) + " " + "name"
  }, name), /*#__PURE__*/React__default["default"].createElement("span", {
    className: styledJsx_cjs.style.dynamic([["3188576998", [SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.5), SCALES.pb(0), SCALES.pl(0.5), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapHalf, theme.palette.accents_8, theme.palette.accents_6]]]) + " " + "social"
  }, children)), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3188576998",
    dynamic: [SCALES.font(1), SCALES.width(1, 'max-content'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0.5), SCALES.pb(0), SCALES.pl(0.5), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), theme.layout.gapHalf, theme.palette.accents_8, theme.palette.accents_6]
  }, ".user.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;max-width:100%;--user-font-size:".concat(SCALES.font(1), ";font-size:var(--user-font-size);width:").concat(SCALES.width(1, 'max-content'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0.5), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0.5), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.names.__jsx-style-dynamic-selector{font-size:inherit;margin-left:").concat(theme.layout.gapHalf, ";display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;white-space:nowrap;}.name.__jsx-style-dynamic-selector{font-size:calc(0.89 * var(--user-font-size));color:").concat(theme.palette.accents_8, ";line-height:1.1em;text-transform:capitalize;font-weight:500;max-width:15rem;text-overflow:ellipsis;overflow:hidden;}.social.__jsx-style-dynamic-selector{font-size:calc(0.75 * var(--user-font-size));color:").concat(theme.palette.accents_6, ";}.social.__jsx-style-dynamic-selector *:first-child{margin-top:0;}.social.__jsx-style-dynamic-selector *:last-child{margin-bottom:0;}")));
};

UserComponent.defaultProps = defaultProps$1;
UserComponent.displayName = 'GeistUser';
var User = withScale$1(UserComponent);
var User$1 = User;

var _excluded = ["href", "className", "children"];
var defaultProps = {
  className: ''
};
var UserLink = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var href = _ref.href,
      className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: "jsx-3263947648" + " " + (props && props.className != null && props.className || className || "")
  }), /*#__PURE__*/React__default["default"].createElement(Link$1, {
    ref: ref,
    href: href,
    color: true,
    target: "_blank",
    rel: "noopener"
  }, children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "3263947648"
  }, "div.jsx-3263947648 a:hover{opacity:0.7;}"));
});
UserLink.defaultProps = defaultProps;
UserLink.displayName = 'GeistUserLink';
var UserLink$1 = UserLink;

User$1.Link = UserLink$1;

tuple('xs', 'sm', 'md', 'lg', 'xl', 'mobile');
tuple('up', 'down', 'default');
var defaultResponsiveOptions = {
  match: 'default'
};

var makeQueries = function makeQueries(bp, up, down) {
  var queryString = function queryString(item) {
    var upQuery = "(min-width: ".concat(item.min, ")");
    var downQuery = "(max-width: ".concat(item.max, ")");
    return up ? upQuery : down ? downQuery : "".concat(upQuery, " and ").concat(downQuery);
  };

  var xs = queryString(bp.xs);
  return {
    xs: xs,
    mobile: xs,
    sm: queryString(bp.sm),
    md: queryString(bp.md),
    lg: queryString(bp.lg),
    xl: queryString(bp.xl)
  };
};

var useMediaQuery = function useMediaQuery(breakpoint) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultResponsiveOptions;
  var _options$match = options.match,
      matchType = _options$match === void 0 ? 'default' : _options$match,
      _options$ssrMatchMedi = options.ssrMatchMedia,
      ssrMatchMedia = _options$ssrMatchMedi === void 0 ? null : _options$ssrMatchMedi;
  var supportMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';
  var theme = useTheme();
  var mediaQueries = React.useMemo(function () {
    var up = matchType === 'up';
    var down = matchType === 'down';
    return makeQueries(theme.breakpoints, up, down);
  }, [theme.breakpoints, options]);
  var query = React.useMemo(function () {
    return mediaQueries[breakpoint];
  }, [mediaQueries, breakpoint]);

  var matchQuery = function matchQuery(q) {
    return window.matchMedia(q);
  };
  /**
   * Do nothing in the server-side rendering.
   * If server match query fucntion is simulated, return user-defined value first.
   */


  var _useState = React.useState(function () {
    if (supportMedia) return matchQuery(query).matches;

    if (ssrMatchMedia && typeof ssrMatchMedia === 'function') {
      return ssrMatchMedia(query).matches;
    }

    return false;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  React.useEffect(function () {
    if (!supportMedia) return;
    var queryList = matchQuery(query);

    var update = function update() {
      return setState(matchQuery(query).matches);
    };

    update();
    /**
     * addListener is deprecated. EventTarget.addEventListener is recommended.
     * But in some old browsers, MediaQueryList does not inherit from EventTarget.
     */

    queryList.addListener(update);
    return function () {
      queryList.removeListener(update);
    };
  }, [supportMedia]);
  return state;
};

var useMediaQuery$1 = useMediaQuery;

var useInput = function useInput(initialValue) {
  var _useCurrentState = useCurrentState$1(initialValue),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      state = _useCurrentState2[0],
      setState = _useCurrentState2[1],
      currentRef = _useCurrentState2[2];

  return {
    state: state,
    setState: setState,
    currentRef: currentRef,
    reset: function reset() {
      return setState(initialValue);
    },
    bindings: {
      value: state,
      onChange: function onChange(event) {
        if (_typeof(event) === 'object' && event.target) {
          setState(event.target.value);
        } else {
          setState(event);
        }
      }
    }
  };
};

var useInput$1 = useInput;

var useModal = function useModal() {
  var initialVisible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var _useCurrentState = useCurrentState$1(initialVisible),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      visible = _useCurrentState2[0],
      setVisible = _useCurrentState2[1],
      currentRef = _useCurrentState2[2];

  return {
    visible: visible,
    setVisible: setVisible,
    currentRef: currentRef,
    bindings: {
      visible: visible,
      onClose: function onClose() {
        return setVisible(false);
      }
    }
  };
};

var useModal$1 = useModal;

var useTabs = function useTabs(initialValue) {
  var _useCurrentState = useCurrentState$1(initialValue),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      state = _useCurrentState2[0],
      setState = _useCurrentState2[1],
      currentRef = _useCurrentState2[2];

  return {
    state: state,
    setState: setState,
    currentRef: currentRef,
    bindings: {
      value: state,
      onChange: function onChange(val) {
        setState(val);
      }
    }
  };
};

var useTabs$1 = useTabs;

var CssBaseline = function CssBaseline(_ref) {
  var children = _ref.children;
  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "1357910706",
    dynamic: [theme.palette.background, theme.palette.foreground, theme.palette.background, theme.font.sans, theme.font.sans, theme.palette.link, theme.expressiveness.linkStyle, theme.expressiveness.linkHoverStyle, theme.layout.gapHalf, theme.layout.gapHalf, theme.layout.gapHalf, theme.layout.gap, theme.palette.foreground, theme.palette.accents_4, theme.palette.code, theme.font.mono, theme.layout.gap, theme.layout.gap, theme.layout.gap, theme.palette.accents_2, theme.layout.radius, theme.font.mono, theme.palette.foreground, theme.palette.accents_2, theme.palette.accents_1, theme.layout.gap, theme.layout.gap, theme.palette.accents_5, theme.palette.accents_1, theme.layout.radius, theme.palette.border, theme.palette.selection, theme.palette.foreground]
  }, "html,body{background-color:".concat(theme.palette.background, ";color:").concat(theme.palette.foreground, ";}html{font-size:16px;--geist-icons-background:").concat(theme.palette.background, ";}body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;font-size:1rem;line-height:1.5;margin:0;padding:0;min-height:100%;position:relative;overflow-x:hidden;font-family:").concat(theme.font.sans, ";}#__next{overflow-x:hidden;}*,*:before,*:after{box-sizing:inherit;text-rendering:geometricPrecision;-webkit-tap-highlight-color:transparent;}p,small{font-weight:400;color:inherit;-webkit-letter-spacing:-0.005625em;-moz-letter-spacing:-0.005625em;-ms-letter-spacing:-0.005625em;letter-spacing:-0.005625em;font-family:").concat(theme.font.sans, ";}p{margin:1em 0;font-size:1em;line-height:1.625em;}small{margin:0;line-height:1.5;font-size:0.875em;}b{font-weight:600;}span{font-size:inherit;color:inherit;font-weight:inherit;}img{max-width:100%;}a{cursor:pointer;font-size:inherit;-webkit-touch-callout:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-box-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:").concat(theme.palette.link, ";-webkit-text-decoration:").concat(theme.expressiveness.linkStyle, ";text-decoration:").concat(theme.expressiveness.linkStyle, ";}a:hover{-webkit-text-decoration:").concat(theme.expressiveness.linkHoverStyle, ";text-decoration:").concat(theme.expressiveness.linkHoverStyle, ";}ul,ol{padding:0;list-style-type:none;margin:").concat(theme.layout.gapHalf, " ").concat(theme.layout.gapHalf, " ").concat(theme.layout.gapHalf, " ").concat(theme.layout.gap, ";color:").concat(theme.palette.foreground, ";}ol{list-style-type:decimal;}li{margin-bottom:0.625em;font-size:1em;line-height:1.625em;}ul li:before{content:'\u2013';display:inline-block;color:").concat(theme.palette.accents_4, ";position:absolute;margin-left:-0.9375em;}h1,h2,h3,h4,h5,h6{color:inherit;margin:0 0 0.7rem 0;}h1{font-size:3rem;-webkit-letter-spacing:-0.02em;-moz-letter-spacing:-0.02em;-ms-letter-spacing:-0.02em;letter-spacing:-0.02em;line-height:1.5;font-weight:700;}h2{font-size:2.25rem;-webkit-letter-spacing:-0.02em;-moz-letter-spacing:-0.02em;-ms-letter-spacing:-0.02em;letter-spacing:-0.02em;font-weight:600;}h3{font-size:1.5rem;-webkit-letter-spacing:-0.02em;-moz-letter-spacing:-0.02em;-ms-letter-spacing:-0.02em;letter-spacing:-0.02em;font-weight:600;}h4{font-size:1.25rem;-webkit-letter-spacing:-0.02em;-moz-letter-spacing:-0.02em;-ms-letter-spacing:-0.02em;letter-spacing:-0.02em;font-weight:600;}h5{font-size:1rem;-webkit-letter-spacing:-0.01em;-moz-letter-spacing:-0.01em;-ms-letter-spacing:-0.01em;letter-spacing:-0.01em;font-weight:600;}h6{font-size:0.875rem;-webkit-letter-spacing:-0.005em;-moz-letter-spacing:-0.005em;-ms-letter-spacing:-0.005em;letter-spacing:-0.005em;font-weight:600;}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit;color:inherit;margin:0;}button:focus,input:focus,select:focus,textarea:focus{outline:none;}code{color:").concat(theme.palette.code, ";font-family:").concat(theme.font.mono, ";font-size:0.9em;white-space:pre-wrap;}code:before,code:after{content:'\\`';}pre{padding:calc(").concat(theme.layout.gap, " * 0.9) ").concat(theme.layout.gap, ";margin:").concat(theme.layout.gap, " 0;border:1px solid ").concat(theme.palette.accents_2, ";border-radius:").concat(theme.layout.radius, ";font-family:").concat(theme.font.mono, ";white-space:pre;overflow:auto;line-height:1.5;text-align:left;font-size:14px;-webkit-overflow-scrolling:touch;}pre code{color:").concat(theme.palette.foreground, ";font-size:1em;line-height:1.25em;white-space:pre;}pre code:before,pre code:after{display:none;}pre p{margin:0;}pre::-webkit-scrollbar{display:none;width:0;height:0;background:transparent;}hr{border-color:").concat(theme.palette.accents_2, ";}details{background-color:").concat(theme.palette.accents_1, ";border:none;}details:focus,details:hover,details:active{outline:none;}summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;list-style:none;outline:none;}summary::marker,summary::before,summary::-webkit-details-marker{display:none;}summary::-moz-list-bullet{font-size:0;}summary:focus,summary:hover,summary:active{outline:none;list-style:none;}blockquote{padding:calc(0.667 * ").concat(theme.layout.gap, ") ").concat(theme.layout.gap, ";color:").concat(theme.palette.accents_5, ";background-color:").concat(theme.palette.accents_1, ";border-radius:").concat(theme.layout.radius, ";margin:1.5em 0;border:1px solid ").concat(theme.palette.border, ";}blockquote *:first-child{margin-top:0;}blockquote *:last-child{margin-bottom:0;}::selection{background-color:").concat(theme.palette.selection, ";color:").concat(theme.palette.foreground, ";}")));
};

var MemoCssBaseline = /*#__PURE__*/React__default["default"].memo(CssBaseline);
MemoCssBaseline.flush = styledJsx_cjs.server;
MemoCssBaseline.flushToHTML = styledJsx_cjs.server.flushToHTML;
var MemoCssBaseline$1 = MemoCssBaseline;

exports.AutoComplete = AutoComplete$1;
exports.Avatar = Avatar$1;
exports.Badge = Badge$1;
exports.Breadcrumbs = Breadcrumbs$1;
exports.Button = Button$1;
exports.ButtonDropdown = ButtonDropdown$1;
exports.ButtonGroup = ButtonGroup$1;
exports.Capacity = Capacity$1;
exports.Card = Card$1;
exports.Checkbox = Checkbox$1;
exports.Code = Code$1;
exports.Collapse = Collapse$1;
exports.CssBaseline = MemoCssBaseline$1;
exports.Description = Description$1;
exports.Display = Display$1;
exports.Divider = Divider$1;
exports.Dot = Dot$1;
exports.Drawer = Drawer$1;
exports.Fieldset = Fieldset$1;
exports.GeistProvider = GeistProvider$1;
exports.Grid = Grid$1;
exports.Highlight = Highlight$1;
exports.Image = Image$1;
exports.Input = Input$1;
exports.Keyboard = Keyboard$1;
exports.Link = Link$1;
exports.Loading = Loading$1;
exports.Modal = Modal$1;
exports.Note = Note$1;
exports.Page = Page$1;
exports.Pagination = Pagination$1;
exports.Popover = Popover$1;
exports.Progress = Progress$1;
exports.Radio = Radio$1;
exports.Rating = Rating$1;
exports.ScaleContext = ScaleContext;
exports.ScalePropKeys = ScalePropKeys;
exports.Select = Select$1;
exports.Slider = Slider$1;
exports.Snippet = Snippet$1;
exports.Spacer = Spacer$1;
exports.Spinner = Spinner$1;
exports.Table = Table$1;
exports.Tabs = Tabs$1;
exports.Tag = Tag$1;
exports.Text = Text$1;
exports.Textarea = Textarea$1;
exports.Themes = Themes$1;
exports.Toggle = Toggle$1;
exports.Tooltip = Tooltip$1;
exports.Tree = Tree$1;
exports.User = User$1;
exports.useAllThemes = useAllThemes;
exports.useBodyScroll = useBodyScroll$1;
exports.useClasses = useClasses$1;
exports.useClickAway = useClickAway$1;
exports.useClipboard = useClipboard$1;
exports.useCurrentState = useCurrentState$1;
exports.useInput = useInput$1;
exports.useKeyboard = useKeyboard$1;
exports.useMediaQuery = useMediaQuery$1;
exports.useModal = useModal$1;
exports.useRect = useRect;
exports.useScale = useScale;
exports.useTabs = useTabs$1;
exports.useTheme = useTheme;
exports.useToasts = useToasts$1;
exports.withScale = withScale$1;
