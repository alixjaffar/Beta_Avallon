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

var getColor = function getColor(palette, type) {
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

var defaultContext$1 = {
  type: 'default',
  auto: false,
  disabled: false,
  loading: false
};
var ButtonDropdownContext = /*#__PURE__*/React__default["default"].createContext(defaultContext$1);
var useButtonDropdown = function useButtonDropdown() {
  return React__default["default"].useContext(ButtonDropdownContext);
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

var _excluded$2 = ["children", "type", "color", "className", "spaceRatio"];
var defaultProps$2 = {
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
      props = _objectWithoutProperties(_ref, _excluded$2);

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

LoadingComponent.defaultProps = defaultProps$2;
LoadingComponent.displayName = 'GeistLoading';
var Loading = withScale$1(LoadingComponent);
var Loading$1 = Loading;

var _excluded$1 = ["children", "onClick", "className", "main", "type"];
var defaultProps$1 = {
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
      props = _objectWithoutProperties(_ref, _excluded$1);

  var theme = useTheme();

  var _useButtonDropdown = useButtonDropdown(),
      parentType = _useButtonDropdown.type,
      disabled = _useButtonDropdown.disabled,
      loading = _useButtonDropdown.loading;

  var type = main ? parentType : selfType;
  var colors = getColor(theme.palette, type, disabled);

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

ButtonDropdownItem.defaultProps = defaultProps$1;
ButtonDropdownItem.displayName = 'GeistButtonDropdownItem';
var ButtonDropdownItem$1 = ButtonDropdownItem;

var _excluded = ["children", "type", "auto", "className", "disabled", "loading", "icon"];
var defaultProps = {
  type: 'default',
  auto: false,
  loading: false,
  disabled: false,
  className: ''
};

var stopPropagation = function stopPropagation(event) {
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
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var ref = React.useRef(null);
  var theme = useTheme();
  var colors = getColor(theme.palette, type);
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
    stopPropagation(event);
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
    onClick: stopPropagation
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
ButtonDropdownComponent.defaultProps = defaultProps;
var ButtonDropdown = withScale$1(ButtonDropdownComponent);
var ButtonDropdown$1 = ButtonDropdown;

ButtonDropdown$1.Item = ButtonDropdownItem$1;

exports["default"] = ButtonDropdown$1;
