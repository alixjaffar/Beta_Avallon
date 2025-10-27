'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styledJsx_cjs = require('../styled-jsx.cjs.js');
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

var defaultAllThemesConfig = {
  themes: Themes$1.getPresets()
};
var AllThemesContext = /*#__PURE__*/React__default["default"].createContext(defaultAllThemesConfig);

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

var useTheme = useTheme$1;

var _excluded$4 = ["children", "className", "visible", "enterTime", "leaveTime", "clearTime", "name"];
var defaultProps$4 = {
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

CssTransition.defaultProps = defaultProps$4;
CssTransition.displayName = 'GeistCssTransition';
var CssTransition$1 = CssTransition;

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

var defaultProps$3 = {
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

ButtonDrip.defaultProps = defaultProps$3;
ButtonDrip.displayName = 'GeistButtonDrip';
var ButtonDrip$1 = ButtonDrip;

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

var _excluded$1 = ["isRight", "isSingle", "children", "className"];
var defaultProps$1 = {
  isRight: false,
  className: ''
};

var ButtonIcon = function ButtonIcon(_ref) {
  var isRight = _ref.isRight,
      isSingle = _ref.isSingle,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded$1);

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

ButtonIcon.defaultProps = defaultProps$1;
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

var defaultContext = {
  isButtonGroup: false,
  disabled: false
};
var ButtonGroupContext = /*#__PURE__*/React__default["default"].createContext(defaultContext);
var useButtonGroupContext = function useButtonGroupContext() {
  return React__default["default"].useContext(ButtonGroupContext);
};

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

var _excluded = ["children", "disabled", "type", "loading", "shadow", "ghost", "effect", "onClick", "auto", "icon", "htmlType", "iconRight", "className"];
var defaultProps = {
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
      props = _objectWithoutProperties(filteredProps, _excluded);
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
ButtonComponent.defaultProps = defaultProps;
ButtonComponent.displayName = 'GeistButton';
var Button = withScale$1(ButtonComponent);
var Button$1 = Button;

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
var getColors = function getColors(palette, type) {
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
    return getColors(theme.palette, toast.type);
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

exports["default"] = GeistProvider$1;
