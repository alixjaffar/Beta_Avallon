'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactDom = require('react-dom');
var styledJsx_cjs = require('../styled-jsx.cjs.js');

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
var isChildElement = function isChildElement(parent, child) {
  if (!parent || !child) return false;
  var node = child;

  while (node) {
    if (node === parent) return true;
    node = node.parentNode;
  }

  return false;
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

var _excluded$7 = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$7);

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
  var elRef = elementRef || React.useRef(document.body);

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hidden = _useState2[0],
      setHidden = _useState2[1];

  var safeOptions = _objectSpread2(_objectSpread2({}, defaultOptions), options || {});

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
var KeyCode;

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
})(KeyCode || (KeyCode = {}));

var KeyMod;

(function (KeyMod) {
  KeyMod[KeyMod["CtrlCmd"] = 2048] = "CtrlCmd";
  KeyMod[KeyMod["Shift"] = 1024] = "Shift";
  KeyMod[KeyMod["Alt"] = 512] = "Alt";
  KeyMod[KeyMod["WinCtrl"] = 256] = "WinCtrl";
})(KeyMod || (KeyMod = {}));

/* istanbul ignore next */

var getCtrlKeysByPlatform = function getCtrlKeysByPlatform() {
  return {
    CtrlCmd: isMac() ? 'metaKey' : 'ctrlKey',
    WinCtrl: isMac() ? 'ctrlKey' : 'metaKey'
  };
};
var getActiveModMap = function getActiveModMap(bindings) {
  var modBindings = bindings.filter(function (item) {
    return !!KeyMod[item];
  });
  var activeModMap = {
    CtrlCmd: false,
    Shift: false,
    Alt: false,
    WinCtrl: false
  };
  modBindings.forEach(function (code) {
    var modKey = KeyMod[code];
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
    return !KeyMod[item];
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

var _excluded$5 = ["children", "onClick", "visible", "width", "onContentClick", "backdropClassName", "positionClassName", "layerClassName"];
var defaultProps$5 = {
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
      props = _objectWithoutProperties(_ref, _excluded$5);

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
Backdrop.defaultProps = defaultProps$5;
Backdrop.displayName = 'GeistBackdrop';
var Backdrop$1 = Backdrop;

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

var _excluded$4 = ["className", "children", "visible", "placement"];
var defaultProps$4 = {
  className: '',
  visible: false
};

var DrawerWrapper = function DrawerWrapper(_ref) {
  var className = _ref.className,
      children = _ref.children,
      visible = _ref.visible,
      placement = _ref.placement,
      props = _objectWithoutProperties(_ref, _excluded$4);

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

DrawerWrapper.defaultProps = defaultProps$4;
DrawerWrapper.displayName = 'GeistDrawerWrapper';
var DrawerWrapper$1 = DrawerWrapper;

var _excluded$3 = ["visible", "keyboard", "disableBackdropClick", "onClose", "onContentClick", "wrapClassName", "children"];
var defaultProps$3 = {
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
      props = _objectWithoutProperties(_ref, _excluded$3);

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
  }, KeyCode.Escape, {
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

DrawerComponent.defaultProps = defaultProps$3;
DrawerComponent.displayName = 'GeistDrawer';
var Drawer = withScale$1(DrawerComponent);
var Drawer$1 = Drawer;

var _excluded$2 = ["className", "children"];
var defaultProps$2 = {
  className: ''
};

var ModalTitleComponent = function ModalTitleComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$2);

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

ModalTitleComponent.defaultProps = defaultProps$2;
ModalTitleComponent.displayName = 'GeistModalTitle';
var ModalTitle = withScale$1(ModalTitleComponent);
var ModalTitle$1 = ModalTitle;

var _excluded$1 = ["className", "children"];
var defaultProps$1 = {
  className: ''
};

var ModalSubtitleComponent = function ModalSubtitleComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$1);

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

ModalSubtitleComponent.defaultProps = defaultProps$1;
ModalSubtitleComponent.displayName = 'GeistModalSubtitle';
var ModalSubtitle = withScale$1(ModalSubtitleComponent);
var ModalSubtitle$1 = ModalSubtitle;

var _excluded = ["className", "children"];
var defaultProps = {
  className: ''
};

var ModalContentComponent = function ModalContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["498745028", [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.3125), SCALES.pr(1.3125), SCALES.pb(0.6625), SCALES.pl(1.3125), SCALES.mt(0), SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), SCALES.mb(0), SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')]]]) + " " + (props && props.className != null && props.className || useClasses$1('content', className) || "")
  }), children), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "498745028",
    dynamic: [SCALES.font(1), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(1.3125), SCALES.pr(1.3125), SCALES.pb(0.6625), SCALES.pl(1.3125), SCALES.mt(0), SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), SCALES.mb(0), SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)')]
  }, ".content.__jsx-style-dynamic-selector{position:relative;text-align:left;font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1.3125), " ").concat(SCALES.pr(1.3125), " ").concat(SCALES.pb(0.6625), " ").concat(SCALES.pl(1.3125), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0, 'calc(var(--modal-wrapper-padding-right) * -1)'), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0, 'calc(var(--modal-wrapper-padding-left) * -1)'), ";}.content.__jsx-style-dynamic-selector>*:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector>*:last-child{margin-bottom:0;}")));
};

ModalContentComponent.defaultProps = defaultProps;
ModalContentComponent.displayName = 'GeistModalContent';
var ModalContent = withScale$1(ModalContentComponent);
var ModalContent$1 = ModalContent;

Drawer$1.Title = ModalTitle$1;
Drawer$1.Subtitle = ModalSubtitle$1;
Drawer$1.Content = ModalContent$1;

exports["default"] = Drawer$1;
