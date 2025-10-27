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

var _excluded$4 = ["children"],
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
        props = _objectWithoutProperties(_ref, _excluded$4);

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

var _excluded$3 = ["src", "stacked", "text", "isSquare", "className"];
var defaultProps$4 = {
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
      props = _objectWithoutProperties(_ref, _excluded$3);

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

AvatarComponent.defaultProps = defaultProps$4;
AvatarComponent.displayName = 'GeistAvatar';
var Avatar = withScale$1(AvatarComponent);
var Avatar$1 = Avatar;

var defaultProps$3 = {
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

AvatarGroupComponent.defaultProps = defaultProps$3;
AvatarGroupComponent.displayName = 'GeistAvatarGroup';
var AvatarGroup = withScale$1(AvatarGroupComponent);
var AvatarGroup$1 = AvatarGroup;

Avatar$1.Group = AvatarGroup$1;

var _excluded$2 = ["src", "text", "name", "children", "className", "altText"];
var defaultProps$2 = {
  className: ''
};

var UserComponent = function UserComponent(_ref) {
  var src = _ref.src,
      text = _ref.text,
      name = _ref.name,
      children = _ref.children,
      className = _ref.className,
      altText = _ref.altText,
      props = _objectWithoutProperties(_ref, _excluded$2);

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

UserComponent.defaultProps = defaultProps$2;
UserComponent.displayName = 'GeistUser';
var User = withScale$1(UserComponent);
var User$1 = User;

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

var _excluded$1 = ["href", "color", "underline", "children", "className", "block", "icon"];
var defaultProps$1 = {
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
      props = _objectWithoutProperties(_ref, _excluded$1);

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
LinkComponent.defaultProps = defaultProps$1;
LinkComponent.displayName = 'GeistLink';
var Link = withScale$1(LinkComponent);
var Link$1 = Link;

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

exports["default"] = User$1;
