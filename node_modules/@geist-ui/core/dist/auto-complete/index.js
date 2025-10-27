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

var getColors = function getColors(palette, status) {
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

var defaultProps$8 = {
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

var getId = function getId() {
  return Math.random().toString(32).slice(2, 10);
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
var isBrowser = function isBrowser() {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
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

var _excluded$6 = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$6);

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

var _excluded$5 = ["label", "labelRight", "type", "htmlType", "icon", "iconRight", "iconClickable", "onIconClick", "initialValue", "onChange", "readOnly", "value", "onClearClick", "clearable", "className", "onBlur", "onFocus", "autoComplete", "placeholder", "children", "disabled"];

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
      props = _objectWithoutProperties(_ref, _excluded$5);

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
    return getColors(theme.palette, type);
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
InputComponent.defaultProps = defaultProps$8;
InputComponent.displayName = 'GeistInput';
var Input = withScale$1(InputComponent);
var Input$1 = Input;

var tuple = function tuple() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
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

var _excluded$4 = ["type", "disabled", "readOnly", "onFocus", "onBlur", "className", "initialValue", "onChange", "value", "placeholder", "resize"];
tuple('none', 'both', 'horizontal', 'vertical', 'initial', 'inherit');
var defaultProps$7 = {
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
      props = _objectWithoutProperties(_ref, _excluded$4);

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
    return getColors(theme.palette, type);
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
TextareaComponent.defaultProps = defaultProps$7;
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

var _excluded$3 = ["hideToggle", "children"];

var passwordDefaultProps = _objectSpread2(_objectSpread2({}, defaultProps$8), {}, {
  hideToggle: false
});

var InputPasswordComponent = /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
  var hideToggle = _ref.hideToggle,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$3);

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

var defaultContext = {
  visible: false
};
var AutoCompleteContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
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

var defaultProps$6 = {};

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

AutoCompleteItemComponent.defaultProps = defaultProps$6;
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

var _excluded$2 = ["children", "className", "visible", "enterTime", "leaveTime", "clearTime", "name"];
var defaultProps$5 = {
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
      props = _objectWithoutProperties(_ref, _excluded$2);

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

CssTransition.defaultProps = defaultProps$5;
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

var defaultProps$4 = {
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

AutoCompleteDropdown.defaultProps = defaultProps$4;
AutoCompleteDropdown.displayName = 'GeistAutoCompleteDropdown';
var AutoCompleteDropdown$1 = AutoCompleteDropdown;

var defaultProps$3 = {
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

AutoCompleteSearchComponent.defaultProps = defaultProps$3;
AutoCompleteSearchComponent.displayName = 'GeistAutoCompleteSearch';
var AutoCompleteSearch = withScale$1(AutoCompleteSearchComponent);
var AutoCompleteSearching = AutoCompleteSearch;

var defaultProps$2 = {
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

AutoCompleteEmpty.defaultProps = defaultProps$2;
AutoCompleteEmpty.displayName = 'GeistAutoCompleteEmpty';
var AutoCompleteEmpty$1 = AutoCompleteEmpty;

var _excluded$1 = ["children", "type", "color", "className", "spaceRatio"];
var defaultProps$1 = {
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
      props = _objectWithoutProperties(_ref, _excluded$1);

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

LoadingComponent.defaultProps = defaultProps$1;
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

var _excluded = ["options", "initialValue", "onSelect", "onSearch", "onChange", "searching", "children", "type", "value", "clearable", "disabled", "dropdownClassName", "dropdownStyle", "disableMatchWidth", "disableFreeSolo", "getPopupContainer"];
var defaultProps = {
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
      props = _objectWithoutProperties(_ref, _excluded);

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
AutoCompleteComponent.defaultProps = defaultProps;
AutoCompleteComponent.displayName = 'GeistAutoComplete';
var AutoComplete = withScale$1(AutoCompleteComponent);
var AutoComplete$1 = AutoComplete;

AutoComplete$1.Item = AutoCompleteItem$1;
AutoComplete$1.Option = AutoCompleteItem$1;
AutoComplete$1.Searching = AutoCompleteSearching;
AutoComplete$1.Empty = AutoCompleteEmpty$1;

exports["default"] = AutoComplete$1;
