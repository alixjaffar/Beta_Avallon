'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styledJsx_cjs = require('../styled-jsx.cjs.js');
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

var defaultContext$1 = {
  inGroup: false
};
var TabsContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
var useTabsContext = function useTabsContext() {
  return React__default["default"].useContext(TabsContext);
};

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

var isGeistElement = function isGeistElement(el) {
  if (!el) return false;
  if (el !== null && el !== void 0 && el.dataset && el !== null && el !== void 0 && el.dataset['geist']) return true;
  el.attributes.getNamedItem('data-geist');
  return !!el.attributes.getNamedItem('data-geist');
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

var _excluded$2 = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$2);

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
var defaultRect = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0,
  height: 0,
  elementTop: -1000
};

var getRectFromDOMWithContainer = function getRectFromDOMWithContainer(domRect, getContainer) {
  if (!domRect) return defaultRect;
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
  return rect.top === defaultRect.top && rect.left === defaultRect.left;
};
var getRefRect = function getRefRect(ref, getContainer) {
  if (!ref || !ref.current) return defaultRect;
  var rect = ref.current.getBoundingClientRect();
  return getRectFromDOMWithContainer(rect, getContainer);
};
var getEventRect = function getEventRect(event, getContainer) {
  var _event$target;

  var rect = event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.getBoundingClientRect();
  if (!rect) return defaultRect;
  return getRectFromDOMWithContainer(rect, getContainer);
};

var isRefTarget = function isRefTarget(eventOrRef) {
  return typeof (eventOrRef === null || eventOrRef === void 0 ? void 0 : eventOrRef.target) === 'undefined';
};

var useRect = function useRect(initialState) {
  var _useState = React.useState(initialState || defaultRect),
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

var usePrevious = function usePrevious(state) {
  var ref = React.useRef(null);
  React.useEffect(function () {
    ref.current = state;
  });
  return ref ? ref.current : null;
};

var usePrevious$1 = usePrevious;

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

var _excluded$1 = ["rect", "visible", "hoverHeightRatio", "hoverWidthRatio", "activeOpacity", "className"];

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
      props = _objectWithoutProperties(_ref, _excluded$1);

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

var _excluded = ["initialValue", "value", "hideDivider", "hideBorder", "children", "onChange", "className", "leftSpace", "highlight", "hoverHeightRatio", "hoverWidthRatio", "activeClassName", "activeStyle", "align"];
var defaultProps$1 = {
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
      props = _objectWithoutProperties(_ref, _excluded);

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

TabsComponent.defaultProps = defaultProps$1;
TabsComponent.displayName = 'GeistTabs';
var Tabs = withScale$1(TabsComponent);
var Tabs$1 = Tabs;

var defaultProps = {
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

TabsItemComponent.defaultProps = defaultProps;
TabsItemComponent.displayName = 'GeistTabsItem';
var TabsItem = withScale$1(TabsItemComponent);
var TabsItem$1 = TabsItem;
/* eslint-enable */

Tabs$1.Item = TabsItem$1;
Tabs$1.Tab = TabsItem$1;

exports["default"] = Tabs$1;
