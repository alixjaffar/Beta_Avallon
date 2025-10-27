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

var getStyles = function getStyles(type, palette, isShadow) {
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

var _excluded$6 = ["children", "className", "disableAutoMargin"];
var defaultProps$6 = {
  disableAutoMargin: false,
  className: ''
};

var CardFooterComponent = function CardFooterComponent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      disableAutoMargin = _ref.disableAutoMargin,
      props = _objectWithoutProperties(_ref, _excluded$6);

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

CardFooterComponent.defaultProps = defaultProps$6;
CardFooterComponent.displayName = 'GeistCardFooter';
var CardFooter = withScale$1(CardFooterComponent);
var CardFooter$1 = CardFooter;

var _excluded$5 = ["className", "children"];
var defaultProps$5 = {
  className: ''
};

var CardContentComponent = function CardContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$5);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["490544004", [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1), SCALES.pr(1), SCALES.pb(1), SCALES.pl(1), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || useClasses$1('content', className) || "")
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "490544004",
    dynamic: [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1), SCALES.pr(1), SCALES.pb(1), SCALES.pl(1), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".content.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1), " ").concat(SCALES.pr(1), " ").concat(SCALES.pb(1), " ").concat(SCALES.pl(1), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.content.__jsx-style-dynamic-selector>p:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector>p:last-child{margin-bottom:0;}")));
};

CardContentComponent.defaultProps = defaultProps$5;
CardContentComponent.displayName = 'GeistCardContent';
var CardContent = withScale$1(CardContentComponent);
var CardContent$1 = CardContent;

var _excluded$4 = ["opacity"];
var defaultProps$4 = {
  opacity: 0.5
};
var ImageSkeleton = /*#__PURE__*/React__default["default"].memo(function (_ref) {
  var opacity = _ref.opacity,
      props = _objectWithoutProperties(_ref, _excluded$4);

  var theme = useTheme();
  return /*#__PURE__*/React__default["default"].createElement("div", _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["2946022605", [theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_1, opacity]]]) + " " + (props && props.className != null && props.className || "skeleton")
  }), /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "2946022605",
    dynamic: [theme.palette.accents_1, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_1, opacity]
  }, ".skeleton.__jsx-style-dynamic-selector{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background-image:linear-gradient( 270deg, ".concat(theme.palette.accents_1, ", ").concat(theme.palette.accents_2, ", ").concat(theme.palette.accents_2, ", ").concat(theme.palette.accents_1, " );background-size:400% 100%;-webkit-animation:loading-__jsx-style-dynamic-selector 3s ease-in-out infinite;animation:loading-__jsx-style-dynamic-selector 3s ease-in-out infinite;opacity:").concat(opacity, ";-webkit-transition:opacity 300ms ease-out;transition:opacity 300ms ease-out;}@-webkit-keyframes loading-__jsx-style-dynamic-selector{0%{background-position:200% 0;}to{background-position:-200% 0;}}@keyframes loading-__jsx-style-dynamic-selector{0%{background-position:200% 0;}to{background-position:-200% 0;}}")));
});
ImageSkeleton.defaultProps = defaultProps$4;
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

var _excluded$3 = ["src", "disableSkeleton", "className", "maxDelay"];
var defaultProps$3 = {
  disableSkeleton: false,
  className: '',
  maxDelay: 3000
};

var ImageComponent = function ImageComponent(_ref) {
  var src = _ref.src,
      disableSkeleton = _ref.disableSkeleton,
      className = _ref.className,
      maxDelay = _ref.maxDelay,
      props = _objectWithoutProperties(_ref, _excluded$3);

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

ImageComponent.defaultProps = defaultProps$3;
ImageComponent.displayName = 'GeistImage';
var Image = withScale$1(ImageComponent);
var Image$1 = Image;

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

var _excluded$2 = ["href", "color", "underline", "children", "className", "block", "icon"];
var defaultProps$2 = {
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
      props = _objectWithoutProperties(_ref, _excluded$2);

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
LinkComponent.defaultProps = defaultProps$2;
LinkComponent.displayName = 'GeistLink';
var Link = withScale$1(LinkComponent);
var Link$1 = Link;

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

var _excluded$1 = ["url", "title", "children", "showFullLink", "invert", "anchorProps", "className"];
var defaultProps$1 = {
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
      props = _objectWithoutProperties(_ref, _excluded$1);

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
ImageBrowserComponent.defaultProps = defaultProps$1;
ImageBrowserComponent.displayName = 'GeistImageBrowser';
var ImageBrowser = withScale$1(ImageBrowserComponent);
var ImageBrowser$1 = ImageBrowser;

Image$1.Browser = ImageBrowser$1;

var _excluded = ["children", "hoverable", "className", "shadow", "type"];
var defaultProps = {
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
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var hoverShadow = React.useMemo(function () {
    if (shadow) return theme.expressiveness.shadowMedium;
    return hoverable ? theme.expressiveness.shadowSmall : 'none';
  }, [hoverable, shadow, theme.expressiveness]);

  var _useMemo = React.useMemo(function () {
    return getStyles(type, theme.palette, shadow);
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

CardComponent.defaultProps = defaultProps;
CardComponent.displayName = 'GeistCard';
var Card = withScale$1(CardComponent);
var Card$1 = Card;

Card$1.Footer = CardFooter$1;
Card$1.Actions = CardFooter$1;
Card$1.Content = CardContent$1;
Card$1.Body = CardContent$1;

exports["default"] = Card$1;
